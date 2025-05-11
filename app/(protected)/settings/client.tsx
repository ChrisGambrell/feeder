'use client'

import { oauth } from '@/actions/auth'
import { updateAvatar, updateUser } from '@/actions/user'
import { ActionButton } from '@/components/ui/base/action-button'
import { Button } from '@/components/ui/base/c-button'
import { FormInput } from '@/components/ui/base/form-input'
import { themes } from '@/components/ui/base/themes'
import { useForm } from '@/components/ui/base/use-form'
import { AuthUser } from '@/lib/utils'
import { updateAvatarSchema, updateUserSchema } from '@/validators/user'
import { Upload } from 'lucide-react'
import { OAuthProviderId } from 'next-auth/providers'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function SettingsForm({ user }: { user: AuthUser }) {
	const [updateUserState, updateUserAction] = useForm(updateUser, updateUserSchema)
	const [updateAvatarState, updateAvatarAction] = useForm(updateAvatar, updateAvatarSchema)
	const ref = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!updateAvatarState?.fieldErrors.file) return
		toast.error(updateAvatarState.fieldErrors.file)
	}, [updateAvatarState?.fieldErrors.file])

	return (
		<div className='grid gap-6'>
			<div className='relative group size-fit'>
				{user.image ? (
					<img className='ring-2 ring-offset-2 ring-primary rounded-lg size-20' src={user.image} alt={user.name ?? user.email} />
				) : (
					<div className='ring-2 ring-offset-2 ring-primary rounded-lg size-20 flex items-center justify-center'>
						<Upload className='size-6 text-primary' />
					</div>
				)}
				<form
					action={updateAvatarAction}
					className='invisible group-hover:visible absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg'
					ref={ref}>
					<Upload className='size-6 text-primary' />
					<input
						className='z-10 w-full h-full opacity-0 absolute inset-0'
						name='file'
						type='file'
						accept='image/*'
						onChange={() => ref.current?.requestSubmit()}
					/>
				</form>
			</div>
			<form action={updateUserAction} className='grid gap-6'>
				<FormInput
					className='max-w-sm'
					label='Full name'
					name='name'
					placeholder='Max Robinson'
					defaultValue={user.name ?? ''}
					state={updateUserState}
				/>
				<FormInput className='max-w-md' label='Email' defaultValue={user.email} disabled />
				<div className='grid gap-2 sm:grid-cols-2'>
					<FormInput label='Update password' name='password' type='password' state={updateUserState} />
					<FormInput label='Confirm password' name='confirmPassword' type='password' state={updateUserState} />
				</div>

				<div className='ml-auto flex gap-2'>
					<Button type='reset' variant='outline'>
						Reset
					</Button>
					<ActionButton>Update</ActionButton>
				</div>
			</form>
		</div>
	)
}

export function LinkAccountButton({ provider }: { provider: OAuthProviderId }) {
	const [, action] = useForm(oauth.bind(null, provider))

	return (
		<ActionButton formAction={action} size='sm'>
			Link
		</ActionButton>
	)
}

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme()

	return (
		<div className='flex flex-col divide-y'>
			{themes.map((t) => {
				return (
					<div key={t.value} className='py-2 flex items-center gap-3'>
						<div className='flex gap-0.5'>
							<ColorBox color={t.styles.primary} />
							<ColorBox color={t.styles.accent} />
							<ColorBox color={t.styles.secondary} />
							<ColorBox color={t.styles.border} />
						</div>
						<span className='capitalize'>{t.label ?? 'default'}</span>
						<Button
							className='ml-auto'
							disabled={theme === t.value}
							size='sm'
							variant='outline'
							onClick={() => setTheme(t.value)}>
							{theme === t.value ? 'Selected' : 'Switch'}
						</Button>
					</div>
				)
			})}
		</div>
	)
}

function ColorBox({ color }: { color: string }) {
	return <div className='h-3 w-3 rounded-sm border border-muted' style={{ backgroundColor: color }} />
}
