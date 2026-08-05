CREATE TABLE IF NOT EXISTS medication (
  id UUID PRIMARY KEY,
  sku VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_batch (
  id UUID PRIMARY KEY,
  medication_id UUID NOT NULL REFERENCES medication(id),
  lot VARCHAR(60) NOT NULL,
  expiration_date DATE NOT NULL,
  stock_current INTEGER NOT NULL CHECK (stock_current >= 0),
  stock_min INTEGER NOT NULL CHECK (stock_min >= 0),
  version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (medication_id, lot)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movement_type') THEN
    CREATE TYPE movement_type AS ENUM ('ENTRY', 'EXIT', 'ADJUSTMENT');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    CREATE TYPE alert_type AS ENUM ('LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS inventory_movement (
  id BIGSERIAL PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES inventory_batch(id),
  type movement_type NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  reason TEXT,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  idempotency_key UUID UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_alert (
  id BIGSERIAL PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES inventory_batch(id),
  type alert_type NOT NULL,
  message TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION prevent_inventory_movement_mutation()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'inventory_movement es inmutable';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventory_movement_no_update ON inventory_movement;
CREATE TRIGGER trg_inventory_movement_no_update
BEFORE UPDATE ON inventory_movement
FOR EACH ROW
EXECUTE FUNCTION prevent_inventory_movement_mutation();

DROP TRIGGER IF EXISTS trg_inventory_movement_no_delete ON inventory_movement;
CREATE TRIGGER trg_inventory_movement_no_delete
BEFORE DELETE ON inventory_movement
FOR EACH ROW
EXECUTE FUNCTION prevent_inventory_movement_mutation();
