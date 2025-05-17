// "use client";

// import { useState } from "react";
// import useSWR from "swr";
// import Head from "next/head";
// import { useRouter } from "next/navigation";
// import { Student } from "@/app/lib/types/student";

// const CAMPUSES = ["STI Ortigas-Cainta", "STI Sta. Mesa", "STI Global", "STI Fairview"];

// const fetcher = (url: string) => fetch(url).then(async (res) => {
//     if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || "Failed to fetch students");
//     }
//     return res.json();
// });

// export default function StudentManagement() {
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [filterCampus, setFilterCampus] = useState<string>("");
//     const router = useRouter();

//     const { data: students, error: fetchError } = useSWR<Student[]>("/api/students", fetcher);
//     const isLoading = !students && !fetchError;
//     const isError = !!fetchError || (students && !Array.isArray(students));

//     const filteredStudents = (students || []).filter((student) => {
//         if (!student) return false;

//         const name = student.scholar_name?.toLowerCase() || "";
//         const id = student.student_id?.toString() || "";
//         const campus = student.campus || "";

//         const matchesSearch =
//             name.includes(searchTerm.toLowerCase()) ||
//             id.includes(searchTerm);

//         const matchesCampus = filterCampus ? campus === filterCampus : true;

//         return matchesSearch && matchesCampus;
//     });

//     const handleStudentClick = (studentId?: string) => {
//         if (studentId) {
//             router.push(`/student/${studentId}`);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Head>
//                 <title>Student Management | Scholar System</title>
//                 <meta name="description" content="Manage students and scholars" />
//             </Head>

//             <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     <div className="w-full">
//                         <div className="bg-white shadow rounded-lg overflow-hidden">
//                             <div className="p-6">
//                                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Records</h2>

//                                 {/* Filters */}
//                                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                                     <div className="flex-1">
//                                         <label htmlFor="search" className="sr-only">
//                                             Search
//                                         </label>
//                                         <div className="relative rounded-md shadow-sm">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <svg
//                                                     className="h-5 w-5 text-gray-400"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 20 20"
//                                                     fill="currentColor"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                                                         clipRule="evenodd"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 id="search"
//                                                 className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                                                 placeholder="Search by name or ID"
//                                                 value={searchTerm}
//                                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="w-full sm:w-48">
//                                         <label htmlFor="campus-filter" className="sr-only">
//                                             Campus
//                                         </label>
//                                         <select
//                                             id="campus-filter"
//                                             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
//                                             value={filterCampus}
//                                             onChange={(e) => setFilterCampus(e.target.value)}
//                                         >
//                                             <option value="">All Campuses</option>
//                                             {CAMPUSES.map((campus) => (
//                                                 <option key={campus} value={campus}>
//                                                     {campus}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                                 {/* Status Display */}
//                                 {isLoading ? (
//                                     <div className="flex justify-center items-center h-64">
//                                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//                                     </div>
//                                 ) : isError ? (
//                                     <div className="text-center py-12">
//                                         <svg
//                                             className="mx-auto h-12 w-12 text-gray-400"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                             />
//                                         </svg>
//                                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                                             Failed to load students
//                                         </h3>
//                                         <p className="mt-1 text-sm text-gray-500">
//                                             {fetchError?.message || "An unexpected error occurred"}
//                                         </p>
//                                     </div>
//                                 ) : filteredStudents.length === 0 ? (
//                                     <div className="text-center py-12">
//                                         <svg
//                                             className="mx-auto h-12 w-12 text-gray-400"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                             />
//                                         </svg>
//                                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                                             No students found
//                                         </h3>
//                                         <p className="mt-1 text-sm text-gray-500">
//                                             Try adjusting your search or add a new student
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full divide-y divide-gray-200">
//                                             <thead className="bg-gray-50">
//                                                 <tr>
//                                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         ID
//                                                     </th>
//                                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Name
//                                                     </th>
//                                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Campus
//                                                     </th>
//                                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                         Status
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="bg-white divide-y divide-gray-200">
//                                                 {filteredStudents.map((student) => {
//                                                     const [firstName = "", ...lastNameParts] = student.scholar_name?.split(" ") || [];
//                                                     const lastName = lastNameParts.join(" ") || "";
//                                                     const rowKey = student.student_id?.toString() || Math.random().toString(36).substring(2, 15);
//                                                     return (

//                                                         <tr
//                                                             key={rowKey} // Key is provided here
//                                                             className="hover:bg-gray-50 cursor-pointer"
//                                                             onClick={() => handleStudentClick(student.student_id?.toString())}
//                                                         >
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                                 {student.student_id || 'N/A'}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                                 <div className="text-sm text-gray-900 font-medium">
//                                                                     {firstName} {lastName}
//                                                                 </div>
//                                                                 <div className="text-sm text-gray-500">
//                                                                     {student.school_email || 'No email'}
//                                                                 </div>
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                 {student.campus || 'N/A'}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                                 <span
//                                                                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.scholarship_status === "Scholar"
//                                                                             ? "bg-green-100 text-green-800"
//                                                                             : "bg-gray-100 text-gray-800"
//                                                                         }`}
//                                                                 >
//                                                                     {student.scholarship_status || 'Unknown'}
//                                                                 </span>
//                                                             </td>
//                                                         </tr>
//                                                     );
//                                                 })}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }