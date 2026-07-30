import { UserRole } from "@/schemas/users"
import { auth } from "@/lib/auth";


export type AuthUser = typeof auth.$Infer.Session.user;
export interface User extends AuthUser{
    readonly id: string
    bio: string | null
    role: UserRole
    phone: string | null

}

export interface UserPublic {
    id: string;
    name: string;
    lastName: string;
    phone: string | null;
    email: string;
    role: UserRole;
    image: string | null;
}

export interface SeekerProfile {
    userId: string;
    resumeUrl: string | null;
    coverLetter: string | null;
    linkedin: string | null;
    portfolio: string | null;
    expectedSalary: number | null;
    modality: 'remote' | 'onsite' | 'hybrid' | null;
    location: string | null;
    experienceYears: number | null;
}

export type ProfileStatus = 'incomplete' | 'complete' | 'verified' ;

export interface RecruiterProfile {
    userId: string
    companyId: string | null
    position: string | null
    department: string | null
}

export interface Company {
    id: string
    name: string
    description: string | null
    website: string | null
    logo: string | null
    industry: string | null
    size: string | null
    location: string | null
    createdAt: string
}
