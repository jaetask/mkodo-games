# MKODO

I took the email info and decided to get a head start.

- [x] Find/Use/Create a next.js codesandbox
- [x] Add tailwind styling
- [] Look at MKODO existing apps
- [] Create a similar app
- [] Generate some data via faker

## Features to deliver

- Fake an API with static JSON data (will be provided in interview)
- Landing page, with cards to view data
- Clickthrough to detailed view
- Must be responsive
- Consistent spacing
- Clean design / Lots of whitespace
- Shopping cart / basket functionality ?

## Testing

- Jest
- React testing library for components
- Cypress for user journeys

## Code standards

- Pure functions
- Prefer native JS
- Colocate components in single file.

Have some fun and see how far i can get 😍

## MKODO APPS

Pick a bet!
This looks interesting, from what I can gather it works like this:

### multiple games

> pick a game to buy a ticket

games have:

- title
- tagline
- description
- short name

### games have mutliple bets

> pick a bet to enter?

bets have:

- sales name
- start date/time
- offer (win if this actually happens)
- entry price
- ROI, eg $10 returns $100,000 = 10000%

select a bet>

small screen appears with various entry levels and RIO/ratios

continue >

confirm entry >

validate payment

- enter vendor id
  < return
- done

ok, lets model this is a xstate and build the flow
