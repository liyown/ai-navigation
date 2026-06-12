# AI 导航 | AI Navigation

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15.1.0-black)

</div>

## 📖 简介

AI 导航是一个现代化的人工智能网站导航系统，致力于帮助用户发现、分享和管理优质的 AI 工具与资源。项目采用最新的 Web 技术栈构建，提供流畅的用户体验和强大的管理功能。

### ✨ 特性

- 🎯 **精选内容**: 严选优质 AI 网站，分类清晰直观
- 🔍 **智能搜索**: 支持多搜索引擎集成和实时搜索
- 🎨 **现代设计**: 精美的 UI 设计，支持浅色/深色主题
- 📱 **响应式**: 完美适配桌面端、平板和移动设备
- 🚀 **智能抓取**: 自动获取网站标题、描述和图片
- 👮‍♂️ **后台管理**: 完善的管理员功能和审核机制
- 💾 **数据安全**: 支持数据备份与云端同步

## 🚀 界面展示

### 示例站点

- [AI 导航](https://ai-navigation-sz5y.vercel.app/) - 发现、分享和收藏优质 AI 工具与资源

### 界面预览

#### 首页浅色主题

![首页浅色主题](/public/compose.png)

#### 首页深色主题

![首页深色主题](/public/compose-dark.png)

#### 排行榜

![排行榜](/public/rankings.png)

#### 深色模式

![深色模式](/public/dark.png)

##### 动画效果

![头部动画效果](/public/header-1735608882123.gif)
![全部动画效果](/public/all.gif)
![底部动画效果](/public/footer.gif)

## 🛠️ 开发步骤

### 1. 环境准备

- 安装 [Node.js](https://nodejs.org/) (>= 18.0.0)
- 安装 [Git](https://git-scm.com/)
- 准备一个代码编辑器 (推荐 VS Code)
- 确保有可用的包管理器 (npm >= 8.0.0)

### 2. 项目设置

1. Fork 项目仓库到你的 GitHub 账号

2. 克隆项目到本地:

```bash
git clone https://github.com/OpenAISpace/ai-navigation.git
cd ai-navigation
```

3. 安装项目依赖:

```bash
npm install
```

4. 环境变量配置:

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入必要的环境变量
```

> [!IMPORTANT]
> 当前 Prisma schema 仅支持 PostgreSQL。
> `DATABASE_URL` 和 `DIRECT_URL` 需要填写 PostgreSQL 连接串，不能直接替换成 MySQL。
> 如果你使用 MySQL 执行 `npx prisma migrate dev`，会在初始化阶段报错。

5. 初始化数据库:

```bash
npx prisma migrate dev
npm run init-data
```

### 3. 开发流程

1. 创建新的功能分支:

```bash
git checkout -b feature/your-feature-name
```

2. 启动开发服务器:

```bash
npm run dev
```

3. 代码质量检查:

```bash
# 运行代码检查
npm run lint

# 运行类型检查
npm run type-check
```

4. 提交代码:

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin feature/your-feature-name
```

## 📦 部署步骤

### 1. Vercel 部署（推荐）

1. Fork 本项目到你的 GitHub 账号

2. 在 [Vercel](https://vercel.com/) 注册账号并连接 GitHub

3. 在 Vercel 中导入项目:
   - 点击 "New Project"
   - 选择你 fork 的仓库
   - 配置项目设置:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Node.js Version: 18.x

4. 配置环境变量:

   在 Vercel 项目设置的 "Environment Variables" 中添加以下变量：

   | 变量名 | 必填 | 说明 | 示例 |
   |--------|------|------|------|
   | `DATABASE_URL` | ✅ | PostgreSQL 数据库连接字符串 | `postgres://user:pass@host:5432/db` |
   | `DIRECT_URL` | ✅ | PostgreSQL 直连地址（用于 Prisma） | `postgres://user:pass@host:5432/db` |
   | `ADMIN_PASSWORD` | ✅ | 管理员登录密码 | `your-password` |
   | `JWT_SECRET` | ✅ | JWT 密钥，建议随机字符串 | `random-secret-key` |
   | `OSS_REGION` | ❌ | OSS 区域（如使用阿里云） | `oss-cn-hangzhou` |
   | `OSS_BUCKET` | ❌ | OSS Bucket 名称 | `your-bucket` |
   | `OSS_ACCESS_KEY` | ❌ | OSS Access Key | `your-key` |
   | `OSS_ACCESS_SECRET` | ❌ | OSS Access Secret | `your-secret` |
   | `OSS_ENDPOINT` | ❌ | OSS Endpoint | `oss-cn-hangzhou.aliyuncs.com` |

5. 部署项目:
   - 点击 "Deploy"
   - 等待部署完成
   - 访问分配的域名检查部署结果

6. 初始化数据（首次部署后）:
   - 访问 `/admin` 使用设置的密码登录
   - 或运行 `npm run init-data` 初始化种子数据

### 常见部署问题

- 数据库初始化报错:
  请先确认 `.env` / Vercel 环境变量中的 `DATABASE_URL` 和 `DIRECT_URL` 使用的是 PostgreSQL，而不是 MySQL。
- 分类列表为空:
  执行完 `npx prisma migrate dev` 后，还需要再运行一次 `npm run init-data` 导入初始分类和站点数据。

### 2. 自托管部署

#### Docker 部署

1. 构建 Docker 镜像:

```bash
docker build -t ai-nav .
```

2. 运行容器:

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e DIRECT_URL=your_direct_url \
  -e ADMIN_PASSWORD=your_password \
  -e JWT_SECRET=your_jwt_secret \
  --name ai-nav \
  ai-nav
```

#### 手动部署

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库连接等信息

# 3. 初始化数据库
npx prisma migrate dev

# 4. 初始化种子数据（可选）
npm run init-data

# 5. 构建项目
npm run build

# 6. 启动生产服务器
npm run start
```

### 3. 数据库准备

推荐使用以下免费/付费 PostgreSQL 服务：

- **Supabase** (推荐免费)
  1. 创建项目后获取 `DATABASE_URL` 和 `DIRECT_URL`
  2. 在 Settings > API 中获取连接字符串

- **Neon**
  1. 创建项目后获取连接字符串
  2. 注意：Neon 需要修改连接字符串

- **Railway**
  1. 创建 PostgreSQL 插件
  2. 获取连接字符串

## 🔧 核心功能

### 网站管理

- **网站提交**
  - 支持手动填写和自动抓取
  - 分类管理
  - 审核流程和状态追踪
- **访问统计**
  - 记录网站访问次数
  - 显示网站点赞数
- **网站检测**
  - 自动检测网站可访问性
  - 实时显示网站状态

### 管理后台

- 管理员登录认证
- 网站审核管理
- 分类管理
- 主题设置

## 🛠️ 技术栈

- **前端框架**:

  - Next.js 15 (App Router)
  - React 18
  - TypeScript

- **状态管理**:

  - Jotai
  - React Query / SWR

- **UI 框架**:

  - Tailwind CSS
  - shadcn/ui
  - Framer Motion

- **数据存储**:

  - PostgreSQL
  - Prisma ORM

- **工具链**:
  - React Hook Form
  - Zod
  - Lucide React
  - ESLint
  - Prettier

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

<div align="center">

**AI 导航** © 2026 Made with ❤️

</div>
