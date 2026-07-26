const pillars = [
  {
    n: "01",
    title: "Autonomous decision engine",
    body:
      "Flowbound watches inventory, lead times, and open POs continuously and surfaces the call to make. Reorder, hold, or reroute, before a stockout or an overbuy happens.",
  },
  {
    n: "02",
    title: "A consulting wrapper, not just a dashboard",
    body:
      "Every recommendation comes with the reasoning behind it, in plain language. It's the part you used to pay a consultant to explain.",
  },
  {
    n: "03",
    title: "A chatbot that knows your supply chain",
    body:
      "Ask it anything, like why we reordered from Supplier B, or what happens if lead times slip a week, and it answers from your live data, not a canned help doc.",
  },
]

export function ProductExplainer() {
  return (
    <section id="product" className="border-b border-fb-black/10 py-20 md:py-28">
      <div className="container-fb">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">What Flowbound is</p>
          <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.2rem]">
            One system that decides, explains, and answers.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.n} className="border-t-2 border-fb-green-500 pt-5">
              <span className="font-mono text-sm text-fb-black/35">{p.n}</span>
              <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-fb-black/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
