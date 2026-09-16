---
title: "Freight Class: What It Is and Why Rates Change"
description: "What freight class is, the four factors that set it, and how to avoid the reclass fees that quietly inflate an LTL freight bill."
publishDate: 2026-09-11
author: "Flowbound"
category: "Shipping & Logistics"
tags: ["freight class", "LTL shipping", "shipping optimization", "freight costs"]
---

An LTL freight invoice that comes back higher than the quote isn't always a carrier mistake. More often
it's a reclass, the carrier's own inspection at the terminal deciding your shipment doesn't match the freight
class it was quoted at, and rebilling it at the class they measured instead. Understanding what freight
class actually is, and what determines it, is the difference between catching that before it happens and
finding out about it on an invoice weeks later.

## What is freight class?

Freight class is a standardized rating system, the National Motor Freight Classification (NMFC), used to
price less-than-truckload (LTL) shipments. Every LTL shipment gets assigned one of 18 classes, ranging from
class 50 (least expensive to ship) to class 500 (most expensive), and that class is one of the main inputs
into what a carrier charges. Two shipments of the same weight and the same distance can have meaningfully
different freight costs if they carry different classes, because class reflects more than just how heavy
something is.

## The four factors that actually determine your freight class

**Density.** How much a shipment weighs relative to how much space it takes up, measured in pounds per
cubic foot. This is usually the single biggest factor: a dense, compact shipment (metal parts, for example)
typically earns a lower, cheaper class, while a bulky, lightweight shipment (empty boxes, foam packaging)
takes up truck space without weighing much, which pushes the class, and the cost, higher.

**Handling.** How much special care a shipment needs moving through a terminal, whether it requires hand
loading instead of a forklift, and how fragile or awkwardly shaped it is. Freight that's easy to palletize
and move mechanically rates lower than freight that needs individual attention at every touchpoint.

**Stowability.** How easily a shipment fits alongside other freight in the same trailer. Hazardous materials,
items with unusual dimensions, or freight that can't be stacked all reduce how efficiently a carrier can fill
a truck, and that inefficiency shows up as a higher class.

**Liability.** The likelihood a shipment gets damaged or lost, or damages other freight around it, based on
value, fragility, and susceptibility to theft. Higher-liability freight rates higher, reflecting the real
cost a carrier is taking on by accepting it, the same underlying risk that drives [shipping damage
claims](/blog/reducing-shipping-damage-claims/) when that liability turns into an actual incident.

## Why the same product can get different classes on different shipments

Freight class isn't a fixed property of a product, it's a property of that specific shipment as packaged and
palletized. The same SKU shipped loose in a box rates differently than shipped shrink-wrapped on a pallet,
because the packaging changes density and handling. This is the part that catches distributors off guard:
the class quoted when a shipment was booked assumed a certain density and packaging, and if what actually
ships doesn't match that assumption closely enough, the carrier's own freight inspection at the terminal can
reclassify it, and rebill the difference.

## Where reclass fees actually come from

A reclass happens when a carrier physically weighs and measures a shipment at their terminal and finds it
doesn't match the class (or the weight) on the bill of lading. The most common cause is an inaccurate density
estimate at booking, someone estimated dimensions and weight rather than measuring the actual palletized
shipment, and the carrier's own numbers came out different enough to bump the class up.

The fee itself is usually smaller than the frustration of an invoice that doesn't match the quote, but it
adds up across a shipping volume, and it's one of the quieter reasons [shipping costs creep up over
time](/blog/shipping-costs-creeping-up/) without an obvious single cause: not one big rate increase, a
scatter of small reclass adjustments that don't get caught unless someone is actually reconciling invoices
against quotes shipment by shipment.

## How freight class interacts with the LTL vs. parcel decision

Freight class only applies to LTL shipments, not parcel, which is priced primarily on weight and dimensions
rather than the four NMFC factors above. That's part of what makes [the LTL vs. parcel
decision](/blog/ltl-vs-parcel-shipping/) more complicated than just comparing a quoted rate: a low-density,
awkwardly shaped LTL shipment might carry a high enough class that a parcel carrier, or breaking the shipment
into smaller parcel-eligible pieces, actually costs less for the same freight, even though the LTL quote
looked competitive at first glance.

## What actually reduces freight class costs

**Measure, don't estimate, density at booking.** The single biggest lever is accuracy: an actual weight and
dimension measurement of the palletized shipment, not a rough estimate, is what keeps the quoted class
matching what the carrier measures at the terminal, and avoids the reclass fee entirely.

**Consolidate and repackage to raise density where possible.** Compressing a shipment's footprint, using a
smaller pallet, better stacking, or denser packaging, can genuinely move a shipment into a cheaper class,
not just avoid a reclass but lower the baseline rate.

**Compare the carrier's quoted class against your own history for that SKU.** If a specific product has
been reclassed before, that's a signal the booking process is estimating its density wrong consistently, not
a one-off carrier error, and it's worth fixing at the source rather than absorbing the fee every time.

**Weigh freight class alongside the full carrier and lane comparison, not in isolation.** A shipment's class
affects different carriers differently depending on their own rate structures for that class, so the
cheapest option for a given shipment isn't always the one with the lowest headline rate; it's the one whose
combination of class-based pricing and lane happens to fit that specific shipment best.

## Letting the comparison happen automatically

Manually checking freight class against a shipment's actual measurements, and comparing that against every
available carrier's rate for that class and lane, is exactly the kind of repetitive calculation that's easy
to skip when things get busy, which is when reclass fees and suboptimal carrier choices quietly accumulate.
[Shipping Optimization](/shipping-optimization/) compares carriers and lanes automatically and recommends
the option that gets a shipment there on time for the least cost, so a class-sensitive shipment isn't
defaulting to whichever carrier is easiest to book, it's weighed against every option every time, the same
discipline that applies whether the shipment in question is a routine reorder or [a rush order covering for
a supplier delay](/blog/rush-shipping-is-a-symptom-not-a-solution/).

## FAQ

**What is freight class?**
A standardized rating system (NMFC) used to price LTL shipments, ranging from class 50 (cheapest) to class
500 (most expensive), based on density, handling, stowability, and liability rather than weight alone.

**What is the most important factor in determining freight class?**
Density, pounds per cubic foot, is usually the single biggest factor. A dense, compact shipment typically
earns a lower class than a bulky, lightweight one of the same weight, which is also why [multi-location
inventory](/blog/multi-location-inventory-sync/) decisions can change freight costs, not just warehouse
costs.

**Why did my freight bill come back higher than the quote?**
Most likely a reclass: the carrier physically weighed and measured the shipment at their terminal and found
it didn't match the class or weight on the original bill of lading, usually because the booking estimate,
not the carrier, got the density wrong.

**Does freight class apply to parcel shipments?**
No. Freight class is specific to LTL shipping. Parcel is priced primarily on weight and dimensions, which is
one of the key differences to weigh in [the LTL vs. parcel decision](/blog/ltl-vs-parcel-shipping/) for a
given shipment.

**How can I avoid reclass fees on LTL shipments?**
Measure the actual palletized shipment's weight and dimensions at booking instead of estimating, since an
inaccurate density estimate is the most common cause of a terminal reclassifying a shipment, along with
[choosing the right carrier](/blog/cost-of-picking-the-wrong-carrier/) for that shipment's actual class and
lane in the first place.
