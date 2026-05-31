import * as migration_20260530_214207 from "./20260530_214207"
import * as migration_20260531_125552 from "./20260531_125552"

export const migrations = [
  {
    up: migration_20260530_214207.up,
    down: migration_20260530_214207.down,
    name: "20260530_214207",
  },
  {
    up: migration_20260531_125552.up,
    down: migration_20260531_125552.down,
    name: "20260531_125552",
  },
]
