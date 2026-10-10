-- ============================================
-- EXPENSE TRACKER — DATABASE SCHEMA
-- ============================================

-- Create & select database
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- ============================================
-- USERS — login accounts
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EXPENSES — money going out
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  category    VARCHAR(50) NOT NULL,
  date        DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INCOMES — money coming in
-- ============================================
CREATE TABLE IF NOT EXISTS incomes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  source      VARCHAR(50) NOT NULL,
  date        DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);