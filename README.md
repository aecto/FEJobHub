# 外企招聘平台 (FEJobHub)

一个用于发布和浏览外企招聘信息的全栈Web应用，支持管理员发布职位信息，用户可以浏览、搜索职位并申请。

## 功能特性

- **职位展示**: 类似LinkedIn的布局，左侧职位列表，右侧职位详情
- **搜索功能**: 支持按公司名称、职位标题、技能关键词、工作地点搜索
- **分页显示**: 每页默认显示30条职位信息
- **用户系统**: 用户注册、登录，支持游客浏览
- **管理员功能**: 
  - 每日上传XLSX文件自动解析并插入数据库
  - 删除用户、删除职位信息
  - 管理员面板
- **定时任务**: 每日晚上9点自动检查并处理XLSX文件
- **响应式设计**: 适配移动端，便于转换为手机App和微信小程序

## 技术栈

### 后端
- Node.js + Express
- MySQL/PostgreSQL
- Sequelize ORM
- JWT认证
- node-schedule定时任务

### 前端
- React + Vite
- React Router
- Axios
- 响应式CSS设计

## 项目结构

```
FEJobHub/
├── backend/              # 后端代码
│   ├── controllers/      # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── services/        # 业务逻辑
│   ├── middleware/      # 中间件
│   ├── config/          # 配置文件
│   ├── uploads/         # 上传文件目录
│   ├── server.js        # 入口文件
│   └── package.json     # 后端依赖
├── frontend/            # 前端代码
│   ├── public/          # 静态资源
│   ├── src/             # 源代码
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API服务
│   │   ├── utils/       # 工具函数
│   │   └── App.jsx      # 主应用
│   ├── index.html       # HTML模板
│   └── package.json     # 前端依赖
├── datasource/          # 数据源文件
│   └── 2025-09-02.xlsx  # 示例XLSX文件
└── README.md            # 项目说明
```

## 环境要求

- Node.js >= 14.x
- MySQL/PostgreSQL数据库
- Python (用于分析XLSX文件结构)

## 安装与运行

### 后端

1. 进入后端目录:
   ```bash
   cd backend
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 配置环境变量:
   - 复制 `.env.example` 为 `.env` 并修改配置
   - 设置数据库连接信息、JWT密钥等敏感信息

4. 启动服务:
   ```bash
   npm start
   ```
   或开发模式:
   ```bash
   npm run dev
   ```

### 前端

1. 进入前端目录:
   ```bash
   cd frontend
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 启动开发服务器:
   ```bash
   npm run dev
   ```

4. 构建生产版本:
   ```bash
   npm run build
   ```

## 环境变量配置

为确保应用安全，所有敏感信息都应通过环境变量配置，不要在代码中硬编码。

### 后端环境变量

- `PORT`: 服务器端口，默认3001
- `DB_HOST`: 数据库主机地址
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_NAME`: 数据库名称
- `DB_PORT`: 数据库端口
- `JWT_SECRET`: JWT加密密钥（应使用强随机字符串）
- `JWT_EXPIRES_IN`: JWT过期时间
- `UPLOAD_PATH`: 文件上传路径

### 配置示例

```bash
# 服务器配置
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=fejobhub
DB_PORT=3306

# JWT配置（生产环境务必使用强密钥）
JWT_SECRET=your_strong_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# 文件上传配置
UPLOAD_PATH=./uploads
```

## 数据库配置

1. 创建数据库:
   ```sql
   CREATE DATABASE fejobhub;
   ```

2. 在 `.env` 文件中配置数据库连接信息

3. 应用启动时会自动创建数据表

## 使用说明

### 管理员操作

1. 管理员需要先注册账户并手动设置为管理员角色
2. 每日将XLSX文件命名为 `YYYY-MM-DD.xlsx` 格式并上传到服务器指定目录
3. 系统会在每晚9点自动处理新上传的文件

### 用户操作

1. 用户可以注册/登录账户，或以游客身份浏览职位
2. 使用搜索功能查找感兴趣的职位
3. 点击职位列表项查看详细信息
4. 点击"官方申请"按钮跳转到企业官网申请页面

## API接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/logout` - 用户登出

### 职位接口
- `GET /api/jobs` - 获取职位列表（支持分页和搜索）
- `GET /api/jobs/:id` - 获取职位详情
- `POST /api/jobs/upload` - 上传XLSX文件（管理员）
- `DELETE /api/jobs/:id` - 删除职位（管理员）

### 管理员接口
- `GET /api/admin/users` - 获取用户列表
- `DELETE /api/admin/users/:id` - 删除用户
- `GET /api/admin/dashboard` - 获取仪表板数据

## Docker容器化部署

为了方便在阿里云服务器上部署，并支持将来的功能扩展和升级，项目提供了完整的Docker容器化部署方案。

### 部署架构

项目采用微服务架构，包含以下容器：

1. **MySQL容器**: 数据库服务
2. **后端容器**: Node.js Express应用
3. **前端容器**: React应用（通过Nginx提供服务）

### 部署步骤

1. 确保服务器已安装Docker和Docker Compose
2. 克隆项目代码到服务器
3. 配置环境变量
4. 运行以下命令启动服务：
   ```bash
   docker-compose up -d
   ```

详细部署说明请参考 [DEPLOYMENT.md](DEPLOYMENT.md) 文件。

### 升级方案

项目支持无缝升级：

1. **前端升级**: 重新构建前端镜像并重启容器
2. **后端升级**: 重新构建后端镜像并重启容器
3. **数据库升级**: 通过迁移脚本处理数据库结构变更

详细升级说明请参考 [DEPLOYMENT.md](DEPLOYMENT.md) 文件。

## 传统部署方式

1. 构建前端:
   ```bash
   cd frontend
   npm run build
   ```

2. 将构建产物部署到服务器

3. 配置Nginx反向代理:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. 在生产服务器上配置环境变量

5. 启动后端服务:
   ```bash
   cd backend
   npm start
   ```

## 安全建议

1. **环境变量**: 生产环境中务必使用强密码和密钥，不要使用默认值
2. **HTTPS**: 在生产环境中启用HTTPS
3. **数据库**: 使用专用的数据库用户，限制权限
4. **JWT**: 使用足够强度的密钥，定期更换
5. **文件上传**: 限制上传文件类型和大小，进行安全检查

## 开发计划

- [x] 分析XLSX文件结构，设计数据库表结构
- [x] 创建后端项目结构和配置
- [x] 实现数据库模型和连接
- [x] 开发XLSX文件解析和数据导入功能