import cors from "cors";
import { ACCEPTED_ORIGINS } from "../config.js";


export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } ={} ) =>{
    return cors({
        origin: (origin, callback) => {
            if(acceptedOrigins.includes(origin) || !origin ){
                return callback(null, true);
            } 
            return callback(new Error('Origin not Allowed'))
        }
    })
}