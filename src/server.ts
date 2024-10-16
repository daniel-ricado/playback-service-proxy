import http from 'http'
import dotenv from 'dotenv'

import { getAvailableChunks, cleanupChunks } from './util/requestHandler.js'
import { generateManifest } from './util/generateManifest.js'

dotenv.config()

const hostname = '127.0.0.1'
const port = 3000

const ALLOWED_ORIGIN = '*.ricado.co.nz'

const server = http.createServer(async (req, res) => 
{
    const origin = req.headers.origin
  
    // restrict origin

    // if (!origin || !origin.endsWith(ALLOWED_ORIGIN)) 
    // {
    //     res.statusCode = 403
    //     res.end('Forbidden: Unauthorized origin')
    //     return
    // }

    if (req.method === 'GET' && req.url?.startsWith('/generate-manifest'))
    {
        const url = new URL(req.url, `http://${hostname}:${port}`)

        const camera_id = url.searchParams.get('camera_id')

        if(!camera_id)
        {
            throw new Error('camera_id is required')
        }    

        try {
            const filesToIndex: string[] = await getAvailableChunks(camera_id)

            res.end(JSON.stringify(filesToIndex))
            return

            // await generateManifest(camera_id, filesToIndex)
            // await cleanupChunks(camera_id)

            // res.statusCode = 200
            // res.setHeader('Content-Type', 'application/json')
            // res.end(JSON.stringify({ message: 'Manifests generated and cleanup triggered' }))
        } 
        catch (error) 
        {
            res.statusCode = 500
            res.end(JSON.stringify({ error: (error as Error).message }))
        }
    } 
    else 
    {
        res.statusCode = 404
        res.end('Not Found')
    }
});

server.listen(port, hostname, () => 
{
  console.log(`Server running at http://${hostname}:${port}/`)
})