FROM node:18

# Install dependencies for yt-dlp-exec (python, ffmpeg)
RUN apt-get update && \
    apt-get install -y python3 python-is-python3 ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]