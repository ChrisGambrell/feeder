import { respondToInvite } from '@/actions/user'
import { ActionButton } from '@/components/ui/base/action-button'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { cn } from '@/lib/utils'
import { CheckIcon, DropletsIcon, MilkIcon, XIcon } from 'lucide-react'
import { CreateActivityDialog, ShareDialog } from './client'

export default async function DashboardPage() {
	const user = await auth()

	const invites = await prisma.invite.findMany({
		where: { email: user.email, status: { in: ['PENDING', 'ACCEPTED'] } },
		include: { inviter: true },
		orderBy: { created_at: 'desc' },
	})

	const activities = await prisma.activity.findMany({
		where: {
			OR: [
				{ user_id: user.id },
				{ user_id: { in: invites.filter((invite) => invite.status === 'ACCEPTED').map((invite) => invite.inviter_id) } },
			],
		},
		orderBy: { created_at: 'desc' },
	})

	return (
		<div className='grid gap-4 px-2'>
			<ShareDialog />
			{invites.filter((invite) => invite.status === 'PENDING').length > 0 && (
				<div className='grid gap-1'>
					{invites
						.filter((invite) => invite.status === 'PENDING')
						.map((invite) => (
							<div key={invite.id} className='bg-green-500/40 px-4 py-2 rounded-lg border flex items-center gap-4'>
								<div className='flex-1 font-bold'>
									{invite.inviter.name} has invited you to join their log of activities.
								</div>
								<form className='flex items-center gap-1'>
									<ActionButton
										formAction={respondToInvite.bind(null, invite.id, 'ACCEPTED')}
										size='icon'
										variant='ghost'>
										<CheckIcon />
									</ActionButton>
									<ActionButton
										formAction={respondToInvite.bind(null, invite.id, 'REJECTED')}
										size='icon'
										variant='ghost'>
										<XIcon />
									</ActionButton>
								</form>
							</div>
						))}
				</div>
			)}
			<div className='flex items-center gap-2'>
				<CreateActivityDialog type='PEE'>
					<button className='cursor-pointer bg-yellow-500/40 flex-1 h-24 flex flex-col items-center justify-center gap-2 rounded-md border p-2 hover:bg-yellow-500/60 transition-colors'>
						<DropletsIcon className='size-6 fill-yellow-500' />
						<span className='text-sm font-black'>Log Pee</span>
					</button>
				</CreateActivityDialog>
				<CreateActivityDialog type='FOOD'>
					<button className='cursor-pointer flex-1 h-24 flex flex-col items-center justify-center gap-2 rounded-md border p-2 hover:bg-muted transition-colors'>
						<MilkIcon className='size-6' />
						<span className='text-sm font-black'>Log food</span>
					</button>
				</CreateActivityDialog>
				<CreateActivityDialog type='POOP'>
					<button className='cursor-pointer bg-yellow-800/40 flex-1 h-24 flex flex-col items-center justify-center gap-2 rounded-md border p-2 hover:bg-yellow-800/60 transition-colors'>
						<DropletsIcon className='size-6 fill-yellow-800' />
						<span className='text-sm font-black'>Log Poop</span>
					</button>
				</CreateActivityDialog>
			</div>
			<div className='divide-y'>
				{activities.map((activity) => (
					<div
						key={activity.id}
						className={cn('m-2 p-2 rounded-lg border flex flex-col', {
							'bg-yellow-500/40': activity.type === 'PEE',
							'bg-yellow-800/40': activity.type === 'POOP',
						})}>
						{activity.type === 'FOOD' ? (
							<>
								<div className='flex items-center gap-2 justify-between'>
									<span className='text-lg font-black'>{activity.type}</span>
									<span className='text-xs'>{activity.created_at.toLocaleString()}</span>
								</div>
								<span className='text-sm'>
									{activity.amount} {activity.unit}
								</span>
								{activity.notes && <span className='text-sm italic'>{activity.notes}</span>}
							</>
						) : (
							<>
								<div className='flex items-center gap-2 justify-between'>
									<span className='text-lg font-black'>{activity.type}</span>
									<span className='text-xs'>{activity.created_at.toLocaleString()}</span>
								</div>
								{activity.notes && <span className='text-sm italic'>{activity.notes}</span>}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
