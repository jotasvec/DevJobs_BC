import * as http from "../lib/api";
import { API } from "../constants";

const userURL = (userID) =>  `${API.USERS}/${userID}`
const seekerURL = (userID) =>  userID 
    ? `${API.USERS}/seeker-profile/${userID}`
    : `${API.USERS}/me/seeker-profile`

const recruiterURL =  (userID) => userID 
    ? `${API.USERS}/recruiter-profile/${userID}`
    : `${API.USERS}/me/recruiter-profile`


export const getUser = async (id) => {
    const { data, success } = await http.get(userURL(id));
    if (!success) throw new Error("Error getting user");
    return { data, success };
}

export async function getSeekerProfile(id) {
    const { data, success } = await http.get(seekerURL(id));
    if (!success) throw new Error("Error Seeker profile");
    return data;
}

export async function getRecruiterProfile(id) {
    const { data, success } = await http.get(recruiterURL(id));
    if (!success) throw new Error("Error Recruiter profile");
    return data;
}

export async function updateUser(id, body) {
    const { data, success, message } = await http.patch(userURL(id), body)
    if (!success) throw new Error(`Error updating user: ${message}`);
    return data
}

export async function updateSeekerProfile(body) {
    const { data, success, message } = await http.put(seekerURL(), body)
    if (!success) throw new Error(`Error updating user: ${message}`);
    return data
}

export async function updateRecruiterProfile(body) {
    const { data, success, message } = await http.put(recruiterURL(), body)
    if (!success) throw new Error(`Error updating user: ${message}`);
    return data
}



