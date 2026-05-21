import { betterAuth } from "better-auth";
import db from '../db/database'
import type { Database } from "better-sqlite3"

export const auth = betterAuth({

    database: db as Database,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL, 
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
    
})