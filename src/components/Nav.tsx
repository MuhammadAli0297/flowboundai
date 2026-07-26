import { LogoLockup } from "./LogoMark"

const links = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "vs. SAP", href: "#sap" },
  { label: "For SMBs", href: "#smb" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-fb-black/10 bg-fb-paper/90 backdrop-blur">
      <div className="container-fb flex h-16 items-center justify-between">
        <a href="#top" className="shrink-0">
          <LogoLockup />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[0.9rem] text-fb-black/70 transition-colors hover:text-fb-green-600"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="inline-flex items-center border border-fb-black bg-fb-black px-4 py-2 font-body text-[0.85rem] font-normal text-fb-white transition-colors hover:bg-fb-green-600 hover:border-fb-green-600"
        >
          Request a pilot
        </a>
      </div>
    </header>
  )
}
