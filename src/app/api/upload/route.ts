import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only video files are allowed.' },
                { status: 400 }
            )
        }

        // Validate file size (max 500MB)
        const maxSize = 500 * 1024 * 1024 // 500MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 500MB.' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${user.id}/${timestamp}-${file.name}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('videos')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('videos').getPublicUrl(data.path)

        // Create project record
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                video_url: publicUrl,
                video_title: file.name,
                status: 'pending',
            } as any)
            .select()
            .single()

        if (projectError) {
            return NextResponse.json({ error: projectError.message }, { status: 500 })
        }

        return NextResponse.json(
            {
                message: 'File uploaded successfully',
                project,
                url: publicUrl,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
