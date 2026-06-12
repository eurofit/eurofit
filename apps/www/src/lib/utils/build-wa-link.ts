type Args = {
  phone: string
  message: string
}

export function buildWhatsAppLink({ phone, message }: Args) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`
}
