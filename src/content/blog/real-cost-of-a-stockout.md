---
title: "The Real Cost of a Stockout"
description: "How to calculate the cost of a stockout: lost sales, lost margin, expedite costs, and customers who don't come back, with a worked example."
excerpt: "Lost sales are the smallest part of what an empty shelf costs."
publishDate: 2026-10-10
author: "Muhammad Hassan"
authorTitle: "CEO"
category: "Industry Insights"
tags: ["stockout", "lost sales", "inventory management", "safety stock", "reorder points"]
---

The cost of a stockout is the revenue and margin you lose while an item is unavailable, plus the extra costs of
recovering, plus the customers who go elsewhere and do not return. The basic formula is stockout days
multiplied by the daily sales rate you would have had. That number is the minimum. For most small distributors
it is the smallest piece of the real bill, which is why stockouts get underestimated and underfunded as a
problem.

## The direct loss: lost sales

Start with the simplest version:

Lost units = days out of stock x daily sales rate before the stockout

Lost revenue = lost units x selling price

Lost margin = lost units x margin per unit

Use margin for decisions. Revenue overstates what you actually lost, because you would have spent money on the
goods to earn it.

**Pick the baseline carefully.** Use the daily rate from just before the stockout, not a long trailing
average. A trailing average that includes the empty days is dragged down by the zeros and understates the
loss. If an item sold 15 units a day for 20 days and then sat empty for 10, a 30-day average says 10 a day,
which suggests 100 lost units. The real figure is 150.

## The costs on top

Lost sales are only the visible part. Add:

- **Expedite costs.** Rush freight and overtime to recover, which tend to cost far more than a planned
  replenishment. [Rush shipping is a symptom, not a solution](/blog/rush-shipping-is-a-symptom-not-a-solution/)
  explains why it becomes a habit.
- **Substitution and discounts.** Selling a substitute at a lower margin, or discounting to keep an annoyed
  customer.
- **Lost repeat business.** The customers who tried you, found it unavailable, and bought from a competitor.
  This is the largest and hardest to measure.
- **Staff time.** Hours spent apologizing, chasing suppliers, and re-routing orders.

## A worked example

A SKU sells 15 units a day at $40, with a gross margin of $14 per unit. A late supplier shipment leaves it out
of stock for 10 days.

- Lost units = 10 x 15 = **150**
- Lost revenue = 150 x $40 = **$6,000**
- Lost margin = 150 x $14 = **$2,100**
- Expedited freight to restock = **$450** (assumed)
- Customer attrition: of 40 customers who hit the stockout, assume 10 percent do not return, and each is worth
  $800 in lifetime margin. 4 x $800 = **$3,200** (assumed)

Total estimated cost = $2,100 + $450 + $3,200 = **$5,750**, more than two and a half times the margin
number you would see if you only counted the lost sales. The expedite and attrition figures are illustrative
assumptions, so replace them with your own. What matters is that the structure holds: the direct loss is a
floor.

## Why stockouts keep happening

Most stockouts trace back to a short list of causes, none of them mysterious:

1. **Reorder points that are out of date.** Demand shifted and the trigger did not. The math behind a sound
   trigger is in [reorder point math](/blog/reorder-point-math/).
2. **No buffer for variability.** Demand and lead times fluctuate, and without [safety
   stock](/blog/safety-stock-how-much-buffer-you-need/) any swing becomes an empty shelf.
3. **Supplier delays nobody saw coming.** A [lead time that slips](/blog/supplier-lead-time-slips/) is invisible
   until the stock runs out.
4. **Bad on-hand data.** The system says you have 12, the shelf has 0.
5. **Manual replenishment.** An order that waits on someone being free is an order that arrives late. The
   [real cost of manual supply chain processes](/blog/real-cost-of-manual-supply-chain-processes/) adds up
   well beyond the stockouts themselves.

## Using the number

Once you can price a stockout, the trade-off against overstock becomes concrete. Safety stock has a carrying
cost, and a stockout has the cost you just calculated. The right buffer is where the two balance, and
different SKUs balance in different places. A fast, high-margin item justifies a larger buffer than a slow,
low-margin one. Track the [stockout rate and other KPIs](/blog/supply-chain-kpis-to-track/) so the problem
stays visible, and so you can tell whether your changes work.

## Where Flowbound fits

Flowbound works on the causes, not the accounting. [Inventory Tracking](/inventory-tracking/) gives you live
visibility into what is on hand, what is incoming, and what is already spoken for, so you are not working from
stale numbers. [Demand Forecasting](/demand-forecasting/) uses sales history, seasonality, and supplier lead
times to tell you what you will need and when. [Supplier Coordination](/supplier-coordination/) flags lead-time
changes before a delay turns into a stockout, and [Reorder](/reorder/) can place the purchase order at your
reorder point at the quantity and supplier already recommended, once you trust it and inside the guardrails you
set.

## FAQ

**What is the cost of a stockout?**
It is the lost sales and margin while an item is unavailable, plus recovery costs such as expedited freight,
plus the long-term cost of customers who switch to a competitor. The simplest formula multiplies stockout days
by the daily sales rate from before the stockout.

**Should I measure lost sales in revenue or margin?**
Use margin for decisions, since revenue overstates what you lost. Revenue is a useful headline number but
ignores the cost of the goods you did not have to buy. Pairing the figure with your [safety
stock](/blog/safety-stock-how-much-buffer-you-need/) decisions shows what a buffer is worth.

**Why not use a trailing average for daily sales?**
A trailing average that includes the stockout days contains zero-sales days, which pull the average down and
understate the loss. Use the rate from the period just before the item ran out.

**How do I prevent stockouts?**
Keep reorder points current, hold safety stock sized to your demand and lead-time variability, and watch
supplier delays early. Methods are covered in [reorder point math](/blog/reorder-point-math/) and in the
[forecasting without a data team](/blog/forecast-demand-without-a-data-team/) guide.

**Can software prevent stockouts?**
It can reduce them by keeping data current and acting on it promptly. [Reorder](/reorder/) places purchase
orders when your reorder point is hit, and [Demand Forecasting](/demand-forecasting/) keeps the quantities
grounded in real demand. No tool removes supplier risk entirely.
