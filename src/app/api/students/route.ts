import { NextResponse } from "next/server";
import { query } from "@/app/lib/dbPG/dbPG";
import { Student } from "@/app/lib/types/student";

function setCorsHeaders(response: NextResponse, request?: Request) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://scholar-manager-git-main-jmtrinidads-projects-c5d38af8.vercel.app",
    "https://stronglabs.vercel.app",
  ];

  const requestOrigin = request?.headers.get("origin") || "";
  const origin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[2];

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function OPTIONS(request: Request) {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response, request);
}

// SELECT student_id, scholar_name, year_level,
// school_year_name, semester_name, batch_name,
// scholarship_status, course, campus, school_email,
// secondary_email, contact_number, internship_year,
// graduation_year, delistment_date, delistment_reason,
// termination_notice_status, other_comments, absorbed,
// hire_date, role_id, student_pass

// 	FROM public.masterlist_detailed;

// export async function GET(request: Request) {
//   try {
//     const students = [
//       {
//         student_id: "02000221234",
//         scholar_name: "Juan Dela Cruz",
//         school_email: "juan.cruz@sti.edu",
//         year_level: "3rd Year",
//         course: "BSCS",
//         campus: "STI Ortigas-Cainta",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2026,
//         scholarship_status: "Inactive",
//       },
//       {
//         student_id: "02000222222",
//         scholar_name: "Great Britain Rendon",
//         school_email: "greatbritainrendon@gmail.com",
//         year_level: "3rd Year",
//         course: "BSCS",
//         campus: "STI Ortigas-Cainta",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2026,
//         scholarship_status: "Inactive",
//       },
//       {
//         student_id: "02000562139",
//         scholar_name: "John Martin Nigos",
//         school_email: "john.nigos@sti.edu",
//         year_level: "2nd Year",
//         course: "BSIT",
//         campus: "STI Sta. Mesa",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2025,
//         scholarship_status: "Inactive",
//       },
//       {
//         student_id: "02000125678",
//         scholar_name: "Geguna Arvin",
//         school_email: "geguna.arvin@sti.edu",
//         year_level: "4th Year",
//         course: "BSIT",
//         campus: "STI Sta. Mesa",
//         delistment_date: "2024-05-15",
//         delistment_reason: "Academic deficiency",
//         graduation_year: null,
//         scholarship_status: "Inactive",
//       },
//       {
//         student_id: "02000674512",
//         scholar_name: "Toyo Ashley Aguilar",
//         school_email: "dann.aguilar@sti.edu",
//         year_level: "1st Year",
//         course: "BSIT",
//         campus: "STI Sta. Mesa",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2027,
//         scholarship_status: "Inactive",
//       },
//       {
//         student_id: "02000304986",
//         scholar_name: "toyo Trinidad",
//         school_email: "trinidad.304986@ortigas-cainta.sti.edu.ph",
//         year_level: "2",
//         course: "BSIT",
//         campus: "STI Sta. Mesa",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2026,
//         scholarship_status: "Active",
//       },
//       {
//         student_id: "020003203232",
//         scholar_name: "testing testing",
//         school_email: "testing@gmail.com",
//         year_level: "6",
//         course: "BSTESTT TESTTTSTEDTEST",
//         campus: "STI newest branch",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2026,
//         scholarship_status: "Active",
//       },
//         {
//         student_id: "02000843743",
//         scholar_name: "testing testing",
//         school_email: "hannahmpaulino@gmail.com",
//         year_level: "6",
//         course: "BSHM",
//         campus: "STI West Negros",
//         delistment_date: null,
//         delistment_reason: null,
//         graduation_year: 2026,
//         scholarship_status: "Active",
//       },
//     ];

//     const transformedStudents = students.map((student) => {
//       let program = student.course;
//       if (student.course === "BSCS") {
//         program = "Bachelor of Science in Computer Science";
//       } else if (student.course === "BSIT") {
//         program = "Bachelor of Science in Information Technology";
//       }
//       const yearLevel = student.year_level;
//       const yearDigit = yearLevel ? yearLevel.match(/\d/)?.[0] || "" : "";

//       return {
//         _id: student.student_id.toString(),
//         studentNumber: student.student_id.toString(),
//         schoolEmail: student.school_email,
//         firstName: student.scholar_name.split(" ")[0] || "",
//         lastName: student.scholar_name.split(" ").slice(1).join(" ") || "",
//         scholarship_status: student.scholarship_status,
//         graduation_year: student.graduation_year,
//         year: yearDigit,
//         branch: student.campus,
//         program: program,
//         createdAt: new Date().toISOString(),
//         __v: 0,
//       };
//     });
//     console.log("API Triggered: ", Date.now());
//     const response = NextResponse.json(transformedStudents);
//     return setCorsHeaders(response, request);
//   } catch (error: unknown) {
//     console.error("Error fetching students:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     const response = NextResponse.json([], { status: 200 });
//     response.headers.set(
//       "X-Error-Message",
//       `Error fetching students: ${errorMessage}`
//     );
//     return setCorsHeaders(response, request);
//   }
// }
export async function GET(request: Request) {
  try {
    const students = await query<Student>(
      `SELECT student_id, scholar_name, school_email, year_level, course, campus, delistment_date, delistment_reason, graduation_year, scholarship_status
       FROM public.masterlist_detailed`
    );

    const transformedStudents = students.map((student) => {
      let program = student.course;
      if (student.course === "BSCS") {
        program = "Bachelor of Science in Computer Science";
      } else if (student.course === "BSIT") {
        program = "Bachelor of Science in Information Technology";
      }
      const yearLevel = student.year_level;
      const yearDigit = yearLevel ? yearLevel.match(/\d/)?.[0] || "" : "";

      return {
        _id: student.student_id.toString(),
        studentNumber: student.student_id.toString(),
        schoolEmail: student.school_email,
        firstName: student.scholar_name.split(" ")[0] || "",
        lastName: student.scholar_name.split(" ").slice(1).join(" ") || "",
        scholarship_status: student.scholarship_status,
        graduation_year: student.graduation_year,
        year: yearDigit,
        branch: student.campus,
        program: program,
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
