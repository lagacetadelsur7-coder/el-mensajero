CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  is_featured boolean DEFAULT false,
  cover_title_override text,
  cover_image_url text
);

-- If the table already exists, add the columns:
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_title_override text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image_url text;
