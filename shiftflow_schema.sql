-- ShiftFlow MVP Database Schema
-- Run this in Neon SQL Editor (Dashboard -> SQL Editor -> paste -> Run)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  timezone TEXT DEFAULT 'UTC',
  business_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users (managers + staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT,
  full_name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner','manager','staff')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Store Staff (junction table)
CREATE TABLE store_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position TEXT,
  hourly_rate NUMERIC,
  can_open BOOLEAN DEFAULT false,
  can_close BOOLEAN DEFAULT false,
  max_weekly_hours INTEGER,
  is_active BOOLEAN DEFAULT true,
  UNIQUE (store_id, user_id)
);

-- 4. Shifts
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Shift Swap Requests
CREATE TABLE shift_swap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES users(id),
  offered_to UUID REFERENCES users(id),
  accepted_by UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','accepted','manager_review','approved','rejected','cancelled')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 6. Time Off Requests
CREATE TABLE time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 7. Attendance Records
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID REFERENCES shifts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  store_id UUID NOT NULL REFERENCES stores(id),
  clock_in_at TIMESTAMPTZ,
  clock_out_at TIMESTAMPTZ,
  clock_in_method TEXT CHECK (clock_in_method IN ('app_geofence','pin_pad','manager_manual')),
  clock_in_location POINT,
  variance_minutes INTEGER,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('shift_published','swap_request','swap_resolved','time_off_resolved','shift_reminder')),
  title TEXT,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Activity Log (audit trail)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_store_staff_store ON store_staff (store_id);
CREATE INDEX idx_store_staff_user ON store_staff (user_id);
CREATE INDEX idx_shifts_store_start ON shifts (store_id, starts_at);
CREATE INDEX idx_shifts_user_start ON shifts (user_id, starts_at);
CREATE INDEX idx_swap_shift ON shift_swap_requests (shift_id);
CREATE INDEX idx_swap_status ON shift_swap_requests (status);
CREATE INDEX idx_timeoff_user_status ON time_off_requests (user_id, status);
CREATE INDEX idx_attendance_store_clockin ON attendance_records (store_id, clock_in_at);
CREATE INDEX idx_attendance_user_clockin ON attendance_records (user_id, clock_in_at);
CREATE INDEX idx_notifications_user_read_created ON notifications (user_id, is_read, created_at DESC);
CREATE INDEX idx_activity_store_created ON activity_log (store_id, created_at DESC);
