FROM node:latest

WORKDIR /app

COPY package.json /app/
RUN npm install

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

COPY . /app/
RUN cd /app; npm run build

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "/app/dist/server.js"]
