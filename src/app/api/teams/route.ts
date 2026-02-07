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

    // Fetch team memberships for this user
    const { data: memberships, error } = await supabase
        .from('team_members')
        .select(`
            team_id,
            role,
            teams (
                id,
                name,
                plan,
                owner_id
            )
        `)
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform structure
    const teams = memberships.map((m: any) => ({
        ...m.teams,
        my_role: m.role
    }))

    return NextResponse.json({ teams })
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

    const { name } = await request.json()

    // Start transaction (manual via sequential steps since Supabase JS doesn't support transactions purely in client)

    // 1. Create Team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name,
            owner_id: user.id
        } as any)
        .select()
        .single()

    if (teamError) {
        return NextResponse.json({ error: teamError.message }, { status: 500 })
    }

    // 2. Add creator as Owner
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'owner'
        } as any)

    if (memberError) {
        // Rollback attempt (delete team)
        await supabase.from('teams').delete().eq('id', team.id)
        return NextResponse.json({ error: memberError.message }, { status: 500 })
    }

    return NextResponse.json({ team })
}
