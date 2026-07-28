export type ServiceCapability = {
  title: string
  description: string
  // Optional dedicated page for this capability. When set, the nav flyout
  // links here instead of the service anchor, and the services page grid
  // gets a centered CTA button under this capability's tile.
  href?: string
  ctaLabel?: string
}

export type ServiceTone = "paper" | "white" | "dark"
export type ServiceIcon = "spark" | "crate" | "network" | "bolt" | "chat" | "shield-check"

export type Service = {
  slug: string
  name: string
  tone: ServiceTone
  icon: ServiceIcon
  headline: string
  description: string
  capabilities: ServiceCapability[]
  // Optional dedicated page for the service as a whole (used instead of
  // per-capability pages when the capabilities are better told as one
  // narrative, e.g. Customer Service, Quality Monitoring). When set, the
  // nav's top-level link goes straight here instead of the services anchor,
  // and the services page grid gets a centered CTA button under the whole
  // section, matching the Ask Flowbound teaser pattern.
  href?: string
  ctaLabel?: string
}

export const services: Service[] = [
  {
    slug: "inventory",
    name: "Inventory",
    tone: "white",
    icon: "crate",
    headline: "Inventory that forecasts, tracks, and ships itself smarter.",
    description:
      "Inventory is usually where small and mid-sized supply chains lose the most money: too much cash tied up in the wrong SKUs, not enough of what's actually selling, and shipping costs that creep up because nobody's watching lane by lane. Flowbound's inventory service covers the full loop, from forecasting what you'll need, to tracking what's on hand, to picking the cheapest way to get it where it needs to go.",
    capabilities: [
      {
        title: "Demand Forecasting",
        description:
          "Flowbound looks at your sales history, seasonality, and supplier lead times to tell you what you'll actually need to reorder and when, so you're not caught flat-footed on a bestseller or sitting on dead stock.",
        href: "/demand-forecasting",
        ctaLabel: "Explore Demand Forecasting",
      },
      {
        title: "Inventory Tracking",
        description:
          "Real-time visibility into what's on hand, what's incoming, and what's already spoken for. No more reordering something you already have or promising stock you don't.",
        href: "/inventory-tracking",
        ctaLabel: "Explore Inventory Tracking",
      },
      {
        title: "Shipping Optimization",
        description:
          "Flowbound compares carriers, lanes, and lead times automatically and recommends the option that gets your order there on time for the least cost. No manual rate shopping required.",
        href: "/shipping-optimization",
        ctaLabel: "Explore Shipping Optimization",
      },
    ],
  },
  {
    slug: "supplier-management",
    name: "Supplier Management",
    tone: "paper",
    icon: "network",
    headline: "Supplier relationships that run themselves, without dropping the ball.",
    description:
      "Managing suppliers by spreadsheet and email works until it doesn't: a missed reorder point, a wholesale account nobody's watching, a vendor conversation that falls through the cracks. Flowbound's supplier management service keeps every supplier relationship and wholesale account current, so nothing gets missed and nobody's chasing down a status update by phone.",
    capabilities: [
      {
        title: "Supplier Coordination",
        description:
          "Flowbound keeps every supplier conversation, purchase order, and lead time change in one place, and flags the ones that need your attention before a delay turns into a stockout.",
        href: "/supplier-coordination",
        ctaLabel: "Explore Supplier Coordination",
      },
      {
        title: "Wholesale Account Management",
        description:
          "Track pricing tiers, order minimums, and standing wholesale agreements per account, so every reorder goes out at the right terms without you having to double check the contract each time.",
        href: "/wholesale-account-management",
        ctaLabel: "Explore Wholesale Account Management",
      },
    ],
  },
  {
    slug: "autonomous",
    name: "Autonomous",
    tone: "dark",
    icon: "bolt",
    headline: "Reorders and pricing calls that happen without waiting on you.",
    description:
      "Most systems tell you what to do and wait for someone to click approve. Flowbound goes a step further: once you trust the call, it reorders and reprices on its own, inside the guardrails you set, and tells you afterward what it did and why. No dashboard to check before a purchase order goes out.",
    capabilities: [
      {
        title: "Reorder",
        description:
          "Flowbound places the purchase order the moment your reorder point is hit, at the quantity and supplier it already recommended, so restocking doesn't wait on someone opening their laptop.",
        href: "/reorder",
        ctaLabel: "Explore Reorder",
      },
      {
        title: "Pricing",
        description:
          "When supplier costs shift or demand moves, Flowbound adjusts your sell price within the bounds you set, so your margin holds without you re-running the math every time something changes.",
        href: "/pricing",
        ctaLabel: "Explore Pricing",
      },
    ],
  },
  {
    slug: "customer-service",
    name: "Customer Service",
    tone: "white",
    icon: "chat",
    headline: "Customer questions answered before your team even sees them.",
    description:
      "Every \"where's my order\" or \"what happened to my shipment\" question is really a supply chain question, and most small teams end up answering the same ones over and over by hand. Flowbound puts your live order, shipment, and inventory data behind a chat agent that answers customers directly, and hands off to your team only when a real judgment call is needed.",
    capabilities: [
      {
        title: "Order Status & Tracking",
        description:
          "Customers get a real answer on where their order is and when it'll arrive, pulled straight from live shipment data instead of a guess or a canned reply.",
      },
      {
        title: "Returns & Claims Handling",
        description:
          "Flowbound checks a return or damage claim against the actual order and shipment record and routes it correctly, so your team isn't chasing down details before they can even start helping.",
      },
      {
        title: "Customer Inquiries",
        description:
          "The same agent that runs your supply chain answers customer questions in plain language, using your real data, so your team only steps in for the calls that actually need a person.",
      },
    ],
    href: "/customer-service",
    ctaLabel: "Explore Customer Service",
  },
  {
    slug: "quality-monitoring",
    name: "Quality Monitoring",
    tone: "paper",
    icon: "shield-check",
    headline: "Catch a quality problem before it becomes a pattern.",
    description:
      "A damaged shipment or a bad batch is easy to miss when it's buried in a spreadsheet of returns and complaints. Flowbound watches inspection results, returns, and supplier performance together, so a quality issue gets flagged while it's still one incident, not after it's cost you a repeat customer.",
    capabilities: [
      {
        title: "Defect & Damage Detection",
        description:
          "Flowbound flags damage and defect patterns as they show up in returns and inspections, instead of waiting for someone to notice the trend by hand.",
      },
      {
        title: "Supplier Quality Scorecards",
        description:
          "Every supplier gets a running record of defect rates and on-time-in-full performance, so a quality conversation with a vendor comes with the numbers already attached.",
      },
      {
        title: "Inspection Tracking",
        description:
          "Incoming inspection results get logged and checked automatically, and anything that fails gets flagged before it ever reaches your shelf.",
      },
    ],
    href: "/quality-monitoring",
    ctaLabel: "Explore Quality Monitoring",
  },
]
