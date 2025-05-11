import { logout } from '@/actions/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/base/c-button'
import { LayoutProps } from '@/components/ui/base/utils'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/lib/auth'
import { AuthUser } from '@/lib/utils'
import Link from 'next/link'
import { NavButtons } from './client'

export default async function Layout({ children }: LayoutProps) {
	const user = await auth()

	return (
		<div>
			<nav className='h-16 px-4 border-b'>
				<div className='w-full h-full max-w-screen-lg mx-auto flex items-center justify-between'>
					<NavButtons />
					<UserMenu user={user} />
				</div>
			</nav>
			<div className='w-full max-w-screen-lg mx-auto mt-4 sm:px-4'>{children}</div>
		</div>
	)
}

function UserMenu({ user }: { user: AuthUser }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative size-10 rounded-full'>
					<Avatar className='size-10'>
						<AvatarImage src={user.image ?? ''} alt={user.name ?? user.email} />
						<AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>{user.name}</p>
						<p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href='/settings'>
						<DropdownMenuItem>Settings</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<form action={logout}>
					<DropdownMenuItem asChild>
						<button className='w-full' type='submit'>
							Log out
						</button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
