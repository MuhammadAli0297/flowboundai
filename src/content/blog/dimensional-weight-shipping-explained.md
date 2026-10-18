---
title: "Dimensional Weight: How Carriers Bill Parcels"
description: "Dimensional weight explained: the formula, a worked example with a common divisor of 139, and how box size changes your parcel shipping bill."
excerpt: "Why a light, bulky box can cost more to ship than a heavy one."
publishDate: 2026-10-06
author: "Muhammad Ali"
authorTitle: "CFO"
category: "Shipping & Logistics"
tags: ["dimensional weight", "parcel shipping", "shipping costs", "packaging", "carrier selection"]
---

Dimensional weight, also called DIM weight or volumetric weight, is a pricing method parcel carriers use to
charge for the space a package takes up, not just how much it weighs. Carriers compare the package's actual
weight to its dimensional weight and bill whichever is greater. A large, light box can therefore cost far
more to ship than a small, heavy one, and many shippers only find out when the invoice arrives.

## The formula

Dimensional weight = (length x width x height) / divisor

Measurements are in inches for US domestic shipments, and the divisor is set by the carrier. A divisor of 139
is a common example for domestic parcel rates. Carriers can use different divisors for different services
and rate types, and they change over time, so always confirm the figure your own contract uses before you
build anything on it. Most carriers also round the result up to the next whole pound.

The carrier then bills the **greater** of the actual weight and the dimensional weight. This billed amount is
called the chargeable weight.

## A worked example: when volume wins

A 20 x 16 x 12 inch box holds a light product and weighs 9 pounds.

- Volume = 20 x 16 x 12 = 3,840 cubic inches
- Dimensional weight = 3,840 / 139 = 27.6, rounded up to **28 lb**
- Actual weight = 9 lb
- Chargeable weight = **28 lb**

You are paying to ship 28 pounds to move 9 pounds of product. Most of that charge is air.

## A worked example: when weight wins

A 10 x 8 x 6 inch box of dense hardware weighs 12 pounds.

- Volume = 10 x 8 x 6 = 480 cubic inches
- Dimensional weight = 480 / 139 = 3.5, rounded up to **4 lb**
- Actual weight = 12 lb
- Chargeable weight = **12 lb**

Here the actual weight is higher, so dimensional weight never comes into play. Density is what decides which
rule bites. Light and bulky products get hit, dense products do not.

## What it does to your costs

The effect compounds quietly. Every extra inch on a box dimension multiplies volume, so a few inches of
unnecessary void space can move a package up several billing weight tiers. If the 20 x 16 x 12 box above
could be packed in a 16 x 12 x 8 box without risking the product:

- Volume = 1,536 cubic inches, dimensional weight = 1,536 / 139 = 11.05, rounded up to **12 lb**
- Chargeable weight falls from 28 lb to 12 lb

That is a 57 percent drop in billed weight from packaging alone, before you negotiate anything with the
carrier. For a distributor shipping hundreds of parcels a week, oversized boxes are one of the more fixable
causes of [shipping costs creeping up](/blog/shipping-costs-creeping-up/).

## How to reduce dimensional weight charges

1. **Right-size your packaging.** Audit the box sizes you ship most often against the products inside. Cut
   the void fill, not the protection.
2. **Keep a few standard sizes.** A small set of well-chosen boxes beats one oversized box for everything.
3. **Check your divisor.** Know the divisor in your contract. Different carriers and service levels can
   produce very different chargeable weights for the same box.
4. **Mind the damage trade-off.** Squeezing a product into a tight box can raise damage rates. A saving that
   increases [shipping damage claims](/blog/reducing-shipping-damage-claims/) is not a saving.
5. **Compare carriers per shipment.** Because the divisor and rate structure differ, the cheapest carrier
   for a dense parcel is often not the cheapest for a bulky one. The cost of [picking the wrong
   carrier](/blog/cost-of-picking-the-wrong-carrier/) is real, and it varies by package profile.

## Parcel versus freight

Dimensional weight is a parcel concept. Once shipments get large or heavy enough to move as freight, billing
shifts to different rules. [Freight class](/blog/freight-class-explained-ltl-shipping/) is built on density
too, but works through a class system instead of a divisor. If you are deciding which side of that line a
shipment belongs on, [LTL versus parcel](/blog/ltl-vs-parcel-shipping/) walks through the comparison.

## Count it in landed cost

Dimensional weight charges land in your freight line, and your freight line lands in your costs.
[Landed cost](/blog/landed-cost-formula-explained/) only reflects reality if the freight component is the
chargeable weight cost, not the cost implied by the product's actual weight. A SKU that looks profitable
when you assume 9 pounds of freight can be margin-thin once you see it billed at 28.

## Where Flowbound fits

Flowbound does not redesign your packaging or calculate your divisor for you. [Shipping
Optimization](/shipping-optimization/) compares carriers, lanes, and lead times automatically and recommends
the option that gets an order there on time for the least cost, so you are not manually rate shopping for
every shipment. That gives you a consistent way to see which carrier is actually cheapest for a given order,
instead of defaulting to whichever one you used last time.

## FAQ

**What is dimensional weight?**
Dimensional weight is a pricing measure parcel carriers use based on a package's volume. They calculate it by
multiplying length, width, and height and dividing by a carrier-specific divisor, then bill the greater of the
dimensional weight and the actual weight.

**What divisor should I use?**
The divisor depends on your carrier, service level, and contract. A divisor of 139 is a common example for
US domestic parcel shipments, but you should confirm yours rather than assume. The wrong divisor makes your
cost estimates inaccurate, and that error flows straight into [landed cost](/blog/landed-cost-formula-explained/).

**Does dimensional weight apply to freight shipments?**
Not in the same way. Parcel carriers use dimensional weight. Larger LTL shipments are billed by a freight class
system that also reflects density, covered in [freight class explained](/blog/freight-class-explained-ltl-shipping/).

**How can I lower my dimensional weight charges?**
The most direct way is smaller, better-fitted boxes. Auditing your most common shipments, trimming void
space, and keeping a small set of standard sizes can drop chargeable weight significantly. Balance it against
damage risk using what you know from [shipping damage claims](/blog/reducing-shipping-damage-claims/).

**Can software help me pick the cheapest carrier for a package?**
Yes. [Shipping Optimization](/shipping-optimization/) compares carriers, lanes, and lead times and recommends
the option that delivers on time for the least cost, which removes the manual rate shopping.
