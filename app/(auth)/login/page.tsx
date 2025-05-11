'use client'

import { login, oauth } from '@/actions/auth'
import { AuthLayout } from '@/components/auth-layout'
import { ActionButton } from '@/components/ui/base/action-button'
import { FormInput } from '@/components/ui/base/form-input'
import { useForm } from '@/components/ui/base/use-form'
import { CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { loginSchema } from '@/validators/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function LoginPage() {
	return (
		<Suspense>
			<Page />
		</Suspense>
	)
}

function Page() {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/'

	const [state, action] = useForm(login, loginSchema)
	const [, githubAction] = useForm(oauth.bind(null, 'github'))
	const [, googleAction] = useForm(oauth.bind(null, 'google'))

	return (
		<AuthLayout title='Welcome back' desc='Enter your credentials to access your account'>
			<CardContent>
				<form action={action} className='grid gap-6'>
					<input type='hidden' name='callbackUrl' value={callbackUrl} />
					<FormInput label='Email' name='email' placeholder='m@example.com' state={state} />
					<FormInput
						label={
							<div className='flex items-center'>
								<Label htmlFor='password'>Password</Label>
								<Link className='ml-auto inline-block text-primary text-sm underline' href='/forgot'>
									Forgot password?
								</Link>
							</div>
						}
						name='password'
						type='password'
						clearOnError
						state={state}
					/>
					<ActionButton>Log in</ActionButton>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>Or</span>
						</div>
					</div>

					<div className='grid gap-2'>
						<ActionButton formAction={githubAction} variant='outline'>
							Sign in with GitHub
						</ActionButton>
						<ActionButton formAction={googleAction} variant='outline'>
							Sign in with Google
						</ActionButton>
					</div>

					<p className='text-center text-sm text-muted-foreground'>
						Don&apos;t have an account?{' '}
						<Link className='text-primary underline' href='/register'>
							Sign up
						</Link>
					</p>
				</form>
			</CardContent>
		</AuthLayout>
	)
}
