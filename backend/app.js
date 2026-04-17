import "dotenv/config";
import express from "express";
import { DEFAULTS as DEF } from "./config.js";
import { jobsRouter } from "./routes/jobs.js";
import { corsMiddleware } from "./middlewares/cors.js";

const PORT = process.env.PORT || DEF.PORT;

const app = express()

// implementing cors
app.use(corsMiddleware())

// get existing path and validate them 
app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString()
    console.log(`[${time}] ${req.method} ${req.url}`);
    next() // "jump" to the path, it goes/route to the path
})
app.use(express.json())

//Home
app.get('/', (req, res) => {
    return res.send('<h1>Helooow!</h1>' );
})
// Health
app.get('/health', (req, res) => {
    return res.json({
        status: 'OK',
        uptime: process.uptime()
    })
})

// Router
app.use('/jobs', jobsRouter)

if(process.env.NODE_ENV !== 'production'){
    console.log("current ENV: ", process.env.NODE_ENV)
    app.listen(PORT, () => {
        console.log(`✅ Server is RUNNING on: http://localhost:${PORT} `)
    })
}

export default app