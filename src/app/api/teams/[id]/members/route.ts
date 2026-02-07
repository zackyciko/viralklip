import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    // This route will return team members for a specific team
    const supabase = await createClient()
    const { id } = await params // teamId

    // Get authenticated user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a member of this team before showing data
    const { data: membership } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', id)
        .eq('user_id', user.id)
        .single()

    if (!membership) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all members
    const { data: members, error } = await supabase
        .from('team_members')
        .select(`
            user_id,
            role,
            joined_at,
            users (
                id,
                name,
                avatar_url,
                email
            )
        `)
        .eq('team_id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform
    const formattedMembers = members.map((m: any) => ({
        id: m.users?.id,
        name: m.users?.name,
        role: m.role,
        avatar: m.users?.avatar_url,
        email: m.users?.email,
        status: 'Active' // Mock status for now
    }))

    return NextResponse.json({ members: formattedMembers })
}
