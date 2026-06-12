import { STORAGE_KEYS } from "@/const/keys"
import { atomWithStorage } from "jotai/utils"

export const recentSearchesAtom = atomWithStorage<string[] | undefined>(
  STORAGE_KEYS.SEARCHBAR_RECENT_SEARCHES,
  undefined
)
