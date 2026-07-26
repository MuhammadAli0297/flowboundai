export function SmbFocus() {
  return (
    <section id="smb" className="border-b border-fb-black/10 py-20 md:py-28">
      <div className="container-fb grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:items-start">
        <div>
          <p className="eyebrow mb-4">Who we build for</p>
          <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.2rem]">
            Starting with SMBs, on purpose.
          </h2>
        </div>
        <div className="max-w-xl text-[1.02rem] leading-relaxed text-fb-black/70">
          <p>
            We're starting with small and mid-sized operators, the companies SAP-scale software was never
            priced for. It's where the gap is widest, and where we can prove the engine works on real
            decisions, fast.
          </p>
          <p className="mt-5">
            Every pilot builds the track record we bring upmarket. The roadmap is deliberate: earn results
            with SMBs first, then bring the same decision engine to enterprise supply chains.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-fb-black/10 pt-6">
            <div>
              <p className="font-mono text-2xl font-medium text-fb-green-600">SMB</p>
              <p className="mt-1 text-sm text-fb-black/55">where we start</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-medium text-fb-black/25">&rarr;</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-medium text-fb-black">Enterprise</p>
              <p className="mt-1 text-sm text-fb-black/55">where we're headed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
