import { UserRole } from "@/schemas/users"
import { auth } from "@/lib/auth";


export type AuthUser = typeof auth.$Infer.Session.user;
export interface User extends AuthUser{
    readonly id: string
    lastName: string
    role: UserRole

}

export interface UserPublic {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string | null;
}

export interface Seeker extends User{
    applications: number
    resume: string
    address: string
    expectedSalary: number
    biography: string
    //modality: 'remote' | 'onsite' | 'hybrid'
}

export type ProfileStatus = 'incomplete' | 'complete' | 'verified' ;

export interface Recruiter extends User{
    company: Company;
    position? : string
    profileStatus : ProfileStatus
}


export type Company = {
    id: string
    name: string;
    address: string;
    phone?: string;
    description?: string
    websiteUrl?: string
    logoUrl?: string
    industry?: string
    companySize?: number
    createdAt: Date;
    updatedAt: Date;
}


export interface Admin extends User{
    adminLevel: number
    rootAdmin(): void
}
