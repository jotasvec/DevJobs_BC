import * as http from "../lib/api";
import { API } from "../constants";

const companyURL = `${API.COMPANIES}`

export const getAllCompanies = async (filters) => {
    const data = await http.get(`${companyURL}?${filters}`)
    if(!data.success) throw new Error("Error listing companies");
    return data
}

export const getCompanyById = async (id, options = {}) => {
    const data = await http.get(`${companyURL}/${id}`, options)
    if(!data.success) throw new Error("Error getting company");
    return data.data
}

export const createCompany = async (body) => {
    const data = await http.post(companyURL, body)
    if(!data.success) throw new Error("Error creating company");
    return data
}