import { NextResponse } from 'next/server'

export function errorResponse(message: string, status: number = 500) {
    return NextResponse.json({ error: message }, { status })
}

export function successResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status })
}

export function validateRequired(fields: Record<string, any>, required: string[]) {
    const missing = required.filter((field) => !fields[field])

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
}

export async function withAuth<T>(
    handler: (user: any) => Promise<T>
): Promise<T> {
    // This is a placeholder - actual implementation would get user from Supabase
    // and call the handler with the authenticated user
    throw new Error('Not implemented')
}
