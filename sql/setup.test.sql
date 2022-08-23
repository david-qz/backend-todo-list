-- This file runs after setup.sql during testing
-- Add dummy data for testing here

insert into users (email, password_hash) values
('dummy@example.com', '$2b$10$r0p878WXUgMMNFWA2MLf4OvLf9aaa4t/DfJvrroiRm80BYk4a.5D6');

insert into todos (user_id, task, completed) values
(1, 'do dishes', true),
(1, 'walk dog', false);
