CREATE TABLE users (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(64) UNIQUE,
  "createdAt" timestamp with time zone NOT NULL DEFAULT 'NOW()',
  "updatedAt" timestamp with time zone NOT NULL DEFAULT 'NOW()'
);

CREATE TABLE torrents (
  "id" SERIAL NOT NULL primary key,
  "hashString" VARCHAR(40) NOT NULL UNIQUE,
  "name" TEXT,
  "files" TEXT [],
  "userId" INT NOT NULL REFERENCES users,
  "createdAt" timestamp with time zone NOT NULL DEFAULT 'NOW()',
  "updatedAt" timestamp with time zone NOT NULL DEFAULT 'NOW()'
);
