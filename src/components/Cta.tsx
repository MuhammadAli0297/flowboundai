export function Cta() {
  return (
    <section id="cta" className="bg-fb-green-500 py-20 md:py-24">
      <div className="container-fb text-center">
        <h2 className="mx-auto max-w-xl text-[1.9rem] font-semibold leading-tight tracking-tight text-fb-black md:text-[2.3rem]">
          We're onboarding a small group of business pilots right now.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-fb-black/70">
          Tell us a bit about your supply chain and we'll get back to you within a few days. No sales
          pressure, just a real conversation about how we can help your team run tighter and smarter.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:hello@flowbound.ai?subject=Pilot%20request"
            className="inline-flex items-center border border-fb-black bg-fb-black px-6 py-3.5 font-body font-normal text-fb-white transition-colors hover:bg-fb-ink"
          >
            Request a pilot
          </a>
          <a
            href="mailto:hello@flowbound.ai?subject=Question"
            className="inline-flex items-center border border-fb-black px-6 py-3.5 font-body font-normal text-fb-black transition-colors hover:bg-fb-black hover:text-fb-white"
          >
            Talk to us
          </a>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-fb-black/50">
          hello@flowbound.ai
        </p>
      </div>
    </section>
  )
}
