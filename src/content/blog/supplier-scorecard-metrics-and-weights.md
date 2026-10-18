---
title: "Supplier Scorecard: Metrics and Weights"
description: "How to build a supplier scorecard: which metrics to track, how to weight them, and how to measure delivery so scores reflect what you actually receive."
excerpt: "Which supplier metrics to track and how to weight them."
publishDate: 2026-10-04
author: "Muhammad Hassan"
authorTitle: "CEO"
category: "Supplier Management"
tags: ["supplier scorecard", "supplier management", "on-time delivery", "supplier performance", "wholesale"]
---

A supplier scorecard is a repeatable way to rate each supplier on the things that matter to your business,
usually delivery, quality, lead-time reliability, responsiveness, and cost. Each metric gets a score and a
weight, the weighted scores add up to one number per supplier, and the same scorecard runs every month or
quarter so you can see who is improving and who is slipping. It replaces "I feel like this vendor has been
late lately" with numbers you can put in front of the vendor.

## Why informal tracking breaks down

Most small teams know which suppliers are good and bad, in the sense that the person who places the orders
remembers. That works until you have more than a handful of suppliers, or the person who remembers leaves, or
you need to have a hard conversation and cannot back it up. [How many suppliers is too many to track by
hand](/blog/how-many-suppliers-is-too-many-to-track-by-hand/) is a real threshold, and a scorecard is what
you build once you cross it. It also surfaces a problem unprompted: a supplier whose [lead times keep
slipping](/blog/supplier-lead-time-slips/) shows up as a falling score before it shows up as a stockout.

## The metrics worth tracking

Most scorecards group metrics into a few categories. You do not need all of them, and a scorecard with twenty
metrics gets ignored. Start with the handful that map to real money:

- **On-time delivery.** The share of orders that arrive by the date you needed them. The most commonly
  weighted metric, and the one you will argue about definitions for.
- **Quality.** Defect rate or reject rate on incoming goods. The calculation is covered in [how to calculate
  defect rate](/blog/how-to-calculate-defect-rate/), and it should be measured the same way for every supplier.
- **Lead-time reliability.** Not how long the lead time is, but how consistent it is. A supplier that is
  always 14 days is easier to plan around than one that averages 10 and ranges from 5 to 25.
- **Responsiveness.** How quickly the supplier answers questions, confirms orders, and handles problems.
  Harder to measure, so keep the definition simple, such as hours to confirm a purchase order.
- **Cost accuracy.** Invoice price matching the agreed price. Price variance and invoice errors are a hidden
  cost that never appears in the quoted unit price.

## Define each metric before you measure it

The most common scorecard failure is two people measuring the same metric differently. Settle these before
you collect a single number:

- **Delivery is measured at your dock, not the ship date.** A supplier can ship on time and still deliver
  late because of a carrier delay. Decide whether that counts against the supplier. Either answer is
  defensible, but you need to pick one and apply it to everyone.
- **On time against which date?** The date you requested, or the date the supplier confirmed? Measuring against
  the confirmed date rewards suppliers who confirm generously. Measuring against the requested date is harsher
  and often more honest.
- **What counts as a defect?** A cosmetic scuff and a unit that does not work are not the same, and your
  scorecard should say how each is counted.

## Choosing weights

Weights say what you care about, and they should reflect your business, not a template. A common starting
point looks like this:

| Metric | Weight |
| --- | --- |
| On-time delivery | 40% |
| Quality | 25% |
| Lead-time reliability | 20% |
| Responsiveness | 15% |

If you sell perishable or time-critical goods, push delivery higher. If a defect means a safety problem or an
expensive return, push quality higher. If you can absorb late shipments with buffer stock, drop delivery and
raise cost accuracy. The weights are a statement of priorities, so write down why you chose them.

## A worked example

Score each metric from 0 to 100, multiply by its weight, and add the results.

| Metric (weight) | Supplier A | Supplier B |
| --- | --- | --- |
| On-time delivery (40%) | 96 | 85 |
| Quality (25%) | 99 | 99.5 |
| Lead-time reliability (20%) | 80 | 90 |
| Responsiveness (15%) | 70 | 95 |

- Supplier A: 38.4 + 24.75 + 16.0 + 10.5 = **89.7**
- Supplier B: 34.0 + 24.9 + 18.0 + 14.25 = **91.1** (24.875 rounds to 24.9)

Supplier A has the better on-time rate and still ranks second, because B is steadier on lead time and far
more responsive. That is the value of a composite score: it makes the trade-offs visible instead of letting
whichever number you looked at first decide the argument. The single score is only a summary. The useful
part is the breakdown, because it tells you what to raise with each supplier.

## Turn the scorecard into action

A scorecard nobody acts on is a spreadsheet. Build in the follow-up:

1. **Set a threshold.** Decide what score triggers a conversation, and what triggers looking for an
   alternative.
2. **Review on a schedule.** Monthly for key suppliers, quarterly for the rest. Look at the trend, not just
   the latest number.
3. **Bring the data to the conversation.** A supplier who hears "your on-time rate dropped from 94 to 82
   percent over two quarters" has something to respond to. This is also the evidence base for [renegotiating
   terms](/blog/renegotiating-wholesale-terms/).
4. **Use it at onboarding.** A new supplier should enter the same scorecard from their first order, which
   pairs naturally with a [supplier onboarding checklist](/blog/supplier-onboarding-checklist/).

Suppliers also already leave a trail you can score from. [Suppliers already have a quality track
record](/blog/suppliers-already-have-a-quality-track-record/) in your returns and inspection data, you just
have to collect it in one place.

## Where Flowbound fits

Flowbound does not decide your weights or which suppliers you keep, those are your calls. What it handles is
the data collection that makes a scorecard painful to maintain by hand. [Quality Monitoring](/quality-monitoring/)
keeps a running record of each supplier's defect rates and on-time-in-full performance, so a supplier
conversation arrives with the numbers attached. [Supplier Coordination](/supplier-coordination/) keeps supplier
conversations, purchase orders, and lead-time changes in one place and flags the ones that need attention
before a delay becomes a stockout.

## FAQ

**What is a supplier scorecard?**
A supplier scorecard is a recurring, structured rating of each supplier across metrics such as on-time
delivery, quality, lead-time reliability, and responsiveness. Each metric is weighted and the results combine
into a single score per supplier, tracked over time.

**Which metrics should a small business track first?**
Start with on-time delivery and quality, since those map most directly to lost sales and returns. Add
lead-time reliability once you have enough orders to measure consistency. The [defect rate
calculation](/blog/how-to-calculate-defect-rate/) gives you a consistent way to measure the quality side.

**How should I weight the metrics?**
Weight them by what costs you the most when they go wrong. A common starting split is 40 percent on-time
delivery, 25 percent quality, 20 percent lead-time reliability, and 15 percent responsiveness, adjusted to
your business. Write down the reasoning so the weights can be revisited.

**How often should I update the scorecard?**
Monthly for your most important suppliers and quarterly for the rest is a reasonable rhythm. Watch the trend
across periods rather than a single month, which can be skewed by one bad shipment.

**Can software build the scorecard for me?**
Software can collect and calculate the numbers automatically, which is the time-consuming part.
[Quality Monitoring](/quality-monitoring/) maintains supplier defect rates and on-time-in-full records, and
[Supplier Coordination](/supplier-coordination/) tracks the lead-time changes and order history behind them.
