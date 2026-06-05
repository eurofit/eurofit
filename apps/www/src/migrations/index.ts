import * as migration_20260530_214207 from "./20260530_214207"
import * as migration_20260531_125552 from "./20260531_125552"
import * as migration_20260531_173258 from "./20260531_173258"
import * as migration_20260531_180201 from "./20260531_180201"
import * as migration_20260601_140233 from "./20260601_140233"

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
  {
    up: migration_20260531_173258.up,
    down: migration_20260531_173258.down,
    name: "20260531_173258",
  },
  {
    up: migration_20260531_180201.up,
    down: migration_20260531_180201.down,
    name: "20260531_180201",
  },
  {
    up: migration_20260601_140233.up,
    down: migration_20260601_140233.down,
    name: "20260601_140233",
  },
]
