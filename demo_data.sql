-- OpenLoyalty Demo Data SQL Script
-- This script creates essential demo data for the OpenLoyalty application

-- Clear existing data (optional - uncomment if you want to start fresh)
-- TRUNCATE TABLE ol__users_roles, ol__user, ol__pos, ol__level, ol__campaign, ol__earning_rule, ol__segment CASCADE;

-- 1. INSERT ROLES (if not already present)
INSERT INTO ol__roles (id, role) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_PARTICIPANT'), 
(3, 'ROLE_SELLER')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT ADMIN USER
INSERT INTO ol__user (id, username, password, salt, is_active, create_at, email, dtype) VALUES 
('demo-admin-001', 'admin', '$2y$13$r2ycEYr7ZGcV/3DcC8lbvOezuiG5safNgjuv16TjrTtO8KHdoWJkm', '', true, NOW(), 'admin@oloy.com', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 3. ASSIGN ADMIN ROLE TO USER
INSERT INTO ol__users_roles (user_id, role_id) VALUES 
('demo-admin-001', 1)
ON CONFLICT DO NOTHING;

-- 4. INSERT POS (Point of Sale) DATA
INSERT INTO ol__pos (pos_id, name, description, identifier, location_street, location_address1, location_postal, location_country, location_province, location_city, location_geo_point) VALUES 
('00000000-0000-474c-1111-b0dd880c07e2', 'Off-line store 1', 'Sample POS', 'pos1', 'Street', '21', '00015', 'US', 'NY', 'City', '{"lat": "51.1170364", "long": "17.0203959"}'),
('00000000-0000-474c-1111-b0dd880c07a2', 'eCommerce 1', 'Sample online POS', 'us_online_1', 'Street', '21', '12345', 'US', 'Washington', 'City', '{"lat": "51.1170364", "long": "17.0203959"}'),
('00000000-0000-474c-1111-b0dd880c87b2', 'eCommerce 2', 'Sample on-line POS', 'ecommerce2', 'Street', '3', '00002', 'UK', 'London - City', 'City', '{"lat": "51.1170364", "long": "17.0203959"}'),
('00000000-0000-474c-1111-b0dd880c87c2', 'Off-line store 2', 'Sample POS', 'france_1', 'Street', '21', '12345', 'FR', 'Paris', 'City', '{"lat": "51.1170364", "long": "17.0203959"}')
ON CONFLICT (pos_id) DO NOTHING;

-- 5. INSERT LEVELS
INSERT INTO ol__level (level_id, name, description, condition_value, reward, active, special_rewards) VALUES 
('00000000-0000-474c-b092-b0dd880c07e1', 'Bronze', 'Bronze level', 0, '{"type": "points", "value": 100}', true, '[]'),
('00000000-0000-474c-b092-b0dd880c07e2', 'Silver', 'Silver level', 1000, '{"type": "points", "value": 200}', true, '[]'),
('00000000-0000-474c-b092-b0dd880c07e3', 'Gold', 'Gold level', 5000, '{"type": "points", "value": 500}', true, '[]'),
('00000000-0000-474c-b092-b0dd880c07e4', 'Platinum', 'Platinum level', 10000, '{"type": "points", "value": 1000}', true, '[]')
ON CONFLICT (level_id) DO NOTHING;

-- 6. INSERT SEGMENTS
INSERT INTO ol__segment (segment_id, name, description, active, parts) VALUES 
('00000000-0000-474c-b092-b0dd880c07f1', 'New Customers', 'Customers who registered in last 30 days', true, '[]'),
('00000000-0000-474c-b092-b0dd880c07f2', 'High Value Customers', 'Customers with total spend > $1000', true, '[]'),
('00000000-0000-474c-b092-b0dd880c07f3', 'Inactive Customers', 'Customers with no activity in last 90 days', true, '[]')
ON CONFLICT (segment_id) DO NOTHING;

-- 7. INSERT EARNING RULES
INSERT INTO ol__earning_rule (earning_rule_id, name, description, type, active, reward, conditions) VALUES 
('00000000-0000-474c-b092-b0dd880c08e1', 'Welcome Bonus', 'Get points for your first purchase', 'event', true, '{"type": "points", "value": 100}', '[]'),
('00000000-0000-474c-b092-b0dd880c08e2', 'Purchase Points', 'Earn 1 point per $1 spent', 'event', true, '{"type": "points", "value": 1}', '[]'),
('00000000-0000-474c-b092-b0dd880c08e3', 'Birthday Bonus', 'Get bonus points on your birthday', 'event', true, '{"type": "points", "value": 50}', '[]')
ON CONFLICT (earning_rule_id) DO NOTHING;

-- 8. INSERT CAMPAIGNS
INSERT INTO ol__campaign (campaign_id, name, description, active, reward, conditions, segments, levels, pos) VALUES 
('00000000-0000-474c-b092-b0dd880c09e1', 'Summer Sale', 'Special summer campaign', true, '{"type": "points", "value": 200}', '[]', '[]', '[]', '[]'),
('00000000-0000-474c-b092-b0dd880c09e2', 'Holiday Special', 'Holiday season campaign', true, '{"type": "points", "value": 300}', '[]', '[]', '[]', '[]'),
('00000000-0000-474c-b092-b0dd880c09e3', 'New Year Bonus', 'New Year celebration campaign', true, '{"type": "points", "value": 500}', '[]', '[]', '[]', '[]')
ON CONFLICT (campaign_id) DO NOTHING;

-- 9. INSERT SETTINGS
INSERT INTO ol__settings (setting_id, key, value) VALUES 
('00000000-0000-474c-b092-b0dd880c0ae1', 'program_name', 'OpenLoyalty Demo'),
('00000000-0000-474c-b092-b0dd880c0ae2', 'program_points_name', 'Points'),
('00000000-0000-474c-b092-b0dd880c0ae3', 'currency', 'USD'),
('00000000-0000-474c-b092-b0dd880c0ae4', 'timezone', 'UTC'),
('00000000-0000-474c-b092-b0dd880c0ae5', 'customer_registration_active', 'true'),
('00000000-0000-474c-b092-b0dd880c0ae6', 'allow_duplicate_email', 'false')
ON CONFLICT (setting_id) DO NOTHING;

-- 10. INSERT EMAIL TEMPLATES
INSERT INTO ol__email (email_id, key, subject, content, sender_name, sender_email) VALUES 
('00000000-0000-474c-b092-b0dd880c0be1', 'customer_registration', 'Welcome to OpenLoyalty', 'Welcome {{ customer.firstName }}!', 'OpenLoyalty', 'noreply@oloy.com'),
('00000000-0000-474c-b092-b0dd880c0be2', 'password_reset', 'Password Reset', 'Click here to reset your password: {{ resetUrl }}', 'OpenLoyalty', 'noreply@oloy.com'),
('00000000-0000-474c-b092-b0dd880c0be3', 'points_earned', 'Points Earned', 'You earned {{ points }} points!', 'OpenLoyalty', 'noreply@oloy.com')
ON CONFLICT (email_id) DO NOTHING;

-- 11. INSERT SELLER USER (for POS access)
INSERT INTO ol__user (id, username, password, salt, is_active, create_at, email, dtype) VALUES 
('demo-seller-001', 'seller', '$2y$13$r2ycEYr7ZGcV/3DcC8lbvOezuiG5safNgjuv16TjrTtO8KHdoWJkm', '', true, NOW(), 'seller@oloy.com', 'seller')
ON CONFLICT (username) DO NOTHING;

-- 12. ASSIGN SELLER ROLE
INSERT INTO ol__users_roles (user_id, role_id) VALUES 
('demo-seller-001', 3)
ON CONFLICT DO NOTHING;

-- 13. INSERT CUSTOMER USER (for testing)
INSERT INTO ol__user (id, username, password, salt, is_active, create_at, email, dtype) VALUES 
('demo-customer-001', 'customer', '$2y$13$r2ycEYr7ZGcV/3DcC8lbvOezuiG5safNgjuv16TjrTtO8KHdoWJkm', '', true, NOW(), 'customer@oloy.com', 'customer')
ON CONFLICT (username) DO NOTHING;

-- 14. ASSIGN CUSTOMER ROLE
INSERT INTO ol__users_roles (user_id, role_id) VALUES 
('demo-customer-001', 2)
ON CONFLICT DO NOTHING;

-- Display summary
SELECT 'Demo data inserted successfully!' as status;
SELECT 'Admin user: admin / admin123' as admin_credentials;
SELECT 'Seller user: seller / admin123' as seller_credentials;
SELECT 'Customer user: customer / admin123' as customer_credentials; 