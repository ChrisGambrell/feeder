import { User } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type AuthUser = User

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const toastKeyMap = {
	blank: 'message',
	error: 'error',
	success: 'success',
} as const

const getToastRedirect = (path: string, type: keyof typeof toastKeyMap, message: string, arbitraryParams: string = '') => {
	const key = toastKeyMap[type]

	let redirectPath = `${path}?${key}=${encodeURIComponent(message)}`
	if (arbitraryParams) redirectPath += `&${arbitraryParams}`

	return redirectPath
}

export const getErrorRedirect = (path: string, message: string = '', arbitraryParams: string = '') =>
	getToastRedirect(path, 'error', message, arbitraryParams)

export const getSuccessRedirect = (path: string, message: string = '', arbitraryParams: string = '') =>
	getToastRedirect(path, 'success', message, arbitraryParams)
