import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Get authenticated user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's projects
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects })
}

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

    const body = await request.json()
    const { video_url, video_title } = body

    // Validate input
    if (!video_url) {
        return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // Create new project
    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            video_url,
            video_title: video_title || 'Untitled Project',
            status: 'pending',
        } as any)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project }, { status: 201 })
}
