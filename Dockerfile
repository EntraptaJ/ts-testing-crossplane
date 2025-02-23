FROM debian:12.1-slim as package-stage

# TODO(negz): Use a proper Crossplane package building tool. We're abusing the
# fact that this image won't have an io.crossplane.pkg: base annotation. This
# means Crossplane package manager will pull this entire ~100MB image, which
# also happens to contain a valid Function runtime.
# https://github.com/crossplane/crossplane/blob/v1.13.2/contributing/specifications/xpkg.md
WORKDIR /package
COPY package/ ./

RUN cat crossplane.yaml > /package.yaml
RUN cat input/*.yaml >> /package.yaml


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
COPY --from=package-stage /package.yaml /package.yaml
COPY --from=package-stage /package.yaml /app/package.yaml

WORKDIR /app
CMD ["main.js"]