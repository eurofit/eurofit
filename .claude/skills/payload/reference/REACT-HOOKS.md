# Payload CMS — Admin React Hooks

All hooks are imported from `@payloadcms/ui` and must be used in Client Components (`'use client'`).

---

## Table of Contents

1. [useField](#usefield)
2. [useFormFields](#useformfields)
3. [useAllFormFields](#useallformfields)
4. [useForm](#useform)
5. [useDocumentForm](#usedocumentform)
6. [useCollapsible](#usecollapsible)
7. [useDocumentInfo](#usedocumentinfo)
8. [useListQuery](#uselistquery)
9. [useSelection](#useselection)
10. [useLocale](#uselocale)
11. [useAuth](#useauth)
12. [useConfig](#useconfig)
13. [useEditDepth](#useeditdepth)
14. [usePreferences](#usepreferences)
15. [useTheme](#usetheme)
16. [useTableColumns](#usetablecolumns)
17. [useDocumentEvents](#usedocumentevents)
18. [useStepNav](#usestepnav)
19. [usePayloadAPI](#usepayloadapi)
20. [useRouteTransition](#useroutetransition)

---

## useField

Manages a single field's state within its parent form. Use this inside any **Custom Field Component** to read and write field values.

```ts
import { useField } from "@payloadcms/ui"

const { value, setValue } = useField({ path })
```

### Arguments

| Property          | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `path`            | Path to the field in form data. Falls back to `name` if omitted. |
| `validate`        | Client-side validation function run before form submission.      |
| `disableFormData` | If `true`, the field is excluded from submitted form data.       |
| `hasRows`         | Set `true` for array/blocks fields.                              |

### Returned Object

```ts
type FieldType<T> = {
  errorMessage?: string
  errorPaths?: string[]
  filterOptions?: FilterOptionsResult
  formInitializing: boolean
  formProcessing: boolean
  formSubmitted: boolean
  initialValue?: T
  path: string
  permissions: FieldPermissions
  readOnly?: boolean
  rows?: Row[]
  schemaPath: string
  setValue: (val: unknown, disableModifyingForm?: boolean) => void
  showError: boolean
  valid?: boolean
  value: T
}
```

### Example

```tsx
"use client"
import type { TextFieldClientComponent } from "payload"
import { useField } from "@payloadcms/ui"

export const CustomTextField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField({ path })

  return (
    <div>
      <p>{path}</p>
      <input onChange={(e) => setValue(e.target.value)} value={value} />
    </div>
  )
}
```

### ⚠️ Updating Lexical Rich Text Fields

Lexical uses `initialValue` (not `value`) to trigger a re-render. Calling `setValue` alone updates the database but **does not update the editor UI**. Use `dispatchFields` with an `UPDATE` action instead:

```tsx
"use client"
import { useAllFormFields } from "@payloadcms/ui"

export const MyComponent: React.FC = () => {
  const [, dispatchFields] = useAllFormFields()

  const updateRichTextField = (newValue) => {
    dispatchFields({
      type: "UPDATE",
      path: "myRichTextField",
      value: newValue,
      initialValue: newValue, // required for Lexical re-render
    })
  }

  return (
    <button
      onClick={() =>
        updateRichTextField({
          /* new state */
        })
      }
    >
      Update
    </button>
  )
}
```

---

## useFormFields

Retrieve **specific fields** from form state with optimized re-renders — only re-renders when the selected field changes.

Uses a Redux-style selector: `([fields, dispatch]) => fields.myField`.

```tsx
"use client"
import { useFormFields } from "@payloadcms/ui"

const MyComponent: React.FC = () => {
  const amount = useFormFields(([fields]) => fields.amount)
  const feePercentage = useFormFields(([fields]) => fields.feePercentage)

  if (
    typeof amount?.value !== "undefined" &&
    typeof feePercentage?.value !== "undefined"
  ) {
    return <span>The fee is ${(amount.value * feePercentage.value) / 100}</span>
  }
}
```

> **Tip:** Prefer this over `useAllFormFields` when you only need 1–2 specific fields.

---

## useAllFormFields

Retrieve **all fields** and the `dispatchFields` method. Returns `[fields: Fields, dispatch: React.Dispatch<Action>]`.

> **Warning:** Component re-renders on **every field change**. Use sparingly.

```tsx
"use client"
import { useAllFormFields } from "@payloadcms/ui"
import { reduceFieldsToValues, getSiblingData } from "payload/shared"

const ExampleComponent: React.FC = () => {
  const [fields, dispatchFields] = useAllFormFields()

  const formData = reduceFieldsToValues(fields, true)
  const siblingData = getSiblingData(fields, "someFieldName")

  return null
}
```

### dispatchFields Actions

| Action             | Description                                |
| ------------------ | ------------------------------------------ |
| `ADD_ROW`          | Adds a row (array/blocks)                  |
| `DUPLICATE_ROW`    | Duplicates a row (array/blocks)            |
| `MODIFY_CONDITION` | Updates a field's conditional logic result |
| `MOVE_ROW`         | Moves a row (array/blocks)                 |
| `REMOVE`           | Removes a field from form state            |
| `REMOVE_ROW`       | Removes a row (array/blocks)               |
| `REPLACE_STATE`    | Completely replaces form state             |
| `UPDATE`           | Updates any property of a field's state    |

Full action types: [Form/types.ts](https://github.com/payloadcms/payload/blob/3.x/packages/ui/src/forms/Form/types.ts)

---

## useForm

Interact with the form itself. Returns methods for action-based callbacks. **Does not cause re-renders when fields change.**

> **Warning:** The `fields` property is deprecated and may be stale. Use `getFields()` instead.

### Returned Properties

| Property          | Description                                       |
| ----------------- | ------------------------------------------------- |
| `submit`          | Trigger form submission                           |
| `dispatchFields`  | Dispatch actions to field state                   |
| `validateForm`    | Trigger form validation                           |
| `createFormData`  | Create `multipart/form-data` from form state      |
| `disabled`        | Whether the form is disabled                      |
| `getFields`       | Get all fields from state                         |
| `getField`        | Get a single field by path                        |
| `getData`         | Get form data                                     |
| `getSiblingData`  | Get sibling data for a field path                 |
| `getDataByPath`   | Get field data by path (useful for arrays/blocks) |
| `setModified`     | Set form `modified` state                         |
| `setProcessing`   | Set form `processing` state                       |
| `setSubmitted`    | Set form `submitted` state                        |
| `formRef`         | Ref to the form HTML element                      |
| `reset`           | Reset form to initial state                       |
| `addFieldRow`     | Add a row to an array/block field                 |
| `removeFieldRow`  | Remove a row from an array/block field            |
| `replaceFieldRow` | Replace a row in an array/block field             |

---

## useDocumentForm

Same as `useForm`, but always returns the **top-level document form**. Useful inside child forms (e.g., Lexical blocks) that have their own nested `Form` context.

```tsx
"use client"
import { useDocumentForm } from "@payloadcms/ui"

const MyComponent: React.FC = () => {
  const { fields: parentDocumentFields } = useDocumentForm()
  return (
    <p>The document has ${Object.keys(parentDocumentFields).length} fields</p>
  )
}
```

---

## useCollapsible

Control the nearest parent collapsible component.

| Property              | Description                               |
| --------------------- | ----------------------------------------- |
| `isCollapsed`         | `true` if open, `false` if collapsed      |
| `isVisible`           | `true` if no parent collapsible is closed |
| `toggle`              | Toggle the nearest collapsible            |
| `isWithinCollapsible` | Whether inside another collapsible        |

```tsx
"use client"
import { useCollapsible } from "@payloadcms/ui"

const CustomComponent: React.FC = () => {
  const { isCollapsed, toggle } = useCollapsible()
  return (
    <div>
      <p>I am {isCollapsed ? "closed" : "open"}</p>
      <button onClick={toggle} type="button">
        Toggle
      </button>
    </div>
  )
}
```

---

## useDocumentInfo

Information about the document currently being edited.

### Key Properties

| Property                        | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `id`                            | Document ID (collection only; `undefined` on create) |
| `collectionSlug`                | Collection slug                                      |
| `globalSlug`                    | Global slug                                          |
| `docConfig`                     | Collection or Global config                          |
| `docPermissions`                | Document-level permissions                           |
| `data`                          | Saved document data                                  |
| `initialData`                   | Initial document data                                |
| `isEditing`                     | `true` when editing (vs creating)                    |
| `isInitializing`                | `true` while doc info is loading                     |
| `isLocked` / `documentIsLocked` | Lock state                                           |
| `hasPublishedDoc`               | Whether a published version exists                   |
| `hasPublishPermission`          | Publish permission flag                              |
| `hasSavePermission`             | Save permission flag                                 |
| `title`                         | Document title                                       |
| `apiURL`                        | API URL for current doc                              |
| `action`                        | Form action URL                                      |
| `currentEditor`                 | User currently editing                               |
| `lastUpdateTime`                | Last update timestamp                                |
| `versionCount`                  | Total version count                                  |
| `unpublishedVersionCount`       | Unpublished version count                            |
| `uploadStatus`                  | `'idle'` \| `'uploading'` \| `'failed'`              |
| `getDocPermissions`             | Method: fetch doc permissions                        |
| `getDocPreferences`             | Method: fetch doc preferences                        |
| `setDocFieldPreferences`        | Method: set field-level preferences                  |
| `setDocumentTitle`              | Method: update doc title                             |
| `setHasPublishedDoc`            | Method: update published state                       |
| `unlockDocument`                | Method: unlock document                              |
| `updateDocumentEditor`          | Method: update current editor                        |
| `updateSavedDocumentData`       | Method: update saved data                            |
| `incrementVersionCount`         | Method: increment version count                      |
| `preferencesKey`                | Key for user preferences                             |
| `mostRecentVersionIsAutosaved`  | Whether latest version is autosaved                  |

```tsx
"use client"
import { useDocumentInfo } from "@payloadcms/ui"

const LinkFromCategoryToPosts: React.FC = () => {
  const { id } = useDocumentInfo()
  if (!id) return null
  return (
    <a
      href={`/admin/collections/posts?where[or][0][and][0][category][in][0]=[${id}]`}
    >
      View posts
    </a>
  )
}
```

---

## useListQuery

Subscribe to data and query state within the **List View**.

### Returned Properties

| Property              | Description                               |
| --------------------- | ----------------------------------------- |
| `data`                | Current list data                         |
| `query`               | Current query                             |
| `defaultLimit`        | Default items per page                    |
| `defaultSort`         | Default sort order                        |
| `modified`            | Whether query differs from a Query Preset |
| `handlePageChange`    | Method: change page                       |
| `handlePerPageChange` | Method: change per-page count             |
| `handleSearchChange`  | Method: update search                     |
| `handleSortChange`    | Method: update sort                       |
| `handleWhereChange`   | Method: update where clause               |

---

## useSelection

Row selection state in the List View.

| Property         | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `count`          | Number of selected rows                                         |
| `totalDocs`      | Total documents in collection                                   |
| `selected`       | Map of `{ id: boolean }`                                        |
| `selectAll`      | Enum: `'allAvailable'` \| `'allInPage'` \| `'none'` \| `'some'` |
| `setSelection`   | Toggle a document's selection                                   |
| `toggleAll`      | Toggle all on page; pass `true` to select all available         |
| `getQueryParams` | Generate query string from current selection                    |

---

## useLocale

Returns the currently selected locale object.

```ts
const locale = useLocale()
// locale.code, locale.label, locale.rtl
```

---

## useAuth

Access the current user and auth methods.

| Property             | Description                    |
| -------------------- | ------------------------------ |
| `user`               | Currently logged-in user       |
| `token`              | Auth token (JWT)               |
| `permissions`        | User permissions               |
| `logOut`             | Method: log out                |
| `refreshCookie`      | Method: silently refresh token |
| `setToken`           | Method: set token manually     |
| `refreshPermissions` | Method: reload permissions     |

```tsx
"use client"
import { useAuth } from "@payloadcms/ui"
import type { User } from "../payload-types.ts"

const Greeting: React.FC = () => {
  const { user } = useAuth<User>()
  return <span>Hi, {user.email}!</span>
}
```

---

## useConfig

Access the Payload [Client Config](https://payloadcms.com/docs/custom-components/overview#accessing-the-payload-config).

```tsx
const { config } = useConfig()
// config.serverURL, config.collections, etc.
```

For efficient collection/global lookups:

```tsx
const { getEntityConfig } = useConfig()
const mediaConfig = getEntityConfig({ collectionSlug: "media" })
```

---

## useEditDepth

Returns the current editing depth (number of nested modal levels).

```tsx
const editDepth = useEditDepth()
```

---

## usePreferences

Get and set user preferences. See [Preferences docs](https://payloadcms.com/docs/admin/preferences).

---

## useTheme

Read and update the current UI theme.

| Property   | Description                           |
| ---------- | ------------------------------------- |
| `theme`    | `'light'` \| `'dark'` \| `'auto'`     |
| `autoMode` | `true` if following system preference |
| `setTheme` | Setter function                       |

---

## useTableColumns

Manage column visibility and order in list tables.

| Property             | Description                                     |
| -------------------- | ----------------------------------------------- |
| `columns`            | Current column state (active/inactive + config) |
| `LinkedCellOverride` | Component override for linked cells             |
| `moveColumn`         | Reorder: `{ fromIndex, toIndex }`               |
| `resetColumnsState`  | Reset to collection config defaults             |
| `setActiveColumns`   | Activate specific columns by name (array)       |
| `toggleColumn`       | Toggle a single column by name                  |

---

## useDocumentEvents

Subscribe to cross-document events (e.g., updates in nested drawers).

| Property           | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `mostRecentUpdate` | `{ entitySlug, id?, updatedAt }` of most recently updated doc |
| `reportUpdate`     | Method: report a document update                              |

```tsx
const { mostRecentUpdate } = useDocumentEvents()
```

---

## useStepNav

Update the breadcrumb step-nav in the admin header.

| Property     | Description                                |
| ------------ | ------------------------------------------ |
| `stepNav`    | Array of `StepNavItem` (`{ label, url? }`) |
| `setStepNav` | Setter for the breadcrumb array            |

```tsx
"use client"
import { type StepNavItem, useStepNav } from "@payloadcms/ui"
import { useEffect } from "react"

export const MySetStepNavComponent: React.FC<{ nav: StepNavItem[] }> = ({
  nav,
}) => {
  const { setStepNav } = useStepNav()
  useEffect(() => {
    setStepNav(nav)
  }, [setStepNav, nav])
  return null
}
```

---

## usePayloadAPI

Make reactive REST API requests to your Payload instance.

```tsx
const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI(
  "/api/posts/123",
  { initialParams: { depth: 1 } }
)
```

### Arguments

| Property  | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `url`     | API endpoint; relative URLs get prefixed with the Payload API route |
| `options` | Options object                                                      |

**Options:**

| Property        | Description                                      |
| --------------- | ------------------------------------------------ |
| `initialData`   | Pre-load data; skips initial request if provided |
| `initialParams` | Initial request params (default: `{}`)           |

### Returned Array

**Element 1 — state object:**

| Property    | Description                      |
| ----------- | -------------------------------- |
| `data`      | API response                     |
| `isError`   | Whether the request failed       |
| `isLoading` | Whether a request is in progress |

**Element 2 — methods:**

| Property    | Description                         |
| ----------- | ----------------------------------- |
| `setParams` | Update params and trigger a refetch |

---

## useRouteTransition

Trigger visual route transition feedback when navigating.

`Link` from `@payloadcms/ui` triggers transitions automatically. For programmatic navigation:

```tsx
"use client"
import { useRouteTransition } from "@payloadcms/ui"
import { useRouter } from "next/navigation"

const MyComponent: React.FC = () => {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const go = () => startRouteTransition(() => router.push("/somewhere"))
  return <button onClick={go}>Navigate</button>
}
```

---

## Quick Import Reference

```ts
import {
  useField,
  useFormFields,
  useAllFormFields,
  useForm,
  useDocumentForm,
  useCollapsible,
  useDocumentInfo,
  useListQuery,
  useSelection,
  useLocale,
  useAuth,
  useConfig,
  useEditDepth,
  usePreferences,
  useTheme,
  useTableColumns,
  useDocumentEvents,
  useStepNav,
  usePayloadAPI,
  useRouteTransition,
} from "@payloadcms/ui"
```
