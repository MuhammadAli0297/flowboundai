---
title: "Inventory Shrinkage: Causes and How to Track It"
description: "What inventory shrinkage actually is, the formula to calculate your rate, realistic benchmarks, and how a small distributor can track it without an ERP."
publishDate: 2026-08-08
author: "Flowbound"
category: "Inventory Management"
tags: ["inventory management", "shrinkage", "inventory tracking", "warehouse operations", "small business"]
---

Most inventory shrinkage advice is written for a retail store with a sales floor, a shoplifter problem, and
a loss-prevention budget. If you run a warehouse and sell to other businesses, most of that doesn't apply to
you. Nobody is walking out your front door with a jacket under their coat. Your shrinkage is coming from
somewhere else entirely, and the articles built around shoplifting stats won't help you find it.

## What is inventory shrinkage?

Inventory shrinkage is the gap between what your records say you have and what you actually have on the
shelf, measured in units or dollar value. If your system says 500 units of a SKU and a physical count turns
up 480, you've shrunk 20 units. For a wholesale distributor, that gap usually comes from four places: theft
(employee, rarely customer, since customers aren't walking your aisles), damage that never got logged,
administrative or counting error, and supplier shortages on receiving, meaning a purchase order for 500
units that arrived as 480 but got checked into the system as a full 500 anyway.

## How to calculate your shrinkage rate

The formula is simple:

**Shrinkage rate = (recorded inventory value − actual inventory value) ÷ recorded inventory value × 100**

Worked example: your system shows $120,000 of inventory value for a given warehouse. A physical count
values what's actually on the shelf at $114,000. The gap is $6,000, and $6,000 divided by $120,000 is 0.05,
or a 5% shrinkage rate. Run this per SKU, not just at the warehouse level, and you'll usually find the total
is hiding a lot of variance: most of your catalog shrinks at 1% or less, and two or three SKUs are doing
most of the damage.

## What realistic benchmarks look like

General retail benchmarks put average shrinkage around 1.5% of sales, with anything from 0.5% to 2%
considered normal and anything past 5% a real problem. Those numbers come from stores with foot traffic and
shoplifting exposure, which most B2B distributors don't have. If you're a warehouse operation with no retail
floor, no walk-in customers, and controlled access, your realistic target is meaningfully lower, closer to
0.2% to 1%. If a warehouse-only operation is running shrinkage above 1.5%, that's not a theft problem in the
way a retail benchmark would suggest. It's almost always a receiving or counting process problem, and it's
worth treating it as one before assuming someone on staff is stealing.

One distributor we've talked to found this the hard way: a 2.8% shrinkage rate that looked like a theft
issue on paper turned out to be almost entirely a receiving problem on one high-volume SKU. A supplier had
switched to shrink-wrapped pallets of 48 units instead of individually-boxed cases of 50, and the receiving
team had kept checking in pallets at the old count out of habit for three months before anyone noticed the
math no longer matched. That's 96 units a month, on one SKU, from a process change nobody flagged, not a
person walking off with product.

## The four real causes, and how each one actually shows up

**Theft.** In a warehouse setting this is almost always internal, an employee with access to stock and the
opportunity to move it without anyone noticing a specific unit is gone. It tends to concentrate on
high-value, easy-to-move SKUs rather than spreading evenly across the catalog, which is itself a useful
signal: if your shrinkage is one or two expensive SKUs consistently underperforming their count while
everything else tracks fine, that pattern points toward theft in a way that even, catalog-wide shrinkage
doesn't.

**Damage.** A pallet gets dropped, a case gets crushed in a forklift pass, a product gets damaged sitting
too long in a corner nobody was watching. The actual loss isn't the damage itself, it's the damage that
never gets written up. A warehouse where damaged units get logged and pulled from sellable inventory the
same day shows up in your books honestly. One where a damaged case gets shoved behind a shelf and dealt with
"later" shows up as a mystery gap during the next count instead, weeks after anyone remembers what happened
to it.

**Administrative and counting error.** This is the least dramatic cause and, for most B2B distributors, the
biggest one: a picker grabs the wrong SKU off an adjacent shelf, a unit gets logged into the wrong bin
location and effectively disappears from the count that matters, a return gets processed back into stock at
the wrong quantity. None of this is theft or damage, it's just human counting error compounding quietly
across thousands of transactions a month. If you've never audited how often your own bin-to-SKU accuracy is
actually right, this is very likely where a chunk of your shrinkage is hiding.

**Supplier shortage on receipt.** This is the cause retail-focused shrinkage articles almost never mention,
because a store buying from a distributor rarely deals with it directly, but it's a real and common source
for anyone receiving pallet or case-pack freight. A purchase order for 500 units shows up short at 480, and
if receiving checks the shipment in against the PO quantity instead of a physical count, the missing 20
units get absorbed into your system as if they arrived. You never had them, but your records say you did,
and the "loss" only surfaces months later at your next cycle count, disconnected from the shipment that
actually caused it. It's also the cause most tied to the supplier relationship itself: a vendor who's
[reliable about lead times](/supplier-coordination/) tends to ship accurate counts too, and a short
shipment is often the first sign a supplier relationship is starting to slip before the lead time itself
does.

## Tracking shrinkage without an ERP

You don't need a full ERP system to catch most of this. A few practices, done consistently, catch the
majority of shrinkage a small distributor deals with:

**Count against the physical shipment, not the purchase order.** Every inbound delivery gets counted by
hand against what actually arrived, not rubber-stamped against what the PO says should have arrived. This
one habit closes off the supplier-shortage cause almost entirely, and it's the single most commonly skipped
step we hear about from distributors who later find a shrinkage problem was really a receiving problem.

**Run cycle counts on a rotation, not one big annual count.** Counting your entire warehouse once a year
means a problem that started in February doesn't surface until December, ten months of compounding error
with no chance to catch it early. Splitting your catalog into sections and counting a different section
every week means every SKU gets a real count every couple of months, and a gap that opens up gets caught
within weeks instead of most of a year.

**Log damage the moment it happens, not at the next count.** A simple damage log, even a shared spreadsheet
by the receiving dock, that gets a line the same day a pallet gets dropped keeps damage from becoming an
unexplained gap later. The goal isn't a formal process, it's just making sure damage gets written down
before everyone forgets it happened.

**Track shrinkage per SKU, not just warehouse-wide.** A single blended shrinkage number tells you almost
nothing about where to look. Per-SKU tracking is what turns "we're off by 5%" into "we're off by 5% because
of these three SKUs," which is an actual, fixable finding instead of a vague worry.

**Reconcile discrepancies against a real record, not memory.** The practices above only work if there's
something to compare a physical count against in the first place, and that's exactly where a spreadsheet
maintained by memory starts to break down at any real volume. This is closer to what [real-time inventory
tracking](/blog/what-real-time-inventory-actually-means/) is supposed to solve: a record that reflects what
should be on hand at any moment, so a discrepancy shows up as a discrepancy instead of getting explained
away as "we probably miscounted."

## Shrinkage isn't the same problem as dead stock

It's worth being precise about what shrinkage is not. A SKU that's genuinely unsellable, discontinued,
seasonal, or simply not moving anymore, isn't shrinkage, it's [dead or slow-moving
stock](/blog/dead-stock-vs-slow-moving-stock/), a different problem with a different fix. Shrinkage is
specifically inventory that your records claim exists and physically doesn't, whether that's from theft,
damage, counting error, or a short shipment. Mixing the two together in your reporting makes both harder to
act on: a shrinkage number inflated by dead stock you haven't written off yet looks worse than your real
loss problem, and a dead stock number that's actually shrinkage in disguise means you're trying to discount
your way out of what's really a receiving or counting gap.

## Where this becomes a system problem, not a counting problem

Manual cycle counts and a damage spreadsheet catch a lot, but they all depend on someone remembering to
compare the record against reality regularly and consistently, across every SKU, every week. That's the part
that quietly stops happening once a warehouse gets busy or a key person is out for two weeks. [Inventory
Tracking](/inventory-tracking/) is built around exactly this gap: it keeps a live record of what's on hand
and flags a discrepancy between recorded and actual counts as it appears, rather than waiting for the next
scheduled count to surface a gap that's already months old. Paired with accurate [reorder
point](/blog/reorder-point-math/) math, which only works if the inventory number it's built on is trustworthy
in the first place, catching shrinkage early stops being a once-a-year fire drill and becomes a normal part
of how the warehouse runs.

## FAQ

**What is a normal inventory shrinkage rate?**
General retail benchmarks put average shrinkage around 1.5% of sales, with 0.5% to 2% considered normal. A
warehouse-only distributor with no retail floor and controlled access should expect to run lower, closer to
0.2% to 1%, since the shoplifting exposure that drives up retail benchmarks doesn't apply the same way to a
B2B operation using [inventory tracking](/inventory-tracking/) to keep counts current.

**How do you calculate inventory shrinkage rate?**
Subtract your actual, physically-counted inventory value from your recorded inventory value, then divide
that gap by the recorded value and multiply by 100. $6,000 of shrinkage on $120,000 of recorded inventory is
a 5% shrinkage rate. Running the same calculation per SKU rather than warehouse-wide usually shows the total
is driven by a small number of problem SKUs, not spread evenly across the catalog.

**What's the most common cause of shrinkage for a distributor, as opposed to a retailer?**
Retail shrinkage skews heavily toward shoplifting. A warehouse distributor with no retail floor usually sees
more shrinkage from administrative and counting error, plus supplier shortages that arrive short of the
purchase order quantity but get checked in as a full count. Both are process gaps, not theft, and both show
up as a mystery discrepancy at the next count rather than as an obvious event, the same discrepancy [reorder
point calculations](/blog/reorder-point-math/) quietly inherit if nobody catches it first.

**Is shrinkage the same thing as dead stock?**
No. Shrinkage is inventory your records say exists but physically doesn't, from theft, damage, error, or a
short shipment. [Dead stock](/blog/dead-stock-vs-slow-moving-stock/) is inventory that's still physically
there but isn't selling anymore. Treating the two as the same problem makes both numbers harder to trust and
harder to act on.

**How often should a small distributor do physical inventory counts?**
Rotating cycle counts, a different section of the warehouse every week so the full catalog gets counted
every couple of months, catch problems faster than one big annual count. An annual count means a
discrepancy that started early in the year doesn't surface until the count finally happens, by which point
it's much harder to trace back to whatever caused it.
