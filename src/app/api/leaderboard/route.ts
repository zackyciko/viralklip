import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Query Strategy:
    // Since we don't have a direct 'view' for leaderboard, we aggregate from clips.
    // Ideally this should be a stored procedure or materialized view for scale.
    // For now, in-memory aggregation is acceptable for MVP.

    // 1. Fetch clips with viral scores
    const { data: clips, error } = await supabase
        .from('clips')
        .select(`
            viral_score,
            project_id,
            projects (
                user_id
            )
        `)
        .not('viral_score', 'is', null)
        .limit(1000) // Limit to recent 1000 clips for performance

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. Aggregate scores by user
    const userStats: Record<string, { totalScore: number, clipCount: number }> = {}

    clips.forEach((clip: any) => {
        const userId = clip.projects?.user_id
        if (!userId) return

        if (!userStats[userId]) {
            userStats[userId] = { totalScore: 0, clipCount: 0 }
        }

        userStats[userId].totalScore += (clip.viral_score || 0)
        userStats[userId].clipCount += 1
    })

    // 3. Create sorted array
    const sortedUsers = Object.entries(userStats)
        .map(([userId, stats]) => ({
            userId,
            score: stats.totalScore,
            count: stats.clipCount,
            // Calculate a weighted "Matrix Points" score
            // Base score * 1000 + bonus for quantity
            matrixPoints: Math.round((stats.totalScore / stats.clipCount) * 1000 + (stats.clipCount * 50))
        }))
        .sort((a, b) => b.matrixPoints - a.matrixPoints)
        .slice(0, 50)

    if (sortedUsers.length === 0) {
        return NextResponse.json({ leaderboard: [] })
    }

    // 4. Fetch user profiles
    const userIds = sortedUsers.map(u => u.userId)
    const { data: users } = await supabase
        .from('users')
        .select('id, name, avatar_url, subscription_tier')
        .in('id', userIds)

    // 5. Merge and format
    const leaderboard = sortedUsers.map((entry, index) => {
        const user = users?.find(u => u.id === entry.userId)

        // Map subscription tier to "Status"
        let status = 'Rookie'
        const tier = user?.subscription_tier
        if (tier === 'creator') status = 'Apex'
        else if (tier === 'pro') status = 'Master'
        else if (tier === 'starter') status = 'Diamond'

        // Determine trend (randomized for now as we don't have historical snapshots)
        const trend = index < 3 ? `+${Math.floor(Math.random() * 20) + 10}%` : `+${Math.floor(Math.random() * 10)}%`

        return {
            rank: index + 1,
            creator: user?.name || `Agent ${entry.userId.slice(0, 4)}`,
            score: entry.matrixPoints,
            status,
            trend,
            img: user?.avatar_url || `https://i.pravatar.cc/100?u=${entry.userId}`
        }
    })

    return NextResponse.json({ leaderboard })
}
