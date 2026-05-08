export interface User{
    readonly id: string
    email: string
    password: string
    name: string
    lastName: string
    role: 'admin' | 'recruiter' | 'seeker'
    greeting: () => string
    avatar: string
    createdAr: string
    
}

export interface Seeker extends User{
    aplications: number
    resume: string
    address: string
    expectedSalary: number
    modality: 'remote' | 'onsite' | 'hybrid'


}


export interface Recruiter extends User{
    company: Company;
}

export interface Admin extends User{
    adminLevel: number
    rootAdmin(): void
}

export type Company = {
  name: string;
  address: string;
  phone?: string;
};

