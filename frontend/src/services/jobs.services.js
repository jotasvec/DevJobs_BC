import * as http from "../lib/api";
import { API } from "../constants";

export const getAllJobs = async () => {
    const req = await http.get(API.JOBS)
    if(!req.success) throw new Error("Error listing jobs");
    return req;
}

export const getJobById = async (id) => {
    const res = await http.get(`${API.JOBS}/${id}`)
    if(!res.success) throw new Error(`Job Not Found \n Status: ${res.message} `);
    return res;
}



