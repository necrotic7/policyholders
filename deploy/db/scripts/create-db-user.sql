CREATE USER POLICYHOLDERS IDENTIFIED BY safesync;
GRANT CONNECT, RESOURCE TO POLICYHOLDERS;
ALTER USER POLICYHOLDERS QUOTA UNLIMITED ON USERS;