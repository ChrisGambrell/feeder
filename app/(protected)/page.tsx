import { Card } from '@/components/ui/card'

export default function DashboardPage() {
	return (
		<div className='grid gap-4 lg:grid-cols-3'>
			<div className='h-fit grid gap-4 lg:col-span-2'>
				<Card className='h-[400px] border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border-2 sm:border-dashed sm:shadow-sm' />
				<Card className='h-[200px] border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border-2 sm:border-dashed sm:shadow-sm' />
			</div>
			<div className='h-fit grid gap-4'>
				<Card className='h-[200px] border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border-2 sm:border-dashed sm:shadow-sm' />
				<Card className='h-[300px] border-0 border-t shadow-none rounded-none sm:rounded-xl sm:border-2 sm:border-dashed sm:shadow-sm' />
			</div>
		</div>
	)
}
