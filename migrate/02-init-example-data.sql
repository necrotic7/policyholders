-- 根節點
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (1, NULL, 2, 3, 'Alice', TO_TIMESTAMP('2024-01-01 10:00:00', 'YYYY-MM-DD HH:Mi:ss'), NULL);

-- 第二層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (2, 1, 4, 5, 'Bob', TO_TIMESTAMP('2024-01-02 11:00:00', 'YYYY-MM-DD HH:Mi:ss'), 1);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (3, 1, 6, 7, 'Charlie', TO_TIMESTAMP('2024-01-02 12:00:00', 'YYYY-MM-DD HH:Mi:ss'), 1);

-- 第三層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (4, 2, 8, 9, 'David', TO_TIMESTAMP('2024-01-03 09:00:00', 'YYYY-MM-DD HH:Mi:ss'), 2);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (5, 2, NULL,NULL, 'Eve', TO_TIMESTAMP('2024-01-03 10:00:00', 'YYYY-MM-DD HH:Mi:ss'), 2);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (6, 3, 11, NULL, 'Frank', TO_TIMESTAMP('2024-01-03 11:00:00', 'YYYY-MM-DD HH:Mi:ss'), 3);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (7, 3, NULL,NULL, 'Grace', TO_TIMESTAMP('2024-01-03 12:00:00', 'YYYY-MM-DD HH:Mi:ss'), 3);

-- 第四層
INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (8, 4, NULL, NULL, 'Henry', TO_TIMESTAMP('2024-01-04 09:00:00', 'YYYY-MM-DD HH:Mi:ss'), 4);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (9, 4, 10, NULL, 'Ivy', TO_TIMESTAMP('2024-01-04 10:00:00', 'YYYY-MM-DD HH:Mi:ss'), 4);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (10, 9, NULL, NULL, 'Jack', TO_TIMESTAMP('2024-01-04 11:00:00', 'YYYY-MM-DD HH:Mi:ss'), 9);

INSERT INTO policyholders (id, parent_id, left_child_id, right_child_id, name, registration_date, introducer_id) 
VALUES (11, 6, NULL, NULL, 'Kim', TO_TIMESTAMP('2024-01-04 12:00:00', 'YYYY-MM-DD HH:Mi:ss'), 6);
