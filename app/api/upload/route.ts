import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
const s3client = new S3({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_KEY!,
  },
});

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
export async function POST(req: NextRequest) {
  try {
    const { name, type, fileBuffer }: any = await req.json();
    const buffer = Buffer.from(fileBuffer, "base64");
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: name,
      Body: buffer,
      ContentType: type,
    };
    const upload = await s3client.send(new PutObjectCommand(params));
    return NextResponse.json(
      { message: "Successfully uploaded" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
