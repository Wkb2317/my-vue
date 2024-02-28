const pendingPreFlushCbs: Function[] = []

let isFlushPending: boolean = false
let currentFlushPromise: Promise<void> | null = null

const resolvedPromise: Promise<any> = Promise.resolve()

export function queuePreFlushCb(cb: Function) {
  queueJob(cb, pendingPreFlushCbs)
}

function queueJob(cb: Function, pendingQueue: Function[]) {
  pendingQueue.push(cb)
  queueFlush()
}

function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs() {
  isFlushPending = false
  if (pendingPreFlushCbs.length) {
    const activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0

    for (let index = 0; index < activePreFlushCbs.length; index++) {
      const job = activePreFlushCbs[index]
      job()
    }
  }
}
