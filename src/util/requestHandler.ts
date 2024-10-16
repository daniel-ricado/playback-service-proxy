import fetch from 'node-fetch'

enum ERequestTypes {
	GET_AVAILABLE_CHUNKS = 'GET_AVAILABLE_CHUNKS',
	REMOVE_CHUNKS = 'REMOVE_CHUNKS'	
}
     
// Fetch files from Cloudflare transfer_database
export async function getAvailableChunks(camera_id: string): Promise<string[]>
{
    const bearerToken = process.env.CLOUDFLARE_SECRET;
    const cloudflareUrl = process.env.CLOUDFLARE_URL;

    const cameraIdQueryString = camera_id ? '&camera_id=' + camera_id : ''

    const response = await fetch(`https://${cloudflareUrl}?type=${ERequestTypes.GET_AVAILABLE_CHUNKS}${cameraIdQueryString}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        }
    });

    if (!response.ok) 
    {
        // throw new Error('Failed to fetch files from Cloudflare')
        console.error('Failed to fetch files from Cloudflare', response)
        return []
    }

    const data: any = await response.json()

    return data?.results || []
}

// tell Cloudflare to remove chunks past the retention policy
export async function cleanupChunks(camera_id: string) 
{
    const bearerToken = process.env.BEARER_TOKEN
    const cloudflareCleanupUrl = process.env.CLOUDFLARE_URL

    const cameraIdQueryString = camera_id ? '&camera_id=' + camera_id : ''

    const response = await fetch(`${cloudflareCleanupUrl}?type=${ERequestTypes.REMOVE_CHUNKS}${cameraIdQueryString}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        }
    })

    if (!response.ok) 
    {
        // throw new Error('Failed to notify Cloudflare for cleanup')
        console.error('Failed to notify Cloudflare for cleanup', response)
        return response
    }

    const data: any = await response.json()

    return data?.results || []
}