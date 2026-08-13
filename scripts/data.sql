-- Reset and Insert Fresh Sample Data for OMBS Microservices

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ombs_auth
TRUNCATE TABLE ombs_auth.users;
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('999999', 'admin123', 'ADMIN');
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('100001', 'member123', 'MEMBER');
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('100002', 'member123', 'MEMBER');
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('200001', 'maid123', 'MAID');
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('200002', 'maid123', 'MAID');
INSERT INTO ombs_auth.users (user_id, password, role) VALUES ('200003', 'maid123', 'MAID');

-- 2. ombs_user
TRUNCATE TABLE ombs_user.members;
TRUNCATE TABLE ombs_user.maids;
INSERT INTO ombs_user.members (member_id, member_name, member_address, contact_email, contact_phone) 
VALUES ('100001', 'Ravi Kumar', 'Sector 62, Noida', 'ravi@gmail.com', '9876543210');
INSERT INTO ombs_user.members (member_id, member_name, member_address, contact_email, contact_phone) 
VALUES ('100002', 'Sita Patel', 'Indiranagar, Bangalore', 'sita@gmail.com', '9876543211');

INSERT INTO ombs_user.maids (maid_id, maid_name, maid_address, maid_age, maid_type, experience_years, preferred_job_type, salary_expectation, contact_email, contact_phone, status) 
VALUES ('200001', 'Aarti Sharma', 'Sector 62, Noida', 28, 'Cleaner', 4, 'Full Time', 8000.0, 'aarti@gmail.com', '9999888877', 'ALLOCATED');
INSERT INTO ombs_user.maids (maid_id, maid_name, maid_address, maid_age, maid_type, experience_years, preferred_job_type, salary_expectation, contact_email, contact_phone, status) 
VALUES ('200002', 'Priya Singh', 'Sector 15, Noida', 32, 'Cook', 6, 'Part Time', 6000.0, 'priya@gmail.com', '9999888876', 'ALLOCATED');
INSERT INTO ombs_user.maids (maid_id, maid_name, maid_address, maid_age, maid_type, experience_years, preferred_job_type, salary_expectation, contact_email, contact_phone, status) 
VALUES ('200003', 'Pooja Sharma', 'Indiranagar, Bangalore', 24, 'Baby sitter', 2, 'Full Time', 12000.0, 'pooja@gmail.com', '9999888875', 'AVAILABLE');

-- 3. ombs_matching
TRUNCATE TABLE ombs_matching.jobs;
INSERT INTO ombs_matching.jobs (job_id, member_id, maid_id, job_detail, job_type, job_location, salary, status, created_at) 
VALUES (1, '100001', '200001', 'Full Time House Cleaner needed in Sector 62 Noida', 'Full Time', 'Noida', 8000.0, 'ALLOCATED', '2025-06-15 10:00:00');
INSERT INTO ombs_matching.jobs (job_id, member_id, maid_id, job_detail, job_type, job_location, salary, status, created_at) 
VALUES (2, '100001', '200002', 'Part Time Experienced Cook for North Indian Meals', 'Part Time', 'Noida', 6000.0, 'ALLOCATED', '2025-09-10 11:30:00');
INSERT INTO ombs_matching.jobs (job_id, member_id, maid_id, job_detail, job_type, job_location, salary, status, created_at) 
VALUES (3, '100002', '200003', 'Full Time Baby sitter for 2 year old child', 'Full Time', 'Bangalore', 12000.0, 'ALLOCATED', '2026-01-20 09:15:00');
INSERT INTO ombs_matching.jobs (job_id, member_id, maid_id, job_detail, job_type, job_location, salary, status, created_at) 
VALUES (4, '100001', NULL, 'Cleaner for 3 BHK Apartment', 'Full Time', 'Noida', 9000.0, 'PENDING', '2026-03-05 14:00:00');

-- 4. ombs_payment
TRUNCATE TABLE ombs_payment.payments;
INSERT INTO ombs_payment.payments (transaction_id, job_id, member_id, member_name, amount, payment_done, payment_date) 
VALUES (1, 1, '100001', 'Ravi Kumar', 500.0, 'Yes', '2025-06-16 15:30:00');
INSERT INTO ombs_payment.payments (transaction_id, job_id, member_id, member_name, amount, payment_done, payment_date) 
VALUES (2, 2, '100001', 'Ravi Kumar', 500.0, 'Yes', '2025-09-11 16:45:00');
INSERT INTO ombs_payment.payments (transaction_id, job_id, member_id, member_name, amount, payment_done, payment_date) 
VALUES (3, 3, '100002', 'Sita Patel', 500.0, 'Yes', '2026-02-10 10:30:00');
INSERT INTO ombs_payment.payments (transaction_id, job_id, member_id, member_name, amount, payment_done, payment_date) 
VALUES (4, 4, '100001', 'Ravi Kumar', 500.0, 'No', NULL);

-- 5. ombs_feedback
TRUNCATE TABLE ombs_feedback.feedbacks;
INSERT INTO ombs_feedback.feedbacks (feedback_id, sender_id, receiver_id, rating, comments, created_at) 
VALUES (1, '100001', '200001', 4, 'Very professional cleaner, highly recommended.', '2025-07-01 12:00:00');
INSERT INTO ombs_feedback.feedbacks (feedback_id, sender_id, receiver_id, rating, comments, created_at) 
VALUES (2, '100001', '200002', 5, 'Excellent cook, prepares very delicious meals.', '2025-10-01 18:30:00');
INSERT INTO ombs_feedback.feedbacks (feedback_id, sender_id, receiver_id, rating, comments, created_at) 
VALUES (3, '100002', '200003', 5, 'Great with kids, very responsible baby sitter.', '2026-03-01 14:00:00');

SET FOREIGN_KEY_CHECKS = 1;
