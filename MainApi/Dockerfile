# build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

# Release
FROM node:18-alpine
WORKDIR /app

# Env vars
ENV NODE_ENV=production

# Copy
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

# run
USER node
EXPOSE 3000
CMD ["node", "dist/main"]
