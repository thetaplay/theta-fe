-- Alerts table for position monitoring
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  position_id BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EXPIRY_REMINDER', 'PRICE_MOVE')),
  enabled BOOLEAN DEFAULT TRUE,
  threshold FLOAT, -- For PRICE_MOVE alerts (e.g., 0.05 = 5%)
  hours_before_expiry INT, -- For EXPIRY_REMINDER (e.g., 4 hours)
  last_triggered TIMESTAMP WITH TIME ZONE,
  last_price FLOAT, -- For tracking price changes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
  position_id BIGINT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_position ON alerts(user_id, position_id);
CREATE INDEX IF NOT EXISTS idx_alerts_enabled_type ON alerts(enabled, type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for alerts table
DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
