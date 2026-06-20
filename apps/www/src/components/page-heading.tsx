type PageHeadingProps = {
  title: string
  description?: string
}

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <hgroup className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </hgroup>
  )
}
