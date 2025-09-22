FROM docker.io/library/node:16-alpine

WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci --only=production

# 复制应用代码
COPY . .

# 创建必要目录
RUN mkdir -p ../datasource
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]