import { connectDB } from "../../database";

export default async function handler(req, res) {
  if (req.method != "GET") {
    return res.status(400).json("잘못된 접근입니다.");
  }

  const db = (await connectDB).db("test");
  let result = await db.collection("comment").find().toArray();
  console.log(result);
  return res.status(200).json(result);
}
