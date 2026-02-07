import crypto from 'crypto'

export interface MidtransConfig {
    serverKey: string
    clientKey: string
    isProduction: boolean
}

export interface PaymentRequest {
    orderId: string
    amount: number
    customerDetails: {
        firstName: string
        lastName?: string
        email: string
        phone?: string
    }
    itemDetails: {
        id: string
        name: string
        price: number
        quantity: number
    }[]
}

export interface PaymentResponse {
    token: string
    redirectUrl: string
}

class MidtransClient {
    private config: MidtransConfig
    private baseUrl: string

    constructor(config: MidtransConfig) {
        this.config = config
        this.baseUrl = config.isProduction
            ? 'https://app.midtrans.com'
            : 'https://app.sandbox.midtrans.com'
    }

    /**
     * Create payment transaction
     */
    async createTransaction(request: PaymentRequest): Promise<PaymentResponse> {
        const payload = {
            transaction_details: {
                order_id: request.orderId,
                gross_amount: request.amount,
            },
            customer_details: {
                first_name: request.customerDetails.firstName,
                last_name: request.customerDetails.lastName || '',
                email: request.customerDetails.email,
                phone: request.customerDetails.phone || '',
            },
            item_details: request.itemDetails.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        }

        const response = await fetch(`${this.baseUrl}/snap/v1/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Basic ${Buffer.from(this.config.serverKey + ':').toString('base64')}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Midtrans error: ${error.error_messages?.[0] || 'Unknown error'}`)
        }

        const data = await response.json()

        return {
            token: data.token,
            redirectUrl: data.redirect_url,
        }
    }

    /**
     * Verify webhook signature
     */
    verifySignature(
        orderId: string,
        statusCode: string,
        grossAmount: string,
        signatureKey: string
    ): boolean {
        const input = orderId + statusCode + grossAmount + this.config.serverKey
        const hash = crypto.createHash('sha512').update(input).digest('hex')
        return hash === signatureKey
    }

    /**
     * Get transaction status
     */
    async getTransactionStatus(orderId: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/v2/${orderId}/status`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${Buffer.from(this.config.serverKey + ':').toString('base64')}`,
            },
        })

        if (!response.ok) {
            throw new Error('Failed to get transaction status')
        }

        return response.json()
    }
}

// Export singleton instance
export const midtrans = new MidtransClient({
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    isProduction: process.env.NODE_ENV === 'production',
})
