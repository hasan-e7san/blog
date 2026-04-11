import {
  PutObjectCommand,
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";

type UploadOptions = {
  buffer: Buffer;
  contentType?: string;
  folder?: string;
  fileName?: string;
};

type MinioEnv =
  | "MINIO_ENDPOINT"
  | "MINIO_ACCESS_KEY"
  | "MINIO_SECRET_KEY"
  | "MINIO_BUCKET";

function getEnv(name: MinioEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for MinIO uploads`);
  }
  return value;
}

function buildEndpoint(rawEndpoint: string): string {
  if (rawEndpoint.startsWith("http://") || rawEndpoint.startsWith("https://")) {
    return rawEndpoint;
  }

  const useSsl = process.env.MINIO_USE_SSL === "true";
  return `${useSsl ? "https" : "http"}://${rawEndpoint}`;
}

const bucketName = () => getEnv("MINIO_BUCKET");

const s3Client = new S3Client({
  endpoint: buildEndpoint(getEnv("MINIO_ENDPOINT")),
  region: process.env.MINIO_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: getEnv("MINIO_ACCESS_KEY"),
    secretAccessKey: getEnv("MINIO_SECRET_KEY"),
  },
});

let ensureBucketPromise: Promise<void> | null = null;

function isPublicReadEnabled(): boolean {
  return process.env.MINIO_PUBLIC_READ !== "false";
}

async function ensurePublicReadPolicy(bucket: string): Promise<void> {
  if (!isPublicReadEnabled()) {
    return;
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy),
    })
  );
}

async function ensureBucketExists(): Promise<void> {
  if (ensureBucketPromise) {
    return ensureBucketPromise;
  }

  ensureBucketPromise = (async () => {
    const bucket = bucketName();

    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
    }

    await ensurePublicReadPolicy(bucket);
  })();

  return ensureBucketPromise;
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getPublicBaseUrl(): string {
  const configured = process.env.MINIO_PUBLIC_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const endpoint = buildEndpoint(getEnv("MINIO_ENDPOINT")).replace(/\/$/, "");
  return `${endpoint}/${bucketName()}`;
}

function buildObjectUrl(objectKey: string): string {
  return `${getPublicBaseUrl()}/${objectKey}`;
}

export async function uploadBufferToStorage({
  buffer,
  contentType,
  folder = "uploads",
  fileName,
}: UploadOptions): Promise<string> {
  await ensureBucketExists();

  const safeName = sanitizeFileName(fileName || `file-${Date.now()}`);
  const objectKey = `${folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${safeName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: objectKey,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
    })
  );

  return buildObjectUrl(objectKey);
}
