import { MongoClient, GridFSBucket } from "mongodb";
import uniqid from "uniqid";
import { Readable } from "stream";

// MongoDB connection details
const DATABASE_NAME = "food-ordering";

// Setup MongoDB connection and GridFS bucket
let db;
let bucket;

const connectToDatabase = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db(DATABASE_NAME);
    bucket = new GridFSBucket(db, {
      bucketName: "uploads",
    });
  }
};

export async function POST(req) {
  await connectToDatabase();

  const data = await req.formData();
  if (data.get("file")) {
    // Upload the file to GridFS
    const file = data.get("file");

    const ext = file.name.split(".").slice(-1)[0];
    const newFileName = uniqid() + "." + ext;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const readablePhotoStream = new Readable();
    readablePhotoStream.push(buffer);
    readablePhotoStream.push(null);

    const uploadStream = bucket.openUploadStream(newFileName, {
      contentType: file.type,
    });

    readablePhotoStream.pipe(uploadStream);

    await new Promise((resolve, reject) => {
      uploadStream.on("error", reject);
      uploadStream.on("finish", resolve);
    });

    const fileId = uploadStream.id;
    const link = `http://localhost:3000/api/download/${fileId}`;
    return new Response(JSON.stringify({ link }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
