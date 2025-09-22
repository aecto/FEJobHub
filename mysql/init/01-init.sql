-- 创建数据库和用户
CREATE DATABASE IF NOT EXISTS fejobhub;
CREATE USER IF NOT EXISTS 'fejobhub_user'@'%' IDENTIFIED BY 'fejobhub_password';
GRANT ALL PRIVILEGES ON fejobhub.* TO 'fejobhub_user'@'%';