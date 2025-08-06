DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Allow public read'
      AND tablename = 'jobs'
  ) THEN
    CREATE POLICY "Allow public read"
    ON jobs
    FOR SELECT
    TO anon
    USING (true);
  END IF;
END
$$;

