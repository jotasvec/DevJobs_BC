import { betterAuth } from "better-auth";
import db from '../db/database'
import type { Database } from "better-sqlite3"
import { ROLES } from "@/constants";
import { SeekerProfileModel } from "@/models/seekerProfile";
import { RecruiterProfileModel } from "@/models/recruiterProfile";

export const auth = betterAuth({
    database: db as Database,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
    emailAndPassword:{
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 32,
        autoSignIn: true,
    },
    user:{
        additionalFields:{
            role:{
                type: "string",
                required: true,
                defaultValue: "seeker"
            },
            lastName: {
                type: "string",
                required: true,
                defaultValue: ''
            },
            phone: {
                type: "string",
                required: false,
                defaultValue: ''
            }

        }
    },
    socialProviders:{
        //TODO
        /* github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }, */
        /* google:{
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        } */
    },
    plugins:[
        //add plugins
    ],
    advanced: {
        disableCSRFCheck: process.env.NODE_ENV === "test",
    },
    databaseHooks:{ // creates "empty" profiles after signup
        user:{
            create:{
                after: async (user) => {
                    try {
                        if (user.role === ROLES.SEEKER) {
                            SeekerProfileModel.upsert(user.id, {})
                        }else if(user.role === ROLES.RECRUITER){
                            RecruiterProfileModel.upsert(user.id, {})
                        }
                    } catch (error) {
                        console.error("Failed to create profile after signup:", error);
                        
                    }
                }
            }
        }
    }

})