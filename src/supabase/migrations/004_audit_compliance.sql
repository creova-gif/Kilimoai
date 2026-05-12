-- ============================================================================
-- KILIMO AGRI-AI SUITE - Compliance & Audit Logging
-- ============================================================================
-- Purpose: Support TRA compliance and data protection audit trails
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- e.g., 'wallet_deposit', 'login', 'data_export'
  entity_type TEXT, -- e.g., 'wallet', 'user', 'farm'
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success', -- 'success', 'failure'
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'institutional_admin')
    )
  );

-- System can insert logs
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for TRA compliance and security monitoring';
