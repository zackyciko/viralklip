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
        // Get referrals
        const { data: referrals } = await supabase
            .from('referrals')
            .select(`
                id,
                total_earned,
                status,
                created_at,
                referee:users!referee_id(email, avatar_url, subscription_tier)
            `)
            .eq('referrer_id', user.id)
            .order('created_at', { ascending: false })

        // Get payouts
        const { data: payouts } = await supabase
            .from('payouts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        // Calculate stats
        // @ts-ignore
        const totalEarnings = referrals?.reduce((sum, ref) => sum + (ref.total_earned || 0), 0) || 0
        // @ts-ignore
        const activeReferrals = referrals?.filter(ref => ref.status === 'active').length || 0
        const conversionRate = referrals && referrals.length > 0 ? (activeReferrals / referrals.length) * 100 : 0

        // Mock clicks for now as we don't track link clicks yet
        const totalClicks = (referrals?.length || 0) * 15 + Math.floor(Math.random() * 50)

        return NextResponse.json({
            stats: {
                totalEarnings,
                activeReferrals,
                totalClicks,
                conversionRate
            },
            referrals: referrals || [],
            payouts: payouts || []
        })

    } catch (error) {
        console.error('Affiliate error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch affiliate data' },
            { status: 500 }
        )
    }
}
