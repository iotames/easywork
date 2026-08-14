# WHALE — 鲸鱼装饰插件使用说明

一个挂在 Web UI 浮动层（`shell.overlay`）下边缘的装饰性鲸鱼：在左右两边缘内来回滑动巡游，鼠标移上去暂停，点击会跃起并喷出一座多束喷泉水花，几秒后自行停止，可反复点击。

本文档把这段代码连同用法一起讲清楚，方便你把整个文件夹拿走另用。文件全部自包含，不依赖本仓库其它路径。

## 文件清单

`whaleui/` 目录整体搬走即可，全部文件：

| 文件 | 作用 |
|---|---|
| `WhaleOverlay.tsx` | 组件本体：悬停暂停 + 点击触发喷泉的 React 逻辑 |
| `WhaleOverlay.module.css` | 全部样式与动画：巡游、跃起、多束喷泉水花（纯 CSS） |
| `FishLogo.tsx` | 鲸鱼本体图标（一个 svg） |
| `icons/props.ts` | `FishLogo` 的 props 类型（图标组件共用） |
| `env.d.ts` | CSS Modules 的 TypeScript 类型声明，让 `tsc` 开箱即认 `*.module.css` |

这套文件已做成**自包含、相对导入**：`WhaleOverlay.tsx` 用 `./FishLogo`、`./WhaleOverlay.module.css` 相对导入，不再依赖任何 npm 包名。

如果只想要纯样式，单拿 `WhaleOverlay.module.css` 也能用——但组件 `WhaleOverlay.tsx` 依赖一个能渲染鲸鱼图形的组件（默认用 `FishLogo`）。

## 依赖

### 代码逻辑依赖

- **React**：`useState`、`useRef`、`useCallback`、`useEffect` —— 需使用方项目已装 `react`（peer dependency），并建议装 `@types/react`。
- **FishLogo**：同一目录的 `FishLogo.tsx`（已随目录打包），接受 `size?: number` 和 `className?: string`，`color` 走 `currentColor`，svg 自带 `aria-hidden`。
- **CSS Modules**：`WhaleOverlay.module.css` 默认导入，`env.d.ts` 已提供类型声明。若你的构建工具（Vite/Webpack）已支持 CSS Modules，该声明只是兜底，无冲突。

想换成你自己的图标，删掉 `FishLogo.tsx`，在 `WhaleOverlay.tsx` 里把 `FishLogo` 换成任意接受 `size`/`className` 的 svg 组件即可（若带 `aria-hidden` 更好，和外层叠加）。

### CSS 特性依赖（纯 CSS，零第三方，浏览器需支持）

- `color-mix(in srgb, var(--x) 60%, transparent)`：调透明度用，2023 年后的浏览器都支持
- `clip-path: polygon(...)`：画喷泉水柱的变径锥形
- `@keyframes`、CSS 变量（`--*`）

不依赖本仓库任何其它包。

## 怎么挂载到你的页面

组件本身不负责挂载，它只是一个可渲染的 React 元素。你可以用两种方式放进页面：

### 方式一：直接渲染（最省事）

在任何 React 组件里把它作为普通元素渲染：

```tsx
import { WhaleOverlay } from './WhaleOverlay'

export function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <WhaleOverlay />
      {/** 你的其它界面 */}
    </div>
  )
}
```

`WhaleOverlay` 内部用 `position: absolute` 定位，需要一个**相对定位的父容器**（`position: relative`），它会在容器左右两边缘之间巡游。容器要足够宽（左右活动各 500px + 鲸鱼尺寸），否则两侧会重叠。

### 方式二：作为 cordis 插件的 `shell.overlay` 席位（本项目原样）

在本仓库里，它通过 `ctx.slots.inject('shell.overlay', ...)` 注册到 Web 壳的浮动层，挂在所有列之上、不参与滚动：

```ts
import { WhaleOverlay } from './WhaleOverlay'

export function apply(ctx: SomeClientContext) {
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'whale-overlay',
    order: 100,
  }, WhaleOverlay))
}
```

如果你不是 cordis 环境，忽略这段即可。

## 交互与辅助技术

- **悬停暂停**：鼠标移到鲸鱼上，巡游动画暂停（`data-paused`），移开继续。
- **点击喷泉**：左键点击触发一次「跃起 + 喷水」，约 2 秒后自行停止；喷泉期间再次点击被忽略。
- **不读屏**：整块 `aria-hidden`，对辅助技术隐藏，仅接受鼠标交互，不给键盘焦点。
- **降低动态系数**：`prefers-reduced-motion` 下所有动画关闭，鲸鱼静止。
- **点击区域**：只有鲸鱼所在的 `--whale-size` 方块接收指针事件，周围区域仍是点击穿透（不影响页面其它交互）。

## 全部配置参数（改这里就能调）

所有参数都是 CSS 变量，集中写在 `WhaleOverlay.module.css` 的 `.root` 块里，改一处全动画跟随。

### 位置与巡游

| 变量 | 默认 | 含义 |
|---|---|---|
| `--whale-size` | `96px` | 鲸鱼方块边长，需和图标 size 一致 |
| `--edge-offset` | `20px` | 鲸鱼静止时离浏览器边缘的间隙 |
| `--bottom-offset` | `16px` | 鲸鱼离底部的高度 |
| `--base-opacity` | `0.9` | 鲸鱼静止透明度 |
| `--sway-distance` | `500px` | 每个边缘单程滑动距离 |
| `--exit-distance` | 自动 | 淡出时越过边缘的行程（= size + edge-offset） |
| `--patrol-duration` | `16s` | 一整个「右边缘 + 左边缘」巡游周期 |

### 喷泉

| 变量 | 默认 | 含义 |
|---|---|---|
| `--spout-duration` | `2s` | 整个「跃起 + 喷水」动画时长 |
| `--spout-ratio` | `1.5` | 主水柱高 = 鲸鱼高的倍数 |
| `--spout-top-width` | `48px` | 主水柱最宽处（中段）宽度 |
| `--spout-font-narrow` | `36%` | 底部窄口半宽占比（越小连接越尖） |
| `--spout-side-ratio` | `0.72` | 两侧副水柱高 = 主柱高的倍数 |
| `--spout-side-width` | `20px` | 副水柱宽度 |
| `--spout-burst-ratio` | `2` | 顶部水花直径 = 鲸鱼高倍数（设 >1 就比鲸鱼大） |
| `--spout-mist-ratio` | `2.4` | 顶花外圈雾霭直径倍数 |
| `--spout-droplet` | `14px` | 溅射小水滴直径 |
| `--spout-color-light` | `#c9e6ff` | 水的中段浅蓝色 |
| `--spout-color-deep` | `#2f86c4` | 水的顶端深蓝色 |

水的颜色是「无色 → 浅蓝 → 深蓝」向上渐变：底部接触鲸鱼处透明，中段浅蓝，顶端深蓝。

## 常见微调

- **鲸鱼更大/更小**：改 `--whale-size`，同时把组件里的 `size={96}` 改成同值。
- **滑动更远/更近**：改 `--sway-distance`。
- **巡游更快/更慢**：改 `--patrol-duration`（数值越小越快）。
- **水更高/更矮**：改 `--spout-ratio`。
- **顶部水花更大/更小**：改 `--spout-burst-ratio`。
- **水更蓝/更淡**：改 `--spout-color-light`、`--spout-color-deep`。
- **喷水更快/更慢**：改 `--spout-duration`。

## 已知注意点

- 巡游依赖 `100vw`（视口宽度）。若容器/窗口过窄（左右两个 `--sway-distance` 区域重叠），两侧会显得拥挤，正常桌面宽度（>1100px）无碍。
- 喷泉和巡游不会同时进行：喷泉期间巡游动画暂停，喷泉结束继续。
