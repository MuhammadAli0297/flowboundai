---
title: "Managing Supplier Lead Time Variability"
description: "Most lead time advice assumes an ERP and a stats background. Here's how to catch supplier lead time slips early with just a spreadsheet."
publishDate: 2026-07-24
author: "Flowbound"
category: "Supplier Management"
tags: ["supplier management", "lead times", "small business"]
---

## What is supplier lead time?

Supplier lead time is the time between placing a purchase order and having the goods in your warehouse,
ready to sell. Lead time variability is how much that number actually swings from order to order. A
supplier quoted at two weeks who sometimes ships in ten days and sometimes takes five weeks isn't reliable
at two weeks. They're reliable at five weeks, and your reorder math should plan around that, not the quote.

## Why the average lead time lies to you

Most suppliers give you one number: "our lead time is 14 days." That number is an average, or sometimes
just what they told you when you onboarded them two years ago. Neither tells you what actually happens
order to order. A supplier that runs 10 to 25 days, averaging 14, and a supplier that runs a steady 12 to
16 days both round to "two weeks." They are not the same supplier to plan against. The first one needs a
much bigger buffer, because half the time it takes longer than the number you've written down, and the
other half it doesn't tell you anything about how much longer.

This is the part most operations-research content gets right in theory and useless in practice: reducing
how much a lead time *swings* usually matters more to your stockout risk than shaving a few days off the
average. But almost every guide on that point then hands you a standard deviation formula and a safety
stock equation that assumes you already have clean, structured delivery data sitting in an ERP. Most small
operators don't. You have a folder of order confirmation emails and a gut feeling that one supplier has
gotten slower lately.

## Why most lead time advice doesn't fit a five-person team

Search "how to manage lead time variability" and you'll mostly find two flavors of advice. One is
academic: calculate the standard deviation of your last 20 deliveries per SKU, feed it into a safety stock
formula alongside your demand variability, done. That works if a system is already logging every commit
date and actual delivery date automatically. If you're placing orders by email and tracking them in a
spreadsheet you update when you remember to, you don't have 20 clean data points sitting anywhere, you have
20 email threads. The other flavor is generic: "communicate more with your suppliers," "build strong
relationships." True, and not actionable on a Tuesday when you're deciding whether to place an order today
or wait.

What's missing is the middle: a way to catch a slip early with the data you actually have, before it costs
you a stockout, without needing a statistics background or a system nobody has time to maintain.

## Three signs a lead time is already slipping

You usually don't get a phone call telling you a supplier has gotten slower. You get quieter signals, and
they're easy to miss individually:

- **Recent orders are consistently arriving later than the lead time on file.** Not one late order, three
  or four in a row that all miss by roughly the same amount. One late order is an incident. A pattern is a
  new lead time you haven't updated yet.
- **Order confirmations have gotten vaguer.** A firm ship date has quietly become a date range, or a range
  has become "we'll confirm closer to the time." Suppliers stop committing to specifics right around when
  they know they can't hit them.
- **You're following up more than once to get a status update.** A supplier who used to answer in one email
  now takes two or three nudges. That extra friction is usually a sign their own backlog has grown, even if
  nobody says so directly.

Any one of these alone might be nothing, a single missed shipment or a distracted account rep. Two or more
together, especially across back-to-back orders, usually means the number you're planning against is
already wrong.

## A buffer you can build without a standard deviation formula

Here's the operator version of the safety-stock math: instead of calculating a standard deviation, track
the actual delivery date against the promised date for a supplier's last five orders. Just two columns,
promised and actual, in whatever spreadsheet you already use. Take the worst gap in those five, not the
average, and use that as your planning lead time going forward, not the number on the original quote.

Worked example: a supplier quoted at 14 days actually delivered in 12, 15, 14, 22, and 16 days over their
last five orders. The average is close enough to the quote to feel fine. But the worst case, 22 days, is
the number that determines whether you stock out, because the one time it happens is the time you didn't
have a buffer for it. Plan your reorder point off 20 to 22 days for that supplier, not 14. When a sixth
order comes in, drop the oldest and recheck the worst of the new five. This is the same logic behind the
[three-number method for forecasting demand without a data team](/blog/forecast-demand-without-a-data-team/):
you don't need a statistics background to get a workable number, you need a small, consistent habit applied
to real orders instead of a formula applied to data you don't have.

## What to do the moment a lead time changes

Update the number everywhere you use it, not just in your head. If your reorder point math assumes a
14-day lead time and the real number is now 22, every order placed against the old assumption is already
running behind before it ships. [Recalculate your reorder point](/blog/reorder-point-math/) with the new
number, and if the gap between old and new is big enough, treat it as a today problem: place the next
order now instead of waiting for the usual trigger to fire on a lead time that no longer describes this
supplier.

## Ask your supplier these three questions, not "what's your lead time"

Asking a supplier "what's your lead time" gets you their standard quote, the same number that's already
wrong. Three more specific questions get you something you can actually plan around:

- **"What were your actual ship dates on my last three orders, not your standard quote?"** This gets real
  numbers instead of a marketing figure, and it's a question most suppliers can answer from their own
  records in a few minutes.
- **"What part of this is in your control, and what part isn't?"** A supplier that's slow because of their
  own scheduling is a different problem than one waiting on a raw material shortage upstream. The first is
  worth pushing on. The second means you plan a longer buffer and stop expecting it to improve on its own.
- **"If this timeline changes again, who tells me, and how?"** Most delays don't surprise the supplier,
  they surprise you, because nobody on their end is responsible for flagging it outward. Getting a name and
  a channel, even an informal one, turns a silent slip into an early warning.

## When tracking this by hand stops working

The two-column method above works fine for a handful of suppliers you order from regularly. It gets harder
fast once you're juggling a dozen or more, each with their own drift, and nobody has time to update a
spreadsheet column after every single delivery. That's a separate problem from lead time itself, more
about [how many suppliers one person can actually track by hand](/blog/how-many-suppliers-is-too-many-to-track-by-hand/)
before something falls through. Past that point, the fix isn't a better spreadsheet template, it's not
doing it by hand at all. That's the specific gap [Supplier Coordination](/supplier-coordination/) is built
to close: it keeps every supplier conversation, purchase order, and lead time change in one place, and
flags the ones that actually need your attention before a delay turns into a stockout. Once a slip is
caught and your reorder point is recalculated, [placing the actual order](/reorder/) the moment that new
threshold is hit is a separate, later step, not something catching the slip does on its own.

## FAQ

**What is supplier lead time variability?**
It's how much a supplier's actual delivery time swings around the lead time they quote you. A supplier
that's usually on time but occasionally very late has high variability even if their average looks fine,
and that swing is what actually drives stockout risk.

**How do I calculate a lead time buffer without a statistics background?**
Track promised versus actual delivery dates for a supplier's last five orders in two spreadsheet columns.
Use the worst gap in that set, not the average, as your planning lead time, and refresh it as new orders
come in.

**How often should I recheck a supplier's lead time?**
Recheck after any order that misses its promised date by more than a few days, and do a full review of your
five most recent orders per supplier at least quarterly. A supplier's timeline can drift for months before
it shows up as a stockout if nobody's watching in between.

**What's the difference between supplier lead time and total lead time?**
Supplier lead time covers the supplier's side only: order processing through shipping to you. Total lead
time can include your own receiving and putaway time on top of that, which matters if your warehouse has a
backlog too, not just your supplier.
