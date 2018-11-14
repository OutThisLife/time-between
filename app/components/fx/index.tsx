import anime from 'animejs'
import * as d3 from 'd3-timer'
import { compose, setDisplayName, withHandlers } from 'recompose'
import { withTheme } from 'styled-components'

import { ResultProps } from '../result'

interface TInner {
  onRef: () => void
}

interface Point {
  fill: string
  stroke: string
  x: number
  y: number
  s: number
  tl?: () => anime.AnimeInstance
}

let timer

export default compose<TInner, {}>(
  setDisplayName('fx'),
  withTheme,
  withHandlers(({ theme: { scales, palette } }) => ({
    onRef: () => () => {
      const cv = document.getElementById('fx') as HTMLCanvasElement
      const ctx = cv.getContext('2d')

      const points: Point[] = []
      const pW = 5
      const pD = Math.floor(pW * 0.3)

      const rand = (i: number) =>
        Math.PI * Math.random() * i - Math.sin(i) + i + 1

      const genX = (i: number) =>
        rand(pW + (i % (window.innerWidth / pW / 2)) * pW + pD)

      const genY = (i: number) =>
        rand(pW + Math.floor(i / (window.innerHeight / pW / pW)) * pW + pD)

      const getCoords = (i: number): Point => {
        const generate = (
          fill: boolean = Math.random() < 0.5,
          stroke: boolean = !fill
        ): Point => ({
          x: genX(i),
          y: genY(i),
          s: anime.random(pW / 1.3, pW),
          fill: !fill ? scales.neutral.N1 : palette.purple.base,
          stroke: !stroke ? scales.neutral.N1 : palette.purple.base
        })

        const point = {
          ...generate(),
          tl: () =>
            anime({
              targets: point,
              duration: anime.random(5e3, 10e4),
              easing: 'easeInOutCubic',
              ...generate(),
              complete: () => point.tl()
            })
        }

        return point
      }

      const draw = () => {
        cv.width = window.innerWidth
        cv.height = window.innerHeight

        for (let i = 0, l = points.length; i < l; i++) {
          const { fill, stroke, x, y, s } = points[i]

          ctx.fillStyle = fill
          ctx.strokeStyle = stroke

          ctx.beginPath()
          ctx.arc(x, y, s / 2, 0, pW * 2, false)
          ctx.lineWidth = 1

          ctx.fill()
          ctx.stroke()
        }
      }

      if (typeof timer === 'object') {
        timer.stop()
      }

      timer = d3.timer(draw)

      window.addEventListener(
        'pixels',
        ({ detail: [start, end] }: CustomEventInit<ResultProps['dates']>) => {
          if (typeof end !== 'object') {
            return
          }

          const h = Math.abs(end.diff(start, 'hour'))

          while (h < points.length) {
            points.pop()
          }

          for (let i = points.length; i < h; i++) {
            const p = getCoords(i)
            points.push(p)
            p.tl()
          }
        }
      )
    }
  }))
)(({ onRef }) => (
  <canvas
    ref={onRef}
    id="fx"
    style={{
      zIndex: -1,
      pointerEvents: 'none',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      filter: 'blur(1px)'
    }}
  />
))
