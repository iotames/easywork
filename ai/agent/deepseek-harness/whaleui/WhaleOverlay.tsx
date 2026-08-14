/**
 * Decorative brand whale over the shell.overlay layer. Not a feature surface:
 * aria-hidden (never read to assistive tech) and not focusable, but the whale
 * box itself does accept pointer interaction — hovering pauses its patrol, and
 * a click fires a one-shot "leap and spout" animation that ends by itself. The
 * 96px whale box is the only interactive region; the overlay around it stays
 * click-through so the rest of the frame remains reachable.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { FishLogo } from './FishLogo'
import css from './WhaleOverlay.module.css'

/** Leap-and-spout animation duration, ms; must match --spout-duration in the CSS (2s). */
const SPOUT_DURATION = 2000

/**
 * Render the decorative whale overlay: hover pauses the patrol, clicking
 * fires a one-shot leap-and-spout.
 * @returns the whale element (aria-hidden; pointer enters pause it, clicks spurt).
 */
export function WhaleOverlay() {
  const [paused, setPaused] = useState(false)
  const [spouting, setSpouting] = useState(false)
  const spoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopSpouting = useCallback(() => {
    setSpouting(false)
    if (spoutTimer.current !== null) { clearTimeout(spoutTimer.current); spoutTimer.current = null }
  }, [])

  const spout = useCallback(() => {
    // A second click while already spurting is ignored (no restart).
    if (spoutTimer.current !== null) return
    setSpouting(true)
    spoutTimer.current = setTimeout(stopSpouting, SPOUT_DURATION)
  }, [stopSpouting])

  // Unmount cleanup: never leave the timer running.
  useEffect(() => () => {
    if (spoutTimer.current !== null) clearTimeout(spoutTimer.current)
  }, [])

  return (
    <div
      className={css.root}
      aria-hidden="true"
      data-paused={paused || undefined}
      data-spouting={spouting || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onClick={spout}
    >
      <span className={css.spout} onAnimationEnd={stopSpouting} />
      <span className={css.spray} />
      <FishLogo size={96} className={css.fish} />
    </div>
  )
}
