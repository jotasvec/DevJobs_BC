export interface Technology{
    id: string
    name: string
    category: string
    created_at: string
}

export interface TechnologyCategory{
    id: string
    name: string
    description: string
}

interface RawTechnologyRow extends Technology {
    category_name: string; // Resultado del JOIN
}

export interface TechQuery {
    search?: string;
    category?: string;
    name?: string
}

export interface GroupedTechnologies{
    [categoryName: string]: Partial<Technology>[]
}