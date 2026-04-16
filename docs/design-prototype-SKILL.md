---
name: design-prototype
description: 根据设计 spec 生成网站原型。当用户已有 design-analysis skill 产出的双层 Spec（或自写设计描述），想要据此生成可运行的前端原型时，触发此 skill。关键词包括：根据 spec 生成、复刻、生成原型、做一个类似的、按这个风格做、design prototype、生成设计、还原效果。也适用于"根据这个来复刻"、"试一下生成"、"做一个原型"等场景。此 skill 只负责根据已有 spec 生成代码，不负责分析网站——分析由 design-analysis skill 处理。如果用户直接给 URL 要求复刻，应先建议运行 design-analysis 产出 spec。
---

# Design Prototype — 基于双层 Spec 的设计原型生成

## 目标

输入一份双层设计 Spec（来自 design-analysis skill），输出可运行的前端原型（React JSX），还原核心设计模式和视觉体验。

目标是**设计模式级还原**——抓住最惊艳的设计策略，用可行技术实现 80% 效果。不追求像素级复刻。

---

## 读取 Spec 的优先级策略

Spec 有 13 个 section，生成时按以下顺序读取：

### 第一优先：建立整体感（读 30 秒就开始有方向）
1. **附录：Agent 快速参考** → 5 色、2 字体、关键尺寸、风格一句话
2. **零：核心设计体验** → 理解"这个网站在表达什么"
3. **十一：Do's and Don'ts** → 知道什么绝对不能做

### 第二优先：搭骨架
4. **三：色彩系统** → 定义所有颜色变量
5. **四：字体系统** → 选 Google Fonts 替代 + 定义层级
6. **六：布局原则** → Grid + 间距 + 最大宽度

### 第三优先：做核心体验
7. **八：核心交互模式** → 按惊艳度排序实现
8. **九：动画编排** → 能做的做，不能做的简化标注
9. **零：逐屏视觉描述** → 按顺序构建每个 section

### 第四优先：打磨细节
10. **五：组件样式** → 按钮、卡片、导航的精确样式
11. **七：深度与层级** → 阴影和 z-index
12. **十：响应式策略** → clamp 和 flex-wrap

### 可跳过
13. **二：视觉主题与氛围** → 已被"核心设计体验"覆盖
14. **一：技术栈** → 参考但不复制原技术栈
15. **十二：设计哲学** → 已内化到实现中

---

## 实现策略

### Token 系统搭建

从 spec 的 Token 层直接转译：

```javascript
// 从 Section 三（色彩）
const colors = {
  primary: "#xxx",      // spec 中的 primary
  secondary: "#xxx",    // spec 中的 secondary
  accent: "#xxx",       // spec 中的 accent
  bg: "#xxx",           // spec 中的主背景
  surface: "#xxx",      // spec 中的卡片/浮层色
  text: "#xxx",         // spec 中的主文字色
  textMuted: "#xxx",    // spec 中的次文字色
  // 分区配色（如有）
  sections: {
    hero: { bg: "#xxx", text: "#xxx" },
    // ...
  }
};

// 从 Section 四（字体）
// → 在组件顶部加 Google Fonts <link>
// 字体替代策略：
//   压缩斜体 → Bebas Neue / Anton
//   圆润膨胀 → Lilita One / Boogaloo / Bubblegum Sans
//   手绘感 → Caveat / Patrick Hand
//   现代精致 → DM Sans / Outfit / Satoshi（如 Google Fonts 有）
//   等宽/技术感 → JetBrains Mono / Fira Code

// 从 Section 六（布局）
const layout = {
  maxWidth: 1400,       // spec 中的 max-width
  grid: 12,             // spec 中的列数
  gap: "1.25rem",       // spec 中的 gap
  spacingUnit: "1rem",  // spec 中的基础间距
};

// 从 Section 七（深度）
const shadows = {
  sm: "spec 中的 sm shadow",
  md: "spec 中的 md shadow",
  lg: "spec 中的 lg shadow",
};
```

### 核心交互实现

读 Section 八，按优先级表实现：

**⭐⭐⭐ 必须实现（定义性体验）：**
- 核心交互模式的完整状态管理 + 动画 + 事件
- 配色系统和分区策略
- 排版层级的视觉冲击力

**⭐⭐ 尽量实现（差异化细节）：**
- 微交互（按钮形变、文字 hover、sticker 浮动）
- 简化版视差（scrollY 监听）
- 装饰元素

**⭐ 简化或标注（锦上添花）：**
- Lottie → 静态 SVG + CSS animation 模拟
- 物理引擎 → CSS transition 近似
- 音效 → 省略，注释标注
- 复杂 scroll-driven → 状态切换 + transition

### SVG 组件构建

根据 spec 逐屏描述中的视觉元素，创建简化 SVG 组件：

```
原站手绘角色 → 简化几何 SVG 传达同样风格语言
原站 Lottie 运动员 → 静态方块人 SVG + bobble/rotate CSS animation
原站照片 → 渐变色块 + 文字标签占位
原站视频 → 深色背景 + "▶ Video" 标签
```

重点：**风格一致性比精确度更重要**。所有 SVG 组件要用同一套视觉语言（同样的圆角、同样的色彩饱和度、同样的线条粗细）。

### Section 组装

按 spec 的逐屏描述，从上到下构建：

```
1. 导航栏（fixed，可能多色版本）
2. Hero section（核心交互所在）
3. 各内容 section（按描述顺序）
4. 过渡区域（配色变化的衔接）
5. CTA / Join section
6. Footer
```

每个 section 自包含：背景色 + 内容 + 装饰 + 过渡。

### Do's and Don'ts 执行

生成过程中持续对照 Section 十一：

```
✅ DO "使用全大写粗体标题" → text-transform: uppercase; font-weight: 900
❌ DON'T "不要使用渐变背景" → 所有背景用纯色
❌ DON'T "不要使用通用素材图" → 用手绘 SVG 或色块占位
✅ DO "保持大量留白" → 各 section padding 加大
```

这一步经常被忽略，但对"感觉对不对"影响巨大。

---

## 技术约束（Artifact 环境）

### 可用
- React hooks（useState, useEffect, useRef, useCallback）
- Tailwind core utility classes
- Inline styles
- Google Fonts CDN
- cdnjs.cloudflare.com 外部库
- Lucide React 图标
- Recharts 图表
- SVG（inline）
- CSS @keyframes animation
- CSS transition
- CSS transform / perspective / backface-hidden

### 不可用
- localStorage / sessionStorage
- npm 包（除预装的）
- GSAP / Lottie player / Framer Motion
- 外部 JS 库（除 cdnjs 上的）
- `<form>` 标签

### 替代策略表

| 原站技术 | Artifact 替代 | 效果损失 |
|---------|-------------|---------|
| GSAP ScrollTrigger | scrollY + useEffect | pin 效果缺失，用自动轮播替代 |
| GSAP Draggable | onClick 切换 + 简单 onMouse 拖拽 | 物理惯性缺失 |
| Lottie 动画 | 静态 SVG + CSS @keyframes | 失去帧动画细节，保留运动感 |
| Matter.js | 省略 | 无物理碰撞效果 |
| Lenis 平滑滚动 | 原生 scroll | 滚动手感差异 |
| Swiper | CSS scroll-snap 或手写轮播 | 功能基本等价 |
| 音效 | 省略，注释标注 | 无声 |
| 视频背景 | 渐变 + 标签占位 | 无动态画面 |
| Three.js 3D | 省略或 CSS 3D transform | 大幅简化 |

---

## 质量检查清单

生成后逐项自检：

### 感觉层（最重要）
- [ ] 第一眼看上去"感觉对"——配色、字体、密度跟 spec 描述一致
- [ ] 核心交互可操作且流畅
- [ ] Do's and Don'ts 没有违反

### Token 层
- [ ] 所有颜色用 spec 中的精确色值
- [ ] 字体层级有明确的视觉差异（display ≠ body）
- [ ] 间距体系一致（不是随意的 padding 值）
- [ ] 圆角统一

### 体验层
- [ ] 最惊艳的 1-2 个交互模式已实现
- [ ] 各 section 配色过渡自然
- [ ] 装饰元素丰富度到位（不空荡）
- [ ] 动画节奏有呼吸感（不全静止也不全在动）

### 工程层
- [ ] 响应式可用（clamp + flex-wrap）
- [ ] 无 console 报错
- [ ] 动画不卡顿

---

## 输出要求

- 格式：`.jsx`（单文件 React 组件）
- 文件名：`[domain]-replica.jsx`
- 保存到：`/mnt/user-data/outputs/`
- 用 `present_files` 呈现

### 生成后必须说明

```
实现了的核心模式：
1. [模式名] — [一句话说明]
2. ...

与原站的主要差距：
1. [差距] — [原因]
2. ...

如需进一步还原，建议：
1. [下一步]
```

---

## 输入来源与路由

### 最佳输入：design-analysis spec 文件
- 读取 `/mnt/user-data/outputs/[domain]-design-spec.md`
- 按上述优先级策略读取各 section

### 可用输入：用户自写描述
- 需至少包含：视觉描述 + 配色 + 核心交互
- 信息不足时补问

### 路由规则
如果用户直接给 URL 要求"复刻"：
> 建议先跑 design-analysis 产出 spec，再基于 spec 生成。这样效果好很多——spec 是分析和生成之间的质量桥梁。要我先分析这个网站吗？

---

## 关键原则

1. **spec 是唯一输入。** 不参考原站源码——这验证 spec 质量。
2. **先看 Quick Reference 再动手。** 5 色 + 2 字体 + 风格一句话，30 秒建立方向感。
3. **Do's and Don'ts 全程执行。** 感觉对不对，80% 取决于"没做什么"。
4. **惊艳感优先于完整性。** 3 个精致 section > 10 个粗糙 section。
5. **SVG 是替代品不是复制品。** 同样的视觉语言，简化的几何表达。
6. **诚实标注差距。** 告诉用户 Lottie 简化了、scroll-driven 省略了。
7. **一次生成，迭代精修。** 第一版跑通核心模式，后续按反馈补细节。
