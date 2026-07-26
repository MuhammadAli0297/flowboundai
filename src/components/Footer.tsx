import { LogoLockup } from "./LogoMark"

export function Footer() {
  return (
    <footer className="bg-fb-black py-14 text-fb-white/70">
      <div className="container-fb flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <LogoLockup dark />
          <p className="mt-4 text-sm leading-relaxed text-fb-white/45">
            Supply chain decisions, explained in plain language, for small and mid-sized teams who don't
            have an SAP budget.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-fb-white/35">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#product" className="hover:text-fb-white">What it is</a></li>
              <li><a href="#how-it-works" className="hover:text-fb-white">How it works</a></li>
              <li><a href="#sap" className="hover:text-fb-white">vs. SAP</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-fb-white/35">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#smb" className="hover:text-fb-white">Who we serve</a></li>
              <li><a href="#cta" className="hover:text-fb-white">Request a pilot</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-fb-white/35">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="mailto:hello@flowbound.ai" className="hover:text-fb-white">hello@flowbound.ai</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-fb mt-12 border-t border-fb-white/10 pt-6 text-xs text-fb-white/35">
        © {new Date().getFullYear()} Flowbound. All rights reserved.
      </div>
    </footer>
  )
}
