import { NextApiRequest, NextApiResponse } from "next";
import { dbConnectionMain } from "@/app/lib/db/db";
import Student from "@/app/lib/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnectionMain();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const student = await Student.findById(id);
        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching student" });
      }
      break;

    case "PUT":
      try {
        const student = await Student.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating student" });
      }
      break;

    case "DELETE":
      try {
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
          return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting student" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
