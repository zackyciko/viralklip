import { createClient } from '@/lib/supabase/server'
import { midtrans } from '@/lib/midtrans'
import { sendEmail, emailTemplates } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const body = await request.json()

        const {
            order_id,
            transaction_status,
            fraud_status,
            gross_amount,
            signature_key,
            status_code,
        } = body

        // Verify signature
        const isValid = midtrans.verifySignature(
            order_id,
            status_code,
            gross_amount,
            signature_key
        )

        if (!isValid) {
            console.error('Invalid signature for order:', order_id)
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        // Get payment record
        // @ts-ignore - Placeholder types
        const { data: payment } = await supabase
            .from('payments')
            .select('*, users(name, email)')
            .eq('order_id', order_id)
            .single()

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
        }

        // Handle payment status
        let paymentStatus = 'pending'

        if (transaction_status === 'capture') {
            paymentStatus = fraud_status === 'accept' ? 'success' : 'pending'
        } else if (transaction_status === 'settlement') {
            paymentStatus = 'success'
        } else if (
            transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire'
        ) {
            paymentStatus = 'failed'
        } else if (transaction_status === 'pending') {
            paymentStatus = 'pending'
        }

        // Update payment status
        // @ts-ignore
        await supabase
            .from('payments')
            .update({
                status: paymentStatus,
                transaction_status,
                fraud_status,
                updated_at: new Date().toISOString(),
            } as any)
            .eq('order_id', order_id)

        // If payment successful, update user credits and subscription
        if (paymentStatus === 'success') {
            // @ts-ignore
            await supabase
                .from('users')
                .update({
                    subscription_tier: payment.plan,
                    credits_remaining: payment.credits,
                    credits_reset_date: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString(), // 30 days from now
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', payment.user_id)

            // Send success email
            try {
                // @ts-ignore - Placeholder types
                await sendEmail({
                    to: payment.users.email,
                    subject: '✅ Pembayaran Berhasil - ViralKlip',
                    // @ts-ignore
                    html: emailTemplates.paymentSuccess(
                        payment.users.name,
                        payment.plan,
                        payment.amount,
                        order_id
                    ),
                })
            } catch (emailError) {
                console.error('Failed to send email:', emailError)
                // Don't fail the webhook if email fails
            }
        }

        return NextResponse.json({ status: 'ok' })
    } catch (error: any) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
