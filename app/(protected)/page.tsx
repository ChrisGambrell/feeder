import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { DropletsIcon, MilkIcon } from 'lucide-react'
import { CreateActivityDialog } from './client'

export default async function DashboardPage() {
	const user = await auth()
	const activities = await prisma.activity.findMany({ where: { user_id: user.id }, orderBy: { created_at: 'desc' } })

	return (
		<div className='grid gap-4 px-2'>
			<div className='flex items-center gap-2'>
				<CreateActivityDialog type='PEE'>
					<button className='cursor-pointer flex-1 h-24 flex flex-col items-center justify-center gap-2 rounded-md border p-2 hover:bg-muted transition-colors'>
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
					<button className='cursor-pointer flex-1 h-24 flex flex-col items-center justify-center gap-2 rounded-md border p-2 hover:bg-muted transition-colors'>
						<DropletsIcon className='size-6 fill-yellow-800' />
						<span className='text-sm font-black'>Log Poop</span>
					</button>
				</CreateActivityDialog>
			</div>
			<div className='divide-y'>
				{activities.map((activity) => (
					<div key={activity.id} className='p-2 flex flex-col'>
						{activity.type === 'FOOD' ? (
							<>
								<div className='flex items-center gap-2 justify-between'>
									<span className='text-lg font-black'>{activity.type}</span>
									<span className='text-xs text-muted-foreground'>{activity.created_at.toLocaleString()}</span>
								</div>
								<span className='text-sm text-muted-foreground'>
									{activity.amount} {activity.unit}
								</span>
								{activity.notes && <span className='text-sm italic text-muted-foreground'>{activity.notes}</span>}
							</>
						) : (
							<>
								<div className='flex items-center gap-2 justify-between'>
									<span className='text-lg font-black'>{activity.type}</span>
									<span className='text-xs text-muted-foreground'>{activity.created_at.toLocaleString()}</span>
								</div>
								{activity.notes && <span className='text-sm italic text-muted-foreground'>{activity.notes}</span>}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
