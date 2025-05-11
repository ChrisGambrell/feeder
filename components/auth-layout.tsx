import { ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export function AuthLayout({ children, title, desc }: { children: ReactNode; title: string; desc: string }) {
	return (
		<div className='min-h-screen bg-background relative flex flex-col sm:flex-row sm:items-center sm:justify-center p-4 sm:p-8 gap-4 sm:gap-0'>
			<div className='w-full sm:max-w-md'>
				<Card className='border-0 shadow-none sm:border sm:shadow-sm'>
					<CardHeader className='text-center'>
						<CardTitle className='text-2xl font-bold'>{title}</CardTitle>
						<CardDescription>{desc}</CardDescription>
					</CardHeader>
					{children}
				</Card>
			</div>
		</div>
	)
}
