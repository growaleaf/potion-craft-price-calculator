# Potion Craft Potion Price Calculator

Static site (`index.html` + `data.js`) for a Potion Craft: Alchemist Simulator player with a customer waiting, who wants to know what a brewed potion will sell for -- tier, extra accepted effects, special-request bonuses, Trading skill, Popularity -- and which potions are worth brewing.

## Sections

1. **Base Prices (41)** -- every potion's base price from the source table, searchable and sortable.
2. **Price Calculator** -- pick a main potion and strength, add up to 3 additional accepted effects, check any of the 10 special-request multipliers, enter Trading/Popularity bonus percentages, and see the unrounded price, the rounded-down price, and the haggle range for a chosen difficulty.
3. **Sources & Caveats** -- points to the full citation and caveats in the page footer.

No dedicated Potion Craft price calculator exists (per Gate 2) -- this tool is assembled directly from one static prose guide.

## Data provenance

- All base prices, the price formula, the strength/special-request/haggling multiplier tables, and the three worked examples: [KosGames -- Potion Craft Alchemist Simulator: Potion Price Composition (Version 1.0.5)](https://kosgames.com/potion-craft-alchemist-simulator-potion-price-composition-version-1-0-5-38817/), published 2023-02-03, fetched and parsed directly from the live page on 2026-11-18. Data reflects game version 1.0.5.
- A second candidate source, gaming.net's "Potion Craft: All Recipes & How to Make Them", was fetched and checked. It covers ingredient recipes, not price composition, and contains no base-price table or formula to cross-check against -- it contributes no data here.
- wiki.gg, gamerjournalist, and supercheats returned 403 Forbidden on direct fetch; the Wayback Machine has no snapshot of the wiki.gg page; Fandom is off-limits per charter. No second source with price data was found.

The source table lists 41 potions (Necromancy at 237 down to Healing at 10) -- that is the full row count transcribed from the page; no row was added or dropped.

No value on this page was invented:

- The source states "up to 3 more Additionals is possible if all effects are desired by the customer" but does not say what happens beyond that. This calculator caps additional accepted effects at 3 and says so on the page, rather than guessing a rule for a 4th.
- The source lists 10 special-request multipliers as independent bonuses but never states which combinations are physically possible in one real transaction (e.g. whether two different "maximal N types of ingredient" rows can both apply, or whether an "Additional fitting Effects" multiplier can combine with an "Additional" accepted-effect term in the same price). The calculator lets any combination be checked and multiplies them all per the published formula, with an on-page note disclosing this as an unresolved ambiguity rather than a game-mechanics rule this page can assert.
- Any potion, multiplier, or mechanic not on the source page is simply absent from this tool -- nothing is backfilled with an invented number.

## Worked examples (used as this page's tests)

All three are reproduced from the source and checked in `test.js`:

1. Mana III + Healing II, both special requests fulfilled, Trading VII (70%), Popularity 20%: `(36.5*2.5 + 10*1.75) * 1.5 * 1.5 * 1.7 * 1.2 = 499`.
2. Healing I with Strength/Dexterity/Swiftness/Stone Skin I as four non-satisfying "fitting" effects (no `Additional` term, per the source's own explanation), Trading IV (40%), Popularity 30%: `(10*1) * 1.25 * 1.2 * 5/3 * 2 * 1.4 * 1.3 = 91`.
3. Levitation (Special Request: Weak) with six stacked multipliers, Trading X (+100%), Popularity +50%: `(132*3) * 2 * 1.5 * 1.25 * 1.2 * 5/3 * 2 * 2 * 1.5 = 17820`, haggled at Very Hard (`*1.5`) = `26730`.

## Running / testing

```
node test.js                     # 15/15 known-answer + arithmetic + row-count tests
python3 -m http.server 8000      # serve the folder, then open http://localhost:8000/
```
