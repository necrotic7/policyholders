CREATE TABLE policyholders (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 節點的唯一 ID
    parent_id INT,                      -- 父節點的 ID
    left_child_id INT,                  -- 左子節點的 ID
    right_child_id INT,                 -- 右子節點的 ID
    code VARCHAR(50) PRIMARY KEY,       -- 保戶編號
    name VARCHAR(100) NOT NULL,         -- 保戶姓名
    registration_date DATETIME,         -- 加入日
    introducer_code VARCHAR(50)         -- 介紹人保戶編號
    FOREIGN KEY (parent_id) REFERENCES BinaryTree (id),
    FOREIGN KEY (left_child_id) REFERENCES BinaryTree (id),
    FOREIGN KEY (right_child_id) REFERENCES BinaryTree (id)
);