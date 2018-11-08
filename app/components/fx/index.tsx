import { ResultProps } from '@/pages'
import animejs from 'animejs'
import { compose, setDisplayName, withHandlers } from 'recompose'
import { withTheme } from 'styled-components'

import worker from '../result/worker'

interface TInner extends ResultProps {
  onRef: () => void
}

interface Payload {
  data: {
    res: Array<[keyof CanvasRect, number, number, number, number]>
    hours: number
  }
}

export default compose<TInner, {}>(
  setDisplayName('fx'),
  withTheme,
  withHandlers(({ theme: { palette } }) => ({
    onRef: () => () => {
      let tm

      const cv = document.getElementById('fx') as HTMLCanvasElement
      const ctx = cv.getContext('2d')

      ctx.fillStyle = palette.purple.light

      worker.onmessage = ({ data: { res, hours } }: Payload) => {
        clearTimeout(tm)
        tm = setTimeout(() => {
          const tl = animejs.timeline({
            autoplay: false
          })

          for (let i = 0, l = res.length; i < l; i++) {
            const [method, ...fill] = res[i]

            tl.add({
              targets: { a: 100 },
              a: 0,
              offset: Math.random(),
              delay: i * 2 * Math.random(),
              duration: 0,
              easing: 'easeOutExpo',
              complete: () => ctx[method](...fill)
            })
          }

          tl.play()
        }, hours === 0 ? 1000 : 3)
      }
    }
  }))
)(({ onRef }) => (
  <canvas
    ref={onRef}
    id="fx"
    width={800}
    height={400}
    style={{
      zIndex: -1,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      left: 0
    }}
  />
))
