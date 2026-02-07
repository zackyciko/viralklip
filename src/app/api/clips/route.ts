import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    // Get authenticated user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single()

    if (projectError || !project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch clips for the project
    const { data: clips, error } = await supabase
        .from('clips')
        .select('*')
        .eq('project_id', projectId)
        .order('clip_number', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ clips })
}
