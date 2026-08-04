import { API } from "../constants";
import * as http from "../lib/api";



export const getApplications = async () => {
    const { data, success } = await http.get(API.APPLICATIONS);
    if (!success) throw new Error("Error application list");
    return { data, success };
}

export const createApplication = async (body) => {
    const data = await http.post(API.APPLICATIONS, body);
    if(!data) throw new Error("Error creating application");
    return data
}

