# syntax=docker/dockerfile:1

###############################################################################
# deps — install node_modules once, shared by the dev and build stages
###############################################################################
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

###############################################################################
# dev — Vite dev server with hot module replacement
###############################################################################
FROM node:22-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

###############################################################################
# build — compile the static bundle into /app/dist
###############################################################################
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

###############################################################################
# prod — serve the static bundle with nginx
###############################################################################
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
