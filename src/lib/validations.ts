import { z } from 'zod'

// Project creation validation
export const createProjectSchema = z.object({
    video_url: z.string().url('Invalid URL').min(1, 'URL is required'),
    video_title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    target_count: z.number().min(1).max(30).default(10),
    aspect_ratios: z.array(z.enum(['9:16', '16:9', '1:1', '4:5'])).default(['9:16', '16:9', '1:1']),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

// User profile update validation
export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    avatar_url: z.string().url('Invalid URL').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Login validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Signup validation
export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
})

export type SignupInput = z.infer<typeof signupSchema>

// File upload validation
export const uploadFileSchema = z.object({
    file: z.instanceof(File)
        .refine((file) => file.size <= 500 * 1024 * 1024, 'File must be less than 500MB')
        .refine(
            (file) => ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.type),
            'Only MP4, MOV, and AVI files are allowed'
        ),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
