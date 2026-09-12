-- CHECK constraints for RiceConnect v2
-- Run this against the Supabase database to enforce data integrity

ALTER TABLE harvest_batches
  ADD CONSTRAINT harvest_batches_status_check
  CHECK (status IN ('unsold', 'interested', 'sold', 'pending_delivery', 'delivered', 'completed', 'cancelled'));

ALTER TABLE harvest_batches
  ADD CONSTRAINT harvest_batches_delivery_status_check
  CHECK (delivery_status IN ('Pending', 'In Transit', 'Delivered', 'Confirmed Received', 'date_scheduled', 'ready_for_pickup'));

ALTER TABLE harvest_batches
  ADD CONSTRAINT harvest_batches_condition_check
  CHECK (condition IN ('fresh', 'dried', 'mixed'));

ALTER TABLE harvest_batches
  ADD CONSTRAINT harvest_batches_drying_status_check
  CHECK (drying_status IS NULL OR drying_status IN ('wet', 'drying', 'dried'));

ALTER TABLE bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'date_scheduled', 'ready_for_pickup', 'in_transit', 'delivered', 'completed', 'cancelled'));

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending_pickup', 'in_transit', 'delivered', 'completed', 'cancelled'));

ALTER TABLE miller_processing_logs
  ADD CONSTRAINT miller_processing_logs_status_check
  CHECK (status IN ('processing', 'completed', 'failed'));

ALTER TABLE milling_queues
  ADD CONSTRAINT milling_queues_status_check
  CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));

ALTER TABLE notifications
  ADD CONSTRAINT notifications_notification_status_check
  CHECK (notification_status IN ('unread', 'read'));
