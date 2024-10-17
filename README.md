
# RICADO Playback Proxy

A NodeJS application and nignx serer that indexes available chunks for playback per camera

## Develop: 
```
    1. Create a folder in the root directory called manifests
    2. fill in the the appConfig fields
    4. npm i
    3. npm run start
```

## Setup Instructions: 

```
  docker build -t playback-service-proxy .

  docker run -d \
    -p 8888:80 \
    -p 44300:443 \
    -v manifests:/var/nginx/manifests \
    --name playback-service-proxy \
    playback-service-proxy
```

## Usage: 

Generate the new manifest and clean up old files
/generate-manifest?camera_id=7ea3cbef-4da0-11ed-bdcc-baf70a43c072

Fetch the manifest of available chunks
/request-manifest?camera_id=7ea3cbef-4da0-11ed-bdcc-baf70a43c072

## todo:

- [ ] notifications / bugsnag
- [ ] enable cleanup requests
- [ ] ensure clean requests don't fall over each other

