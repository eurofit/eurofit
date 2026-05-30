import * as migration_20260530_194527 from "./20260530_194527"

export const migrations = [
  {
    up: migration_20260530_194527.up,
    down: migration_20260530_194527.down,
    name: "20260530_194527",
  },
]
