---
title: "Dead Stock vs. Slow-Moving Inventory"
description: "Dead stock and slow-moving stock look identical on a shelf. Here's the actual test to tell them apart, and why a wholesale account changes the answer."
publishDate: 2026-08-02
author: "Flowbound"
category: "Inventory Management"
tags: ["inventory management", "dead stock", "slow-moving inventory", "small business"]
---

Walk through most small warehouses and you'll find the same thing: a corner of SKUs that haven't moved in
months, all lumped together under one label, "slow stuff." Some of that inventory is genuinely dead, it's
never selling again and the only question is how much you recover on it. The rest is just slow, and treating
it like the first group means you stop reordering something that would have sold fine with a little more
patience.

## What is dead stock?

Dead stock is inventory that has stopped selling entirely, with no seasonal or account-specific reason for
the drop, and shows no real prospect of moving again at anything close to its original price. Slow-moving
stock is different: it still sells, just at a reduced pace. The dividing line isn't how much is on the
shelf. It's whether demand is still there at all.

## Two problems that look identical on a shelf

Dead stock and slow-moving stock look the same sitting in a warehouse: quiet, dusty, not turning over. The
difference only shows up when you look at the trend behind the number, not the number itself. A SKU that
sold five units a month for a year and then stopped is dead. A SKU that's always sold five units a month,
slowly and steadily, was never dead to begin with, it's just not a fast mover, and it never will be.

The test most guides recommend is an aging report: flag anything that hasn't sold in 90, 180, or 365 days
and work down the list. That's a fine starting filter, but age alone can't tell you which bucket a SKU
belongs in, and it's only as good as the count backing it. If your
[on-hand and sold quantities](/blog/what-real-time-inventory-actually-means/) are a week or two stale, the
aging report is working off the wrong starting date. A 200-day-old SKU that sold two units 40 days ago is
aging and slow. A 200-day-old SKU that hasn't sold once since it arrived is aging and dead. Same number in
the aging report, two completely different situations.

## Why this is different for a wholesale account than a retail shelf

Most dead stock advice is written for a retail storefront watching one demand signal: total units sold
across all customers. Wholesale and distribution has a second layer retail articles skip entirely, and it
changes the math. A SKU can look dead in your aggregate sales report while one standing account is still
ordering it every quarter, right on schedule, just not often enough to show up against the rest of your
catalog's noise. Write that SKU off as dead stock and you don't just eat a write-down, you show up short the
next time that account places its usual order.

The reverse happens too. A SKU can look like a broad, healthy slow mover in the aggregate while it's
actually propped up entirely by a single large account, and dead everywhere else. If that account switches
suppliers or discontinues the line on their end, what looked like steady, diversified demand disappears in
one order cycle, not a slow fade. The aggregate number told you it was fine right up until it wasn't.

The practical fix is to check velocity per account before you commit to a dead-stock call on anything that
serves more than a couple of standing accounts, not just per SKU. A flat aggregate trend can hide either
story, and they call for opposite decisions: keep light stock on hand for the quarterly account, or start a
conversation with the account carrying the whole SKU before you're caught flat-footed.

## What getting the label wrong actually costs

Call a slow mover dead, and you stop reordering it right before a customer who actually wants it shows up,
plus you likely write down inventory you didn't need to. Call dead stock slow, and it sits taking up space
and tying up cash for another six months on the theory that it'll eventually move.

Run the numbers on a real example. Say a SKU cost you $6,000 landed for a pallet that's now sitting
untouched. Carrying costs, warehouse space, insurance, and the opportunity cost of that cash not being in a
SKU that actually sells, run in the range of 20 to 30% of inventory value per year as a widely used industry
estimate. Six months of carrying that pallet as an unresolved "maybe slow, maybe dead" SKU costs you
somewhere around $600 to $900 in carrying cost alone, on top of whatever the pallet is actually worth by the
time you finally act on it. That's the cost of indecision, separate from the cost of being wrong in either
direction.

## The write-off and tax timing question

Once something is genuinely dead, not just slow, there's a real accounting decision behind it, not just a
warehouse one. Under standard lower-of-cost-or-market treatment, inventory that won't sell at or near its
carrying value should be written down to what you can actually recover for it, and that write-down is a real
expense that reduces taxable income in the period you take it. Write it down too early, while a SKU still
has a real shot at moving, and you've taken a deduction you'll need to reverse or explain if it turns out to
sell after all. Write it down too late, and you're carrying an asset on the books at a value it doesn't
actually have, plus you've delayed a deduction you were entitled to take. Neither mistake is catastrophic on
its own, but on a catalog with real dead stock sitting in it every quarter, the timing adds up. This isn't a
substitute for your accountant's judgment on a specific SKU, but it's a reason to actually run the dead vs.
slow test before a write-off decision, not after.

## Dead stock is usually a symptom, not the original problem

Most dead stock write-ups treat it as an isolated inventory event: a SKU went bad, write it off, move on.
In practice, dead stock is almost always downstream of a forecasting miss or a reorder point that never got
updated. Something got ordered at a quantity based on demand that later dried up, seasonality that never
came back, or a customer that stopped buying, and nobody adjusted the number going forward.

That's worth internalizing because it changes what you fix. Writing off the dead SKU clears the shelf, but
it doesn't stop the next one from piling up the same way. [Demand forecasting](/demand-forecasting/) that
actually [gets redone on a regular schedule](/blog/forecast-demand-without-a-data-team/), instead of set
once and left alone, is what keeps a slow fade from turning into a pallet of dead stock six months later.
The same logic applies to the [reorder point](/blog/reorder-point-math/) itself: a reorder point calculated
off stale average sales will keep replenishing a SKU that's already dying, right up until someone notices
the shelf isn't clearing.

## What to do with each, once you know which is which

Slow-moving stock usually just needs a smaller reorder quantity and a longer runway, not a fire sale. Cut
the order size, extend the interval between reorders, and keep it in rotation. If it's genuinely tied to one
account, keep enough on hand to serve that account's cadence and stop stocking it for anyone else.

Dead stock in a wholesale context rarely has the same easy exits a retail storefront has. A clearance sale
or a markdown to consumers isn't usually an option when your customers are other businesses buying at
volume. The realistic paths are trading it to a liquidator or jobber who specializes in exactly this,
bundling it into a deal with an account that's already buying something else from you, checking whether
your supplier agreement allows a return-to-vendor on unsold stock, or, if none of that recovers meaningful
value, writing it off cleanly and freeing the warehouse space and the cash for something that will actually
turn.

## Watching the difference instead of guessing at it

Telling the two apart by memory works until you're tracking more than a handful of SKUs across more than a
handful of accounts, at which point it becomes a spreadsheet exercise nobody has time to run every month.
Demand Forecasting watches that same sales history for every SKU, the trend that actually separates dead
from slow, so it factors into what you're told to reorder and how much, instead of lumping a bestseller and
a dead SKU into one flat average. [Inventory Tracking](/inventory-tracking/) pairs with that by keeping
real-time visibility into what's on hand, what's incoming, and what's already spoken for, so the warehouse
count backing up that trend is accurate too, not a guess from the last physical count.

## FAQ

**What is the difference between dead stock and slow-moving inventory?**
Dead stock has stopped selling entirely with no real prospect of picking back up. Slow-moving inventory
still sells, just less often. The test is the sales trend over time, not how much is sitting on the shelf
right now.

**How do you identify dead stock?**
Compare recent sales (the last three months) against the trailing twelve. A flat, ongoing trickle is
slow-moving. A trickle that's stopped entirely, with no seasonal or account-specific explanation, is dead.
For wholesale catalogs, check the trend per account as well as in aggregate, since a SKU can look dead
overall while one standing account keeps it alive on its own.

**Should I write off dead stock immediately?**
Only once you've confirmed it's actually dead, not just slow. Writing down inventory that still has a real
shot at selling means reversing or explaining that deduction later if it turns out to move. Confirm the
trend first, then talk to your accountant about the timing.

**Can slow-moving inventory become dead stock?**
Yes, and it's the most common path dead stock takes. A SKU that keeps getting reordered at the same
quantity despite a shrinking trend eventually stops selling altogether. Catching the slowdown early, and
adjusting the reorder point instead of leaving it on autopilot, is what prevents that slide.
