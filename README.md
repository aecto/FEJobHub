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
│   ├── models/           # 数据模型
│   ├── routes/           # 路由
│   ├── services/         # 业务逻辑
│   ├── middleware/       # 中间件
│   ├── config/           # 配置文件
│   ├── uploads/          # 上传文件目录
│   ├── server.js         # 入口文件
│   └── package.json      # 后端依赖
├── frontend/             # 前端代码
│   ├── public/           # 静态资源
│   ├── src/              # 源代码
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API服务
│   │   ├── utils/        # 工具函数
│   │   └── App.jsx       # 主应用
│   ├── index.html        # HTML模板
│   └── package.json      # 前端依赖
├── datasource/           # 数据源文件
│   └── 2025-09-02.xlsx   # 示例XLSX文件
└── README.md             # 项目说明
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
   - 复制 [.env.example](file:///Users/libin/Work/Qoder/FEJobHub/backend/.env) 为 `.env` 并修改配置

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

## 数据库配置

1. 创建数据库:
   ```sql
   CREATE DATABASE fejobhub;
   ```

2. 在 [.env](file:///Users/libin/Work/Qoder/FEJobHub/backend/.env) 文件中配置数据库连接信息

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

## 部署

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

4. 启动后端服务:
   ```bash
   cd backend
   npm start
   ```

## 开发计划

- [x] 分析XLSX文件结构，设计数据库表结构
- [x] 创建后端项目结构和配置
- [x] 实现数据库模型和连接
- [x] 开发XLSX文件解析和数据导入功能
- [x] 实现定时任务处理每日XLSX文件
- [x] 开发用户认证系统（注册、登录、权限管理）
- [x] 创建职位管理API（增删改查、搜索、分页）
- [x] 开发管理员功能（用户管理、职位管理）
- [x] 创建前端项目结构和配置
- [x] 实现职位列表和详情页面（LinkedIn风格布局）
- [x] 开发搜索和分页功能
- [x] 实现响应式设计，适配移动端
- [x] 创建管理员页面

## 许可证

MIT