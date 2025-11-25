-- Create test users for all three roles
-- All passwords follow the format: [Role]123 (e.g., Admin123, Lender123, Renter123)

-- Admin user
INSERT INTO users (email, password_hash, name, role, wallet_balance)
VALUES (
  'admin@rencam.com',
  '$2b$10$bh1ehxLchYpNj7AHuBJFqec/R0pwFp.ITkh8cvtROrplGGA6cIjgS',
  'Admin User',
  'admin',
  0.00
);

-- Lender user
INSERT INTO users (email, password_hash, name, role, wallet_balance)
VALUES (
  'lender@rencam.com',
  '$2b$10$updGtrzqBOXYPRf5NSZgYuQrHqS4TWiEBct5wazT3LRYABXdudp6O',
  'Lender User',
  'lender',
  0.00
);

-- Renter user
INSERT INTO users (email, password_hash, name, role, wallet_balance)
VALUES (
  'renter@rencam.com',
  '$2b$10$16AXUmsFDBr.PFMiWcmKYOTudrsi17B8iChWDf481/G4OTLVisLem',
  'Renter User',
  'renter',
  0.00
);

-- Display created users
SELECT email, name, role, wallet_balance FROM users;
