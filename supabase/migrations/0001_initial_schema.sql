-- columnistas
CREATE TABLE IF NOT EXISTS columnistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    profesion TEXT,
    seccion_asignada TEXT
);

-- articulos
CREATE TABLE IF NOT EXISTS articulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    cuerpo TEXT,
    categoria TEXT,
    subcategoria TEXT,
    imagen_url TEXT,
    estado TEXT CHECK (estado IN ('borrador', 'publicado')) DEFAULT 'borrador',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    columnista_id UUID REFERENCES columnistas(id)
);

-- comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
    nick TEXT NOT NULL,
    comentario TEXT NOT NULL,
    aprobado BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- publicidades
CREATE TABLE IF NOT EXISTS publicidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ubicacion TEXT CHECK (ubicacion IN ('header', 'sidebar', 'inline')),
    imagen_url TEXT,
    enlace_url TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- RLS
ALTER TABLE columnistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicidades ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
DROP POLICY IF EXISTS "Public articles are viewable by everyone." ON articulos;
CREATE POLICY "Public articles are viewable by everyone." ON articulos FOR SELECT USING (estado = 'publicado');

DROP POLICY IF EXISTS "Public columnists are viewable by everyone." ON columnistas;
CREATE POLICY "Public columnists are viewable by everyone." ON columnistas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Approved comments are viewable by everyone." ON comentarios;
CREATE POLICY "Approved comments are viewable by everyone." ON comentarios FOR SELECT USING (aprobado = true);

DROP POLICY IF EXISTS "Active ads are viewable by everyone." ON publicidades;
CREATE POLICY "Active ads are viewable by everyone." ON publicidades FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Anyone can insert a comment." ON comentarios;
CREATE POLICY "Anyone can insert a comment." ON comentarios FOR INSERT WITH CHECK (true);

-- Policies for admin users (authenticated users)
DROP POLICY IF EXISTS "Auth users have full access to columnistas." ON columnistas;
CREATE POLICY "Auth users have full access to columnistas." ON columnistas FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth users have full access to articulos." ON articulos;
CREATE POLICY "Auth users have full access to articulos." ON articulos FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth users have full access to comentarios." ON comentarios;
CREATE POLICY "Auth users have full access to comentarios." ON comentarios FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth users have full access to publicidades." ON publicidades;
CREATE POLICY "Auth users have full access to publicidades." ON publicidades FOR ALL USING (auth.role() = 'authenticated');
