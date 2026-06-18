import {defineConfig} from 'vitest/config'

export default defineConfig({
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    globals: true,
    // Use worker threads in a single-threaded mode to avoid sandbox kill/EPERM and Node 23 tinypool issues
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    isolate: false,
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1
  }
})
