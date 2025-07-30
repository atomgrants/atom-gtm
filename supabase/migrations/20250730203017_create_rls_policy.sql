CREATE POLICY "Allow public read"
ON jobs
FOR SELECT
TO anon
USING (true);
