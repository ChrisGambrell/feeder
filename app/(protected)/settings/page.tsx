import { unlinkAccount } from '@/actions/user'
import { Button } from '@/components/ui/base/c-button'
import { ConfirmDelete } from '@/components/ui/base/confirm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { OAuthProviderId } from 'next-auth/providers'
import { LinkAccountButton, SettingsForm, ThemeSwitcher } from './client'

export default async function SettingsPage() {
	const user = await auth()
	const linkedAccounts = await prisma.account.findMany({ where: { userId: user.id } })

	return (
		<div className='grid gap-4 lg:grid-cols-3'>
			<Card className='h-fit border-0 shadow-none sm:border sm:shadow-sm lg:col-span-2'>
				<CardHeader>
					<CardTitle>Update your account details</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingsForm user={user} />
				</CardContent>
			</Card>
			<div className='h-fit grid gap-4'>
				<Card className='h-fit border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border sm:shadow-sm'>
					<CardHeader>
						<CardTitle>Linked accounts</CardTitle>
						<CardDescription>Link your social media accounts</CardDescription>
					</CardHeader>
					<CardContent>
						<form className='flex flex-col divide-y'>
							{['github', 'google'].map((provider) => {
								const linkedAccount = linkedAccounts.find((account) => account.provider === provider)
								return (
									<div key={provider} className='py-2 flex items-center justify-between'>
										<span className='capitalize'>{provider}</span>
										{linkedAccount ? (
											<ConfirmDelete action={unlinkAccount.bind(null, provider, linkedAccount.providerAccountId)}>
												<Button size='sm' variant='outline'>
													Unlink
												</Button>
											</ConfirmDelete>
										) : (
											<LinkAccountButton provider={provider as OAuthProviderId} />
										)}
									</div>
								)
							})}
						</form>
					</CardContent>
				</Card>
				<Card className='h-fit border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border sm:shadow-sm'>
					<CardHeader>
						<CardTitle>Theme</CardTitle>
						<CardDescription>Change the theme of the app</CardDescription>
					</CardHeader>
					<CardContent>
						<ThemeSwitcher />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
