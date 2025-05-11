'use client'

import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
