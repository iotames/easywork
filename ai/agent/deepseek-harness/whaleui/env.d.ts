/**
 * Ambient type declarations so the whale can be dropped into any TS + React
 * project without extra setup. The CSS Modules import (`WhaleOverlay.module.css`)
 * is normally typed by the build tool (Vite/Rollup/tsdown); this declaration
 * provides a plain typed fallback so `tsc` accepts it out of the box. React's
 * own types are a peer dependency — install `react` + `@types/react` in the
 * consuming project as usual.
 */
declare module '*.module.css' {
  /** The exported class-name map (scoped, empty for pure-keyframe/var sheets). */
  const classes: { readonly [key: string]: string }
  export default classes
}
