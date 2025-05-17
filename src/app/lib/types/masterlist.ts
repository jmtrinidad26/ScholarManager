export interface MasterlistDetailed {
  student_id: number;
  scholar_name: string;
  year_level: string;
  school_year_name: string;
  semester_name: string;
  batch_name: string;
  scholarship_status: string;
  course: string;
  campus: string;
  school_email: string;
  secondary_email: string | null;
  contact_number: string | null;
  internship_year: number | null;
  graduation_year: number | null;
  delistment_date: Date | null;
  delistment_reason: string | null;
  termination_notice_status: string | null;
  other_comments: string | null;
  absorbed: boolean;
  hire_date: Date | null;
  role_id: number | null;
  student_pass: string | null;
}
