'use client'

import { oauth, register } from '@/actions/auth'
import { AuthLayout } from '@/components/auth-layout'
import { ActionButton } from '@/components/ui/base/action-button'
import { FormCheckbox } from '@/components/ui/base/form-checkbox'
import { FormInput } from '@/components/ui/base/form-input'
import { useForm } from '@/components/ui/base/use-form'
import { CardContent } from '@/components/ui/card'
import { registerSchema } from '@/validators/auth'
import Link from 'next/link'

export default function RegisterPage() {
	const [state, action] = useForm(register, registerSchema)
	const [, githubAction] = useForm(oauth.bind(null, 'github'))
	const [, googleAction] = useForm(oauth.bind(null, 'google'))

	return (
		<AuthLayout title='Create an account' desc='Enter your details to create your account'>
			<CardContent>
				<form action={action} className='grid gap-6'>
					<div className='grid grid-cols-2 gap-2'>
						<FormInput label='First name' name='firstName' placeholder='Max' state={state} />
						<FormInput label='Last name' name='lastName' placeholder='Robinson' state={state} />
					</div>
					<FormInput label='Email' name='email' placeholder='m@example.com' state={state} />
					<FormInput label='Password' name='password' type='password' clearOnError state={state} />
					<FormInput label='Confirm password' name='confirmPassword' type='password' state={state} />

					<FormCheckbox
						className='text-nowrap'
						label={
							<>
								I agree to the {/* BUG: Missing ToS */}
								<Link href='/terms' className='text-primary underline'>
									Terms of Service
								</Link>{' '}
								and
								<Link href='/privacy' className='text-primary underline'>
									{/* BUG: Missing Privacy Policy */}
									Privacy Policy
								</Link>
							</>
						}
						name='terms'
						state={state}
					/>

					<ActionButton>Create account</ActionButton>

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
						Already have an account?{' '}
						<Link className='text-primary underline' href='/login'>
							Sign in
						</Link>
					</p>
				</form>
			</CardContent>
		</AuthLayout>
	)
}
