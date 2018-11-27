import anime from 'animejs'
import * as d3 from 'd3-timer'
import { compose, setDisplayName, withHandlers } from 'recompose'
import { withTheme } from 'styled-components'

import { ResultProps } from '../result'

interface TInner {
  onRef: () => void
}

interface Point {
  opacity: number
  hue: number
  x: number
  y: number
  r: number
  vx: number
  vy: number
}

let timer

export default compose<TInner, {}>(
  setDisplayName('fx'),
  withTheme,
  withHandlers(() => ({
    onRef: () => () => {
      const cv = document.getElementById('fx') as HTMLCanvasElement
      const ctx = cv.getContext('2d')

      const points: Point[] = []

      const getCoords = (i: number): Point => ({
        opacity: Math.random(),
        x: anime.random(cv.clientWidth * Math.random(), i % cv.clientWidth),
        y: anime.random(cv.clientHeight * Math.random(), i % cv.clientHeight),
        r: anime.random(2, 4),
        vx: anime.random(0.1, 2) * (Math.random() > 0.66 ? -1 : 1),
        vy: anime.random(0.1, 2) * (Math.random() > 0.55 ? -1 : 1),
        hue: Math.trunc(360 / 1.5)
      })

      const draw = () => {
        cv.width = cv.clientWidth
        cv.height = cv.clientHeight

        ctx.clearRect(0, 0, cv.clientWidth, cv.clientHeight)

        for (let i = 0, l = points.length; i < l; i++) {
          if (points[i].x > cv.clientWidth || points[i].x < -20) {
            points[i].vx *= -1
          }

          if (points[i].y > cv.clientHeight || points[i].y < -20) {
            points[i].vy *= -1
          }

          points[i].x += points[i].vx / 4
          points[i].y -= points[i].vy / 4

          ctx.beginPath()

          ctx.globalAlpha = points[i].opacity
          ctx.fillStyle = 'hsl(' + points[i].hue + ', 100%, 97%)'
          ctx.strokeStyle = 'hsl(' + points[i].hue + ', 100%, 90%)'
          ctx.arc(points[i].x, points[i].y, points[i].r, 0, Math.PI * 2)

          ctx.fill()
          ctx.stroke()
        }

        ctx.shadowBlur = 0
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

          const h = Math.min(
            3e4 / navigator.hardwareConcurrency,
            Math.abs(end.diff(start, 'hour'))
          )

          while (h < points.length) {
            points.pop()
          }

          for (let i = points.length; i < h; i++) {
            const p = getCoords(i)
            points.push(p)
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
      left: 0,
      width: 'auto',
      height: '100vh'
    }}
  />
))
