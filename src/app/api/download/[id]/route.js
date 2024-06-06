import { MongoClient, ObjectId, GridFSBucket } from "mongodb";
import { NextResponse } from "next/server";

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

export async function GET(req, { params }) {
  await connectToDatabase();

  const id = params.id;

  if (!id) {
    return new NextResponse("File ID is required", { status: 400 });
  }

  try {
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);
    const fileDetails = await db
      .collection("uploads.files")
      .findOne({ _id: new ObjectId(id) });

    if (!fileDetails) {
      return new NextResponse("File not found", { status: 404 });
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": fileDetails.contentType,
        "Content-Disposition": `attachment; filename="${fileDetails.filename}"`,
      },
    });
  } catch (error) {
    return new NextResponse("Error retrieving file", { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, as we are streaming data
  },
};