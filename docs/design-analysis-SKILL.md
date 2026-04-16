---
name: design-analysis
description: 网站设计模式全栈提取与分析。当用户提供一个网站 URL 并希望理解其设计风格、交互模式、视觉策略、技术实现时，触发此 skill。关键词包括：分析网站、提取设计、复刻、设计拆解、design analysis、网站是怎么做的、这个网站的设计、学习这个网站、借鉴、DESIGN.md、设计系统。也适用于用户说"看看这个网站"、"分析一下"、"拆一下"、"这个效果怎么实现的"等场景。此 skill 产出双层 Spec（Token 层 + 体验层），是 DESIGN.md 的超集。只负责分析产出 spec，不负责生成代码——生成部分由 design-prototype skill 处理。
---

# Design Analysis — 网站设计模式全栈提取

## 目标

输入一个网站 URL（可选配截图），输出一份**双层设计 Spec**：

- **Token 层**（兼容 Google Stitch DESIGN.md 格式）：色板、字体、组件、布局、阴影、响应式——可直接用于组件级生成
- **体验层**（独有能力）：视觉理解描述、交互模式、动画编排、设计哲学——用于页面级复刻

质量标准：一个没见过原站的人，读完 spec 后脑子里的画面应与实际网站 90%+ 吻合。

---

## Spec 输出结构（13 个 Section）

```markdown
# [网站名] - Design Spec

═══════════════════════════════════
体验层（Experience Layer）— 我们独有
═══════════════════════════════════

## 零、视觉理解（Visual Understanding）

### 核心设计体验
1-2 段话总结最核心的设计理念和最惊艳的交互。
不是描述"有什么"，而是"在表达什么"和"用什么方式表达"。
点明品牌理念与交互形式的统一性。

### 逐屏视觉描述
按滚动顺序，每屏用 [屏 N] 标记，描述：
- 背景色和整体色调
- 主要视觉元素（大小、位置、颜色、具体形态）
- 文字内容、字体风格、排版方式
- 交互行为（什么触发什么效果）
- 动画效果（什么在动、怎么动、节奏如何）

标准：**具体到画家能据此画出来**。
✗ "精美的动画效果"
✓ "scroll 到 30% 时，蓝色方块人从右侧以 ease-out 0.6s 滑入"

### 整体感受
一句话总结给人的感觉 + 与同类网站的差异化。

## 一、技术栈（Tech Stack）
| 层面 | 选型 | 识别依据 |

═══════════════════════════════════
Token 层（Token Layer）— 兼容 DESIGN.md
═══════════════════════════════════

## 二、视觉主题与氛围（Visual Theme & Atmosphere）
- 设计密度：稀疏 / 平衡 / 密集
- 情绪关键词：3-5 个（如 "温暖、包容、好玩、绘本感"）
- 表面风格：扁平 / 微质感 / 拟物 / 玻璃态
- 色调倾向：暖调 / 冷调 / 中性 / 多彩

## 三、色彩系统（Color Palette & Roles）
| 语义名称 | 色值 | 功能角色 | 使用场景 |
如有分区配色（不同 section 不同色系），单独列表说明。

## 四、字体系统（Typography Rules）
### 字体配对
- Display: [font-family] — 用途、风格感
- Body: [font-family] — 用途、风格感

### 字号层级表
| 级别 | 字号（clamp 值） | weight | spacing | transform | 用途 |
| XXL | clamp(x, y, z) | 900 | -0.02em | uppercase | 主标题 |
| ... | ... | ... | ... | ... | ... |

### 特殊排版手法
- 大小字同行混排的具体做法
- 散落字母的偏移/旋转参数
- Inline 元素（Lottie/图标）与文字的混排方式

## 五、组件样式（Component Patterns）
每个组件列出四态 CSS 伪代码：

### 按钮
```css
/* Primary */
.btn-primary {
  background: [色值];
  color: [色值];
  border-radius: [值];
  padding: [值];
  font: [值];
  transition: [值];
}
.btn-primary:hover { /* 变化 */ }
.btn-primary:active { /* 变化 */ }
/* 特殊行为：如 SVG path morphing pill→circle */
```

### 卡片
### 导航栏
### 链接/锚点
### 标签/徽章
### 输入框（如有）

## 六、布局原则（Layout Principles）
- Grid：[列数] 列，gap [值]
- 间距体系：[基础单位] 的倍数序列
- 最大宽度：[值]
- 留白哲学：大量留白 / 紧凑 / 区域性留白
- Section 间距模式：全屏段落 / 固定高度 / 内容撑高

## 七、深度与层级（Depth & Elevation）
| 层级 | box-shadow | 用途 |
| sm | [值] | 卡片默认 |
| md | [值] | hover 态 |
| lg | [值] | 浮层/modal |
z-index 策略：[描述]

═══════════════════════════════════
体验层续（Experience Layer cont.）
═══════════════════════════════════

## 八、核心交互模式（Interaction Patterns）
按惊艳度排序，每个模式包含：
- **模式名称**（如"万花筒旋转 Carousel"）
- **用户体验**：用户做什么 → 看到什么效果
- **实现机制**：DOM 结构 + CSS + JS 的配合
- **关键参数**：具体数值（角度、时长、缓动、阈值）
- **设计意图**：为什么用这个而不是更简单的方案

## 九、动画编排（Animation Choreography）
### Scroll-Driven
| 触发范围 | 效果 | pin | duration |

### Lottie 动画清单
| 位置 | JSON URL | autoplay | loop | duration | 内容描述（需截图确认） |

### 微交互
| 触发 | 效果 | 参数 |

### 页面转场
### 音效绑定（如有）
| 区域 | 音效文件 | 触发方式 |

## 十、响应式策略（Responsive Behavior）
- 断点：[值列表]
- Desktop → Tablet：[变化描述]
- Tablet → Mobile：[变化描述]
- 触摸目标最小尺寸：[值]
- 可见性切换：[.vw-desktop / .vw-mobile 等策略]

═══════════════════════════════════
推断层（Inference Layer）
═══════════════════════════════════

## 十一、Do's and Don'ts（设计护栏）

### ✅ DO（这个网站做了什么）
- [从实际模式中提取的积极规则]

### ❌ DON'T（这个网站刻意避免了什么）
- [从缺失模式中推断的消极规则]

推断逻辑：
- 没有 stock photo → DON'T 使用通用素材
- 没有渐变背景 → DON'T 使用渐变
- 没有传统网格 → DON'T 用规矩等分列
- 没有阴影 → DON'T 依赖阴影做层级
- 没有 serif 字体 → DON'T 混入衬线体
- 全大写文字 → DO 保持 uppercase transform

## 十二、设计哲学总结（Design Philosophy）
- 一句话核心理念
- 品牌与交互的统一性分析
- 可复用模式优先级表：
  | 优先级 | 模式 | 复用难度 | 效果冲击力 |

═══════════════════════════════════
附录
═══════════════════════════════════

## 附录：Agent 快速参考（Quick Reference）
供生成时快速查阅，不用翻完整 spec：
- 5 色速查：primary=#xxx, secondary=#xxx, accent=#xxx, bg=#xxx, text=#xxx
- 字体速查：display="xxx", body="xxx"
- 尺寸速查：radius=Xpx, spacing-unit=Xrem, max-width=Xpx
- 阴影速查：default="x x x rgba(...)"
- 风格一句话："[如：互动绘本风格，温暖包容，手绘SVG角色，万花筒旋转导航]"
```

---

## 提取流程

### Phase 1：源码获取

```bash
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" <URL>
```
403 则尝试 web_fetch。都失败告知用户。
保存 HTML 到 `/home/claude/` 供分析。

### Phase 2：Token 层自动提取

系统化扫描源码，按 section 填充：

**色彩**：
- `var(--color-xxx)` / `var(--xxx)` CSS 变量
- inline `fill="xxx"` / `background:` / `color:` 值
- class 语义色（`is-purple` / `bg-red`）
- 归纳为 "语义名 + 色值 + 角色" 表

**字体**：
- `font-family` 声明 + Google Fonts `<link>`
- 所有 `clamp()` / `font-size` 值 → 层级表
- `font-weight` / `letter-spacing` / `line-height` / `text-transform`

**组件**：
- `<button>` / `.btn` 的完整样式链
- `.card` 或带 `border-radius` + `box-shadow` 容器
- `<nav>` / `<header>` 结构 + 多色 logo 逻辑
- transition / hover 参数

**布局**：
- `grid-cols-` / `grid` / `gap`
- 反复出现的 padding/margin rem 值
- `max-width` 约束

**深度**：
- 所有 `box-shadow` 值
- `z-index` 使用模式

**响应式**：
- `@media` 断点
- Tailwind 断点 class
- `.vw-desktop` / `.vw-mobile` 可见性切换

### Phase 3：体验层分析提取

需要 agent 的理解和判断：

**视觉理解描述**：
- 基于 Token 层数据，构建自然语言逐屏描述
- 标准：画家能据此画出来

**交互模式**：
- `data-*` 属性 + JS 引用 → 推断交互行为
- scroll-driven：pin 容器（`height: xxxsvh` + `sticky`）
- drag：Draggable / `touch-action` / `cursor-grab`
- 3D：`perspective` + `backface-hidden`
- 鼠标跟随：`data-image-trail` / `data-sticker-cursor`
- clipPath 遮罩裁切

**动画编排**：
- Lottie：`data-src="xxx.json"` + `data-autoplay` + `data-loop` + `data-duration`
- CSS：`@keyframes` + `animation` 属性
- Scroll 触发：`data-w-id` + IX2 或 ScrollTrigger
- 转场：`data-transition-link` 结构
- 音效：`<audio>` 标签 + `data-sound-*` 绑定

**Do's and Don'ts**：
- DO：从实际模式提取
- DON'T：从**缺失**模式推断（关键洞察来源）

### Phase 4：截图交叉校正

**源码盲区清单**（必须靠截图补）：
1. 字体渲染形态（压缩/膨胀/手写感）
2. Lottie 动画内容（写实/抽象/几何方块）
3. 照片/图片具体画面
4. 配色整体氛围感
5. 多层合成效果

有截图 → 逐屏对比校正 → 更新 spec
无截图 → 标注 "~80% 准确度" + 列出盲区问题

### Phase 5：Human-in-the-Loop

展示"视觉理解描述"，只问：
**"这段描述跟你看到的网站一样吗？哪里不对？"**

1-2 轮修正收敛。完成标志：用户确认描述准确。

---

## 输出要求

- 格式：Markdown
- 文件名：`[domain]-design-spec.md`
- 保存到：`/mnt/user-data/outputs/`
- 用 `present_files` 呈现

---

## 关键原则

1. **Token 层精确，体验层生动。** 色值不能有误差；体验描述要有洞察。
2. **描述是质量阀门。** 描述不对，spec 再详细也没用。
3. **标注信息来源。** 每条关键信息标注 [源码] / [截图] / [推断]。
4. **Do's and Don'ts 是隐藏价值。** 设计精髓常在于"刻意不做什么"。
5. **Agent 快速参考必须填。** 这是生成时效率最高的入口。
6. **不生成代码。** 代码交给 design-prototype skill。
