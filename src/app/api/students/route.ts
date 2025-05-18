import { NextResponse } from "next/server";
import { query } from "@/app/lib/dbPG/dbPG";
import { Student } from "@/app/lib/types/student";

function setCorsHeaders(response: NextResponse, request?: Request) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://scholar-manager-git-main-jmtrinidads-projects-c5d38af8.vercel.app/",
    "https://stronglabs.vercel.app",
  ];

  const requestOrigin = request?.headers.get("origin") || "";
  const origin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[2];

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}
// test

export async function OPTIONS(request: Request) {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response, request);
}

export async function GET(request: Request) {
  try {
    const students = await query<Student>(
      `SELECT student_id, scholar_name, school_email, year_level, course, campus
       FROM public.masterlist_detailed`
    );

    const transformedStudents = students.map((student) => {
      let program = student.course;
      if (student.course === "BSCS") {
        program = "Bachelor of Science in Computer Science";
      } else if (student.course === "BSIT") {
        program = "Bachelor of Science in Information Technology";
      }

      return {
        _id: student.student_id.toString(),
        studentNumber: student.student_id.toString(),
        schoolEmail: student.school_email,
        firstName: student.scholar_name.split(" ")[0] || "",
        lastName: student.scholar_name.split(" ").slice(1).join(" ") || "",
        year: student.year_level,
        branch: student.campus,
        program: program,
        isScholar: true,
        createdAt: new Date().toISOString(),
        __v: 0,
      };
    });

    const response = NextResponse.json(transformedStudents);
    return setCorsHeaders(response, request);
  } catch (error: unknown) {
    console.error("Error fetching students:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json([], { status: 200 });
    response.headers.set(
      "X-Error-Message",
      `Error fetching students: ${errorMessage}`
    );
    return setCorsHeaders(response, request);
  }
}
