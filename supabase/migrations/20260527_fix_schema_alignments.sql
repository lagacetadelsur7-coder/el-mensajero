-- Agregar columnas de portada a articulos si no existen
ALTER TABLE articulos ADD COLUMN IF NOT EXISTS cover_title_override TEXT;
ALTER TABLE articulos ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Agregar columnas de perfil a columnistas si no existen
ALTER TABLE columnistas ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE columnistas ADD COLUMN IF NOT EXISTS rol TEXT;
