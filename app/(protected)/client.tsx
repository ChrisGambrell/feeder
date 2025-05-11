'use client'

import { createActivity } from '@/actions/user'
import { ActionButton } from '@/components/ui/base/action-button'
import { FormInput } from '@/components/ui/base/form-input'
import { FormSelect } from '@/components/ui/base/form-select'
import { FormTextarea } from '@/components/ui/base/form-textarea'
import { useForm } from '@/components/ui/base/use-form'
import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createActivitySchema } from '@/validators/user'
import { ActivityType } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const links = [
	{ href: '/', exact: true, label: 'Baby Log' },
	{ href: '/settings', label: 'Settings' },
]

export function NavButtons() {
	const pathname = usePathname()

	return (
		<div className='flex gap-1'>
			{links.map((link) => (
				<Link
					key={link.href}
					className={buttonVariants({
						variant: link.exact
							? pathname === link.href
								? 'secondary'
								: 'link'
							: pathname.startsWith(link.href)
							? 'secondary'
							: 'link',
					})}
					href={link.href}>
					{link.label}
				</Link>
			))}
		</div>
	)
}

export function CreateActivityDialog({ children, type }: { children: ReactNode; type: ActivityType }) {
	const [state, action, loading] = useForm(createActivity, createActivitySchema)

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Log {type}</DialogTitle>
					<DialogDescription>Enter the amount and unit of {type} and click submit.</DialogDescription>
				</DialogHeader>
				<form action={action} className='grid gap-6'>
					<input type='hidden' name='type' value={type} />

					<div className='grid grid-cols-3 gap-2'>
						<FormInput className='col-span-2' label='Amount' name='amount' type='number' state={state} />
						<FormSelect
							label='Unit'
							name='unit'
							// TODO: When selected, add to local storage and make the default
							options={['ml', 'g', 'oz', 'lb', 'cup', 'tsp', 'tbsp', 'pinch', 'none']}
							defaultValue='ml'
							state={state}
						/>
					</div>
					<FormTextarea label='Notes' name='notes' placeholder='Added diaper rash cream, etc.' state={state} />
					<ActionButton loading={loading}>Submit</ActionButton>
				</form>
			</DialogContent>
		</Dialog>
	)
}
