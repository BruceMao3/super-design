# Super Design — Plugin Spec

> **Date:** 2026-04-14
> **Status:** Draft
> **Plugin name:** super-design
> **Total skills:** 20（1 bootstrap + 5 reference-free + 3 process + 11 reference-guided）

---

## 1. Overview

Super Design 是一个独立的 AI agent skill plugin，覆盖**设计全生命周期**：从灵感研究、设计提取、原型生成，到设计打磨、开发实施、质量保障。

### 1.1 解决什么问题

设计工作流中存在三个断裂：

1. **灵感到规格的断裂** — 看到好设计，但无法系统化提取为可执行的 spec
2. **原型到品质的断裂** — 能快速生成原型，但设计品质粗糙
3. **设计到开发的断裂** — 设计决策在开发实施中丢失

Super Design 通过 19 个 skill 和严格的 human-in-the-loop 流程串联这三个阶段。

### 1.2 核心原则

1. **Human-in-the-loop 无处不在** — 每个产出设计内容的步骤都有用户确认门（approval gate），不自动跳过
2. **设计参考隔离** — 提取/复刻阶段忠实还原，不施加外部设计意见；打磨阶段才引入设计知识
3. **独立零依赖** — 不依赖 superpowers 或 impeccable 的安装，所有能力自包含
4. **多 provider 支持** — 借鉴 impeccable 的构建系统，一次编写，编译到 11+ provider

### 1.3 不做什么

- 不做完整的项目脚手架（不是 create-app）
- 不做后端逻辑（只关注前端设计和 UI）
- 不做像素级复刻（目标是设计模式级还原，80% 效果）
- 不替代设计师（辅助而非替代，human 始终做决策）

---

## 2. Architecture

### 2.1 四层分区

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 0: Bootstrap                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ super-design                                          │  │
│  │ 入口 + 流程路由 + session 状态管理                      │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Reference-Free Zone                               │
│  规则：不引用 reference/*.md                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ design-    │ │ design-    │ │ design-    │              │
│  │ essence    │ │ analysis   │ │ prototype  │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│  ┌────────────┐ ┌────────────┐                              │
│  │ figma-     │ │ design-    │                              │
│  │ to-code    │ │ brainstorm │                              │
│  └────────────┘ └────────────┘                              │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Process Control                                   │
│  不产出设计内容，管理开发流程                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ design-    │ │ design-    │ │ design-    │              │
│  │ plan       │ │ review     │ │ finish     │              │
│  └────────────┘ └────────────┘ └────────────┘              │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Reference-Guided Zone                             │
│  可引用 reference/*.md                                       │
│                                                              │
│  ┌─ 基础设施层 ────────────────────────────────────────┐    │
│  │ design-token    数据基础设施：产出变量表，            │    │
│  │                 被执行层 skill 消费                   │    │
│  │ design-critique 流程基础设施：产出问题清单，          │    │
│  │                 被 bootstrap 消费做路由               │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌─ 执行层 ────────────────────────────────────────────┐    │
│  │ design-typeset   排版修正                            │    │
│  │ design-layout    布局修正                            │    │
│  │ design-colorize  配色策略                            │    │
│  │ design-animate   动效添加                            │    │
│  │ design-distill   极简精简（方向性，与加法互斥）        │    │
│  │ design-adapt     响应式适配                          │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌─ 质量保障层 ────────────────────────────────────────┐    │
│  │ design-a11y      无障碍专项                          │    │
│  │ design-harden    错误处理 / 边界 / i18n              │    │
│  │ design-audit     技术质量检查                        │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 基础设施层的两种"基础设施"

- **design-token 是数据基础设施**：它产出的变量表（颜色、字体、间距）被执行层 skill 直接消费。typeset 需要字体 token，colorize 需要色彩 token，layout 需要间距 token。没有 token，执行层 skill 缺乏统一的变量体系。
- **design-critique 是流程基础设施**：它产出的问题清单被 bootstrap 消费来做路由决策。critique 本身不执行修复，也不了解下游 skill 的存在——它只诊断。

两者的共同点是：都是其他 skill 的上游依赖。区别在于消费方式：token 被 skill 内部引用，critique 被 bootstrap 流程引用。

---

## 3. Reference Isolation Boundary

### 3.1 规则

**Reference-Free Zone 的唯一规则：不引用 `reference/*.md` 文件。**

这意味着：
- design-essence、design-analysis、design-prototype、figma-to-code、design-brainstorm 这五个 skill 的 SKILL.md 中不出现任何指向 `reference/typography.md`、`reference/color-and-contrast.md` 等文件的引用
- 这些 skill 内部已有的 DO/DON'T 规则是它们自身的智慧，保留不动
- 这些 skill 的设计目标各自独立（提取还原度、原创构思质量等），不受 Reference-Guided Zone 的设计意见影响

### 3.2 边界的物理位置

**Phase 3 决策门是两个区域的天然分界线。** 原型生成完成后，用户选择"是否进入设计打磨"——选择进入，就跨越了边界，进入 Reference-Guided Zone。

### 3.3 为什么不是"禁止设计意见"

Reference-Free 不等于"禁止 DO/DON'T"。这些 skill 本身经过打磨，内含高质量的设计判断。隔离的是**外部设计参考系统**（impeccable 风格的 typography.md 等），而不是 skill 自身的设计智慧。

原因：提取和复刻阶段需要忠实还原目标设计——如果目标网站用了 Inter + gradient text，spec 就应该忠实记录这些选择，而不是被外部参考规则纠正为"不要用 Inter"。

---

## 4. Human-in-the-Loop Flow

### 4.1 完整流程

```
Phase 1: 灵感研究
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  入口 A：用户给 URL + "看看这个网站"
    → design-essence（快扫 5 分钟）
    → 展示核心创意报告
    → 🧑 Human Gate: "描述准确吗？值得深入吗？"
    → yes → design-analysis
    → no → 结束，或换一个 URL

  入口 B：用户给 URL + "分析/拆解这个网站"
    → 直接进入 design-analysis（全栈提取 30 分钟）

  入口 C：用户给 URL + "复刻这个网站"
    → 建议先跑 analysis → prototype
    → 用户可选跳过 analysis 直接 prototype

  design-analysis 流程：
    → Phase 1: 源码获取
    → Phase 2: Token 层自动提取
    → Phase 3: 体验层分析提取
    → Phase 4: 截图交叉校正
    → Phase 5: 展示"视觉理解描述"
    → 🧑 Human Gate: "这段描述跟你看到的网站一样吗？哪里不对？"
    → 1-2 轮修正收敛
    → 输出：[domain]-design-spec.md

  入口 D：用户要从零做原创设计
    → design-brainstorm
    → 探索项目上下文
    → 逐个提问，理解意图
    → 提出 2-3 种方案
    → 🧑 Human Gate: 逐 section 确认设计
    → 输出：设计 spec


Phase 2: 原型生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  入口 E：用户有 spec + "生成原型"
    → design-prototype（读取 spec，按优先级生成）
    → 展示原型 + 实现清单 + 差距说明
    → 🧑 Human Gate: "原型感觉对吗？哪里要调？"
    → 修正收敛

  入口 F：用户给 Figma URL
    → figma-to-code（MCP 提取 → spec → 代码）
    → 展示代码 + 截图对照
    → 🧑 Human Gate: "跟 Figma 设计稿对得上吗？"
    → 修正收敛


Phase 3: 设计决策门
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🧑 Human Gate:
  ┌──────────────────────────────────────────┐
  │  原型已就绪，下一步：                       │
  │                                           │
  │  A. 设计打磨 → 再开发                      │
  │     critique 评审 → 按清单修正 → 再开发     │
  │                                           │
  │  B. 直接开发 → 看效果                       │
  │     先跑起来，后续按需打磨                   │
  │                                           │
  │  C. 挑选打磨                               │
  │     只做特定维度（如只改排版、只调配色）      │
  └──────────────────────────────────────────┘

  → 选 A：进入 Phase 3A
  → 选 B：跳到 Phase 4
  → 选 C：bootstrap 路由到用户指定的 skill


Phase 3A: 设计打磨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  design-critique（评审模式）
    → 产出优先级问题清单
    → 🧑 Human Gate: "哪些问题你认同？要修哪些？"
    → bootstrap 根据用户选择路由到执行层 skill

  执行建议顺序（非强制）：
    token → typeset → layout → colorize/animate → adapt
      → a11y → harden → audit

  每个执行 skill 完成后：
    → 展示修改 diff
    → 🧑 Human Gate: "这个改动满意吗？"

  --verify 触发条件（三选一，先满足哪个就触发）：
    a. critique_issues.remaining 为空（所有 accepted issue 都已被执行 skill 处理）
    b. 用户主动说"都改完了"或"可以验证了"
    c. bootstrap 检测到 executed 列表覆盖了 accepted issues 对应的所有 skill 类型

  → design-critique --verify（验证模式）
  → 🧑 Human Gate: "验证通过，继续开发？"


Phase 4: 开发实施
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  design-plan
    → 读取 spec + 当前代码
    → 写 bite-sized 任务列表（每个任务 2-5 分钟）
    → 展示完整计划
    → 🧑 Human Gate: "计划 OK？"

  选择执行方式：
    → Subagent 驱动：每个任务独立 agent + 两阶段 review
    → Inline 执行：批量执行 + checkpoint

  每个任务完成后：
    → 展示实现结果
    → 🧑 Human Gate: "任务 N 结果 OK？"

  design-review
    → 代码审查（spec 合规 → 代码质量两阶段）
    → 🧑 Human Gate: "review 意见你认同哪些？"


Phase 5: 交付
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  design-finish
    → 验证测试通过
    → 🧑 Human Gate:
      A. 合并到主分支
      B. 创建 PR
      C. 保持当前状态
      D. 丢弃重来
    → 执行用户选择
    → 清理工作区
```

### 4.2 入口独立性

每个入口（A-F）都是独立可用的：
- 用户可以只跑 essence 看看灵感，不做后续
- 用户可以直接跳到 analysis，不需要先跑 essence
- 用户可以直接给 spec 跑 prototype，不需要先做 analysis
- 用户可以只跑 critique 看问题，不做修复
- 任何阶段都可以停下来，不强制走完全流程

### 4.3 Human Gate 的设计原则

1. **每个 gate 只问一个问题** — 不堆叠多个决策
2. **优先提供选项** — 多选优于开放式提问
3. **展示后再问** — 先让用户看到产出，再问是否满意
4. **修正要收敛** — 1-2 轮修正后收敛，不无限循环
5. **允许跳过** — 用户说"跳过"就跳过，不强制

---

## 5. Session State Management

### 5.1 问题

19 个 skill 的完整流程大概率跨会话。Agent 对话上下文在新会话中丢失，导致：
- 不知道上次执行到哪一步
- 不知道设计方向（加法/减法）已确定
- 不知道哪些 skill 已经跑过

### 5.2 方案：`.super-design-state.json`

Bootstrap 在项目根目录维护一个轻量状态文件：

```json
{
  "version": 1,
  "created": "2026-04-14T10:30:00Z",
  "updated": "2026-04-14T15:45:00Z",
  "phase": "3A",
  "direction": "additive",
  "specs": [
    {
      "type": "analysis",
      "file": "awwwards-design-spec.md",
      "created": "2026-04-14T10:30:00Z"
    }
  ],
  "executed": [
    {
      "skill": "design-essence",
      "timestamp": "2026-04-14T10:15:00Z",
      "status": "completed"
    },
    {
      "skill": "design-analysis",
      "timestamp": "2026-04-14T10:30:00Z",
      "status": "completed"
    },
    {
      "skill": "design-prototype",
      "timestamp": "2026-04-14T11:00:00Z",
      "status": "completed"
    },
    {
      "skill": "design-critique",
      "timestamp": "2026-04-14T14:00:00Z",
      "status": "completed",
      "output": "critique-report.md"
    },
    {
      "skill": "design-typeset",
      "timestamp": "2026-04-14T15:45:00Z",
      "status": "completed"
    }
  ],
  "critique_issues": {
    "total": 8,
    "accepted": 5,
    "resolved": 2,
    "remaining": ["layout-rhythm", "color-contrast", "responsive-nav"]
  },
  "plan": {
    "file": "docs/super-design/plans/2026-04-14-prototype-impl.md",
    "total_tasks": 12,
    "completed_tasks": 0
  }
}
```

### 5.3 状态管理规则

1. **Bootstrap 在每次会话启动时读取** `.super-design-state.json`
2. **每个 skill 完成后，bootstrap 更新**状态文件
3. **direction 一旦设置，切换需要 human 确认**
4. **用户可以手动重置**：删除文件即重置所有状态
5. **文件应加入 `.gitignore`** — 这是工作状态，不是项目内容

### 5.4 方向互斥的执行层保障

```
当 direction = "subtractive" 时：
  用户请求 animate 或 colorize →
  bootstrap 读取状态 →
  警告："当前设计方向是减法（已执行 distill）。
        animate 是加法操作，可能与 distill 的产出冲突。
        确定要切换方向吗？这会覆盖 distill 的部分产出。"
  → 🧑 Human Gate: 确认 or 取消

当 direction = "additive" 时：
  用户请求 distill →
  同理警告
```

---

## 6. Skill Definitions

### 6.1 Bootstrap

#### super-design

```yaml
name: super-design
description: "Use when starting any design work — creating UI, analyzing websites, building prototypes, or improving design quality. Routes to appropriate design skills and manages session state."
```

**职责：**
- Session 启动时注入（通过 hooks/session-start）
- 读取 `.super-design-state.json` 恢复会话状态
- 根据用户意图路由到正确的 skill
- 在 critique 产出问题清单后，路由到具体执行 skill
- 维护 direction 和 executed 状态
- 管理方向互斥警告

**路由逻辑：**

| 用户意图 | 路由到 |
|---------|--------|
| "看看这个网站" / "这个网站好在哪" | design-essence |
| "分析/拆解这个网站" | design-analysis |
| "复刻这个网站" | design-analysis → design-prototype |
| "做一个 XXX" / 从零开始 | design-brainstorm |
| "根据 spec 生成原型" | design-prototype |
| Figma URL | figma-to-code |
| "评审一下设计" | design-critique |
| "改一下排版/布局/配色..." | 具体执行 skill |
| "做个开发计划" | design-plan |
| "提交/完成" | design-finish |

---

### 6.2 Reference-Free Zone

#### design-essence

```yaml
name: design-essence
description: "Use when user shares a website URL and wants to quickly understand its design strengths — what makes it good, its core creativity, whether it's worth deeper analysis. Keywords: 这个网站好在哪, 核心创意, 设计亮点, 灵感提取, 看看这个网站."
```

**输入：** 网站 URL（可选截图）
**输出：** 轻量创意报告（300-500 字）
**时间：** 5 分钟
**Human Gate：** 展示报告后询问 "描述准确吗？值得深入分析吗？"
**与 analysis 的关系：** 递进关系。essence 是快扫，觉得值得再用 analysis 深入。但用户可跳过 essence 直接用 analysis。

**核心流程：**
1. 源码快扫（前 500 行）
2. 寻找品牌理念 ↔ 交互形式的统一性（"那根线"）
3. 视觉感知（截图 or DOM 推断）
4. 创意拆解（为什么不普通）
5. 输出报告 + 判断建议

---

#### design-analysis

```yaml
name: design-analysis
description: "Use when user wants a full design extraction of a website — complete technical and experiential teardown for reproduction or deep understanding. Keywords: 分析网站, 提取设计, 复刻, 设计拆解, DESIGN.md, 这个效果怎么实现的."
```

**输入：** 网站 URL（可选截图）
**输出：** 双层设计 Spec（13 section，Markdown）
**时间：** 30 分钟
**Human Gate：** 展示"视觉理解描述"后询问 "这段描述跟你看到的网站一样吗？哪里不对？"

**Spec 结构（13 Section）：**

体验层：
- 零、视觉理解（逐屏描述，标准：画家能据此画出来）
- 一、技术栈

Token 层：
- 二、视觉主题与氛围
- 三、色彩系统
- 四、字体系统
- 五、组件样式
- 六、布局原则
- 七、深度与层级

体验层续：
- 八、核心交互模式
- 九、动画编排
- 十、响应式策略

推断层：
- 十一、Do's and Don'ts
- 十二、设计哲学总结

附录：Agent 快速参考

**提取流程（5 Phase）：**
1. 源码获取
2. Token 层自动提取
3. 体验层分析提取
4. 截图交叉校正
5. Human-in-the-Loop 修正

---

#### design-prototype

```yaml
name: design-prototype
description: "Use when user has a design spec (from design-analysis or self-written) and wants to generate a runnable frontend prototype. Keywords: 根据 spec 生成, 复刻, 生成原型, 做一个类似的, 还原效果."
```

**输入：** 13 section 双层设计 Spec（来自 design-analysis 或 design-brainstorm，格式统一）
**输出：** 可运行的前端原型（React JSX）
**Human Gate：** 展示原型 + 实现/差距说明，询问 "原型感觉对吗？"

**输入格式：** prototype 只接受 13 section 双层 Spec 格式。无论 spec 来自 analysis（提取）还是 brainstorm（构思），prototype 的读取逻辑相同。如果用户给的是自由格式描述，prototype 应提示用户先跑 brainstorm 产出标准 spec。

**Spec 读取优先级：**
1. Agent 快速参考 → 核心设计体验 → Do's and Don'ts（建立方向感）
2. 色彩系统 → 字体系统 → 布局原则（搭骨架）
3. 核心交互模式 → 动画编排 → 逐屏视觉描述（做核心体验）
4. 组件样式 → 深度与层级 → 响应式策略（打磨细节）

**薄 section 处理：** brainstorm 产出的 spec 可能某些 Token 层 section 较薄（如无精确色值，只有方向描述）。prototype 遇到薄 section 时，根据 Quick Reference 和视觉理解描述自行推导具体值，并在输出中标注"[推导值]"。

**实现策略：**
- 惊艳感优先于完整性（3 个精致 section > 10 个粗糙 section）
- SVG 是替代品不是复制品
- 诚实标注差距（Lottie 简化了、scroll-driven 省略了）

**路由规则：** 如果用户直接给 URL 要求"复刻"，建议先跑 design-analysis 产出 spec。Spec 是分析和生成之间的质量桥梁。

---

#### figma-to-code

```yaml
name: figma-to-code
description: "Use when user provides a Figma URL and wants to convert designs to frontend code. Keywords: Figma, 设计稿转代码, figma.com/design, 组件实现."
```

**输入：** Figma URL（fileKey + nodeId）
**输出：** 组件代码 + Token 文件 + Spec
**Human Gate：** 展示代码 + 截图对照，询问 "跟 Figma 设计稿对得上吗？"

**工作流：**
1. 解析 URL → get_metadata（了解结构）
2. 定位目标组件 → get_design_context（提取数据）
3. 整理为结构化 Spec（Token + Props + Structure）
4. 适配项目技术栈 → 生成代码
5. 截图对照验证

**MCP 工具依赖：**
- `get_metadata` — 获取文件结构树
- `get_design_context` — 核心工具，获取参考代码 + Token + 截图
- `get_screenshot` — 获取渲染截图
- `get_variable_defs` — 获取变量定义
- `search_design_system` — 搜索组件/变量/样式

---

#### design-brainstorm

```yaml
name: design-brainstorm
description: "Use when user wants to design something from scratch — no reference website, no existing spec. Explores intent, proposes approaches, builds design through collaborative dialogue. Keywords: 做一个, 设计一个, 从零开始, 新项目."
```

**输入：** 用户的设计意图（可模糊）
**输出：** 设计 Spec 文档（复用 design-analysis 的 13 section 结构，见下方格式说明）
**Human Gate：** 贯穿整个过程——每个问题、每个方案、每个 section 都有确认

**流程（对标 superpowers:brainstorming）：**
1. 探索项目上下文（文件、文档、近期提交）
2. 逐个提问，理解目的/约束/成功标准（一次一个问题，优先多选）
3. 提出 2-3 种方案 + 权衡分析 + 推荐
4. 逐 section 展示设计，每个 section 后确认
5. 写设计文档并保存
6. Spec 自检（占位符、矛盾、模糊）
7. 🧑 用户 review spec
8. 过渡到 design-plan

**Hard Gate：** 设计未被用户批准前，不写任何代码、不执行任何实现操作。

**输出格式统一：** brainstorm 产出复用 design-analysis 的 13 section 双层 Spec 结构，确保 design-prototype 有统一的输入格式。区别在于来源不同：

| Section | analysis（从网站提取） | brainstorm（从零构思） |
|---------|---------------------|---------------------|
| 零、视觉理解 | 从网站源码+截图提取 | 由用户和 agent 共同构思 |
| 一、技术栈 | 从源码识别 | 由用户指定或 agent 推荐 |
| 二～七（Token 层） | 从源码精确提取 | 由 agent 根据设计方向生成 |
| 八～九（交互/动画） | 从源码分析 | 由用户描述 + agent 设计 |
| 十、响应式 | 从源码提取 | 由 agent 根据目标设备推荐 |
| 十一、Do's/Don'ts | 从有/无模式推断 | 由设计方向约束推导 |
| 十二、设计哲学 | 从整体提炼 | 由 brainstorm 对话直接产出 |
| 附录：Quick Ref | 汇总提取数据 | 汇总构思数据 |

某些 section 在 brainstorm 场景下可能较薄（如没有源码可提取的 Token 精确值），但结构保持完整，让 prototype 不需要判断输入来自哪个 skill。

---

### 6.3 Process Control

#### design-plan

```yaml
name: design-plan
description: "Use when you have an approved design spec and need to create a step-by-step implementation plan before writing code."
```

**输入：** 已批准的设计 Spec
**输出：** 实施计划文档（bite-sized 任务列表）
**Human Gate：** 展示计划后询问 "计划 OK？选择执行方式？"

**任务粒度：** 每个任务 2-5 分钟，每个步骤是一个动作。

**任务结构：**
```markdown
### Task N: [组件名]
**Files:**
- Create: `exact/path/to/file.tsx`
- Modify: `exact/path/to/existing.tsx:123-145`
- Test: `tests/exact/path/to/test.tsx`

- [ ] Step 1: 写失败测试
- [ ] Step 2: 运行确认失败
- [ ] Step 3: 写最小实现
- [ ] Step 4: 运行确认通过
- [ ] Step 5: 提交
```

**无占位符规则：** 每个步骤必须包含实际内容。禁止 "TBD"、"TODO"、"类似 Task N"。

**执行交接：**
- Subagent 驱动（推荐）：每个任务独立 agent + 两阶段 review
- Inline 执行：批量执行 + checkpoint

**Open Question — Subagent 执行模式：** 以下细节 defer 到实现阶段定义：
- Subagent 生命周期管理（每个任务创建新 agent，任务完成后销毁）
- 上下文传递方式（plan 全文 vs 单任务摘录 + 项目上下文）
- 失败后的重试策略（自动重试 vs 报告给 human 决定）
- Subagent 与 bootstrap session state 的同步机制
- 两阶段 review 的 reviewer agent 是否复用同一个 agent

实现时参考 superpowers:subagent-driven-development 的模式，但需要适配 super-design 的 session state 管理。

---

#### design-review

```yaml
name: design-review
description: "Use when implementation tasks are complete and code needs review against the design spec."
```

**输入：** 已完成的代码 + 原始 Spec
**输出：** Review 报告
**Human Gate：** 展示 review 意见后询问 "哪些意见你认同？"

**两阶段 Review：**
1. **Spec 合规检查** — 实现是否符合设计 spec 的要求？
2. **代码质量检查** — 实现本身的工程质量如何？

规则：先过 spec 合规，再看代码质量。Spec 合规未通过不进行代码质量 review。

---

#### design-finish

```yaml
name: design-finish
description: "Use when all implementation and review is complete, ready to deliver or merge."
```

**输入：** 已通过 review 的代码
**输出：** 执行用户选择的交付动作
**Human Gate：**
```
A. 合并到主分支
B. 创建 PR
C. 保持当前状态
D. 丢弃重来
```

**流程：**
1. 验证测试通过
2. 确定 base branch
3. 展示 4 个选项（不多不少）
4. 执行用户选择
5. 清理工作区

---

### 6.4 Reference-Guided Zone

#### design-critique

```yaml
name: design-critique
description: "Use when an existing UI needs design review — identifying quality issues, anti-patterns, and improvement opportunities. Supports --verify mode for post-fix validation."
```

**输入：** 已有的 UI 代码 / 运行中的页面
**输出：** 优先级问题清单
**可引用：** `reference/*.md`（typography, color, spatial, motion, interaction, responsive）
**Human Gate：** 展示问题清单后询问 "哪些问题你认同？要修哪些？"

**两种模式：**
- **评审模式**（默认）：全面检查，产出问题清单
- **验证模式**（`--verify`）：针对之前的问题清单，验证已修复的项目

**评审不执行。** critique 只诊断，不修复。它不了解下游 skill 的存在。问题清单交给 bootstrap 做路由。

---

#### design-token

```yaml
name: design-token
description: "Use when a project needs a unified design token system — extracting, organizing, and maintaining color, typography, spacing, and shadow variables from existing code."
```

**输入：** 用户项目的现有代码
**输出：** 结构化的 token 体系（CSS variables / JS constants / JSON）
**可引用：** `reference/*.md`（用于 token 组织建议）
**Human Gate：** 展示提取的 token 表后询问 "这些 token 覆盖全了吗？命名合理吗？"

**产出被以下 skill 消费：**
- design-typeset（字体 token）
- design-colorize（色彩 token）
- design-layout（间距 token）
- design-adapt（响应式 token）

---

#### design-typeset

```yaml
name: design-typeset
description: "Use when typography needs fixing — font hierarchy unclear, sizes too close, poor readability, inconsistent type scale."
```

**输入：** UI 代码 + token（如有）
**输出：** 排版修正（字体层级、字号、行高、字重）
**可引用：** `reference/typography.md`
**Human Gate：** 展示修改 diff 后询问 "排版改动满意吗？"

---

#### design-layout

```yaml
name: design-layout
description: "Use when layout needs fixing — spacing inconsistent, visual rhythm flat, alignment issues, grid problems."
```

**输入：** UI 代码 + token（如有）
**输出：** 布局修正（间距、对齐、网格、视觉节奏）
**可引用：** `reference/spatial-design.md`
**Human Gate：** 展示修改 diff 后询问 "布局改动满意吗？"

---

#### design-colorize

```yaml
name: design-colorize
description: "Use when color needs work — palette lacks cohesion, poor contrast, no brand presence, neutrals feel dead."
```

**输入：** UI 代码 + token（如有）
**输出：** 配色修正（调色板、对比度、品牌色、中性色调和）
**可引用：** `reference/color-and-contrast.md`
**Human Gate：** 展示修改 diff 后询问 "配色改动满意吗？"
**方向标记：** additive（与 distill 互斥）

---

#### design-animate

```yaml
name: design-animate
description: "Use when UI feels static and needs purposeful motion — transitions, entrances, state changes, micro-interactions."
```

**输入：** UI 代码
**输出：** 动效添加（过渡、入场、状态变化）
**可引用：** `reference/motion-design.md`
**Human Gate：** 展示修改 diff 后询问 "动效改动满意吗？"
**方向标记：** additive（与 distill 互斥）

---

#### design-distill

```yaml
name: design-distill
description: "Use when UI feels cluttered, over-designed, or needs ruthless simplification — strip to essence."
```

**输入：** UI 代码
**输出：** 精简后的 UI（移除冗余、简化结构）
**可引用：** `reference/*.md`（用于判断什么是"必要的"）
**Human Gate：** 展示修改 diff 后询问 "精简改动满意吗？是否过度精简？"
**方向标记：** subtractive（与 animate/colorize 互斥）

---

#### design-adapt

```yaml
name: design-adapt
description: "Use when UI needs responsive adaptation — mobile, tablet, different viewports, container-level responsiveness."
```

**输入：** UI 代码
**输出：** 响应式适配（断点、容器查询、触控适配）
**可引用：** `reference/responsive-design.md`
**Human Gate：** 展示各断点效果后询问 "响应式效果满意吗？"

**注意：** adapt 的产出可能引入新的 a11y 问题（触控目标大小、折叠菜单键盘导航）。如果后续 a11y 发现 adapt 相关问题，需要回到 adapt 修正后重跑 a11y 该条目。这是一个有界循环，不会无限迭代。

---

#### design-a11y

```yaml
name: design-a11y
description: "Use when UI needs accessibility review — WCAG compliance, color contrast, keyboard navigation, screen reader support, focus management, ARIA."
```

**输入：** UI 代码
**输出：** 无障碍修正
**可引用：** `reference/*.md`（对比度等）
**Human Gate：** 展示 a11y 问题清单后询问 "哪些要修？"

**与 adapt 的循环依赖：** a11y 可能发现 adapt 引入的问题（如移动端触控目标过小）。此时 a11y 标记该问题需要 adapt 修正，bootstrap 路由回 adapt，修正后重跑 a11y 该条目。循环有界——只针对 adapt 相关条目，不重做全部 a11y。

---

#### design-harden

```yaml
name: design-harden
description: "Use when UI needs resilience — error states, empty states, loading states, boundary conditions, i18n, long text, missing data."
```

**输入：** UI 代码
**输出：** 健壮性增强
**可引用：** `reference/interaction-design.md`
**Human Gate：** 展示边界状态处理后询问 "边界处理满意吗？"

**范围：** 错误处理、边界状态、i18n。不包含 a11y（独立 skill）和技术性能（audit 负责）。

---

#### design-audit

```yaml
name: design-audit
description: "Use when code needs technical quality review — performance, bundle size, rendering efficiency, code duplication, best practices."
```

**输入：** UI 代码
**输出：** 技术质量报告 + 修复建议
**可引用：** `reference/*.md`
**Human Gate：** 展示技术问题清单后询问 "哪些要修？"

**与 harden 的区别：**
- audit 检查"代码写得好不好"（性能、bundle、重复代码）
- harden 检查"极端情况撑不撑得住"（错误、边界、i18n）

---

## 7. Inter-Skill Relationships

### 7.1 依赖关系

```
design-essence ─── 推荐 ───→ design-analysis（递进，非强制）
design-analysis ── 产出 spec ──→ design-prototype（消费 spec）
design-brainstorm ─ 产出 spec ──→ design-plan（消费 spec）
design-critique ── 产出清单 ──→ bootstrap 路由 → 执行层 skill
design-token ──── 产出变量表 ──→ typeset / colorize / layout / adapt
design-plan ───── 产出任务 ──→ 执行（subagent 或 inline）
design-adapt ←── 有界循环 ───→ design-a11y
```

### 7.2 互斥关系

```
design-distill（减法） ←── 方向互斥 ───→ design-animate（加法）
design-distill（减法） ←── 方向互斥 ───→ design-colorize（加法）
```

互斥由 bootstrap 通过 session 状态管理执行。切换方向需要 human 确认。

### 7.3 执行建议顺序

```
critique → token → typeset → layout → colorize/animate → adapt → a11y → harden → audit
                                                           ↑       │
                                                           └───────┘
                                                        有界循环（仅 adapt 相关条目）
```

这是建议顺序，非强制。用户可以按需跳过或重排。

---

## 8. Build System

### 8.1 设计理念

借鉴 impeccable 的构建系统：**单一来源（source/skills/）编译到多 provider 产出（dist/）**。

### 8.2 目录结构

```
super-design/
├── source/
│   └── skills/                      # 单一来源
│       ├── super-design/SKILL.md
│       ├── design-essence/SKILL.md
│       ├── design-analysis/SKILL.md
│       ├── design-prototype/SKILL.md
│       ├── figma-to-code/SKILL.md
│       ├── design-brainstorm/SKILL.md
│       ├── design-plan/SKILL.md
│       ├── design-review/SKILL.md
│       ├── design-finish/SKILL.md
│       ├── design-critique/
│       │   ├── SKILL.md
│       │   └── reference/
│       │       ├── typography.md
│       │       ├── color-and-contrast.md
│       │       ├── spatial-design.md
│       │       ├── motion-design.md
│       │       ├── interaction-design.md
│       │       └── responsive-design.md
│       ├── design-token/SKILL.md
│       ├── design-typeset/SKILL.md
│       ├── design-layout/SKILL.md
│       ├── design-colorize/SKILL.md
│       ├── design-animate/SKILL.md
│       ├── design-distill/SKILL.md
│       ├── design-adapt/SKILL.md
│       ├── design-a11y/SKILL.md
│       ├── design-harden/SKILL.md
│       └── design-audit/SKILL.md
│
├── scripts/
│   ├── build.js                     # 主构建脚本
│   └── lib/
│       ├── utils.js                 # frontmatter 解析、placeholder 替换
│       ├── shared.js                # 共享 utilities
│       └── transformers/
│           ├── factory.js           # 配置驱动的 transformer 工厂
│           ├── providers.js         # provider 配置表
│           └── overrides/           # per-provider 重逻辑
│               ├── cursor.js
│               ├── gemini.js
│               └── ...
│
├── dist/                            # 构建产物（git ignored）
│   ├── cursor/.cursor/skills/
│   ├── claude-code/.claude/skills/
│   ├── gemini/.gemini/skills/
│   ├── codex/.codex/skills/
│   ├── agents/.agents/skills/
│   ├── kiro/.kiro/skills/
│   ├── opencode/.opencode/skills/
│   └── ...
│
├── hooks/
│   ├── session-start                # 注入 super-design bootstrap
│   └── hooks.json
│
├── source/
│   └── plugin-manifest.json         # manifest 模板（含 placeholder）
│
├── .claude-plugin/
│   └── plugin.json                  # 构建产物副本，方便本地开发测试
│
├── package.json
└── .gitignore                       # 包含 dist/ 和 .super-design-state.json
```

### 8.3 Placeholder 系统

借鉴 impeccable 的 placeholder 机制，在构建时替换 provider 相关内容：

| Placeholder | 含义 | Claude Code | Cursor | Gemini |
|-------------|------|-------------|--------|--------|
| `{{model}}` | 模型名 | Claude | Claude | Gemini |
| `{{config_file}}` | 配置文件 | CLAUDE.md | .cursorrules | GEMINI.md |
| `{{command_prefix}}` | 命令前缀 | / | / | / |
| `{{ask_instruction}}` | 提问方式 | Ask the user | Ask the user | Ask the user |

### 8.4 Frontmatter 规范

```yaml
---
name: skill-name                    # 必须：letters, numbers, hyphens
description: "Use when..."         # 必须：触发条件，不描述流程
user-invocable: true               # 可选：是否可被用户直接调用
argument-hint: "[target]"          # 可选：CLI 参数提示
---
```

### 8.5 Provider 配置

```javascript
// scripts/lib/transformers/providers.js
export const providers = {
  'claude-code': {
    provider: 'claude-code',
    configDir: '.claude',
    displayName: 'Claude Code',
    frontmatterFields: ['user-invocable', 'argument-hint'],
  },
  cursor: {
    provider: 'cursor',
    configDir: '.cursor',
    displayName: 'Cursor',
    frontmatterFields: [],
  },
  gemini: {
    provider: 'gemini',
    configDir: '.gemini',
    displayName: 'Gemini',
    frontmatterFields: [],
  },
  // ... 更多 provider
};
```

### 8.6 构建流程

```
bun run build
  1. 读取 source/skills/ 下所有 skill
  2. 解析 frontmatter + body
  3. 对每个 provider：
     a. 替换 frontmatter placeholder
     b. 替换 body placeholder ({{model}}, {{command_prefix}}, ...)
     c. 应用 provider overrides（如有）
     d. 复制 reference/ 文件到共享位置（见下方路径策略）
     e. 重写 skill body 中的 reference 路径为构建后的相对路径
     f. 写入 dist/<provider>/
  4. 验证：
     a. Reference-Free Zone skill 不含 reference/ 引用
     b. 所有 skill 的 description 以 "Use when" 开头
     c. name 只含 letters, numbers, hyphens
     d. 所有 reference 引用路径在构建后的目录结构中可解析
```

### 8.7 Reference 路径策略

**问题：** source 中 reference/ 文件存放在 `design-critique/reference/` 下，其他 skill（typeset、layout、colorize 等）通过相对路径引用。构建后目录结构变化，相对路径可能断裂。

**方案：** 构建时将 reference/ 文件复制到每个 provider 的共享位置，并重写引用路径。

```
构建前（source/）：
  design-critique/reference/typography.md
  design-typeset/SKILL.md  → 引用 ../design-critique/reference/typography.md

构建后（dist/claude-code/）：
  .claude/skills/design-critique/reference/typography.md  ← 原样复制
  .claude/skills/design-typeset/SKILL.md                  ← 路径已重写

路径重写规则：
  源文件中的 ../design-critique/reference/xxx.md
  → 构建后重写为 ../design-critique/reference/xxx.md
  （如果 provider 的目录结构保持 skill 平级，路径不变）
  （如果 provider 的目录结构不同，由 overrides/ 负责路径映射）
```

**构建验证步骤 4d：** 对每个构建后的 skill 文件，扫描 `reference/` 引用，检查目标文件在构建产物中是否存在。不存在则构建失败。

---

## 9. Plugin Manifest

Plugin manifest 是 **per-provider 的**，由构建系统生成到 `dist/<provider>/` 下，不存放在 source 根目录。

**Source 模板**（`source/plugin-manifest.json`）：

```json
{
  "name": "super-design",
  "description": "Full-lifecycle design skills: research, extraction, prototyping, quality polishing, and development. 19 skills with human-in-the-loop workflow.",
  "version": "1.0.0",
  "author": {
    "name": "Bruce"
  },
  "repository": "",
  "skills": "{{skills_path}}",
  "hooks": "{{hooks_path}}"
}
```

**构建时替换：**

| Provider | `{{skills_path}}` | 输出位置 |
|----------|-------------------|---------|
| Claude Code | `./.claude/skills` | `dist/claude-code/.claude-plugin/plugin.json` |
| Cursor | `./.cursor/skills` | `dist/cursor/.cursor-plugin/plugin.json` |
| Gemini | `./.gemini/skills` | `dist/gemini/.gemini/plugin.json` |
| ... | ... | ... |

开发时的 `.claude-plugin/plugin.json` 是 Claude Code 版本的构建产物副本，方便本地测试。

---

## 10. Implementation Priority

### Phase 1: 核心骨架（先跑通流程）
1. Bootstrap（super-design）+ session state
2. design-essence
3. design-analysis
4. design-prototype
5. Build system（至少支持 Claude Code）

> **Phase 1 限制：** 此阶段只能跑"有参考网站"的流程（essence → analysis → prototype）。"从零开始"的原创流程需要 Phase 2 的 design-brainstorm。这是有意的 MVP 取舍——先验证提取→复刻的核心通路，再扩展到原创场景。

### Phase 2: 原创入口 + 开发流程
6. design-brainstorm
7. design-plan
8. design-review
9. design-finish

### Phase 3: 设计打磨
10. design-critique
11. design-token
12. reference/*.md 文件
13. design-typeset / layout / colorize / animate / distill / adapt

### Phase 4: 质量保障
14. design-a11y
15. design-harden
16. design-audit

### Phase 5: 多 provider
17. 完善 build system
18. 支持 Cursor / Gemini / Codex / 其他 provider
19. figma-to-code
