-- Init schema: Users and User_Credentials
CREATE TABLE IF NOT EXISTS "Users" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cpf BYTEA NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verify_token TEXT,
  photo_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "User_Credentials" (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "Users"(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "User_Pix" (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "Users"(id) ON DELETE CASCADE,
  pix_key BYTEA NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rides table with PostGIS points
CREATE TABLE IF NOT EXISTS "Rides" (
  id SERIAL PRIMARY KEY,
  driver_id INT REFERENCES "Users"(id) ON DELETE SET NULL,
  start_address TEXT NOT NULL,
  end_address TEXT NOT NULL,
  start_location geometry(Point,4326),
  end_location geometry(Point,4326),
  seats INT DEFAULT 1,
  status TEXT DEFAULT 'Publicada',
  suggested_price NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
