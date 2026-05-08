import "dotenv/config";
import express from "express";
import { DEFAULTS as DEF } from "./config.js";
import { jobsRouter } from "./routes/jobs.js";
import { technologiesRouter } from "./routes/technologies.js";
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
// Health check
app.get('/health', (req, res) => {
    return res.json({
        status: 'OK',
        uptime: process.uptime()
    })
})

// Jobs Router
app.use('/jobs', jobsRouter)

// Technologies Router
app.use('/technologies', technologiesRouter)

// 404 for non founds paths
app.use((req, res) => {
    res.status(404).json({
        message : `Route not found: ${req.method} ${req.path}`
    })
})




//+++++++++++++++++
//Run Server
//+++++++++++++++++
if(process.env.NODE_ENV !== 'production'){
    console.log("current ENV: ", process.env.NODE_ENV)
app.listen(PORT, () => {
        console.log(`
            ╔════════════════════════════════════════════╗
            ║                                            ║
            ║   🚀 Express + TypeScript Server           ║
            ║                                            ║
            ║   ✅ Server is RUNNING                     ║
            ║   on: http://localhost:${PORT}             ║
            ║                                            ║
            ║   Endpoints:                               ║
            ║   ─────────────────────────────────────    ║
            ║   JOBS:                                    ║
            ║   GET    /jobs                             ║
            ║   GET    /jobs/:id                         ║
            ║   POST   /jobs                             ║
            ║   PATCH  /jobs/:id                         ║
            ║   PUT    /jobs/:id                         ║
            ║   DELETE /jobs/:id                         ║
            ║                                            ║
            ║   TECHNOLOGIES:                            ║
            ║   GET    /technologies                     ║
            ║   GET    /technologies/grouped             ║
            ║   GET    /technologies/categories          ║
            ║   GET    /technologies/category/:category  ║
            ║   GET    /technologies/:id                 ║
            ║   POST   /technologies (admin)             ║
            ║   PUT    /technologies/:id (admin)         ║
            ║   DELETE /technologies/:id (admin)         ║
            ║                                            ║
            ║   Query params:                            ║
            ║   ?technology=React                        ║
            ║   ?modality=remote                         ║
            ║   ?level=senior                            ║
            ║   ?category=Frontend                       ║
            ║   ?search=React                            ║
            ║                                            ║
            ╚════════════════════════════════════════════╝
              
        `)
    })
}

export default app