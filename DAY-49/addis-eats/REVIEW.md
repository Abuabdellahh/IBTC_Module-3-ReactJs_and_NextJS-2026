# REVIEW.md — Peer code review

> Fill this in during the Day 50 peer review. Follow the order:
> 1. README
> 2. Live URL
> 3. Use the app before reading any code
> 4. Route structure
> 5. Follow one feature from URL to data and back
> 6. Check one protected action for both of its checks
>
> Ask questions, not verdicts.

**Reviewer:** _your name_
**Project reviewed:** _peer's name — repository URL — live URL_
**Feature followed end to end:** _e.g. "place an order"_

## Three strengths

1. _Specific, with a file and line — e.g. "`getOrders` takes the user id from the session (`lib/db.js:12`), so the list can't be widened from the URL."_
2.
3.

## Three questions

1. _e.g. "What happens if `deleteItem` is called while signed out? I could not find a session check inside it."_
2.
3.

## Checklist

| Area | Question | Finding |
| --- | --- | --- |
| Boundary | Is client code used only where it must be? | |
| Security | Is there a check inside the write itself? | |
| Queries | Does the id come from the session, not the request? | |
| States | What does a brand-new account see? | |
| Markup | Real buttons and links, not clickable divs? | |
| Naming | Could you find each file without searching? | |
