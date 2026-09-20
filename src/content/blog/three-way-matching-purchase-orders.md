---
title: "Three-Way Matching for Purchase Orders"
description: "What three-way matching is, why it catches billing errors a busy team would otherwise miss, and how to run it without a dedicated AP department."
publishDate: 2026-09-24
author: "Flowbound"
category: "Supplier Management"
tags: ["three-way match", "purchase orders", "supplier management", "small business", "accounts payable"]
---

Three-way matching is the practice of checking three documents against each other before paying a supplier
invoice: the purchase order, the receiving record, and the invoice itself. If the quantities, prices, and
items line up across all three, the invoice gets paid. If they don't, it gets held until someone figures out
why. It's a simple control, and it catches a category of error that's easy to miss when a team is paying
invoices by trusting whatever number shows up on the bill.

## The three documents, and what each one is checking

**The purchase order** is what you agreed to buy: which SKUs, how many units, at what price. It's the
record of intent, created before the goods ever arrive.

**The receiving record** is what actually showed up. A shipment that's short three cases, or arrives with
the wrong item substituted in, gets caught here, assuming someone actually counts and logs what came in
rather than just signing for the pallet.

**The invoice** is what the supplier is asking to be paid. In a healthy transaction, it matches the PO on
price and matches the receiving record on quantity. When it doesn't, that gap is either an honest billing
mistake or something worth a harder look.

Three-way matching is comparing all three, not just glancing at the invoice and paying it because the total
looks roughly right.

## Why this matters more than it seems to on paper

A single mismatched invoice feels like a rounding error. The pattern is what actually costs money. A
supplier invoice that's consistently a little higher than the agreed PO price, a shipment that's
consistently short by a unit or two, a duplicate invoice that slips through because nobody cross-checked
against what was already paid, none of these show up as one dramatic loss. They show up as a slow leak that
only becomes visible once someone adds up a quarter's worth of small discrepancies and realizes it's not
small anymore.

Small distributors are a common target for exactly this kind of error, not necessarily out of malice, more
often because a supplier's own billing system has a stale price sheet, or a warehouse crew ships a
substitution without updating the paperwork. Three-way matching doesn't assume bad faith. It assumes
mistakes happen on both sides of a transaction often enough that checking is worth the few minutes it takes.

## Running it without a dedicated AP team

A formal three-way match process at a large company involves a purchasing department, a receiving
department, and an accounts payable department that don't talk to each other directly, by design, so no
single person can approve a fraudulent payment alone. A small distributor doesn't need that separation of
duties to get the core value. What actually matters:

**Every PO needs a real record before the goods ship**, not a verbal agreement or a text message to a
supplier. If there's nothing to check the invoice against, there's nothing to catch a discrepancy with.
[Suppliers already have a track record](/blog/suppliers-already-have-a-quality-track-record/) worth
checking too, since a supplier whose invoices routinely need correction is telling you something about how
carefully they're running their own operation.

**Receiving has to actually count, not just sign.** A driver handing over a pallet and a warehouse employee
signing without opening a box defeats the whole point. The receiving record is only useful if it reflects
what physically arrived.

**Set a tolerance, not a zero-error bar.** A one-cent rounding difference doesn't need a hold. A price
that's off by more than a few percent, or a quantity that's off by more than a unit or two, does. Matching
that's too strict on tiny variances trains a team to stop paying attention to the flags that actually matter.

**Hold the invoice, don't just eat the discrepancy.** The instinct under time pressure is to pay what's
billed and sort it out later. Later rarely happens, and a pattern of quietly overpaying is exactly the
pattern that compounds.

## Where this connects to purchase order approval

Three-way matching happens after goods arrive, but it depends on decisions made earlier in the process. [Why
approving every purchase order doesn't scale](/blog/why-approving-every-purchase-order-doesnt-scale/) covers
the front end of this: if every PO is getting rubber-stamped without real review, the record you're matching
against later is only as good as that first approval was. And when [supplier lead times start slipping](/blog/supplier-lead-time-slips/),
a rushed reorder placed to cover the gap is exactly the kind of transaction that skips careful documentation,
the one that most needs a clean paper trail behind it, not less.

## Building the process into how you already track suppliers

Three-way matching isn't a system you bolt on separately from how you already manage supplier relationships.
[Supplier Coordination](/supplier-coordination/) is the same discipline applied earlier: keeping every PO,
lead time change, and supplier conversation in one place instead of scattered across email threads and a
spreadsheet nobody's updated in weeks. A PO that's tracked properly from the moment it's placed, and a
receiving record that's logged the day goods arrive, is what makes matching an invoice against them fast
instead of a scavenger hunt through old emails, the same problem that shows up once [a supplier list gets
too long to track by hand](/blog/how-many-suppliers-is-too-many-to-track-by-hand/).

## What Flowbound does and doesn't do here

Flowbound doesn't run accounts payable or match invoices against receiving records, that's a finance
function outside what the product does. What [Supplier Coordination](/supplier-coordination/) does is keep
the upstream half of that process accurate: every purchase order, every lead time change, and every supplier
conversation stays current and centralized, so when an invoice needs checking against what was actually
ordered and what actually arrived, the PO side of that comparison is already a clean, real record instead of
something someone has to reconstruct from memory. [Reorder](/reorder/) works from that same accurate PO
history, so a purchase order placed automatically when a reorder point is hit carries the same clean record
a manually placed one would.

## FAQ

**What is three-way matching?**
Three-way matching compares a purchase order, a receiving record, and a supplier invoice before payment.
When quantities, items, and prices line up across all three, the invoice is approved. When they don't, it's
held until the discrepancy is explained.

**Why does three-way matching matter for a small distributor?**
It catches billing errors, price creep, and short shipments before payment goes out, not after. These
rarely show up as one large loss, more often as a slow pattern that only becomes visible once someone adds
up several months of small discrepancies, the same pattern [supplier lead time slips](/blog/supplier-lead-time-slips/)
follow when nobody's tracking them consistently.

**Does a small business need a separate accounts payable team to do three-way matching?**
No. The formal separation of duties large companies use is about fraud prevention at scale. A small team
gets most of the value just by keeping a real PO record for every order, actually counting what arrives
instead of signing blind, and setting a reasonable tolerance for what triggers a hold before payment.

**What should trigger a hold on an invoice?**
A price that's meaningfully off from the agreed purchase order, a quantity that doesn't match what was
actually received, or a duplicate invoice for an order already paid. Small rounding differences don't need
one; [supplier coordination](/supplier-coordination/) tracked consistently makes it easy to tell the
difference between the two.

**How does three-way matching relate to purchase order approval?**
They're two checkpoints in the same process. Approval happens before goods ship and decides whether the
order should go out at all; matching happens after goods arrive and checks whether what was billed actually
matches what was ordered and received. [Skipping careful review at the approval stage](/blog/why-approving-every-purchase-order-doesnt-scale/)
makes the later match less reliable too, since there's a weaker record to check the invoice against.
