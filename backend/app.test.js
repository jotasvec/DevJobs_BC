import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import app from "./app.js";


let server 
const PORT = 3456
const BASE_URL = `http://localhost:${PORT}`

// before all test, run the server
before(async () => {
    return await new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            console.log(`✅ Test Server is RUNNING on: http://localhost:${PORT} `)
            resolve()
        })
        server.on('error', reject)
    })
})


// closing the server
after(async () => {
    // Cerramos conexiones activas para evitar que el test se quede colgado
    if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
    }
    return await new Promise((resolve, reject) => {
        server.close((err) => {
            if(err) return reject(err)
            console.log("🛑 Test Server CLOSED");
            resolve()
        })
    })
})


// First test
describe('GET /jobs', () => {
    test('should responds with code 200 and Array', async () => {
        const response = await fetch(`${BASE_URL}/jobs`)
        assert.strictEqual(response.status, 200)

        const data = await response.json()
        assert.ok(Array.isArray(data.data), "la respueste deberia ser un array")
        
    })

  
    // test by technology
    test('should filter jobs by technology', async () => {
        const tech = 'react'
        const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
        assert.strictEqual(response.status, 200)
        
        const json = await response.json()
        console.log('tech test json >>',json)
        assert.ok(
            json.data.every(job => {return (
                job.titulo.toLowerCase().includes(tech) ||
                job.descripcion.toLowerCase().includes(tech)||
                job.data.technology.some(t => t.toLowerCase().includes(tech) ) 
            )}),
            `all jobs should include the tecnology ${tech}`
        )
    })
    
})