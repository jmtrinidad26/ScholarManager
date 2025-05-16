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

export async function GET() {
  try {
    await dbConnectionMain();
    const students = await StudentModel.find<Student>({});
    return NextResponse.json(students);
  } catch (error: unknown) {
    console.error("Error fetching students:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching students", error: errorMessage },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check for existing student
    const existingStudent = await StudentModel.findOne<Student>({
      $or: [
        { studentNumber: body.studentNumber },
        { schoolEmail: body.schoolEmail },
      ],
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: "Student already exists" },
        { status: 409 }
      );
    }

    const newStudent = new StudentModel(body);
    await newStudent.save();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating student:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { message: "Student already exists" },
        { status: 409 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating student", error: errorMessage },
      { status: 500 }
    );
  }
}

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

export async function DELETE(request: Request) {
  try {
    await dbConnectionMain();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
    }

    const deletedStudent = await StudentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Student deleted successfully",
        deletedStudent, // Include the deleted student data in response
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting student:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error deleting student", error: errorMessage },
      { status: 500 }
    );
  }
}
