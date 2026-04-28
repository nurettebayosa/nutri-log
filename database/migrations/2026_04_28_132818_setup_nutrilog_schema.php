<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Modifikasi tabel users bawaan Laravel
ALTER TABLE users
  ADD COLUMN role ENUM('owner','karyawan') NOT NULL DEFAULT 'karyawan' AFTER email,
  ADD COLUMN wa_number VARCHAR(20) AFTER role,
  ADD COLUMN avatar_path VARCHAR(255) AFTER wa_number,
  ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER avatar_path,
  ADD COLUMN last_login_at TIMESTAMP NULL AFTER is_active;

-- 2. CREATE TABLES (Persis kodingan kamu)
CREATE TABLE blocks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE COMMENT 'e.g. A1, A2, B1',
  name VARCHAR(100) NOT NULL,
  plant_type VARCHAR(50) DEFAULT 'Pakcoy',
  location VARCHAR(150),
  polybag_count INT,
  photo_path VARCHAR(255),
  notes TEXT,
  has_sensor BOOLEAN DEFAULT FALSE,
  device_id VARCHAR(50) COMMENT 'ESP32 device identifier',
  device_token VARCHAR(100) COMMENT 'Auth token for ESP32',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_has_sensor (has_sensor)
);

CREATE TABLE planting_cycles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NOT NULL,
  cycle_number VARCHAR(20) COMMENT 'e.g. 2026-04',
  plant_type VARCHAR(50),
  start_date DATE NOT NULL,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  harvest_kg DECIMAL(8,2),
  quality_grade ENUM('A','B','C'),
  notes TEXT,
  status ENUM('active','done','failed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  INDEX idx_status (status)
);

CREATE TABLE sensor_readings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NOT NULL,
  sensor_type ENUM('tds','turbidity','moisture') NOT NULL,
  value DECIMAL(8,2) NOT NULL,
  unit VARCHAR(10) COMMENT 'ppm, NTU, %',
  source ENUM('automatic','manual') DEFAULT 'automatic',
  recorded_by BIGINT UNSIGNED NULL COMMENT 'null kalau dari ESP32',
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_block_sensor_time (block_id, sensor_type, recorded_at),
  INDEX idx_recorded_at (recorded_at)
);

CREATE TABLE thresholds (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NOT NULL,
  sensor_type ENUM('tds','turbidity','moisture') NOT NULL,
  critical_min DECIMAL(8,2),
  optimal_min DECIMAL(8,2),
  optimal_max DECIMAL(8,2),
  critical_max DECIMAL(8,2),
  tolerance_minutes INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  updated_by BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE INDEX idx_block_sensor (block_id, sensor_type)
);

CREATE TABLE alerts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NULL,
  sensor_type ENUM('tds','turbidity','moisture','connection','phase'),
  severity ENUM('critical','warning','info') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  trigger_value DECIMAL(8,2),
  status ENUM('active','resolved','ignored') DEFAULT 'active',
  triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by BIGINT UNSIGNED NULL,
  resolution_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status_time (status, triggered_at)
);

CREATE TABLE fertigation_schedules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NOT NULL,
  time_of_day TIME NOT NULL COMMENT '07:00, 12:00, 17:00',
  target_ppm INT DEFAULT 1100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_block_time (block_id, time_of_day)
);

CREATE TABLE fertigation_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  schedule_id BIGINT UNSIGNED NULL,
  block_id BIGINT UNSIGNED NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  executed_at TIMESTAMP NULL,
  executed_by BIGINT UNSIGNED NULL,
  actual_ppm INT COMMENT 'manual input dari TDS pen',
  notes TEXT,
  status ENUM('pending','done','skipped','late') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES fertigation_schedules(id) ON DELETE SET NULL,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (executed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_block_scheduled (block_id, scheduled_at),
  INDEX idx_status (status)
);

CREATE TABLE pump_actions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  block_id BIGINT UNSIGNED NOT NULL,
  action ENUM('on','off') NOT NULL,
  mode ENUM('manual','auto_schedule','auto_threshold') NOT NULL,
  triggered_by BIGINT UNSIGNED NULL COMMENT 'null kalau auto',
  trigger_reason VARCHAR(200),
  duration_seconds INT COMMENT 'durasi nyala saat off',
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_block_time (block_id, executed_at)
);

CREATE TABLE maintenance_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  category ENUM('fertigasi','hama','penyakit','panen','pruning','alat','lainnya') NOT NULL,
  title VARCHAR(200),
  description TEXT NOT NULL,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  related_alert_id BIGINT UNSIGNED NULL COMMENT 'null kalau bukan dari alert',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_alert_id) REFERENCES alerts(id) ON DELETE SET NULL,
  INDEX idx_user_occurred (user_id, occurred_at),
  INDEX idx_category (category)
);

CREATE TABLE maintenance_log_block (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  maintenance_log_id BIGINT UNSIGNED NOT NULL,
  block_id BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (maintenance_log_id) REFERENCES maintenance_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_log_block (maintenance_log_id, block_id)
);

CREATE TABLE maintenance_photos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  maintenance_log_id BIGINT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  caption VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maintenance_log_id) REFERENCES maintenance_logs(id) ON DELETE CASCADE
);

CREATE TABLE reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type ENUM('stabilitas_nutrisi','aktivitas','siklus_tanam') NOT NULL,
  title VARCHAR(200) NOT NULL,
  block_ids VARCHAR(100) COMMENT 'comma-separated block IDs',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_path VARCHAR(255) COMMENT 'path ke PDF/Excel hasil',
  options JSON COMMENT 'checkbox options pas generate',
  generated_by BIGINT UNSIGNED NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_period (period_start, period_end)
);

CREATE TABLE access_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  wa_number VARCHAR(20) NOT NULL,
  request_type ENUM('reset_password','new_account') NOT NULL,
  reason TEXT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  processed_by BIGINT UNSIGNED NULL,
  processed_at TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_email (email)
);

CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(50) NOT NULL COMMENT 'LOGIN, LOGOUT, EDIT_THRESHOLD, etc',
  target_type VARCHAR(50) COMMENT 'Block, User, Threshold, etc',
  target_id BIGINT COMMENT 'ID of the affected entity',
  description VARCHAR(255),
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_action (action),
  INDEX idx_target (target_type, target_id)
);

CREATE TABLE user_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  theme ENUM('light','dark','system') DEFAULT 'light',
  font_size ENUM('small','medium','large') DEFAULT 'medium',
  language VARCHAR(5) DEFAULT 'id',
  reduced_motion BOOLEAN DEFAULT FALSE,
  density ENUM('comfortable','compact') DEFAULT 'comfortable',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  alert_id BIGINT UNSIGNED NULL COMMENT 'null kalau bukan dari alert',
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
  INDEX idx_user_unread (user_id, is_read, created_at)
);

-- 3. INSERT DUMMY DATA
TRUNCATE TABLE users;
INSERT INTO users (name, email, password, role, wa_number) VALUES
('Kiki', 'owner@prodayaanugerahselaras.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner', '081234567890'),
('Tirta', 'tirta@prodayaanugerahselaras.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'karyawan', '081987654321');

INSERT INTO blocks (code, name, plant_type, location, polybag_count, has_sensor, device_id) VALUES
('A1', 'Blok A - Utara', 'Pakcoy', 'Greenhouse 1', 500, TRUE, 'ESP32_A1_001'),
('B1', 'Blok B - Selatan', 'Pakcoy', 'Greenhouse 1', 500, TRUE, 'ESP32_B1_002');

INSERT INTO planting_cycles (block_id, cycle_number, plant_type, start_date, expected_harvest_date, status) VALUES
(1, '2026-04-A1', 'Pakcoy', '2026-04-01', '2026-04-30', 'active'),
(2, '2026-04-B1', 'Pakcoy', '2026-04-05', '2026-05-05', 'active');

INSERT INTO thresholds (block_id, sensor_type, critical_min, optimal_min, optimal_max, critical_max) VALUES
(1, 'tds', 800, 1050, 1400, 1600),
(1, 'moisture', 40, 60, 80, 95);

INSERT INTO sensor_readings (block_id, sensor_type, value, unit, source, recorded_by) VALUES
(1, 'turbidity', 12.5, 'NTU', 'automatic', NULL),
(1, 'moisture', 68.2, '%', 'automatic', NULL),
(1, 'tds', 1150, 'ppm', 'manual', 2);

INSERT INTO fertigation_schedules (block_id, time_of_day, target_ppm) VALUES
(1, '07:00:00', 1100),
(1, '12:00:00', 1200),
(1, '16:00:00', 1100);

INSERT INTO fertigation_logs (schedule_id, block_id, scheduled_at, executed_at, executed_by, actual_ppm, status) VALUES
(1, 1, CONCAT(CURDATE(), ' 07:00:00'), CONCAT(CURDATE(), ' 07:05:00'), 2, 1150, 'done'),
(2, 1, CONCAT(CURDATE(), ' 12:00:00'), NULL, NULL, NULL, 'pending');

SET FOREIGN_KEY_CHECKS = 1;
SQL
        );
    }

    public function down(): void
    {
        // Revert setup
    }
};
