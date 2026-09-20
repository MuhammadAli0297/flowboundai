---
title: "Landed Cost: The Full Formula"
description: "What landed cost actually includes beyond the supplier invoice, the formula for calculating it, and why skipping it quietly erodes margin."
publishDate: 2026-09-30
author: "Flowbound"
category: "Shipping & Logistics"
tags: ["landed cost", "shipping optimization", "pricing strategy", "wholesale", "margin"]
---

Landed cost is the total cost of getting a unit of inventory from your supplier to your warehouse in
sellable condition, not just the price on the supplier invoice. It adds freight, customs duties and taxes,
insurance, and handling on top of the purchase price. For a lot of distributors, those extras stack
somewhere between 20 and 40 percent on top of what the invoice says, and pricing off the invoice number
alone means quietly selling at a thinner margin than the spreadsheet shows.

## The formula

Landed cost = product cost + freight + customs duties and taxes + insurance + handling and other operating
costs

Each piece is straightforward on its own, but easy to leave out when a quick price is needed:

- **Product cost**: what's actually on the supplier's invoice.
- **Freight**: the cost of getting the shipment from the supplier to your door, which varies a lot by
  [carrier and lane choice](/shipping-optimization/).
- **Customs duties and taxes**: relevant for anything imported, calculated against the shipment's declared
  value and tariff classification.
- **Insurance**: coverage for the shipment while it's in transit, cheap relative to the risk it covers but
  easy to forget entirely.
- **Handling and operating costs**: receiving labor, warehousing before the item is sellable, brokerage fees
  if a customs broker is involved.

**A worked example.** A SKU costs $10 per unit on the supplier invoice. Freight works out to $1.20 per unit
for that shipment, duties add $0.60, insurance and handling add another $0.40. Landed cost is $12.20, not
$10. If a reorder decision, or a sell price, is built off the $10 invoice number, the real margin on that
SKU is running about 18 percent thinner than it looks on paper.

## Why this gets skipped

For a domestic supplier with predictable, flat-rate freight, the invoice price and the landed cost aren't
that far apart, and it's tempting to treat them as close enough. The gap widens fast the moment a shipment
crosses a border, involves multiple carriers, or ships in an irregular pattern where freight cost per unit
swings with volume. A distributor sourcing from several suppliers, some domestic and some importing, ends up
with wildly different landed-cost margins across SKUs that look identical on the invoice, and pricing them
the same is a quiet way to lose money on the imported half of the catalog without ever seeing why.

## Allocating cost across a mixed shipment

Most shipments aren't a single SKU, they're a pallet or a container carrying several products at once, and
freight, duties, and handling need to be split across them somehow. The common default is value-based
allocation: divide the shared costs proportionally by each line item's share of the total invoice value, so
a $2,000 SKU absorbs a bigger slice of the shared freight bill than a $200 one on the same shipment. It's not
perfect (a bulky, low-value item can cost more to ship than its price share suggests) but it's close enough
for most pricing decisions, and far more accurate than ignoring the allocation question and pricing every
SKU off the invoice number alone.

## What landed cost actually changes

Getting this number right changes two decisions, not one. It changes what a SKU actually costs, which
changes whether a given sell price is profitable at all. And it changes carrier and lane decisions: [the
cost of picking the wrong carrier](/blog/cost-of-picking-the-wrong-carrier/) isn't just the freight quote,
it's the freight quote's effect on landed cost and, downstream, on margin for every unit in that shipment.
[LTL versus parcel](/blog/ltl-vs-parcel-shipping/) and [freight class](/blog/freight-class-explained-ltl-shipping/)
decisions that look like pure logistics questions are really landed-cost questions once you follow the math
through to the SKU's real margin.

## The connection to pricing

A sell price set without an accurate landed cost isn't wrong on the day it's set, it's wrong the moment
freight rates, duties, or supplier pricing shift and nobody re-runs the math. [The cost of repricing
manually](/blog/cost-of-repricing-manually/) is exactly this: a margin that erodes gradually because
updating price for a cost change that already happened is a task that keeps losing the competition for
attention against whatever's more urgent that day. [Shipping costs that creep up](/blog/shipping-costs-creeping-up/)
without anyone noticing hit landed cost directly, and from there hit margin, well before anyone catches it
in a P&L review.

## Landed cost and demand forecasting

Landed cost also matters for a decision that has nothing to do with pricing on its face: which supplier or
sourcing option to use for a reorder. Two suppliers quoting similar invoice prices can have meaningfully
different landed costs once freight and duties are factored in, and a [demand forecast](/demand-forecasting/)
that recommends a reorder quantity is more useful when the cost basis behind that recommendation reflects
what the order will actually cost delivered, not just the number on a price sheet.

## What Flowbound does and doesn't do here

Flowbound doesn't calculate customs duties or file import paperwork, that stays a finance and compliance
function outside the product. What [Shipping Optimization](/shipping-optimization/) does is keep the freight
component of landed cost down: comparing carriers, lanes, and lead times automatically and recommending the
option that gets an order there on time for the least cost, rather than defaulting to whatever carrier was
used last time. And when supplier costs shift, [Pricing](/pricing/) adjusts your sell price within the
bounds you set so a change in what a SKU actually costs to land doesn't sit unaddressed until someone
happens to notice the margin has thinned.

## FAQ

**What is landed cost?**
Landed cost is the total cost of getting a unit of inventory from a supplier to your warehouse in sellable
condition: product cost plus freight, customs duties and taxes, insurance, and handling. It's the real cost
basis for a SKU, not just the supplier invoice price.

**What's the landed cost formula?**
Landed cost = product cost + freight + customs duties and taxes + insurance + handling and other operating
costs. For a shipment carrying multiple SKUs, shared costs like freight are typically allocated proportionally
by each item's share of total invoice value, the same per-SKU cost basis a [demand forecast](/demand-forecasting/)
should be weighed against when deciding whether a reorder is actually worth it.

**How much does landed cost typically add on top of the invoice price?**
It varies by shipment, but non-product costs commonly stack somewhere between 20 and 40 percent on top of
the supplier invoice, more for imported goods involving customs duties, less for simple domestic shipments
with flat, predictable freight.

**Why does landed cost matter for pricing?**
A sell price set off the invoice price alone overstates real margin once freight, duties, and handling are
factored in. [Pricing](/pricing/) decisions that don't account for landed cost, or don't get revisited when
freight rates or supplier costs shift, quietly erode margin over time.

**Does carrier choice actually affect landed cost by much?**
Yes. Freight is usually the largest non-product component of landed cost, so [the carrier and lane chosen
for a shipment](/shipping-optimization/) has a direct, often significant effect on what a SKU actually costs
once it's landed, not just on how fast it arrives.
