export interface Subject {
    id: string;
    code: string;
    description: string;
    units: number;
    grade: number;
    isInc: boolean;
    isDropped: boolean;
}

export interface Semester {
    id: string;
    name: string; // e.g., "1st Semester"
    subjects: Subject[];
}

export interface AcademicYear {
    id: string;
    name: string; // e.g., "2025-2026"
    semesters: Semester[];
}
