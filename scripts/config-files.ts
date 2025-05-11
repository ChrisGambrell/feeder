import { s3 } from '@/lib/s3'
import { CreateBucketCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()
if (
	!process.env.AWS_ACCESS_KEY_ID ||
	!process.env.AWS_SECRET_ACCESS_KEY ||
	!process.env.AWS_REGION ||
	!process.env.AWS_PUBLIC_BUCKET_NAME ||
	!process.env.NEXT_PUBLIC_SITE_URL
)
	throw new Error('Missing environment variables')

export async function main() {
	const publicBucket = process.env.AWS_PUBLIC_BUCKET_NAME!

	// await s3.send(new DeleteBucketCommand({ Bucket: publicBucket }))

	await s3.send(new CreateBucketCommand({ Bucket: publicBucket }))

	await s3.send(
		new PutPublicAccessBlockCommand({
			Bucket: publicBucket,
			PublicAccessBlockConfiguration: {
				BlockPublicAcls: false,
				IgnorePublicAcls: false,
				BlockPublicPolicy: false,
				RestrictPublicBuckets: false,
			},
		})
	)

	await s3.send(
		new PutBucketPolicyCommand({
			Bucket: publicBucket,
			Policy: JSON.stringify({
				Version: '2012-10-17',
				Statement: [
					{
						Sid: 'PublicReadAvatars',
						Effect: 'Allow',
						Principal: '*',
						Action: 's3:GetObject',
						Resource: `arn:aws:s3:::${publicBucket}/*`,
					},
				],
			}),
		})
	)
}

main()
