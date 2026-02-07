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

    try {
        // Get user's projects first
        const { data: userProjects } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id)

        const projectIds = (userProjects?.map((p: any) => p.id) || []) as string[]

        // Get total projects count
        const { count: totalProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        // Get total clips count
        const { count: totalClips } = await supabase
            .from('clips')
            .select('*', { count: 'exact', head: true })
            .in('project_id', projectIds)

        // Get clips with viral scores
        const { data: clips } = await supabase
            .from('clips')
            .select('viral_score, view_prediction, created_at')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
            .limit(100)

        // Calculate average viral score
        // @ts-ignore - Placeholder types will be replaced when user generates real Supabase types
        const avgViralScore =
            clips && clips.length > 0
                // @ts-ignore
                ? clips.reduce((sum: number, clip: any) => sum + (clip.viral_score || 0), 0) / clips.length
                : 0

        // Calculate total predicted views
        // @ts-ignore - Placeholder types will be replaced when user generates real Supabase types
        const totalPredictedViews =
            clips && clips.length > 0
                // @ts-ignore
                ? clips.reduce((sum: number, clip: any) => sum + (clip.view_prediction || 0), 0)
                : 0

        // Get recent projects
        const { data: recentProjects } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        return NextResponse.json({
            analytics: {
                totalProjects: totalProjects || 0,
                totalClips: totalClips || 0,
                avgViralScore: Math.round(avgViralScore * 10) / 10,
                totalPredictedViews,
                recentProjects: recentProjects || [],
                clips: clips || [],
            },
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
