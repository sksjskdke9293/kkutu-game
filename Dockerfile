FROM node:12-buster-slim

WORKDIR /app

# KKuTu's desktop Electron dependencies are not required on a headless server.
# Installing only the core package keeps the image and peak build memory smaller.
COPY Server/lib/package.json Server/lib/package-lock.json ./Server/lib/
RUN cd Server/lib && npm ci --no-audit --no-fund

COPY Server/lib/ ./Server/lib/
RUN cd Server/lib && npx grunt default pack

WORKDIR /kkutu
