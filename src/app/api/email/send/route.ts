import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailTemplates } from '@/lib/email'
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
        const body = await request.json()
        const { type, data } = body

        let emailHtml = ''
        let subject = ''

        // Get user profile
        // @ts-ignore - Placeholder types
        const { data: profile } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', user.id)
            .single()

        // @ts-ignore
        const userName = profile?.name || user.email?.split('@')[0] || 'User'
        // @ts-ignore
        const userEmail = profile?.email || user.email!

        // Generate email based on type
        switch (type) {
            case 'welcome':
                subject = '🎉 Selamat Datang di ViralKlip!'
                emailHtml = emailTemplates.welcome(userName)
                break

            case 'processing_complete':
                subject = '✅ Video Kamu Sudah Siap!'
                emailHtml = emailTemplates.processingComplete(
                    userName,
                    data.projectTitle,
                    data.clipCount,
                    data.projectId
                )
                break

            case 'credit_low':
                subject = '⚠️ Kredit Hampir Habis'
                emailHtml = emailTemplates.creditLow(userName, data.creditsRemaining)
                break

            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
        }

        // Send email
        await sendEmail({
            to: userEmail,
            subject,
            html: emailHtml,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Email send error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        )
    }
}
