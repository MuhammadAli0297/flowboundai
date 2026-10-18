---
title: "AQL Sampling for Incoming Inspection"
description: "AQL sampling explained for incoming inspection: sample size, accept and reject numbers, defect classes, and a worked example for a 2,000-unit lot."
excerpt: "Inspect a sample, not the whole lot, and know when to reject."
publishDate: 2026-10-08
author: "Ryo Shibata"
authorTitle: "CTO"
category: "Quality Monitoring"
tags: ["aql", "incoming inspection", "quality monitoring", "sampling plan", "supplier quality"]
---

AQL, or acceptable quality limit, is the maximum defect rate in a delivered lot that you are willing to treat
as acceptable. In incoming inspection it drives a sampling plan: instead of checking every unit, you inspect a
defined sample from the lot, count the defects, and accept or reject the whole lot based on a pass number set
in advance. It lets a small team check large deliveries without either inspecting everything or inspecting
nothing.

## Why sample at all

Inspecting every unit of every delivery is rarely practical, and it is not even perfectly reliable, because
people miss defects when they check thousands of identical items. Not inspecting at all means the first time
you learn about a bad lot is when a customer returns it. Sampling sits in the middle. It gives you a
statistically grounded decision rule at a fraction of the effort. If you are not inspecting today, [the
inspection step most teams skip](/blog/the-inspection-step-most-teams-skip/) explains what that gap costs.

## The three inputs

A sampling plan is built from three things:

1. **Lot size.** How many units are in the delivery you are judging.
2. **Inspection level.** How strict the inspection is. General level II is the usual default. Tighter levels
   inspect more units, looser levels inspect fewer.
3. **The AQL value.** The defect rate you will tolerate, expressed as a percentage, such as 1.0 or 2.5.

Together these point to a sample size and two numbers: the **accept number** (the most defects you can find
and still pass the lot) and the **reject number** (the count at which you fail it). The tables come from
standards such as ISO 2859-1 and ANSI/ASQ Z1.4, which are the reference you should check before adopting any
plan.

## A worked example

You receive a lot of 2,000 units. Using general inspection level II, a lot of 1,201 to 3,200 units falls
under sample size code letter K, which calls for a sample of **125 units**. Taking the single sampling plan
for normal inspection, the accept and reject numbers depend on your AQL:

| AQL | Accept | Reject |
| --- | --- | --- |
| 1.0 | 3 | 4 |
| 2.5 | 7 | 8 |

At an AQL of 1.0, you inspect 125 units. Find 3 or fewer defective units and the lot passes. Find 4 or more
and it is rejected. At 2.5 you are more tolerant, passing the lot with up to 7 defects. These values come
from the published tables for this lot size and level. Verify them against the current standard before you
use them in a real plan, since your supplier agreement may specify a different standard or version.

## Defect classes: major, minor, critical

Most plans set separate AQL values by how serious a defect is:

- **Critical.** A defect that makes the product unsafe or unusable in a way that creates legal or safety
  risk. The AQL is typically 0, and critical defects often trigger full inspection regardless of the sample
  result.
- **Major.** A defect that makes the product fail its function or that a customer would reject. A common AQL
  is 2.5.
- **Minor.** A cosmetic or small deviation that does not affect function. A common AQL is 4.0, a looser
  tolerance.

Writing these definitions down with photos or examples before the first inspection avoids disputes with
suppliers later, because "defective" stops being a matter of opinion.

## What happens when a lot fails

A failed lot needs a defined response, decided in advance:

- **Reject and return** the lot to the supplier.
- **Sort or rework** the lot, inspecting 100 percent and removing the bad units, with the supplier bearing
  the cost.
- **Accept with a concession**, documented, when you need the stock and the defect is minor.

Whatever you choose, log it. A single failed lot is a data point. Repeated failures from the same supplier
are a pattern, and a pattern is when you open a formal corrective action. The [CAPA
process](/blog/capa-process-supplier-quality-issues/) covers what to do once a failure stops looking like a
one-off. You also need a clear [defect rate](/blog/how-to-calculate-defect-rate/) measurement so the numbers
you log are comparable across lots and suppliers.

## Sampling limits to keep in mind

Sampling is a decision rule, not a guarantee. A lot that passes can still contain defects, up to the AQL
level you accepted. That is the trade you are making. It also assumes the sample is random and representative.
Pull units from across the whole lot, not just the top carton, because defects often cluster by pallet or
production run. If a lot is later found to be bad, your records of what you inspected are part of
[batch recall readiness](/blog/batch-recall-readiness-checklist/).

## Where Flowbound fits

Flowbound does not set your AQL or choose your sampling plan, that stays a quality decision for your team and
your supplier agreement. What it handles is the tracking. [Inspection Tracking](/quality-monitoring/) logs
incoming inspection results and flags anything that fails before it reaches your shelf. [Quality
Monitoring](/quality-monitoring/) watches defect patterns across returns and inspections, and keeps a running
defect rate and on-time-in-full record for each supplier, so a single failed lot gets noticed alongside the
history behind it. If you are comparing suppliers, those records feed a [supplier
scorecard](/blog/supplier-scorecard-metrics-and-weights/).

## FAQ

**What does AQL stand for?**
AQL stands for acceptable quality limit. It is the maximum percentage of defective units in a lot that you are
prepared to treat as acceptable, and it determines the pass and fail numbers in a sampling plan.

**How do I find the right sample size?**
You need the lot size, the inspection level, and the AQL. The lot size and level give a sample size code
letter, and the standard's tables, such as ISO 2859-1, give the sample size and the accept and reject numbers.
For a 2,000-unit lot at general level II the sample is 125 units. Pairing that with a clear [defect
rate](/blog/how-to-calculate-defect-rate/) definition keeps results consistent.

**Is a lower AQL always better?**
A lower AQL is stricter, so it rejects more lots and pushes more cost back to the supplier. That can be right
for critical products, but unnecessarily strict tolerances raise your own cost and strain the relationship.
Match the AQL to the real risk of the defect.

**Does passing an AQL inspection mean the lot is defect-free?**
No. It means the sample stayed within the accept number, so the lot is statistically likely to be at or below
your tolerated defect rate. Some defects can remain. Keep inspection records for [recall
readiness](/blog/batch-recall-readiness-checklist/).

**Can software run the inspection for me?**
Software cannot physically inspect units, but it can log results, flag failures, and track patterns by
supplier. [Quality Monitoring](/quality-monitoring/) does that, so you see trends instead of isolated results.
