import { ActivityType } from '@prisma/client'
import { z } from 'zod'

export const createActivitySchema = z.object({
	type: z.nativeEnum(ActivityType),
	amount: z.coerce.number().optional(),
	unit: z.string().optional(),
	notes: z.string().optional(),
})

export const updateAvatarSchema = z.object({
	file: z
		.instanceof(File)
		.refine((f) => f.size > 0, 'File is required')
		.refine((f) => f.size <= 1024 * 1024, 'File must be 1MB or less'),
})

export const updateUserSchema = z
	.object({
		name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name is required' }),
		password: z.string({ required_error: 'Password is required' }),
		confirmPassword: z.string({ required_error: 'Confirm password is required' }),
	})
	.refine((arg) => (arg.password || arg.confirmPassword ? arg.password === arg.confirmPassword : true), {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
	.refine((arg) => (arg.password || arg.confirmPassword ? arg.password.length >= 8 : true), {
		message: 'Password must be at least 8 characters long',
		path: ['password'],
	})
