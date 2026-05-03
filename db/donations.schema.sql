-- Donations table schema for production SQL databases (PostgreSQL/MySQL compatible adjustments may be needed)
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  contact VARCHAR(140),
  amount INTEGER NOT NULL CHECK (amount > 0),
  purpose VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('created','processing','success','failed','cancelled','abandoned')),
  razorpay_order_id VARCHAR(80),
  razorpay_payment_id VARCHAR(80),
  razorpay_signature VARCHAR(255),
  receipt_id VARCHAR(80) NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_order ON donations(razorpay_order_id);
