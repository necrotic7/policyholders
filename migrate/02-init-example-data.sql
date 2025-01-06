-- 根節點
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (1, NULL, 2, 3, 'Alice', '2024-01-01 10:00:00', NULL);

-- 第二層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (2, 1, 4, 5, 'Bob', '2024-01-02 11:00:00', 1);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (3, 1, 6, 7, 'Charlie', '2024-01-02 12:00:00', 1);

-- 第三層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (4, 2, 8, 9, 'David', '2024-01-03 09:00:00', 2);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (5, 2, NULL,NULL, 'Eve', '2024-01-03 10:00:00', 2);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (6, 3, 11, NULL, 'Frank', '2024-01-03 11:00:00', 3);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (7, 3, NULL,NULL, 'Grace', '2024-01-03 12:00:00', 3);

-- 第四層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (8, 4, NULL, NULL, 'Henry', '2024-01-04 09:00:00', 4);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (9, 4, 10, NULL, 'Ivy', '2024-01-04 10:00:00', 4);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (10, 9, NULL, NULL, 'Jack', '2024-01-04 11:00:00', 9);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (11, 6, NULL, NULL, 'Kim', '2024-01-04 12:00:00', 6);