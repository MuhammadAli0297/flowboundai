---
title: "Inventory Turnover Ratio, Explained"
description: "How to calculate inventory turnover ratio and days of inventory, with a worked example, and what a low or high number says about your stock."
excerpt: "How fast your stock sells through, and what the number tells you."
publishDate: 2026-10-02
author: "Ryo Shibata"
authorTitle: "CTO"
category: "Inventory Management"
tags: ["inventory turnover", "inventory management", "supply chain kpis", "working capital", "small business"]
---

Inventory turnover ratio measures how many times you sell through and replace your stock in a given period,
usually a year. The formula is cost of goods sold divided by average inventory. A ratio of 4 means you sold
through the equivalent of your whole inventory four times, and dividing 365 by the ratio tells you roughly how
many days a unit sits on the shelf before it sells. It is one of the fastest ways to see whether cash is
moving through your business or parked in a warehouse.

## The formula

Inventory turnover = cost of goods sold (COGS) / average inventory

Average inventory = (beginning inventory + ending inventory) / 2

Two details trip people up. First, use COGS, not revenue. Inventory is carried on your books at cost, so the
numerator should be at cost too. Using sales revenue inflates the ratio by whatever your markup is and makes
a high-margin line look faster than it really is. Second, for a seasonal business, a two-point average of
the start and end of the year can badly misrepresent the stock you actually carried. Averaging twelve
month-end balances is more accurate.

## A worked example

A distributor has $600,000 in annual COGS. Inventory at the start of the year was $180,000 and at the end
$220,000, so average inventory is $200,000.

- Inventory turnover = $600,000 / $200,000 = **3.0**
- Days of inventory = 365 / 3.0 = **about 122 days**

On average, a unit sits for about four months between arriving and selling. Whether that is healthy depends
entirely on what you sell, which is the next section.

## What counts as a good number

There is no universal benchmark, and anyone quoting one without naming an industry is guessing. Grocery and
perishable goods need to turn many times a year or they spoil. A distributor of durable parts can run a much
lower ratio and still be healthy. The useful comparisons are your own history and your own product lines:

- **Trend over time.** A ratio sliding from 4.2 to 3.1 over a year tells you stock is building up faster than
  it is selling, even if total sales are growing.
- **Across categories.** One blended number hides the real story. A line turning 8 times a year and a line
  turning 1.5 times can average out to something that looks fine while the slow line quietly ties up cash.
- **Against your lead times.** If a supplier takes 60 days to deliver and your days of inventory is 122, you
  are carrying roughly two months of stock beyond what the replenishment cycle needs.

## Reading a low ratio

A low ratio usually means overstocking, slow-moving items, or reorders placed on habit instead of demand. It
shows up as cash tied up in stock, storage costs, and eventually write-downs. The line between slow and truly
stuck matters, and [dead stock versus slow-moving stock](/blog/dead-stock-vs-slow-moving-stock/) is worth
reading before you decide what to discount and what to hold. A persistently low ratio is also a sign that
your [reorder points](/blog/reorder-point-math/) are set too high or have not been revisited since demand changed.

## Reading a high ratio

A high ratio is not automatically good news. It can mean strong demand and efficient replenishment, or it can
mean you are running too lean and losing sales to empty shelves. The tell is whether stockouts are rising
alongside the ratio. If turnover climbs while [safety stock](/blog/safety-stock-how-much-buffer-you-need/)
shrinks and out-of-stock events increase, you have not become more efficient, you have traded carrying cost
for lost sales. Turnover should always be read next to your stockout rate and fill rate, which is why it sits
alongside them in a short list of [supply chain KPIs worth tracking](/blog/supply-chain-kpis-to-track/).

## How to improve it without starving the shelves

The levers are the same ones that drive everything else in inventory:

1. **Order closer to actual demand.** Reorder quantities set off last year's sales, or off gut feel, drift
   away from reality. A [demand forecast](/demand-forecasting/) grounded in sales history, seasonality, and
   supplier lead times keeps order sizes honest.
2. **Right-size reorder points by SKU.** One reorder point rule applied to every item overstocks the slow
   ones and under-protects the fast ones.
3. **Cut the long tail deliberately.** Identify the items that have not moved in a long time and decide
   whether to discount, bundle, return, or stop reordering them.
4. **Count what you actually have.** Turnover built on bad on-hand numbers is wrong in a way you cannot see.
   Regular [cycle counting](/blog/inventory-cycle-counting-abc-method/) keeps the denominator trustworthy.

## Where Flowbound fits

Flowbound does not change how the ratio is defined, but it helps with the inputs that move it. [Inventory
Tracking](/inventory-tracking/) keeps a live view of what is on hand, incoming, and already spoken for, so
the average inventory behind your ratio reflects reality. [Demand Forecasting](/demand-forecasting/) uses your
sales history, seasonality, and supplier lead times to recommend what to reorder and when, so you are less
likely to stack up stock you will not sell. And [Reorder](/reorder/) can place the purchase order at the
recommended quantity once you trust the call, inside the guardrails you set.

## FAQ

**What is the inventory turnover ratio formula?**
Inventory turnover equals cost of goods sold divided by average inventory. Average inventory is usually the
beginning and ending balances added together and divided by two, though a seasonal business gets a more
accurate figure by averaging monthly balances. The result is how many times you sold through your stock in
the period.

**How do I turn the ratio into days of inventory?**
Divide 365 by the turnover ratio. A ratio of 3.0 works out to about 122 days, meaning a typical unit sits
for roughly four months before it sells. Comparing that figure to your supplier lead times, covered in more
detail in the [reorder point math](/blog/reorder-point-math/) post, shows how much excess stock you carry.

**Is a higher inventory turnover always better?**
No. A higher ratio can mean efficient replenishment, but it can also mean you are running too lean and
missing sales to stockouts. Read it alongside your stockout rate, and keep an adequate
[safety stock](/blog/safety-stock-how-much-buffer-you-need/) buffer.

**Should I use sales or COGS in the formula?**
Use COGS. Inventory is carried at cost, so the numerator should be at cost as well. Using sales revenue
inflates the ratio by your markup and makes comparisons across product lines with different margins
misleading.

**Can software calculate inventory turnover for me?**
Any system with accurate on-hand and cost data can. The harder part is keeping those numbers current, which
is where [Inventory Tracking](/inventory-tracking/) helps by maintaining live visibility into what you hold.
