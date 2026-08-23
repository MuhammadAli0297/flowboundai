---
title: "How to Track Supplier Quality Issues"
description: "A single bad batch is normal. A rising defect rate from one supplier isn't. Here's the math that tells the two apart, no quality team required."
publishDate: 2026-07-31
author: "Flowbound"
category: "Quality Monitoring"
tags: ["quality monitoring", "supplier management", "defect tracking", "small business"]
---

A damaged shipment shows up, someone processes the return, and everyone moves on. That's the right call for
a one-off. The trouble is that most small teams handle the tenth damaged shipment from the same supplier
exactly the same way they handled the first: as its own isolated thing, because nothing in how it got logged
connects it to the nine before it. The signal was there. It just never got assembled into something anyone
could actually look at.

## How do you know if a supplier quality issue is a pattern, not a fluke?

A defect becomes a pattern once it repeats at a rate higher than that supplier's own recent baseline, not
some universal industry number. Track defects as a percentage of units received per supplier, per month. If
that percentage climbs for two or three months running, or the same failure type shows up on separate
purchase orders, it's a trend worth acting on, not bad luck.

The rest of this comes down to two things: doing that math consistently, and logging enough about each
defect that the math is possible in the first place.

## What "supplier quality issues" actually looks like when you're not a factory

Most advice on this topic is written for a manufacturer running its own production line: acceptable quality
level (AQL) sampling tables, nonconformance reports, corrective and preventive action plans, ISO 9001 audits,
a third-party inspector standing on the factory floor before a container ships. None of that is wrong. It's
just built for a business with a quality engineer on staff and enough volume to justify a full-time inspection
program.

A small wholesale or distribution business doesn't have that. You're not inspecting a production line, you're
receiving finished goods from a supplier and finding out something's wrong after the box is already open:
a damaged item, a wrong count, a batch that doesn't match spec, a customer complaint that traces back to a
defect nobody caught before it shipped. [The inspection step most teams
skip](/blog/the-inspection-step-most-teams-skip/) is the cheapest place to catch a lot of this before it goes
further, but even a team that inspects every shipment still needs a way to tell whether this week's defect is
noise or the start of something worse. A third-party inspection company can help at real manufacturing volume.
At the scale most distributors operate, the fix isn't hiring an inspector, it's tracking what you already see
consistently enough that a pattern can't hide in plain sight.

## The math that separates a fluke from a trend

You don't need a statistics background for this, just one number tracked the same way every month: defective
units divided by units received, times 100.

Say a supplier ships you 500 units a month and your defect rate has held around 0.5% for the last two
quarters, roughly two or three defective units a month. One month comes in at three defects, still 0.6%.
That's noise, not a trend. But if the next month brings seven defects (1.4%) and the month after brings eight
(1.6%), you're not looking at a bad week anymore. The rate roughly tripled and held, and a rate that climbs
and stays up is a different problem than a rate that spikes once and comes back down.

The individual incident was never the real risk. The unnoticed drift underneath it is what turns into a lost
customer, because by the time a defect rate is high enough to notice without tracking it, you've usually
already shipped several bad orders to your own customers before catching on.

## Three things worth logging on every incident

You don't need a formal nonconformance process to make this work. You need the same handful of fields
captured the same way every time, whether it's a spreadsheet row or a note in your order system:

- **The purchase order it came from.** Without this, you can't tell whether three defects are spread across
  three shipments or concentrated in one bad batch, and those mean very different things.
- **What was wrong, in plain terms.** "Cracked housing," "wrong count," "doesn't match spec sheet." You're not
  writing a formal defect taxonomy, you're making sure the same problem gets described the same way twice so
  it's searchable later.
- **How many units it affected.** A defect rate is meaningless without a denominator. One damaged unit out of
  a two-unit order and one damaged unit out of a two-hundred-unit order are not the same event.

That's it. The formality of an enterprise nonconformance report buys you almost nothing at this scale that
these three fields don't already cover, and it's a lot more likely to actually get filled out consistently
by whoever's closest to the return that day.

## Bringing a pattern to the supplier conversation

Once the math shows a real trend, not a one-off, the conversation with your supplier changes shape. "We've
had some issues lately" gets a vague response. "Your defect rate went from 0.5% to 1.6% over the last two
months, all on the same component" gets a specific one, because you've made it impossible to wave off as bad
luck.

Ask for two things: what they think caused the shift, and what changes on their end between now and your next
order. You're not running a formal corrective action process, but you're asking the same underlying question
a CAPA plan asks: is this a one-time cause or something in how they're operating that needs to change. [Supplier
Coordination](/supplier-coordination/) is where that conversation and the purchase orders behind it actually
live day to day, so the quality numbers and the ordering relationship aren't sitting in two disconnected
places. And keeping a running record matters beyond just this one conversation:
[your suppliers already have a quality track record](/blog/suppliers-already-have-a-quality-track-record/)
sitting in your own data, whether or not anyone's been pulling it together.

## When it's time to look at a second supplier

Sometimes the conversation works and the rate comes back down. Sometimes it doesn't, and the same defect
shows up again the next cycle despite a promised fix. That repeat is the real signal, more than the original
defect rate was. A supplier who fixes the problem once it's raised is a supplier worth keeping. One who can't,
or won't, is telling you something about how they're going to perform going forward, not just about this one
batch.

That decision rarely happens in isolation. A supplier's quality trend and their [lead time
reliability](/blog/supplier-lead-time-slips/) tend to move together: a vendor that's cutting corners on
quality control is often the same one that's started running behind on delivery too. If both are drifting at
once, that's a stronger case for lining up a backup than either signal would be on its own.

## Watching every supplier the same way, without the spreadsheet falling behind

All of this works by hand for one or two suppliers you check on manually every month. It gets harder to trust
past that, not because the math changes, but because nobody's actually recalculating twelve suppliers'
defect rates every month by hand once things get busy, and a tracking habit that quietly lapses is worse than
never starting one, because it creates false confidence that someone would have noticed.

[Quality Monitoring](/quality-monitoring/) watches returns, inspections, and supplier performance together,
so a defect rate that's drifting shows up as a pattern while it's still one incident, not after it's already
cost you a repeat customer. Every supplier gets a running scorecard of defect rates built automatically from
that same returns and inspection data, so the numbers are already there the next time a quality conversation
comes up, instead of getting assembled from memory the night before.

## FAQ

**How do you know if a supplier quality issue is a pattern?**
Track defects as a percentage of units received per supplier per month, and compare it to that supplier's own
recent baseline. A rate that climbs for two or three months running, or the same failure type repeating across
separate purchase orders, is a trend. A single spike that returns to baseline the next month usually isn't.

**How do you track supplier defects without dedicated quality software?**
Log three things consistently for every incident: the purchase order it came from, what was wrong in plain
language, and how many units were affected. Those three fields, tracked the same way every time, are enough
to calculate a real defect rate and spot a trend without a formal nonconformance process.

**What's a normal defect rate for a small distributor?**
There isn't one universal number, it depends on the product and the supplier's own history. What matters more
than the absolute rate is the trend: a supplier holding steady at 1% isn't a concern, but a supplier climbing
from 0.5% to 1.5% over two or three months is, even though 1.5% might sound low in isolation.

**When should I stop giving a supplier another chance?**
When the same defect repeats after they've said they fixed it. A supplier who corrects course after one
conversation is worth keeping. One where the same failure shows up again next cycle, especially alongside
slipping lead times, is telling you this is how they operate, not what happened this one time.
