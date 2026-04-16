# Figma MCP to Code Pipeline

从 Figma 设计稿到前端代码的完整通路，基于 Figma MCP 协议实现。本文档记录了经过实际验证的完整流程、工具用法、数据结构和注意事项。

> 验证日期: 2026-04-13
> 验证文件: Adobe Spectrum Design System (Community)
> 验证组件: Card (5 variants), Status Light (9 variants), Text Field (6 states × 2 styles)

---

## 1. 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    Figma Design File                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Pages   │  │Components│  │Variables │  │ Instances  │  │
│  │(Desktop/ │  │(Button,  │  │(Colors,  │  │(具体使用   │  │
│  │ Mobile)  │  │ Card...) │  │ Spacing) │  │ 的组件)    │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ Figma MCP Protocol
                         │
              ┌──────────▼──────────┐
              │    MCP Tool Calls   │
              │                     │
              │  get_metadata       │  → 文件结构树 (XML)
              │  get_design_context │  → 参考代码 + Tokens + 截图
              │  get_screenshot     │  → 组件视觉截图
              │  get_variable_defs  │  → 变量定义
              │  search_design_system│ → 搜索组件/变量/样式
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │   Structured Spec   │
              │                     │
              │  - Design Tokens    │  颜色/字体/间距的精确值
              │  - Component Props  │  变体/状态的 TypeScript 接口
              │  - DOM Structure    │  组件层级和布局方式
              │  - Visual Reference │  截图用于对照验证
              │  - Documentation    │  组件描述和官方文档链接
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │   Coding Agent      │
              │                     │
              │  读取 Spec → 适配技术栈 → 生成代码
              └─────────────────────┘
```

---

## 2. 前置条件

### 2.1 Figma 账号要求

| 计划 | 每日调用次数 | 适用场景 |
|------|:-----------:|---------|
| Starter | 6次/月 | 不可用于开发 |
| Professional (Full/Dev seat) | 200次/天, 10次/分 | 日常开发 |
| Organization (Full/Dev seat) | 200次/天, 15次/分 | 团队开发 |
| Enterprise (Full/Dev seat) | 600次/天, 20次/分 | 大规模使用 |

### 2.2 MCP 客户端支持

- Claude Code (CLI / Desktop / Web)
- VS Code (with MCP extension)
- Cursor
- 其他 [Figma MCP Catalog](https://www.figma.com/mcp-catalog/) 中列出的客户端

### 2.3 认证流程

```
1. 客户端调用 figma.authenticate()
2. 浏览器打开 OAuth 授权页面
3. 用户在 Figma 中授权
4. MCP 工具自动可用
5. 调用 figma.whoami() 验证身份和计划
```

---

## 3. 工具详解

### 3.1 get_metadata — 获取文件结构

**用途**: 了解文件的组织结构，找到目标组件的 node ID

**输入**:
```
fileKey: "DhWAk8tIxrekWZyG028fhl"   ← 从 URL 提取
nodeId:  "41:11058"                  ← 从 URL 的 node-id 参数提取, 将 "-" 转为 ":"
```

**URL 解析规则**:
```
figma.com/design/:fileKey/:fileName?node-id=:nodeId
                  ^^^^^^^^                  ^^^^^^^
                  直接使用                   将 "-" 转为 ":"

figma.com/design/:fileKey/branch/:branchKey/:fileName
                                  ^^^^^^^^^^
                                  使用 branchKey 作为 fileKey
```

**输出**: XML 格式的节点树
```xml
<canvas id="41:11058" name="↳ 🔆 Light Theme">
  <section id="375:43834" name="Actions">
    <frame id="362:42623" name="Quick Actions">
      <instance id="362:44024" name="_Cell" />
    </frame>
  </section>
  <section id="171:25795" name="Cards">
    <frame id="171:22998" name="Card - Desktop - Light">
      <symbol id="171:22989" name="Type=Standard, State=Default, Hover Action=None" />
      <symbol id="171:22987" name="Type=Social, State=Default, Hover Action=None" />
      ...
    </frame>
  </section>
</canvas>
```

**关键信息**:
- `<canvas>` = Figma 页面，名称通常包含主题/设备信息（如 "Light Theme", "Desktop"）
- `<section>` = 顶层分组
- `<frame>` = 组件集合
- `<symbol>` = 组件变体，名称格式为 `Property=Value, Property=Value`
- `<instance>` = 组件实例

**注意事项**:
- 大型设计系统的 metadata 可能超过 500KB，需要用脚本解析
- 只返回指定 nodeId 的子树，不会返回整个文件的所有页面
- Community 文件必须先 Duplicate 到自己的工作区才能访问

### 3.2 get_design_context — 核心工具

**用途**: 获取组件的完整设计上下文，包括参考代码、截图、tokens

**输入**:
```
fileKey: "DhWAk8tIxrekWZyG028fhl"
nodeId:  "171:22989"                ← 具体到单个组件变体
clientFrameworks: "react"           ← 影响生成的参考代码风格
clientLanguages: "typescript,html,css"
```

**输出包含 5 部分**:

#### (1) 参考代码 (React + Tailwind)
```tsx
function CardDesktopLight({ className, type = "Standard", state = "Default" }) {
  return (
    <div className="border border-[#e6e6e6] flex flex-col overflow-clip rounded-[4px] w-[280px]">
      <div className="h-[125px] relative w-full">
        <img className="absolute inset-0 object-cover size-full" src={imgImage} />
      </div>
      <div className="bg-white flex flex-col gap-[4px] px-[24px] py-[30px]">
        <p className="font-semibold text-[14px] text-black">Card title</p>
        <p className="text-[#464646] text-[14px]">Metadata text</p>
      </div>
    </div>
  );
}
```

> **重要**: 这是参考代码，不是最终代码。必须适配项目的技术栈和样式系统。

#### (2) Design Tokens
```
light/gray/gray-50: #FFFFFF
light/gray/gray-200: #E6E6E6
light/gray/gray-700: #464646
light/gray/gray-900: #000000
body/sans-serif/desktop/default/body-s-default:
  Font(family: "Source Sans Pro", size: 14, weight: 400, lineHeight: 100)
```

#### (3) 截图
自动附带组件的渲染截图，用于视觉对照验证。

#### (4) 组件描述 + 文档链接
```
Cards group information into flexible containers to let users
browse a collection of related items and actions.
Documentation: https://spectrum.adobe.com/page/cards/
```

#### (5) 资产 URL
图片和 SVG 以临时 URL 形式提供，**7 天后过期**。

**注意事项**:
- 节点太大时会返回 metadata 而非完整代码，提示你对子节点分别调用
- 变体识别非常准确 — 同一组件的不同 type/state 返回完全不同的结构
- `data-node-id` 属性会添加到生成的代码中，可用于溯源

### 3.3 get_screenshot — 获取截图

**用途**: 获取任意节点的渲染截图

**输入**: fileKey + nodeId（都是必须的）

**注意**: get_design_context 默认已附带截图，通常不需要单独调用此工具。适用于只需要视觉参考不需要代码的场景。

### 3.4 get_variable_defs — 获取变量定义

**用途**: 获取节点关联的 Figma Variables（颜色、间距等）

**输出示例**:
```
icon/default/secondary: #949494
spacing/component/sm: 8px
```

### 3.5 search_design_system — 搜索设计资产

**用途**: 按关键词搜索组件、变量、样式

**输入**:
```
query: "button"
fileKey: "xxx"
includeComponents: true
includeVariables: true
includeStyles: true
```

---

## 4. 完整工作流

### Step 1: 定位目标

```
设计师提供 Figma URL
    │
    ├── 解析 fileKey 和 nodeId
    │
    ▼
get_metadata(fileKey, nodeId)
    │
    ├── 解析返回的 XML 结构树
    ├── 识别 Section / Frame / Symbol 层级
    ├── 从 Symbol 名称中提取变体信息 (Type=X, State=Y)
    │
    ▼
找到目标组件的 nodeId
```

### Step 2: 提取数据

```
对每个目标组件变体:
    │
    ▼
get_design_context(fileKey, nodeId)
    │
    ├── 参考代码 (React + Tailwind)
    ├── Design Tokens (颜色/字体/间距)
    ├── 截图 (视觉参考)
    ├── 组件描述 + 文档链接
    └── 资产 URL (图片/SVG)
```

### Step 3: 生成 Spec

将 MCP 返回的数据整理为结构化 Spec:

```markdown
# Component Spec: [组件名]

## Overview
[组件描述，来自 Figma metadata]
Documentation: [链接]

## Variants
| Property | Values |
|----------|--------|
| Type     | Standard, Social, Learn, Product, Horizontal |
| State    | Default, Hover, Selected, Dragged |

## Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| gray-50 | #FFFFFF | Background |
| gray-200 | #E6E6E6 | Border |

## Structure (每个变体)
[DOM 层级描述]

## Props Interface
[TypeScript 接口定义]

## Reference Code
[参考实现]
```

### Step 4: Coding Agent 实现

```
Spec + 项目上下文 → Coding Agent
    │
    ├── 读取项目技术栈 (React/Vue/Svelte/原生)
    ├── 读取项目样式方案 (Tailwind/CSS Modules/styled-components)
    ├── 映射 Design Tokens 到项目 Token 系统
    ├── 转换参考代码为项目代码
    └── 用截图对照验证
```

---

## 5. 注意事项

### 5.1 Figma 设计师需要做的

| 规范 | 原因 | 影响 |
|------|------|------|
| **使用 Auto Layout** | Agent 才能理解 flex 布局关系 | 没有 Auto Layout 的设计返回绝对定位 |
| **使用 Figma Variables** | Token 才能被提取 | 硬编码颜色只返回 HEX 值，无语义名称 |
| **语义化命名** | Agent 靠名称理解意图 | `LoginCard/EmailInput` vs `Frame 47` |
| **变体用 Variants/Properties** | 变体信息自动出现在 Symbol 名称中 | 名称格式: `Type=Standard, State=Default` |
| **状态做全** | Agent 看不到的状态不会实现 | Default / Hover / Active / Disabled / Error |

### 5.2 MCP 输出的局限性

| 信息 | MCP 能提供 | 不能提供 |
|------|:---------:|:--------:|
| 静态视觉样式 | ✅ | |
| 组件结构/层级 | ✅ | |
| Design Tokens | ✅ | |
| 组件变体矩阵 | ✅ | |
| 截图 | ✅ | |
| 交互行为（动画/过渡） | | ❌ 需要 PRD |
| 响应式断点 | | ❌ 需要 Spec 单独定义 |
| 业务逻辑 | | ❌ 需要 PRD |
| 数据来源/API | | ❌ 需要技术文档 |

### 5.3 参考代码的使用原则

MCP 返回的 React + Tailwind 代码是**参考实现**，不是最终代码：

1. **不要直接复制粘贴** — 必须适配项目的技术栈
2. **Tailwind 类名是精确的** — 间距、颜色、字体都是从 Figma 像素级提取的
3. **图片 URL 会过期** — 7 天后失效，需替换为项目资产路径
4. **不要安装 Tailwind** — 除非项目本身使用 Tailwind，否则要转换为项目的样式系统

### 5.4 调用量优化

Pro 计划每天 200 次调用，需要合理使用：

| 操作 | 消耗 | 建议 |
|------|:----:|------|
| get_metadata (页面级) | 1 次 | 先用这个了解结构，再精确取组件 |
| get_design_context (组件) | 1 次/组件 | 直接取到具体变体节点，避免取太大的 frame |
| get_screenshot | 1 次 | get_design_context 已含截图，通常不需要额外调用 |
| whoami | 不计数 | 免费 |

**策略**: 先用 1 次 get_metadata 扫描结构，从 XML 中找到目标 nodeId，再精准调用 get_design_context。避免对顶层 section 调用 get_design_context（数据量过大会报错）。

### 5.5 Community 文件的限制

- Community 文件不能直接通过 MCP 访问
- 必须先在 Figma 中点 "Open in Figma" 复制到自己的工作区
- 复制后 URL 中的 fileKey 会变化，使用新的 fileKey

---

## 6. 给 Coding Agent 的完整输入模板

一个 coding agent 需要三份文档才能完整实现一个页面：

```yaml
# === 输入给 Coding Agent 的完整上下文 ===

design:
  source: figma
  file: "https://figma.com/design/:fileKey/:fileName?node-id=:nodeId"
  components:
    - name: Card
      node_id: "171:22989"
      variants: [Standard, Social, Learn, Product, Horizontal]
    - name: StatusLight
      node_id: "139:23489"
      variants: [Positive, Informative, Notice, Negative, Neutral, Disabled]
    - name: TextField
      node_id: "199:28306"
      variants: [Standard, Quiet]
      states: [Default, Hover, Focus, Error, Disabled]

tokens:
  colors:
    primary: "#147AF3"       # blue-800
    success: "#008F5D"       # green-800
    warning: "#F68511"       # orange-600
    error:   "#EA3829"       # red-800
    text:    "#222222"       # gray-800
    subtle:  "#464646"       # gray-700
    border:  "#E6E6E6"       # gray-200
    bg:      "#FFFFFF"       # gray-50
  typography:
    family: "Source Sans Pro"
    body-s: "14px/1.4 regular"
    body-xs: "12px/1.0 regular"
  spacing:
    radius-sm: "4px"

breakpoints:
  desktop: ">=1024px"
  tablet: ">=768px"
  mobile: "<768px"

behavior:
  # 来自 PRD，不来自 Figma
  card_click: "Navigate to detail page"
  card_hover: "Show shadow elevation"
  form_validation: "Real-time on blur, show error state"

project:
  framework: "React"          # 或 Vue / Svelte / 原生
  styling: "CSS Modules"      # 或 Tailwind / styled-components
  existing_components: []     # 项目已有的组件，避免重复
```

---

## 7. Web Design Agent 架构参考

如果要构建一个自动化的 Web Design Agent，核心循环如下：

```
┌─────────────────────────────────────────────────┐
│                Web Design Agent                  │
│                                                  │
│  Input:                                          │
│    - Figma URL (设计稿)                           │
│    - PRD (交互行为)                               │
│    - Project context (技术栈/已有组件)             │
│                                                  │
│  Step 1: Scan                                    │
│    get_metadata → 解析结构 → 列出所有组件           │
│                                                  │
│  Step 2: Extract                                 │
│    for each component:                           │
│      get_design_context → tokens + structure     │
│      识别变体矩阵 (Type × State)                  │
│                                                  │
│  Step 3: Map                                     │
│    Figma tokens → 项目 token 系统                 │
│    Figma 组件 → 项目已有组件 (复用)                │
│    新组件 → 生成 spec                             │
│                                                  │
│  Step 4: Generate                                │
│    spec + 项目约定 → 代码                          │
│    适配技术栈 (React/Vue/原生)                     │
│    适配样式方案 (Tailwind/CSS Modules)             │
│                                                  │
│  Step 5: Verify                                  │
│    渲染页面 → 截图 → 与 Figma 截图对比             │
│    差异过大 → 回到 Step 4 修正                     │
│                                                  │
│  Output:                                         │
│    - 组件代码                                     │
│    - Token 文件                                   │
│    - 展示页面                                     │
└─────────────────────────────────────────────────┘
```

### 关键设计决策

1. **Token 优先**: 先提取所有 tokens 建立变量体系，再实现组件。组件中引用变量而非硬编码值。
2. **变体感知**: 利用 Figma Symbol 命名规范 (`Type=X, State=Y`) 自动构建组件的 props 和条件渲染。
3. **增量提取**: 不要一次性提取整个设计系统。按页面/功能模块逐步提取，控制 API 调用量。
4. **双向验证**: 代码 → 截图 → 与 Figma 截图对比，形成闭环。

---

## 8. 经验验证记录

### 测试文件
Adobe Spectrum Design System (Community)
- fileKey: `DhWAk8tIxrekWZyG028fhl`
- Page: "↳ 🔆 Light Theme" (node `41:11058`)

### 提取的组件

| 组件 | Node ID | 变体数 | MCP 识别结果 |
|------|---------|:------:|:-----------:|
| Card - Standard | 171:22989 | - | ✅ 完整结构 + tokens |
| Card - Social | 171:22987 | - | ✅ 头像/社交/点赞/评论 完全不同的结构 |
| Card - Learn | 171:22976 | - | ✅ 分类/标题/状态/图片 独特布局 |
| Card - Product | 171:22965 | - | ✅ Banner/图标/CTA按钮 最复杂变体 |
| Card - Horizontal | 171:22986 | - | ✅ 水平布局 flex-row |
| Status Light | 139:23489 | 9 色 | ✅ 9 种颜色 + disabled/neutral 特殊样式 |
| Text Field | 199:28306 | 24 | ✅ Standard/Quiet × Top/Side × 6 states |

### 提取的 Design Tokens

```
Gray:    #FFFFFF, #F8F8F8, #E6E6E6, #D5D5D5, #B1B1B1, #909090, #6D6D6D, #464646, #222222, #000000
Blue:    #3892F3, #147AF3, #0265DC
Green:   #27BB36, #15A46E, #008F5D, #00653E
Red:     #EA3829, #D31510, #B40000
Orange:  #F68511
Indigo:  #686DF4
Magenta: #DE3D82
Celery:  #27BB36

Font:    Source Sans Pro (Regular 400, SemiBold 600, Italic)
Sizes:   12px (body-xs), 14px (body-s), 16px, 22px
Radius:  4px (components), 10px (product icons), 50px (buttons/avatars)
```

### 结论

Figma MCP 能以像素级精度提取设计数据，**变体识别能力是核心价值** — 同一组件名下的不同 type 返回完全不同的 DOM 结构和样式，coding agent 可以直接基于此实现条件渲染。主要限制在于交互行为和响应式断点需要从其他文档（PRD/Spec）补充。
