FROM node:latest

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

COPY package.json /app/
WORKDIR /app

# scrypt has a build issue, we need to wait for 6.x
RUN npm install scrypt
RUN npm install

COPY . /app/

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
