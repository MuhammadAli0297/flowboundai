---
title: "Incoming Inspection Without a QA Team"
description: "Incoming inspection doesn't need AQL tables or a QA department. Here's a lightweight version a small distributor can actually keep running."
publishDate: 2026-08-05
author: "Flowbound"
category: "Quality Monitoring"
tags: ["quality monitoring", "inspection", "small business"]
---

Search "incoming inspection process" and most of what comes back assumes you have a QA department: sampling
plans, AQL tables, a dedicated inspector with a control plan and a gauge. That's the right process for a
manufacturer building parts to spec. It's overkill for a small distributor with two people on the receiving
dock and a truck to unload before lunch. Here's the version that actually fits.

## What is incoming inspection?

Incoming inspection is checking a shipment against what you ordered, quantity, condition, and item match,
before it goes into stock. It happens at receiving, the cheapest point in the entire supply chain to catch a
problem, before a defect gets shelved, sold, or shipped to a customer who now has to send it back.

## Why most guides don't fit a small distributor

Most incoming inspection content is written for manufacturing floors: ANSI Z1.4 sampling tables, critical
versus major versus minor defect tiers, a quality engineer who signs off before material moves. None of that
assumes what's actually true for a small wholesale or distribution operation. You're not inspecting raw
material against an engineering drawing, you're checking finished goods against a purchase order. You don't
have a QA department, you have whoever's on the dock that morning. And a process that only works when
someone has an hour per shipment to run a formal sampling plan is a process that quietly stops happening the
first busy week, which is exactly the failure mode the original version of this post described. The gap
isn't that small teams need a lighter checklist. It's that they need a process built for the staffing they
actually have, not a scaled-down version of one built for staffing they don't.

## What you're actually checking

Strip out the manufacturing-specific steps and a receiving inspection for finished goods comes down to four
things, in this order:

- **Documentation match.** Does the packing slip match the purchase order: right supplier, right PO number,
  right ship date.
- **Quantity.** Count what arrived against what was ordered. Short shipments are more common than damaged
  ones and easier to catch if you count before you sign for the delivery, not after.
- **Item match.** Is this actually the SKU you ordered, not a substitution the supplier made without telling
  you and not a similar-looking item pulled from the wrong bin on their end.
- **Visible condition.** Packaging integrity, obvious damage, anything that looks wrong at a glance. This
  isn't a lab test, it's a quick look before the box goes on a shelf.

That's it. No control plan, no critical-characteristic sign-off, no gauge calibration log. If a shipment
clears those four checks, it goes into stock.

A worked example: a pallet of 40 cartons comes in against a PO for 480 units. The packing slip lists the
right PO number and ship date, so documentation clears. You count 460 units, twenty short. Two cartons have
visible crush damage on a corner. That's a fifteen-minute check that surfaces two real issues, a short
shipment and possible damage, before either one becomes a stockout or a customer complaint. Compare that to
the alternative: the pallet goes straight to the shelf, the shortage doesn't surface until someone can't
fill an order weeks later, and by then there's no way to tell whether it was a receiving error, a picking
error, or a supplier shortage in the first place.

## How much to inspect, without an AQL table

The manufacturing answer to "how much of the lot do I actually check" is a sampling plan: for a 5,000-unit
lot at a given AQL, inspect exactly 200 units and reject the lot past a set defect count. A small distributor
doesn't need that math, and building it would eat more time than it saves. A simpler rule gets you most of
the benefit:

- **New supplier, or a SKU that's failed before:** full count, full visual check, every shipment, until
  there's a track record that says otherwise.
- **Established supplier with a clean record:** spot-check. Count the total, open and visually check a
  handful of cartons, not every one.
- **High-value or high-return-risk SKU:** full check regardless of supplier history. The cost of a miss is
  too high to spot-check away.

This isn't a formal risk model, it's a judgment call based on what you already know about a supplier, and
that's fine. The judgment gets better the more of it gets recorded instead of relying on memory, which is
the actual gap most small teams have, not the lack of a statistical sampling plan.

## How long this actually takes

For a normal shipment from an established supplier, the four checks above run five to ten minutes: count,
scan the cartons, check the packing slip, move on. A new supplier's first few shipments take longer, closer
to twenty minutes if you're opening more cartons to build confidence before easing into spot-checks. That's
the actual time cost of the process this post is describing, not the hours a full sampling-plan checklist
implies. If receiving a shipment is currently a flat "count it and shelve it" with no inspection step at
all, the honest starting point isn't a formal program, it's adding those five to ten minutes back in.

## What to do when something fails

You don't need a formal non-conformance system with disposition codes to handle a failed check well. You
need three things: stop that item from going onto the shelf, note what's wrong and how much of the shipment
it affects, and tell the supplier before the next order goes out. A sticky note on the pallet and a photo
attached to the PO covers the first two for most small operations. The third is where teams actually drop
the ball, not because the conversation is hard, but because it depends on someone remembering to have it
before the next order gets placed on autopilot. Keeping that conversation attached to the actual
[supplier coordination](/supplier-coordination/) record, instead of a separate note that has to be
remembered separately, is what keeps it from getting skipped.

## The cost of catching it late instead of early

The math here doesn't change no matter how big or small the operation is. A defect caught at receiving costs
a conversation with the supplier and maybe a partial reship. The same defect caught after a customer has it
costs a [return request](/blog/what-a-return-request-actually-needs/) that has to be checked against the
order and shipment record, a replacement shipment, the support time to handle both, and whatever it does to
that customer's confidence in the next order. Inspection isn't overhead on top of the real work. It's the
cheapest point in the entire chain to catch something that's going to cost you regardless, the only real
question is how much.

## From one inspection to a pattern worth acting on

A single failed inspection is one data point. The real value shows up once you can see it against the ones
before it: is this supplier's defect rate holding steady, or is this the third short shipment in two months
that's starting to look like [a pattern instead of an isolated incident](/blog/one-off-defect-or-growing-problem/)?
Most small teams already have this information, it's just spread across a receiving log, a
returns spreadsheet, and whatever anyone remembers from the last supplier call. Pulling it into one place
per supplier is what turns [a gut feeling about supplier quality into an actual track record](/blog/suppliers-already-have-a-quality-track-record/)
you can point to.

To be clear about what this does and doesn't replace: nothing here inspects a shipment for you. Someone on
your team still has to count the cartons and look at the goods. [Quality Monitoring](/quality-monitoring/)
logs the inspection results you record, checks them automatically, and flags anything that fails before it
reaches your shelf, and it rolls those results into a running supplier record over time. It's the memory and
the pattern-spotting for a process your team still runs, not a replacement for the person on the dock doing
the check.

## FAQ

**What is incoming inspection?**
Checking a shipment against what was ordered, quantity, item match, and visible condition, before it goes
into stock. It's the cheapest point in the supply chain to catch a problem, before a defect reaches a shelf
or a customer.

**Do I need an AQL sampling plan to do incoming inspection properly?**
No. AQL tables exist for manufacturers running formal sampling programs against engineering specs. A small
distributor gets most of the benefit from a simpler rule: full checks for new suppliers and high-risk SKUs,
spot-checks for suppliers with a clean track record.

**How long does incoming inspection actually take?**
Five to ten minutes for a normal shipment from an established supplier: count, scan the cartons, check the
packing slip. New suppliers take longer at first, closer to twenty minutes, until there's a track record
that supports easing into spot-checks.

**What should I do when an incoming inspection fails?**
Stop that item from going onto the shelf, document what's wrong and how much of the shipment it affects, and
raise it with the supplier before the next order goes out. The documentation and the supplier conversation
matter more than any formal disposition process.
