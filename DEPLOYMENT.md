# FEJobHub Docker部署指南

## 1. 系统要求

- Docker 20.10+
- Docker Compose 1.29+

## 2. 部署步骤

### 2.1 服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2.2 代码上传

```bash
# 克隆或上传项目代码到服务器
git clone https://github.com/your-username/FEJobHub.git
cd FEJobHub
```

### 2.3 配置环境变量

```bash
# 在backend目录下创建.env文件（如果不存在）
cd backend
cp .env.example .env

# 编辑环境变量
vim .env
```

修改以下关键配置：
```
DB_HOST=mysql
DB_PORT=3306
DB_NAME=fejobhub
DB_USER=fejobhub_user
DB_PASSWORD=fejobhub_password
JWT_SECRET=your_strong_jwt_secret_key
```

### 2.4 构建和启动服务

```bash
# 返回项目根目录
cd ..

# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

### 2.5 初始化数据库

```bash
# 进入后端容器
docker exec -it fejobhub-backend sh

# 运行数据库同步脚本
node scripts/syncDatabase.js

# 退出容器
exit
```

### 2.6 访问应用

- 前端: http://your-server-ip
- 后端API: http://your-server-ip:3001
- 数据库: mysql://your-server-ip:3306

## 3. 升级方案

### 3.1 前端升级流程

```bash
# 拉取最新代码
git pull origin main

# 进入前端目录
cd frontend

# 重新构建前端镜像
docker-compose build frontend

# 停止并重新启动前端服务
docker-compose up -d --no-deps frontend

# 返回项目根目录
cd ..
```

### 3.2 后端升级流程

```bash
# 拉取最新代码
git pull origin main

# 进入后端目录
cd backend

# 检查是否有依赖变更
# 如果package.json有变更，需要重新安装依赖

# 返回项目根目录
cd ..

# 重新构建后端镜像
docker-compose build backend

# 停止并重新启动后端服务
docker-compose up -d --no-deps backend

# 如果有数据库迁移脚本，需要执行
docker exec -it fejobhub-backend node scripts/migration.js
```

### 3.3 数据库升级

对于数据库结构变更，需要创建专门的迁移脚本:

1. 创建迁移脚本:
```javascript
// backend/scripts/migration.js
const sequelize = require('../config/database');
const Job = require('../models/Job');
const User = require('../models/User');

// 在这里添加数据库结构变更逻辑
async function migrate() {
  try {
    // 示例：添加新字段
    // await sequelize.query('ALTER TABLE jobs ADD COLUMN is_featured BOOLEAN DEFAULT FALSE');
    console.log('数据库迁移完成');
  } catch (error) {
    console.error('数据库迁移失败:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
```

2. 执行迁移:
```bash
docker exec -it fejobhub-backend node scripts/migration.js
```

## 4. 常用管理命令

### 4.1 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mysql
```

### 4.2 停止和启动服务

```bash
# 停止所有服务
docker-compose down

# 启动所有服务
docker-compose up -d

# 重启特定服务
docker-compose restart frontend
```

### 4.3 进入容器

```bash
# 进入后端容器
docker exec -it fejobhub-backend sh

# 进入前端容器
docker exec -it fejobhub-frontend sh

# 进入MySQL容器
docker exec -it fejobhub-mysql mysql -u fejobhub_user -p fejobhub
```

## 5. 备份和恢复

### 5.1 数据库备份

```bash
# 创建数据库备份
docker exec fejobhub-mysql /usr/bin/mysqldump -u fejobhub_user -p fejobhub > backup-$(date +"%Y-%m-%d-%H%M%S").sql
```

### 5.2 数据库恢复

```bash
# 恢复数据库
docker exec -i fejobhub-mysql mysql -u fejobhub_user -p fejobhub < backup-file.sql
```

## 6. 性能监控

### 6.1 查看资源使用情况

```bash
# 查看容器资源使用情况
docker stats

# 查看特定容器资源使用情况
docker stats fejobhub-frontend fejobhub-backend fejobhub-mysql
```

## 7. 故障排除

### 7.1 服务无法启动

1. 检查日志:
```bash
docker-compose logs service-name
```

2. 检查端口占用:
```bash
netstat -tulpn | grep :port
```

3. 重新构建镜像:
```bash
docker-compose build --no-cache service-name
```

### 7.2 数据库连接问题

1. 检查数据库服务状态:
```bash
docker-compose ps mysql
```

2. 验证数据库连接:
```bash
docker exec -it fejobhub-mysql mysql -u fejobhub_user -p fejobhub -e "SELECT 1;"
```

3. 检查后端环境变量配置是否正确