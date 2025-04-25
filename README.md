# Frontend Library Corner System / 前端图书管理系统

## Purpose of the Application / 应用目的
This application is designed to provide a comprehensive library management system where users can manage books, categories, and borrowing records. The system supports two types of users: Admin and User. Admin has full control over the system, including managing users, categories, and books, as well as handling borrow and return transactions. Users can view books and categories, add books, and check their own borrowing records.  
本应用旨在提供一个完整的图书馆管理系统，用户可以管理图书、分类和借阅记录。系统支持两种用户类型：管理员和普通用户。管理员可以对系统进行全面管理，包括管理用户、分类、图书，处理借阅和归还事务；普通用户可以查看图书和分类，添加图书，并查看自己的借阅记录。

## Features / 功能列表

### 📖 Book Management / 图书管理
- **Admin**: Can add, edit, delete, and view books.  
  **管理员**：可以添加、编辑、删除和查看图书。
- **User**: Can view books and add new book.  
  **普通用户**：可以查看图书并添加新图书。

### 📚 Category Management / 分类管理
- **Admin**: Can add, edit, delete, and view categories.  
  **管理员**：可以添加、编辑、删除和查看图书分类。
- **User**: Can view books and add new categories.  
  **普通用户**：可以查看分类并添加新类别。

### 🔐 Borrowing System / 借阅系统
- **Admin**: Can handle book borrow and return requests.  
  **管理员**：可以处理图书借阅和归还请求。
- **User**: Can view their own borrowing records and return books.  
  **普通用户**：可以查看自己的借阅记录并归还图书。

### 👥 User Management / 用户管理
- **Admin**: Can view all users, disable users, and manage roles.  
  **管理员**：可以查看所有用户、禁用用户并管理角色。
- **User**: Can only view user information.  
  **普通用户**：只能查看用户信息。

## How to Contribute / 如何贡献
To contribute to the development of this project, follow the steps below:  
要为本项目贡献代码，请按照以下步骤操作：
1. Fork the repository.  
   Fork 该仓库。
2. Create a new branch for your feature or bugfix.  
   为你的功能或 bug 修复创建一个新分支。
3. Make your changes and commit them.  
   进行修改并提交。
4. Submit a pull request for review.  
   提交 pull request 进行审核。

## Dependencies and Installation / 依赖项及安装
This project relies on the following dependencies:  
本项目依赖以下库：
- **antd**: "^5.24.7"  
- **axios**: "^1.8.4"  
- **dayjs**: "^1.11.13"  
- **qs**: "^6.14.0"  
- **react**: "^19.0.0"  
- **react-dom**: "^19.0.0"  
- **react-router**: "^7.5.1"  
- **react-router-dom**: "^7.5.1"  
- **vite-plugin-pages**: "^0.33.0"  

To install the dependencies, follow these steps:  
安装依赖项的步骤：
1. Clone the repository:  
   克隆该仓库：
   ```bash
   git clone https://github.com/Zwy0v0/LibraryCorner.git
2. Navigate to the project folder:
   进入项目文件夹：
   ```bash
   cd <project-folder>
3. Install dependencies:
   安装依赖：
   ```bash
   npm install

## 📐 Application Architecture | 应用架构说明

The **Library Management Frontend** is structured using a **modular, component-based architecture** powered by React. The project is organized into clear domains such as API interaction, reusable UI components, and route-based page views.  
**图书管理系统前端**采用了基于 React 的**模块化组件架构**，整个项目按照 API、可复用组件、页面视图等模块清晰划分。

### 📁 Folder Structure | 文件结构

The following shows the overall structure of the **Library Management System Frontend** project.  
以下是 **图书管理系统前端** 项目的整体目录结构：

```tree
├── .env                     # Environment variables config file | 环境变量配置文件
├── index.html               # HTML entry template               | HTML 模板入口
├── package.json             # Project dependencies & scripts    | 项目依赖与脚本配置
├── README.md                # Project documentation             | 项目说明文档
├── vite.config.js           # Vite build configuration          | Vite 构建配置
|
├── public
│   └── favicon.svg          # Website favicon                   | 网站图标
|
└── src                      # Main source code directory        | 主源码目录
    ├── App.jsx              # Root component                    | 根组件
    ├── main.jsx             # App entry point                   | 应用入口文件
    ├── index.css            # Global stylesheet                 | 全局样式文件
    |
    ├── /api                 # API request modules               | API 请求模块（与后端交互）
    │   ├── book.js          # Book-related API                  | 图书相关 API
    │   ├── borrow.js        # Borrow-related API                | 借阅相关 API
    │   ├── category.js      # Category-related API              | 分类相关 API
    │   ├── login.js         # Login & auth API                  | 登录认证 API
    │   └── user.js          # User management API               | 用户管理 API
    |
    ├── /components          # Reusable UI components            | 可复用组件目录
    │   ├── BookForm         # Book form component               | 图书表单组件
    │   ├── BorrowForm       # Borrow form component             | 借阅表单组件
    │   ├── CategoryForm     # Category form component           | 分类表单组件
    │   ├── Layout           # Layout (navbar/footer)            | 布局组件（导航栏/页脚）
    │   ├── LoginForm        # Login form component              | 登录表单组件
    │   └── UserForm         # User form component               | 用户表单组件
    |
    ├── /pages               # Route-level page components       | 路由页面组件
    │   ├── 404.jsx          # 404 error page                    | 404 错误页面
    │   ├── addBook.jsx      # Add or edit book page             | 添加或编辑图书页面
    │   ├── addBorrow.jsx    # Add borrow page                   | 添加借阅页面
    │   ├── addCategory.jsx  # Add or edit category page         | 添加或编辑分类页面
    │   ├── addUser.jsx      # Add or edit user page             | 添加或编辑用户页面
    │   ├── books.jsx        # Book list page                    | 图书列表页
    │   ├── borrows.jsx      # Borrow records page               | 借阅记录页
    │   ├── categories.jsx   # Category list page                | 分类列表页
    │   ├── index.jsx        # Homepage                          | 系统首页
    │   ├── login.jsx        # Login page                        | 用户登录页
    │   └── users.jsx        # User management page              | 用户管理页
    |
    ├── /utils               # Utility functions                 | 工具函数模块
    │   ├── request.js       # Axios wrapper                     | 封装 Axios 请求
    │   └── throttleDebounce.js  # Throttle & debounce utils     | 节流与防抖函数




















# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
