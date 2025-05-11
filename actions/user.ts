'use server'

import { handleFormAction } from '@/components/ui/base/action'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { s3 } from '@/lib/s3'
import { getSuccessRedirect } from '@/lib/utils'
import { updateAvatarSchema, updateUserSchema } from '@/validators/user'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Account } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { env } from 'process'
import { v4 as uuidv4 } from 'uuid'

export const updateAvatar = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, updateAvatarSchema, async ({ file }) => {
		const user = await auth()
		const Key = `avatars/${user.id}/${uuidv4()}`

		const cmd = new PutObjectCommand({ Bucket: env.AWS_PUBLIC_BUCKET_NAME, Key, ContentType: file.type ?? 'application/octet-stream' })
		const url = await getSignedUrl(s3, cmd, { expiresIn: 60 })

		await prisma.user
			.update({
				where: { id: user.id },
				data: { image: `https://${env.AWS_PUBLIC_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${Key}` },
			})
			.then(async () => await fetch(url, { method: 'PUT', body: file }))

		revalidatePath('/settings')
	})

export const updateUser = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, updateUserSchema, async ({ password, confirmPassword, ...data }) => {
		const user = await auth()

		await prisma.user.update({ where: { id: user.id }, data })

		if (password && confirmPassword) {
			const passwordHash = await bcrypt.hash(password, 10)
			await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })
		}

		redirect(getSuccessRedirect('/settings', 'Account updated'))
	})

export async function unlinkAccount(provider: Account['provider'], providerAccountId: Account['providerAccountId']) {
	const user = await auth()
	await prisma.account.delete({ where: { provider_providerAccountId: { provider, providerAccountId }, userId: user.id } })
	redirect(getSuccessRedirect('/settings', 'Account unlinked'))
}
