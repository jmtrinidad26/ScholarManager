"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

type Student = {
    _id: string;
    studentNumber: string;
    schoolEmail: string;
    firstName: string;
    lastName: string;
    year: string;
    branch: string;
    program: string;
    isScholar: boolean;
    createdAt: string;
};

type StudentFormData = Omit<Student, "_id" | "createdAt">;

const BRANCHES = ["STI Ortigas-Cainta", "STI Sta. Mesa", "STI Global", "STI Fairview"];
const PROGRAMS = ["BS in Computer Science", "BS in Information Technology"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function StudentManagement() {
    const [formData, setFormData] = useState<StudentFormData>({
        studentNumber: "",
        schoolEmail: "",
        firstName: "",
        lastName: "",
        year: "",
        branch: "",
        program: "",
        isScholar: true,
    });
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterBranch, setFilterBranch] = useState<string>("");

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get<Student[]>("/api/students");
                setStudents(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to load students");
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.studentNumber.match(/^\d+$/)) {
            setError("Student number must contain only digits");
            return false;
        }

        if (!formData.schoolEmail.includes("@")) {
            setError("Please enter a valid school email");
            return false;
        }

        if (formData.firstName.length < 2) {
            setError("First name must be at least 2 characters");
            return false;
        }

        if (formData.lastName.length < 2) {
            setError("Last name must be at least 2 characters");
            return false;
        }

        if (!formData.year) {
            setError("Please select a year level");
            return false;
        }

        if (!formData.branch) {
            setError("Please select a branch");
            return false;
        }

        if (!formData.program) {
            setError("Please select a program");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post<Student>("/api/students", formData);
            const newStudent = response.data;

            setSuccess(`Student ${newStudent.firstName} ${newStudent.lastName} added successfully!`);
            setStudents((prev) => [newStudent, ...prev]);

            setFormData({
                studentNumber: "",
                schoolEmail: "",
                firstName: "",
                lastName: "",
                year: "",
                branch: "",
                program: "",
                isScholar: true,
            });
        } catch (err) {
            let errorMessage = "Failed to add student";
            if (axios.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.message ||
                    (err.response?.status === 409
                        ? "Student already exists"
                        : "Failed to add student");
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return;

        try {
            const response = await axios.delete(`/api/students`, {
                data: { id } 
            });

            console.log(response)
            // Update the state to remove the deleted student
            setStudents((prev) => prev.filter((student) => student._id !== id));
            setSuccess("Student deleted successfully");
            setError("");
        } catch (err) {
            let errorMessage = "Failed to delete student";
            if (axios.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.message ||
                    (err.response?.status === 404
                        ? "Student not found"
                        : "Failed to delete student");
            }
            setError(errorMessage);
            setSuccess("");
        }
    };

    // Filter students based on search term and branch filter
    const filteredStudents = students.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            student.studentNumber.includes(searchTerm);
        const matchesBranch = filterBranch ? student.branch === filterBranch : true;
        return matchesSearch && matchesBranch;
    });

    const scholarsCount = students.filter((student) => student.isScholar).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Student Management | Scholar System</title>
                <meta name="description" content="Manage students and scholars" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left column - Form */}
                    <div className="lg:w-1/3">
                        <div className="bg-white shadow rounded-lg p-6 sticky top-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Scholars: {scholarsCount}
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-green-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">{success}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="studentNumber"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Student Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="studentNumber"
                                        name="studentNumber"
                                        value={formData.studentNumber}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="e.g., 20230001"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="schoolEmail"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        School Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="schoolEmail"
                                        name="schoolEmail"
                                        value={formData.schoolEmail}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="username@school.edu"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="John"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="Doe"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="year"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Year Level *
                                    </label>
                                    <select
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">Select year</option>
                                        {YEARS.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="branch"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Branch *
                                        </label>
                                        <select
                                            id="branch"
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        >
                                            <option value="">Select branch</option>
                                            {BRANCHES.map((branch) => (
                                                <option key={branch} value={branch}>
                                                    {branch}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="program"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Program *
                                        </label>
                                        <select
                                            id="program"
                                            name="program"
                                            value={formData.program}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        >
                                            <option value="">Select program</option>
                                            {PROGRAMS.map((program) => (
                                                <option key={program} value={program}>
                                                    {program}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="isScholar"
                                        name="isScholar"
                                        type="checkbox"
                                        checked={formData.isScholar}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor="isScholar"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        This student is a scholar
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting
                                        ? "bg-indigo-400"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    {isSubmitting ? "Adding..." : "Add Student"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right column - Student List */}
                    <div className="lg:w-2/3">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Records</h2>

                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="flex-1">
                                        <label htmlFor="search" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="h-5 w-5 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="search"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                                                placeholder="Search by name or ID"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <label htmlFor="branch-filter" className="sr-only">
                                            Branch
                                        </label>
                                        <select
                                            id="branch-filter"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            value={filterBranch}
                                            onChange={(e) => setFilterBranch(e.target.value)}
                                        >
                                            <option value="">All Branches</option>
                                            {BRANCHES.map((branch) => (
                                                <option key={branch} value={branch}>
                                                    {branch}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Student Table */}
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No students found
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Try adjusting your search or add a new student
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        ID
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Branch
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredStudents.map((student) => (
                                                    <tr key={student._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {student.studentNumber}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {student.firstName} {student.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {student.schoolEmail}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {student.branch}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isScholar
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                                    }`}
                                                            >
                                                                {student.isScholar ? "Scholar" : "Regular"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDelete(student._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}