import { API } from "../constants";
import * as http from "../lib/api";

const baseUrl = (id = '') => `${API.APPLICATIONS}/${id}`

export const getApplications = async (params) => {
    const res = await http.get(`${API.APPLICATIONS}?${params.toString()}`);
    if (!res.success) throw new Error("Error application list");
    return res;
}

export const getApplicationById = async (id) => {
    const { data, success } = await http.get(baseUrl(id));
    if (!success) throw new Error("Error getting application");
    return { data, success };
}

export const getApplicationByStats = async (params) => {
    const { data, success } = await http.get(`${API.APPLICATIONS}/stats?${params.toString()}`);
    if (!success) throw new Error("Error getting application list");
    return { data, success };
}

export const updateApplicationStatus = async (id, body) => {
    const { data, success } = await http.patch(baseUrl(id), body);
    if (!success) throw new Error("Error application list");
    return { data, success };
}


export const createApplication = async (body) => {
    const data = await http.post(API.APPLICATIONS, body);
    if(!data) throw new Error("Error creating application");
    return data
}

export const withdrawApplication = async (id) => {
    const del = await http.del(baseUrl(id));
    if (!del) throw new Error("Error deleting application list");
    return del;
}

