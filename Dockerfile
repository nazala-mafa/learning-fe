FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG NUXT_PUBLIC_APP_URL
ARG NUXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB=5
ENV NUXT_PUBLIC_APP_URL=${NUXT_PUBLIC_APP_URL}
ENV NUXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB=${NUXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB}

RUN pnpm build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
