FROM node:latest

WORKDIR /app

COPY package.json /app/
RUN npm install

ENV NODE_ENV production
ENV PORT 3000
ENV DATABASE_URL postgres://kidibox:postgres:5432/kidibox

COPY . /app/
RUN cd /app; npm run build

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "/app/dist/server.js"]
