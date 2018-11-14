import { spawn } from '@/lib/utils'

interface Payload {
  data: {
    hours: number
    width?: number
    height?: number
  }
}

export const worker: Worker =
  'browser' in process &&
  spawn(function(this: Worker) {
    let lastLen = 0
    const res = []

    this.onmessage = ({ data: { width, hours } }: Payload) => {
      const getCoords = (method: keyof CanvasRect, i: number) => {
        const w = 7
        const d = 2

        const x = w + (i % (width / 7)) * w
        const y = w + Math.floor(i / (width / 7)) * w

        return [method, x + d, y + d, w - d * 2, w - d * 2]
      }

      for (let i = 0, l = hours; i < l; i++) {
        res[i] = getCoords('fillRect', i)
      }

      for (let i = hours, l = lastLen; i < l; i++) {
        res[i] = getCoords('clearRect', i)
      }

      lastLen = hours
      this.postMessage({ res, hours })
    }
  })

export const isWorkerReady = () =>
  'browser' in process && worker instanceof Worker

export default worker
