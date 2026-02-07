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

    // Fetch user profile from database
    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        // If user doesn't exist in users table, create one
        const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || user.email?.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url,
                subscription_tier: 'free',
                credits_remaining: 3,
            } as any)
            .select()
            .single()

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ profile: newProfile })
    }

    return NextResponse.json({ profile })
}

export async function PATCH(request: Request) {
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
    const { name, avatar_url } = body

    // Update user profile
    const { data: profile, error } = await supabase
        .from('users')
        // @ts-ignore - Placeholder types will be replaced when user generates real Supabase types
        .update({
            name,
            avatar_url,
            updated_at: new Date().toISOString(),
        } as any)
        .eq('id', user.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
}
