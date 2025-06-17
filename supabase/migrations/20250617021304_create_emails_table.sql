CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  content TEXT,
  subject_line TEXT,
  sender_email TEXT,
  time TIMESTAMP WITH TIME ZONE,
  listserv TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;