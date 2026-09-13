---
title: "Supply Chain KPIs Worth Tracking"
description: "Six supply chain KPIs for small distributors, real benchmark ranges for each, and why tracking five metrics well beats tracking twenty poorly."
publishDate: 2026-09-01
author: "Flowbound"
category: "Industry Insights"
tags: ["industry insights", "KPIs", "inventory management", "supplier management", "shipping and logistics"]
---

Six numbers cover most of what a small distributor actually needs to know about how their supply chain is
running: fill rate, inventory turns, days of supply, on-time-in-full (OTIF), stockout rate, and defect rate.
Track those five or six well, every week, and you'll catch most real problems before a customer does. Track
twenty metrics pulled off a generic KPI list and you'll likely catch fewer, because nobody has time to
actually look at all twenty, so the dashboard becomes wallpaper instead of a decision tool.

That's the case this post is going to make in more detail: which of these numbers matter most for a
business your size, what a realistic benchmark looks like for each one, and why the right move is usually
to track fewer of them, not more.

## The six KPIs worth your attention

**Fill rate** is the percentage of an order you can ship complete, right now, from stock on hand: units
shipped divided by units ordered, times 100. Order 100 units of a SKU and ship 94 immediately, backordering
the rest, and your fill rate on that order is 94%. A healthy fill rate for a small distributor is generally
95% or higher; anything under 90% on a regular basis usually means your [demand
forecasting](/demand-forecasting/) is running behind what customers are actually asking for, not that
customers are ordering unpredictable amounts.

**Inventory turns** (or inventory turnover) measures how many times you sell through your average inventory
in a year: cost of goods sold divided by average inventory value. A distributor doing $1.2 million in COGS
against $150,000 in average inventory is turning 8 times a year, roughly every 45 days. Most healthy
distribution businesses land somewhere between 5 and 10 turns annually, and six turns, about 61 days of
inventory sitting on the shelf, is a reasonable target if your stockout rate stays under control at the same
time (more on why that pairing matters below). [Inventory Tracking](/inventory-tracking/) is the number this
depends on most directly, since a turns calculation is only as good as the on-hand figure feeding it.

**Days of supply** (also called days of inventory on hand) is turns viewed the other way: how many days
your current stock would last at your average sell-through rate. A 2026 industry survey of wholesale
distributors found 32% running 61 to 90 days of supply, with another 22% sitting above 90, meaning a real
chunk of the industry is quietly overstocked without necessarily knowing it. If your days of supply keeps
drifting upward on a SKU that isn't seasonal, that's cash tied up in shelf space, not a safety cushion,
and it's often the earliest visible sign of [dead stock building up](/blog/dead-stock-vs-slow-moving-stock/)
before anyone notices in the sales numbers.

**On-time-in-full (OTIF)** measures the share of orders that arrive both on the promised date and with the
full quantity ordered, counted as one pass/fail number, not two separate percentages. An order that arrives
a day late is a miss even if every unit shows up; an order that arrives on time but three units short is
also a miss. Multiply the two component rates to see why this is a stricter number than it first looks:
95% on-time and 95% in-full sounds solid, but combined that's only about 90% OTIF, since both conditions
have to hold on the same order. Competitive distributors aim for OTIF above 95%; anything meaningfully below
90% is worth digging into on both [supplier coordination](/supplier-coordination/) (are inbound lead times
slipping) and [shipping optimization](/shipping-optimization/) (are outbound carriers actually hitting the
dates you're quoting).

**Stockout rate** is the percentage of demand you couldn't fill at all because you were out of stock,
distinct from fill rate because it's measured against total demand across a period, not against a single
order. The spread here is wide: one industry benchmark puts top-performing distributors around a 2.1%
stockout rate, with laggards running as high as 16%, which is the difference between "occasionally out of a
slow mover" and "customers regularly hitting an empty shelf." A rising stockout rate almost always traces
back to a [reorder point](/blog/reorder-point-math/) that's set too low, too static, or both, which is why
this number and inventory turns need to be read together, not separately.

**Defect rate**, the share of units that come back damaged, wrong, or dead on arrival, is the one quality
metric on this list and the one most distributors track least consistently. The formula and realistic
benchmark ranges by product category (durable hardgoods under 1%, electronics 1 to 3%, apparel higher) are
covered in full in [how to calculate defect rate](/blog/how-to-calculate-defect-rate/); the short version is
that a rate under 1 to 2% is achievable for most non-fragile categories, and what matters more than the
absolute number is whether a supplier's own rate is rising relative to its history.

## Why five or six beats twenty

It's tempting to build a dashboard with every KPI a supply chain article mentions: perfect order rate,
cash-to-cash cycle time, carrying cost percentage, backorder rate, average lead time, freight cost per unit,
and a dozen more. Every one of them is a real, legitimate metric. None of them is free to maintain.

A metric only earns its place on a small team's dashboard if someone actually looks at it regularly and
changes a decision based on what it says. A 20-metric dashboard reviewed by a five-person team usually means
each metric gets a glance once a month, if that, which is functionally the same as not tracking it at all,
just with more setup work first. The honest failure mode isn't picking the wrong metrics, it's picking too
many good ones and then not having the attention to act on any of them consistently.

The six above were picked because they cover the four things that actually go wrong in a small distribution
business: not having enough stock (stockout rate, fill rate), having too much of the wrong stock (inventory
turns, days of supply), the order not arriving right (OTIF), and the product not being right when it does
(defect rate). A metric that doesn't map to one of those four failure modes is probably a nice-to-have, not
a must-track, for a business your size. This is the same lesson [the general SMB supply chain
gap](/blog/smb-supply-chain-gap/) keeps coming back to: the fix for a lean team is rarely more complexity,
it's fewer, better-tracked moving parts.

## How these numbers actually connect

Read in isolation, any one of these six can look fine while the underlying business isn't. Read together,
they catch each other's blind spots:

- **High inventory turns plus a rising stockout rate** usually means you're running too lean, cutting
  inventory investment in a way that's starting to cost you sales, not genuine efficiency.
- **Low inventory turns plus a low stockout rate** usually means the opposite: you're carrying comfortable
  buffer stock, but probably more of it than you need, and cash that could be doing something else is
  sitting on a shelf as insurance against a stockout that was never that likely.
- **A strong fill rate but a weak OTIF** points at a shipping or carrier problem, not an inventory one:
  you have the product, it's just not reliably arriving on the date you promised.
- **A weak fill rate but a strong OTIF** points the other way: what you do ship arrives fine, but you're
  backordering more of each order than you should be, which is usually a forecasting or reorder-timing gap.

None of these pairings show up if you only look at one number at a time, which is the real argument for
picking a small set deliberately rather than either tracking everything or tracking whatever's easiest to
pull from your existing system.

## Setting your own benchmark instead of chasing a generic one

The ranges above are a starting point, not a target to hit exactly. A distributor selling seasonal outdoor
gear will run a very different days-of-supply number in March than in September, and that's correct
behavior, not a problem to fix. What matters more than matching an industry-wide number is tracking your
own trend for each SKU or supplier over time: is this quarter's OTIF better or worse than last quarter's,
for the same supplier, at the same order volume. A defect rate of 2% that's been stable for a year tells you
something very different from a defect rate of 2% that was 0.8% three months ago, even though the two
numbers look identical in a single snapshot.

## Keeping six numbers current without a spreadsheet

The math behind every one of these KPIs is simple enough to calculate by hand for a single SKU in a few
minutes. Keeping all six current, for every active SKU and every supplier, updated weekly instead of
recalculated in a scramble before a quarterly review, is the part that stops happening once a catalog grows
past a few dozen items and the same one or two people are also on the phone with customers and suppliers all
day. That gap is exactly what [Flowbound](/product/) closes: it keeps inventory turns, days of supply, fill
rate, and stockout rate current per SKU automatically through [Inventory Tracking](/inventory-tracking/),
tracks OTIF per supplier through [Supplier Coordination](/supplier-coordination/), and rolls up defect rate
and on-time-in-full into a running supplier scorecard through [Quality Monitoring](/quality-monitoring/), so
the six numbers that actually matter are always current, not reconstructed from memory the day before a
review.

## FAQ

**What are the most important supply chain KPIs for a small business?**
Fill rate, inventory turns, days of supply, on-time-in-full (OTIF), stockout rate, and defect rate cover the
four things that most often go wrong for a small distributor: not enough stock, too much of the wrong stock,
late or incomplete orders, and bad product reaching a customer. A [reorder point](/blog/reorder-point-math/)
that's tracked well usually keeps the first two in check on its own.

**What's a good inventory turnover ratio for a distributor?**
Most healthy distribution businesses turn inventory 5 to 10 times a year, with 6 turns (about 61 days of
supply) a reasonable target as long as your stockout rate stays low at the same time. A number pulled from
[Inventory Tracking](/inventory-tracking/) that isn't paired with a stockout-rate check can look good while
actually meaning you're running dangerously lean.

**What's considered a good OTIF score?**
Above 95% is competitive for a small distributor, since OTIF is a stricter combined measure than it looks:
95% on-time and 95% in-full together only produce roughly 90% OTIF, because both conditions have to hold on
the same order. A score meaningfully below that is worth checking against both inbound
[supplier coordination](/supplier-coordination/) and outbound [shipping optimization](/shipping-optimization/)
separately to see which side is actually causing the miss.

**How many KPIs should a small distribution business actually track?**
Five or six, tracked consistently and acted on, beats fifteen or twenty that get reviewed once a quarter.
A metric only earns its spot on a small team's dashboard if it maps to a real failure mode (not enough
stock, too much stock, late orders, bad product) and someone actually changes a decision based on what it
says.

**How often should these KPIs be recalculated?**
Weekly for fast-moving SKUs and key suppliers, not just before a quarterly review. A defect rate or OTIF
score calculated once and left stale is really just a snapshot of the day it was pulled, the same gap
[Quality Monitoring](/quality-monitoring/) is built to close by keeping a running scorecard current instead
of rebuilding it from memory when a problem forces the issue.
