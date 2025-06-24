# kyleleung-boot-kit

🚀 一个基于 TypeScript 5.6 的 Node.js 服务端开发框架，采用 **最新装饰器语法** 封装，默认使用 **Express 4.26**，支持模块注入、配置管理、请求处理等特性，适用于快速构建中大型后端服务。

---

## ✨ 特性亮点

- 支持多环境配置合并
- 完整的模块装饰器体系
- 请求参数自动映射与校验（基于 JSON Schema）
- 支持跨域检查、中间件扩展
- 可选 Session 持久化、请求数据共享
- 命令行启动参数灵活
- TypeScript 类型自动生成支持

---

## 📦 安装使用

```bash
npm install kyleleung-boot-kit
```

开发启动：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

---

## 🧱 开发进度

- ✅ 配置读取与多环境合并
- ✅ 路由与参数封装
- ✅ 模块注入机制（AppRequest）
- ⬜ 配置命令初始化模板
- ⬜ 数据库连接（MySQL）
- ✅ 请求参数校验（JSON Schema）
- ⬜ Session 持久化
- ⬜ 全局数据共享
- ⬜ 请求作用域数据共享
- ⬜ 文件上传支持
- ✅ 跨域请求处理
- ⬜ 请求转发代理
- ⬜ 模拟消息队列支持
- ⬜ 并发任务处理
- ⬜ 注解生成接口文档
- ✅ JSON 转 TypeScript 类型定义工具

---

## 🧾 命令行参数

| 参数         | 说明         |
| ------------ | ------------ |
| `APP_ENV`    | 运行环境名称 |
| `configPath` | 配置文件路径 |

---

## ⚙️ 配置文件格式（YAML）

```yaml
Server:
  port: 8001
  host: 0.0.0.0
  publicKey: 5e7692707c144a33
  staticPath: "./stub"
  staticRoute: "/public"
  uploadPath: "./stub/res"
  tempPath: "./stub/temp"
  otherPath: "/Users/mnt/api"

Log:
  level: info
  savePath: "./logs"

Session:
  enabled: true
  timeout: 120000

Email:
  pop3: pop3.163.com
  smtp: smtp.163.com
  user: kyle@163.com
  accessKey: 123456
```

---

## 🧩 装饰器一览

| 装饰器             | 说明                 | 示例 / 说明                          |
| ------------------ | -------------------- | ------------------------------------ |
| `@BootApplication` | 启动类入口           | 自动装载配置与模块                   |
| `@Config`          | 装载配置数据         | 启动类中使用                         |
| `@GetConfig`       | 获取配置信息         | `@GetConfig("Server", "host")`       |
| `@AppService`      | 注册服务模块（单例） | 应用级模块                           |
| `@AppRequest`      | 请求作用域模块       | 请求级别实例                         |
| `@AppModel`        | 注入模块依赖         | `@AppModel([A, B])` 构造函数自动注入 |
| `@RequestMapping`  | 显式定义路由         | `@RequestMapping("/user", "GET")`    |
| `@Get`             | 定义 GET 路由        | `@Get("/user")`                      |
| `@Post`            | 定义 POST 路由       | `@Post("/login")`                    |
| `@GetParam`        | 获取请求参数         | 定义在控制器方法中，依赖于路由装饰器 |

> 🔗 更多示例详见 [使用教程文档](/doc/GetParam)

---

## 📦 内置模块

- `Email`：发送邮件模块（支持 SMTP）
- 计划支持更多模块：Session、Redis 缓存、MQ 模拟等

---

## 👤 作者

**Kyle H Z Liang**

---

## 📄 License

ISC License
