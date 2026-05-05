-- Seed the three test accounts from the frontend prototype.
-- Passwords:  admin123 / teacher123 / student123  (BCrypt cost=10)
INSERT INTO users (email, password_hash, name, role, class_group) VALUES
    ('admin@trainer.kz',  '$2b$10$tr6Ez5qyzdgcnvQrtBrIR.3Ca/5ulsEq.TZy01toco631L07ukgTG', 'Администратор',  'ADMIN',   NULL),
    ('aigerim@school.kz', '$2b$10$A1oIE6grUOmLEagCM5WP/e/LpcxJ5QOtp0VGkG7JNwE8311.2hDSe', 'Айгерим Иванова', 'TEACHER',  NULL),
    ('aliya@school.kz',   '$2b$10$IfJsBZLovoodIu7v/afkYu3.XGlUf.JZLIZya80Pp42yM9F8PUE7C', 'Алия Муратова',   'STUDENT',  '7А');
