ALTER TABLE emails RENAME COLUMN name TO sender_name;
ALTER TABLE emails RENAME COLUMN subject_line TO subject;
ALTER TABLE emails RENAME COLUMN time TO date_time_sent;
ALTER TABLE emails RENAME COLUMN listserv TO listserv_name;
ALTER TABLE emails RENAME COLUMN sender_email TO sender_email_address;
ALTER TABLE emails RENAME COLUMN content TO body;