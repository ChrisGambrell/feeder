import { GlobalToaster } from '@/components/ui/base/global-toaster'
import { ThemeProvider } from '@/components/ui/base/theme-provider'
import '@/lib/env'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Feeder',
	description: "Feeder is a simple app to help you track your baby's food intake and output.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider defaultTheme='light' disableTransitionOnChange>
					{children}
					<Suspense>
						<GlobalToaster />
					</Suspense>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
