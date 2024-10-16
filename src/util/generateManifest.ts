import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// Constants
const CHUNK_DURATION = 30
const BATCH_SIZE = 100
// const NGINX_MANIFEST_PATH = process.env.NGINX_MANIFEST_PATH || '/var/nginx/manifests'

// test
const NGINX_MANIFEST_PATH = './manifests'

// Generate m3u8 manifest per camera
export async function generateManifest(camera_id: string, files: string[]): Promise<void> 
{    
    const manifestFilePath = path.join(NGINX_MANIFEST_PATH, `${camera_id}.m3u8`)
    const writeStream = fs.createWriteStream(manifestFilePath, { flags: 'w' })

    try 
    {
        await writeHeader(writeStream)

        // Process files in batches
        for (let i = 0; i < files.length; i += BATCH_SIZE) 
        {
            const batch = files.slice(i, i + BATCH_SIZE)
            await processBatch(batch, writeStream)
        }

        await writeFooter(writeStream)
    } 
    catch (error) 
    {
        // @todo alert slack that writing the manifest failed
    } 
    finally 
    {
        writeStream.close()
    }
}

// write m3u8 header
async function writeHeader(writeStream: fs.WriteStream): Promise<void> 
{
    const header = [
        '#EXTM3U',
        '#EXT-X-VERSION:3',
        `#EXT-X-TARGETDURATION:${CHUNK_DURATION}`,
        '#EXT-X-MEDIA-SEQUENCE:0\n'
    ].join('\n')

    writeStream.write(header + '\n')
}

// Process each batch of files and write to the manifest
async function processBatch(files: string[], writeStream: fs.WriteStream): Promise<void> 
{
    for (const file of files) 
    {
        const segmentInfo = `#EXTINF:${CHUNK_DURATION},\n${file}\n`
        writeStream.write(segmentInfo)
    }
}

// write m3u8 footer
async function writeFooter(writeStream: fs.WriteStream): Promise<void> 
{
    writeStream.write('#EXT-X-ENDLIST\n')
}