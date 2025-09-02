# 数据库设计

## 1. 职位表 (jobs)

| 字段名 | 类型 | 描述 | 约束 |
|--------|------|------|------|
| id | BIGINT | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | 职位标题 | NOT NULL |
| company_name | VARCHAR(255) | 公司名称 | NOT NULL |
| location | VARCHAR(255) | 工作地点 | NOT NULL |
| salary_range | VARCHAR(100) | 薪资范围 | NULL |
| skills | TEXT | 技能关键词 | NULL |
| description | TEXT | 职位描述 | NULL |
| requirements | TEXT | 职位要求 | NULL |
| job_apply_url | VARCHAR(500) | 官方申请链接 | NOT NULL |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| expires_at | DATETIME | 过期时间 | NOT NULL |
| status | VARCHAR(20) | 状态 | NOT NULL, DEFAULT 'active' |

注意：从XLSX文件中没有发现skills字段，但根据需求文档需要支持按技能搜索，可以在数据导入时从requirements或description中提取关键词。

## 2. 用户表 (users)

| 字段名 | 类型 | 描述 | 约束 |
|--------|------|------|------|
| id | BIGINT | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | 用户名 | NOT NULL, UNIQUE |
| email | VARCHAR(100) | 邮箱 | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | 密码哈希 | NOT NULL |
| role | VARCHAR(20) | 用户角色 | NOT NULL, DEFAULT 'user' |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| last_login | DATETIME | 最后登录时间 | NULL |

## 3. 数据处理逻辑

1. 系统每日检查新上传的XLSX文件（文件名格式为YYYY-MM-DD.xlsx）
2. 解析XLSX文件内容，提取职位信息
3. 为每条记录添加创建时间（当前时间）
4. 计算过期时间（创建时间+60天）
5. 设置默认状态为active
6. 验证数据完整性，确保必填字段不为空
7. 如果薪水范围为空，则设置为"面议"
8. 将数据插入jobs表