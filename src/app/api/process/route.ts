import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const WORKER_API_URL = process.env.WORKER_API_URL || 'https://viralklip-production.up.railway.app'
const WORKER_API_KEY = process.env.WORKER_API_KEY || ''

export async function POST(request: Request) {
    const supabase = await createClient()

    // Get authenticated user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { project_id, video_url, aspect_ratios, target_count } = body

        if (!project_id || !video_url) {
            return NextResponse.json(
                { error: 'project_id and video_url are required' },
                { status: 400 }
            )
        }

        // Update project status to processing
        const { error: updateError } = await supabase
            .from('projects')
            .update({ status: 'processing' } as any)
            .eq('id', project_id)
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Failed to update project status:', updateError)
        }

        // Call Worker API to start processing
        const workerResponse = await fetch(`${WORKER_API_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': WORKER_API_KEY,
            },
            body: JSON.stringify({
                video_url,
                project_id,
                user_id: user.id,
                target_count: target_count || 10,
                aspect_ratios: aspect_ratios || ['9:16', '16:9', '1:1'],
            }),
        })

        if (!workerResponse.ok) {
            const errorText = await workerResponse.text()
            console.error('Worker API error:', errorText)

            // Revert status on failure
            await supabase
                .from('projects')
                .update({ status: 'failed' } as any)
                .eq('id', project_id)
                .eq('user_id', user.id)

            return NextResponse.json(
                { error: 'Failed to start video processing' },
                { status: 500 }
            )
        }

        const workerData = await workerResponse.json()

        // Update project with job_id
        await supabase
            .from('projects')
            .update({
                job_id: workerData.job_id,
                status: 'processing'
            } as any)
            .eq('id', project_id)
            .eq('user_id', user.id)

        return NextResponse.json({
            message: 'Processing started',
            job_id: workerData.job_id,
            project_id,
        })
    } catch (error) {
        console.error('Process error:', error)
        return NextResponse.json(
            { error: 'Failed to process video' },
            { status: 500 }
        )
    }
}
