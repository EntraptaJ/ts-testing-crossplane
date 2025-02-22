FROM node:22-slim AS build-env
COPY . /app
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12
COPY --from=build-env /app/dist /app
WORKDIR /app
CMD ["main.js"]