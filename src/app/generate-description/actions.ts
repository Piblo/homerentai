"use server";

import { IMAGES_BUCKET_NAME, client } from "@/server/s3";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/server/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type GetPreSignedUrlResponse =
  | { error?: never; result: { url: string; imageUrl: string } }
  | { error: string; result?: never };

export async function getPreSignedUrl(
  contentType: string
): Promise<GetPreSignedUrlResponse> {
  const session = await auth();
  if (!session) return { error: "Not authenticated" };

  if (!contentType.startsWith("image/")) {
    return { error: "Invalid content type" };
  }

  const command = new PutObjectCommand({
    Bucket: IMAGES_BUCKET_NAME,
    Key: crypto.randomUUID(),
    ContentType: contentType,
    Metadata: {
      userId: session.user?.id ?? "",
    },
  });

  const url = await getSignedUrl(client, command, { expiresIn: 60 });

  return { result: { url, imageUrl: url.split("?").at(0) ?? "" } };
}
