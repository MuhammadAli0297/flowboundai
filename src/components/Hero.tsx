import { FlowBackground } from "./FlowBackground"

export function Hero() {
  return (
    <section id="top" className="relative min-h-[640px] overflow-hidden bg-fb-black md:min-h-[760px]">
      <FlowBackground />
      <div className="absolute inset-0 bg-gradient-to-r from-fb-black/90 from-0% via-fb-black/55 via-55% to-fb-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-fb-black via-transparent to-transparent" />

      <div className="container-fb relative flex min-h-[640px] flex-col justify-center py-20 md:min-h-[760px]">
        <p className="eyebrow mb-5 text-fb-green-300">Supply chain software for small business teams</p>
        <h1 className="max-w-2xl text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-fb-white md:text-[3.4rem]">
          You don't need an <span className="text-fb-green-300">SAP consultant</span> to run a tight supply chain.
        </h1>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-fb-white/65">
          Get AI-powered inventory decisions in minutes, not months. No SI required. No nine-month rollout.
          Just connect your data and start asking questions.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#cta"
            className="inline-flex items-center bg-fb-green-500 px-6 py-3.5 font-body font-normal text-fb-white transition-colors hover:bg-fb-green-400"
          >
            Start free pilot
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center border border-fb-white/25 px-6 py-3.5 font-body font-normal text-fb-white transition-colors hover:border-fb-white/60"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}
