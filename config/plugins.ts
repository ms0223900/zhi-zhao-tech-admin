export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                accessKeyId: env('AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('AWS_ACCESS_SECRET'),
                region: env('AWS_REGION'),
                params: {
                    ACL: env('AWS_ACL', 'private'),
                    signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                    Bucket: env('AWS_S3_BUCKET'),
                },
            },
            actionOptions: {
                upload: {
                    sizeLimit: 20 * 1024 * 1024, // 20MB
                },
                uploadStream: {
                    sizeLimit: 20 * 1024 * 1024, // 20MB
                },
                delete: {},
            },
        },
    },
});
