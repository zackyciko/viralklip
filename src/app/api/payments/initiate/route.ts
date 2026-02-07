import { createClient } from '@/lib/supabase/server'
import { midtrans } from '@/lib/midtrans'
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
        const { plan } = body

        // Define pricing plans
        const plans: Record<string, { name: string; price: number; credits: number }> = {
            starter: { name: 'Starter Plan', price: 99000, credits: 10 },
            pro: { name: 'Pro Plan', price: 299000, credits: 50 },
            unlimited: { name: 'Unlimited Plan', price: 599000, credits: 999999 },
        }

        const selectedPlan = plans[plan]
        if (!selectedPlan) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
        }

        // Generate unique order ID
        const orderId = `VK-${Date.now()}-${user.id.substring(0, 8)}`

        // Get user profile
        // @ts-ignore - Placeholder types
        const { data: profile } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', user.id)
            .single()

        // Create payment transaction
        const payment = await midtrans.createTransaction({
            orderId,
            amount: selectedPlan.price,
            customerDetails: {
                // @ts-ignore - Placeholder types
                firstName: profile?.name || user.email?.split('@')[0] || 'User',
                email: user.email!,
            },
            itemDetails: [
                {
                    id: plan,
                    name: selectedPlan.name,
                    price: selectedPlan.price,
                    quantity: 1,
                },
            ],
        })

        // Store pending payment in database
        await supabase.from('payments').insert({
            order_id: orderId,
            user_id: user.id,
            plan,
            amount: selectedPlan.price,
            credits: selectedPlan.credits,
            status: 'pending',
            payment_token: payment.token,
        } as any)

        return NextResponse.json({
            orderId,
            token: payment.token,
            redirectUrl: payment.redirectUrl,
        })
    } catch (error: any) {
        console.error('Payment initiation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create payment' },
            { status: 500 }
        )
    }
}
