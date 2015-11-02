CREATE TABLE "torrents" (
  "id" SERIAL NOT NULL primary key,
  "hashString" VARCHAR(40) NOT NULL UNIQUE,
  "name" TEXT,
  "files" TEXT [],
  "userId" INT NOT NULL REFERENCES "users",
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()',
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'
);
