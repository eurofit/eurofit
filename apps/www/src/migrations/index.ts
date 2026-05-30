import * as migration_20260530_214207 from "./20260530_214207"

export const migrations = [
  {
    up: migration_20260530_214207.up,
    down: migration_20260530_214207.down,
    name: "20260530_214207",
  },
]
