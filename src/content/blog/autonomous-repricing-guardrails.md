---
title: "Repricing Guardrails: Floors, Ceilings, Caps"
description: "How to set price floors, ceilings, and max-move limits for automated repricing, and how often to revisit them as your business changes."
publishDate: 2026-08-30
author: "Flowbound"
category: "Autonomous Decisions"
tags: ["autonomous decisions", "repricing", "pricing strategy", "margin", "wholesale pricing"]
---

Handing a machine permission to change your prices without asking first is the part that makes most
distributors nervous, and it should. The fix isn't to keep a human in the loop on every price change
forever, it's to build the fence before you let anything run loose inside it. That fence has three pieces:
a floor, a ceiling, and a limit on how far any single move can go.

## What are repricing guardrails?

Repricing guardrails are the three numeric limits that bound an automated price change: a floor (the
lowest you'll go before margin breaks), a ceiling (the highest the market will actually bear), and a
max-move-per-adjustment cap (how much a price can shift in one pass, regardless of what the underlying math
says it should be). Together they let a system reprice on its own while guaranteeing no single change can
put you in a bad spot, even if a cost feed glitches or demand spikes in a way nobody predicted.

## The floor: never below true margin, not just unit cost

The floor should be built off landed cost, not the invoice price you pay a supplier. A SKU that costs $22 a
unit from the supplier but runs another $1.40 in freight and a $0.60 per-unit share of your warehouse
handling has a real landed cost closer to $24, and a floor set against the $22 number alone is already
eating margin nobody agreed to give up. Once you have landed cost, the floor is landed cost plus the
minimum margin percentage you're willing to accept on that SKU class, not your target margin. A 35%
cost-plus target and a 22% hard floor are two different numbers doing two different jobs: one is where you
want to sit most of the time, the other is the line the system is never allowed to cross even during an
aggressive [demand](/demand-forecasting/)-driven price cut.

Set the floor per SKU class, not one number for the whole catalog. A fast-moving fastener SKU with thin
per-unit margin but high volume can tolerate a tighter floor than a slow-moving specialty part where each
sale needs to carry more weight. Lumping both under one blanket floor either strangles the fast mover's
competitiveness or lets the slow mover's margin erode further than it should.

## The ceiling: what the market will actually bear, not what the math allows

The ceiling exists for a different reason than the floor. It's not there to protect margin, it's there to
stop the system from pricing you out of a sale just because a cost model or a demand spike says it could
charge more. For a commodity SKU with real competitive alternatives, the ceiling should be tied to a
market benchmark, a recent competitor price, an industry price index, or your own historical high for that
SKU over the last 90 days, whichever is the most current signal you actually have access to. For a SKU with
real differentiation or an exclusive supplier relationship, the ceiling can sit further above cost, since
there's less risk of an account simply buying the same part elsewhere.

A distributor selling industrial adhesive at $46 a case with a $31 landed cost has room before hitting any
real ceiling. But if a competitor's list price for the same product is $52, setting your own ceiling above
that number doesn't earn you extra margin, it just hands the next order to whoever's watching the same
market and staying under it. The ceiling isn't a number you calculate from your own cost structure at all,
it's a number you calculate from everyone else's.

## The max-move cap: the guardrail that isn't about margin

The floor and ceiling are about where a price ends up. The max-move-per-adjustment cap is about how fast it
gets there, and it's the one most pricing guides skip entirely because it doesn't map to a margin number.
Say a supplier cost spikes 30% overnight on a raw material shortage. The cost-plus math says your sell
price should jump from $40 to $52 in the same motion. A 30% overnight jump on an account that just placed a
standing order at $40 doesn't read as "the market moved," it reads as being taken advantage of, and a good
account will start shopping around the moment it happens, whether or not the increase was mathematically
justified.

A max-move cap of 8 to 12% per adjustment cycle absorbs that shock instead of passing all of it through at
once. The $40 to $52 move under a 10% cap becomes $40, then $44, then $48.40, then the full $52 over three
or four repricing cycles instead of one, assuming the elevated cost holds. If the spike turns out to be a
one-week blip and costs settle back down before the fourth cycle, you never fully passed through a price
jump that would have needed walking back a week later, which is its own kind of account-trust problem. The
cap isn't slowing down a correct answer for no reason, it's buying time to find out whether the input that
triggered the move is real and lasting or noise that resolves on its own.

## When the guardrails fight each other

Here's the part that doesn't show up in general dynamic-pricing advice, because it's specific to running a
floor, a ceiling, and a max-move cap together rather than any one of them in isolation. A steep cost
increase can put the mathematically correct price above what your max-move cap allows in a single cycle,
which is fine and expected, that's the cap doing its job. But if the cost increase is severe enough, and
your max-move cap is tight enough, you can end up in a stretch of several cycles where the current price sits
below your floor while the system works its way up toward the target. That's a real, deliberate tradeoff,
not a bug: you're choosing to let the price sit under-floor for a bounded window rather than shock the
account with the full increase at once. The fix isn't picking wider guardrails to avoid the situation, it's
deciding in advance how many cycles of under-floor pricing you're willing to tolerate before the cap
loosens for that SKU specifically. Two or three cycles is usually a reasonable ceiling on that patience
before letting a larger single jump through.

## How often to revisit the guardrails themselves

This is a different question than how often prices update. A well-tuned system can [reprice](/pricing/) the
moment a cost or demand signal actually changes, several times a week for a volatile SKU, while the floor,
ceiling, and max-move cap underneath it stay fixed for months. Those bounds are policy, not live data, and
policy only needs revisiting when the business itself has changed, not on a fixed calendar.

Three events should trigger a guardrail review regardless of when the last one happened: a real shift in
your cost structure (a new freight contract, a warehouse move, a change in supplier terms that alters
landed cost math sitewide), a competitive shift worth reacting to (a new entrant undercutting your ceiling
consistently, not a one-week promotional blip), or a deliberate strategy change (you decide to compete more
aggressively on a SKU class and are willing to run tighter margin to hold volume). Outside of those three
triggers, a quarterly guardrail review is a reasonable default for most catalogs, closer to monthly for SKU
classes with real cost volatility, since a floor calculated against last year's freight rates is quietly
wrong the whole time nobody checks it.

## A note on where this fits: repricing your prices, not Flowbound's

If you searched something like "automated repricing" and landed here expecting a page about subscription
tiers or what a piece of software costs to run, that's not what this is. This post, and Flowbound's
[Pricing](/pricing/) capability it describes, are about resetting the sell price on your own products when
your [supplier costs shift](/supplier-coordination/) or demand moves, inside the bounds you set. It has
nothing to do with what you pay for the tool itself. That mix-up is common enough in this exact keyword
space that it's worth saying directly rather than assuming it's obvious.

## Where this saves the most time

The [manual version of this work](/blog/cost-of-repricing-manually/) usually breaks down not because
nobody knows the formula, but because nobody has time to recalculate a floor, check it against a ceiling,
and apply a capped increase across every account tier, every time a cost changes, for every SKU that
changed. A SKU drifting toward [dead stock](/blog/dead-stock-vs-slow-moving-stock/) often needs the opposite
treatment entirely, a markdown that clears inventory rather than a cost-plus formula assuming steady
demand, another judgment call that's easy to miss by hand across a real-sized catalog. Setting the three
guardrails once, and reviewing them on the cadence above, is what makes it safe to let the day-to-day
repricing run on its own in between.

## FAQ

**What's the difference between a price floor and a target margin?**
The target margin is where you want a price to sit most of the time, usually the cost-plus percentage
you'd quote if someone asked. The floor is the hard minimum the system is never allowed to cross even
during an aggressive price cut, and it should be set lower than the target on purpose, otherwise it isn't
really a limit, it's just the same number twice.

**Does Flowbound's Pricing feature control what I pay for the software?**
No. [Pricing](/pricing/) is Flowbound's autonomous repricing capability: it adjusts your sell price on your
own products within the bounds you set when supplier costs or demand shift. It has no connection to
subscription cost or billing, which is a separate, unrelated question from what this capability does.

**Should every SKU use the same max-move-per-adjustment cap?**
No, and using one flat cap across a whole catalog is a common mistake. A high-volume SKU with tight
per-unit margin can usually tolerate a smaller cap since even a modest move affects many orders, while a
slower-moving SKU with fewer transactions can sometimes absorb a slightly larger single move without the
same account-trust risk. Tiered pricing accounts add another layer here too, since a cap needs to hold
consistently across whatever tiers [a wholesale account's standing agreement](/wholesale-account-management/)
includes, not just the list price.

**How is reviewing repricing guardrails different from reviewing a reorder point?**
They're actually similar problems wearing different clothes. A [reorder point](/blog/reorder-point-math/)
goes stale the same way a pricing floor does, both are numbers calculated once against conditions that
quietly drift, sales pace and lead times on one side, cost structure and competitive pressure on the other.
Neither one benefits from being set once and forgotten, and both need a real trigger-based review rather
than a "someone will notice eventually" approach.

**What happens if a cost spike is bigger than my max-move cap allows?**
The price moves as far as the cap allows in that cycle and picks up the rest over the following cycles,
which can mean sitting under your floor margin for a short, bounded stretch while it catches up. That's a
deliberate tradeoff, not a failure: it protects the account relationship from a single shock in exchange for
a few cycles of thinner margin, and it's worth deciding in advance how many cycles of that you're willing to
tolerate before letting a larger jump through, the same way [Reorder](/reorder/) has to decide how much
lead-time risk to absorb before escalating past its own normal rules.
