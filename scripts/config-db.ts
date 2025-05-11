import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export function main() {
	try {
		// Read the current package.json
		const packageJsonPath = join(process.cwd(), 'package.json')
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

		// Add or update the prisma configuration
		packageJson.prisma = { schema: './prisma/schema' }

		// Add or update the postinstall script
		packageJson.scripts = {
			...packageJson.scripts,
			postinstall: 'npx prisma generate',
		}

		// Write the updated package.json back to the file
		writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

		console.log('Successfully added Prisma configuration and postinstall script to package.json')
	} catch (error) {
		console.error('Error updating package.json:', error)
		process.exit(1)
	}
}

main()
