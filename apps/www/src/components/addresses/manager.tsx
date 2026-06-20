"use client"

import { Address as AddressDoc } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import { MapPin, Plus } from "lucide-react"
import * as React from "react"
import { AddressCard } from "./card"
import { AddressDialog } from "./dialog"

type AddressesManagerProps = {
  addresses: AddressDoc[]
}

export function AddressesManager({ addresses }: AddressesManagerProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const editingAddress = addresses.find((a) => a.id === editingId)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddressDialog
          trigger={
            <Button>
              <Plus />
              Add Address
            </Button>
          }
        />
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <MapPin className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No addresses yet</p>
            <p className="text-sm text-muted-foreground">
              Add a delivery address to speed up checkout.
            </p>
          </div>
          <AddressDialog
            trigger={
              <Button variant="outline">
                <Plus />
                Add your first address
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(id) => setEditingId(id)}
            />
          ))}
        </div>
      )}

      {editingAddress && (
        <AddressDialog
          address={editingAddress}
          open={!!editingId}
          onOpenChange={(open) => {
            if (!open) setEditingId(null)
          }}
        />
      )}
    </div>
  )
}
