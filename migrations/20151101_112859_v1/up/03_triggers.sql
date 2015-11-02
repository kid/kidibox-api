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
  BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER torrents_set_updated_at
  BEFORE UPDATE ON "torrents"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
