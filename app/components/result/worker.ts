import { spawn } from '@/lib/utils'

interface Payload {
  data: {
    hours: number
    width: number
    height: number
  }
}

export const worker: Worker =
  typeof window !== 'undefined' &&
  spawn(function(this: Worker) {
    let lastLen = 0
    const res = []

    this.onmessage = ({ data: { hours } }: Payload) => {
      const getCoords = (method: keyof CanvasRect, i: number) => {
        const w = 14
        const d = 2

        const x = w + (i % 50) * w
        const y = w + Math.floor(i / 50) * w

        return [method, x + d, y + d, w - d * 2, w - d * 2]
      }

      for (let i = 0, l = hours; i < l; i++) {
        res[i] = getCoords('fillRect', i)
      }

      for (let i = hours, l = lastLen; i < l; i++) {
        res[i] = getCoords('clearRect', i)
      }

      lastLen = hours
      this.postMessage({
        res,
        hours
      })
    }
  })

export const isWorkerReady = () =>
  typeof window !== 'undefined' && worker instanceof Worker

export default worker
