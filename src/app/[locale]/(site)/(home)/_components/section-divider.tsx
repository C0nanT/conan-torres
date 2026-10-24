export function SectionDivider() {
  return (
    <div aria-hidden={true} className="bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="border-t-2 border-dotted border-border/60 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" />
      </div>
    </div>
  )
}
