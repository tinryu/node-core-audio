# Docker Guide

## Docker Compose (Recommended)
You can use `docker-compose.yml` to manage the backend effortlessly.

- **Build and Start Container in Background**
  `docker-compose up -d --build`

- **Stop All Services**
  `docker-compose down`

- **View Active Logs**
  `docker-compose logs -f`

- **Restart the API**
  `docker-compose restart yt-mp3-api`

---
# Docker commands
- Build Docker Image
docker build -t yt-mp3-api .

- Run Container
docker run -d -p 5000:5000 --name yt-mp3-api-container yt-mp3-api

- Stop Container
docker stop d5f2389e3f0a378cfaa954129a20f251cc1a7aa697cfd798dfe483ba75d6c68d

- Remove Container
docker rm yt-mp3-api-container

- Remove Image
docker rmi yt-mp3-api

- List Images
docker images

- List Containers
docker ps

- List All Containers
docker ps -a

- Remove All Containers
docker rm $(docker ps -a -q)

- Remove All Images
docker rmi $(docker images -q)

- Remove All Containers and Images
docker rm $(docker ps -a -q) && docker rmi $(docker images -q)

- Debug Logs
docker logs yt-mp3-api-container