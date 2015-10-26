CREATE TABLE users (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(64) NOT NULL UNIQUE,
  "passwordHash" CHAR(192),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()',
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'
);

CREATE TABLE torrents (
  "id" SERIAL NOT NULL primary key,
  "hashString" VARCHAR(40) NOT NULL UNIQUE,
  "name" TEXT,
  "files" TEXT [],
  "userId" INT NOT NULL REFERENCES users,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()',
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()'
);

CREATE FUNCTION set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW."updatedAt" := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER torrents_set_updated_at
  BEFORE UPDATE ON torrents
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
