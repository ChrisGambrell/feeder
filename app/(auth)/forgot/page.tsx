'use client'

import { verifyEmail } from '@/actions/auth'
import { AuthLayout } from '@/components/auth-layout'
import { ActionButton } from '@/components/ui/base/action-button'
import { FormInput } from '@/components/ui/base/form-input'
import { useForm } from '@/components/ui/base/use-form'
import { CardContent, CardFooter } from '@/components/ui/card'
import { verifyEmailSchema } from '@/validators/auth'
import Link from 'next/link'

export default function ForgotPage() {
	const [state, action] = useForm(verifyEmail, verifyEmailSchema)

	return (
		<AuthLayout title='Reset your password' desc="Enter your email address and we'll send you a link to reset your password">
			<CardContent>
				<form action={action} className='grid gap-6'>
					<FormInput label='Email' name='email' placeholder='m@example.com' state={state} />
					<ActionButton>Send verification</ActionButton>
				</form>
			</CardContent>
			<CardFooter>
				<p className='text-center text-sm text-muted-foreground'>
					Remember your password?{' '}
					<Link className='text-primary underline' href='/login'>
						Sign in
					</Link>
				</p>
			</CardFooter>
		</AuthLayout>
	)
}
