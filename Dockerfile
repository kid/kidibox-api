FROM node:4.2.1

WORKDIR /app

COPY package.json /app/
RUN npm install

ENV NODE_ENV production
ENV DATABASE_URL postgres://kidibox:postgres:5432/kidibox

COPY . /app/
RUN cd /app; npm run build

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "/app/dist/server.js"]
