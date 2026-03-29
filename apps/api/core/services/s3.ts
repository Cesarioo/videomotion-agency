import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL; // Optional: Custom domain or R2.dev URL

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.warn('Missing R2 environment variables. File upload will not work.');
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

/**
 * Uploads a file to Cloudflare R2
 * @param filePath Local path to the file
 * @param key Optional custom key (filename) for the uploaded file. Defaults to basename of filePath.
 * @param contentType Optional content type.
 * @returns Object containing the key and public URL (if configured)
 */
export async function uploadFile(filePath: string, key?: string, contentType?: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileStream = fs.createReadStream(filePath);
  const fileKey = key || path.basename(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: fileStream,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL if a base URL is provided
    let url = null;
    if (publicUrl) {
      // Ensure publicUrl doesn't end with slash and key doesn't start with slash
      const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
      const cleanKey = fileKey.startsWith('/') ? fileKey.slice(1) : fileKey;
      url = `${baseUrl}/${cleanKey}`;
    }

    return {
      success: true,
      key: fileKey,
      bucket: bucketName,
      url: url,
    };
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw error;
  }
}

/**
 * Uploads a buffer to Cloudflare R2
 * @param buffer File buffer
 * @param key Filename for the uploaded file
 * @param contentType Optional content type
 * @returns Object containing the key and public URL (if configured)
 */
export async function uploadBuffer(buffer: Buffer, key: string, contentType?: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL if a base URL is provided
    let url = null;
    if (publicUrl) {
      // Ensure publicUrl doesn't end with slash and key doesn't start with slash
      const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
      const cleanKey = key.startsWith('/') ? key.slice(1) : key;
      url = `${baseUrl}/${cleanKey}`;
    }

    return {
      success: true,
      key: key,
      bucket: bucketName,
      url: url,
    };
  } catch (error) {
    console.error('Error uploading buffer to R2:', error);
    throw error;
  }
}

