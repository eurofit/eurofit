"use client"

import { Button } from "@eurofit/ui/components/button"
import { Card, CardContent } from "@eurofit/ui/components/card"
import { Copy } from "lucide-react"
import { toast } from "sonner"

type OrderCardProps = {
  orderId: number
}

export function OrderCard({ orderId }: OrderCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(orderId.toString())
    toast.success(`#${orderId} copied to clipboard!`)
  }

  return (
    <Card size="sm" className="py-2! max-md:w-full">
      <CardContent>
        <div className="flex items-center justify-between gap-10 text-left">
          <div>
            <p className="text-sm text-muted-foreground">Order number</p>
            <p>
              <span className="font-medium">{orderId}</span>
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="icon-sm" onClick={handleCopy}>
              <Copy />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
