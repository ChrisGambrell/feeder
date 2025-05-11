'use server'

import { handleFormAction } from '@/components/ui/base/action'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { env } from '@/lib/env'
import { s3 } from '@/lib/s3'
import { getSuccessRedirect } from '@/lib/utils'
import { createActivitySchema, createInviteSchema, updateAvatarSchema, updateUserSchema } from '@/validators/user'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Account, Invite } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

export const createActivity = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, createActivitySchema, async (data) => {
		const user = await auth()
		await prisma.activity.create({ data: { ...data, user_id: user.id } })
		// TODO: Use the new successMessage
		redirect(getSuccessRedirect('/', 'Successfully logged activity'))
	})

export const createInvite = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, createInviteSchema, async ({ email }) => {
		const user = await auth()
		const token = nanoid()

		await prisma.invite.create({ data: { email, token, inviter_id: user.id } })

		const resend = new Resend(env.AUTH_RESEND_KEY)
		await resend.emails.send({
			from: 'Feeder No-Reply <noreply@gambrell.dev>',
			to: email,
			subject: 'Feeder Invitation',
			html: `<p>You have been invited to join Feeder by ${user.name}.</p><p>Click <a href="${env.NEXT_PUBLIC_SITE_URL}">here</a> to accept the invitation.</p>`,
		})

		redirect(getSuccessRedirect('/', 'Invitation sent'))
	})

export async function respondToInvite(id: Invite['id'], status: Invite['status']) {
	const user = await auth()
	await prisma.invite.update({ where: { id, email: user.email }, data: { status } })
	redirect(getSuccessRedirect('/', 'Invitation responded to'))
}

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
