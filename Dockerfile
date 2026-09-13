FROM node:20-alpine AS build

WORKDIR /app

# Use package.json as the source of truth because the current lockfile is older
# than a few recently-added dependencies. A normal npm install refreshes it.
COPY package.json ./
RUN npm install --include=dev --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

CMD ["npm", "start"]
