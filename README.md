# DeepThink AI

> 深度思考路由器 + 12人AI私董会 — 一个问题进来，AI自动从79种思维模式中选出最合适的那把钥匙，用它的框架一步步拆解，最后落到明天就能做的行动。

<p align="center">
  <img src="https://img.shields.io/badge/DeepThink-AI-FF6B35?style=flat-square&logo=openai" alt="DeepThink AI" />
  <img src="https://img.shields.io/badge/DeepSeek-API-1D4ED8?style=flat-square" alt="DeepSeek API" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 快速开始

### 在线使用（推荐）

直接打开即用，无需任何配置：

**https://deepthink-ai.vercel.app** （部署后替换）

### 本地使用

```bash
# 克隆仓库
git clone https://github.com/marketleonai-del/deepthink.git
cd deepthink

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后打开浏览器访问 `http://localhost:5173`

### 配置 API Key

首次打开页面后，点击右上角的 **「API Key」** 按钮：

1. 前往 [platform.deepseek.com](https://platform.deepseek.com) 注册并创建 API Key
2. 将 Key 粘贴到设置框中
3. 点击保存 — Key 仅保存在你的浏览器本地，不会上传到任何服务器

---

## 两种模式

### 模式一：快速思考（深度思考路由器）

一个问题进来，AI 自动诊断卡点，从 **79种思维模式** 中选出唯一最合适的那把钥匙：

- **69个思维模型**：5W2H、四象限法则、费曼学习法、第一性原理、福格行为模型、GRAI复盘、GROW教练模型、金字塔原理、5Why根因分析、SCQA、二阶思维、SMART原则、STAR陈述法、STP定位、SWOT、PDCA、OKR、飞轮效应、逆向思考、事前验尸、红队演练……等
- **5位人物**：史蒂夫·乔布斯、埃隆·马斯克、查理·芒格、沃伦·巴菲特
- **5本书籍**：《思考，快与慢》、《原则》、《穷查理宝典》、《孙子兵法》、《黑天鹅》

### 模式二：12人AI私董会

**12位拥有正交哲学框架的AI幕僚**，通过 **8步标准化私董会流程** 帮你做重大决策：

| 幕僚 | 哲学框架 | 核心贡献 |
|------|----------|----------|
| 史蒂夫·乔布斯 | 极简主义·用户体验 | 产品直觉·细节执行 |
| 保罗·格雷厄姆 | YC创业逻辑·PMF | 创业本质·用户需求挖掘 |
| 杰夫·贝佐斯 | 长期主义·飞轮效应 | 客户至上·逆向工作法 |
| 埃隆·马斯克 | 第一性原理 | 极限执行·高风险高回报决策 |
| 老子 | 道德经·水哲学 | 顺势而为·无为而治 |
| 六祖慧能 | 六祖坛经·本自具足 | 当下觉察·放下执念 |
| 毛泽东 | 矛盾论·群众路线 | 战略全局·生存优先级判断 |
| 钱学森 | 系统工程·科学方法 | 复杂系统拆解·落地方法论 |
| 凯文·凯利 | 技术涌现·生态系统 | 长远趋势判断·失控之美 |
| 马克·安德森 | 风险资本逻辑 | 市场时机判断·技术浪潮把握 |
| 李小龙 | 截拳道·以无法为有法 | 内心稳定·身体力行 |
| 爱因斯坦 | 思维实验·简洁之美 | 第一性原理·跨维度类比 |

**8步流程**：输入困惑 → 定义问题 → 挖事实 → 独立发言(NGT) → 拆维度 → 深度辩论 → 汇总(贝叶斯) → 摘果子(行动清单)

---

## 技术架构

- **React 19** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui 组件
- **Framer Motion** 动画
- **DeepSeek API** 流式调用（兼容 OpenAI API 格式）
- **本地存储** API Key，不上传服务器

---

## 项目结构

```
src/
├── lib/
│   ├── api.ts          # DeepSeek API 封装
│   ├── data.ts         # 79种思维模式 + 12位幕僚数据
│   └── prompts.ts      # 系统提示词
├── components/
│   └── ApiKeyModal.tsx # API Key 设置弹窗
├── pages/
│   ├── QuickThink.tsx  # 快速思考模式
│   └── Boardroom.tsx   # 12人私董会模式
├── App.tsx             # 主应用 + 路由
└── main.tsx            # 入口
```

---

## 核心理论基础

- **NGT 名义群体法**：12位幕僚并行独立生成观点，彻底解决锚定效应
- **Delphi 法**：多轮辩论传递完整推理过程
- **Pre-Mortem 事前尸检法**：假设项目已失败，多识别30%的致命风险
- **贝叶斯更新理论**：每轮会话记录信念变化，实现决策能力复利增长
- **双钻石设计模型**：先发散再收敛搞对问题，再发散再收敛搞对答案

---

## 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/marketleonai-del/deepthink)

### 手动部署

```bash
npm run build
# 将 dist/ 目录部署到任何静态托管服务
```

---

## Star History

如果这个项目对你有帮助，请给个 Star ⭐

---

**DeepThink AI** © 2025 — 深度思考，从今天开始
