import { dbConnectionMain } from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import StudentModel from "@/app/lib/models/user";
import mongoose from "mongoose";

// Define the Student interface to match the Mongoose schema
interface Student {
  _id: mongoose.Types.ObjectId;
  studentNumber: string;
  schoolEmail: string;
  firstName: string;
  lastName: string;
  year: string;
  branch: string;
  program: string;
  isScholar: boolean;
  createdAt: Date;
}

// Define the request body type for POST
interface StudentCreateBody {
  studentNumber: string;
  schoolEmail: string;
  firstName: string;
  lastName: string;
  year: string;
  branch: string;
  program: string;
  isScholar?: boolean;
}

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  // Allow all origins for a public API (or specify origins for better security)
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  // No credentials needed for public API
  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response);
}

export async function GET() {
  try {
    await dbConnectionMain();
    const students = await StudentModel.find<Student>({});
    const response = NextResponse.json(students);
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error("Error fetching students:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json(
      { message: "Error fetching students", error: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnectionMain();
    const body: StudentCreateBody = await request.json();

    // Validate required fields
    const requiredFields: (keyof StudentCreateBody)[] = [
      "studentNumber",
      "schoolEmail",
      "firstName",
      "lastName",
      "year",
      "branch",
      "program",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      const response = NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // Check for existing student
    const existingStudent = await StudentModel.findOne<Student>({
      $or: [
        { studentNumber: body.studentNumber },
        { schoolEmail: body.schoolEmail },
      ],
    });

    if (existingStudent) {
      const response = NextResponse.json(
        { message: "Student already exists" },
        { status: 409 }
      );
      return setCorsHeaders(response);
    }

    const newStudent = new StudentModel(body);
    await newStudent.save();

    const response = NextResponse.json(newStudent, { status: 201 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error("Error creating student:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      const response = NextResponse.json(
        { message: "Student already exists" },
        { status: 409 }
      );
      return setCorsHeaders(response);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json(
      { message: "Error creating student", error: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnectionMain();
    const { id } = await request.json();

    if (!id) {
      const response = NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const response = NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    const deletedStudent = await StudentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      const response = NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(
      {
        message: "Student deleted successfully",
        deletedStudent,
      },
      { status: 200 }
    );
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error("Error deleting student:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json(
      { message: "Error deleting student", error: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
