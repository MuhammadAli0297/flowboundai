const reasons = [
  "No SI required. You're connected in days, not months.",
  "One subscription. No consulting bill stacked on top.",
  "Continuous decision making, not a once-a-month review.",
  "Ask the agent directly instead of filing a support ticket.",
  "Built for teams without a dedicated ops analyst on staff.",
  "Every recommendation comes with its reasoning attached.",
]

export function WhyUs() {
  return (
    <section id="why" className="border-b border-fb-black/10 bg-fb-white py-20 md:py-28">
      <div className="container-fb">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">Why small business teams choose Flowbound</p>
          <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.2rem]">
            Built for the team that doesn't have an SAP budget.
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-3 border-t border-fb-black/10 pt-5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fb-green-500" />
              <span className="text-[1rem] leading-relaxed text-fb-black/75">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
