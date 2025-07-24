CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT,
  job_title TEXT,
  organization TEXT,
  job_url TEXT,
  email_body TEXT,
  time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
