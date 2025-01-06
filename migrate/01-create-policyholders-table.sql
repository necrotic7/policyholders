CREATE TABLE policyholders (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 保戶編號
    parent_id INT,                      -- 父節點的 ID
    left_child_id INT,                  -- 左子節點的 ID
    right_child_id INT,                 -- 右子節點的 ID
    name VARCHAR(100) NOT NULL,         -- 保戶姓名
    registration_date DATETIME,         -- 加入日
    introducer_id INT         			-- 介紹人保戶編號
);