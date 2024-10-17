
# RICADO Playback Proxy

A NodeJS application and nignx instance the indexes available chunks for playback


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