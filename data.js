// Data transcribed directly from the source page (see README.md for provenance).
// Every numeric value below appears verbatim on that page. Nothing is invented;
// anything the source does not state is left out of this file and called out
// as "not published" in index.html instead of guessed here.

const SOURCE = {
  name: "KosGames",
  title: "Potion Craft Alchemist Simulator: Potion Price Composition (Version 1.0.5)",
  url: "https://kosgames.com/potion-craft-alchemist-simulator-potion-price-composition-version-1-0-5-38817/",
  published: "2023-02-03",
  gameVersion: "1.0.5",
  fetched: "2026-11-18",
};

// Base potion prices, in the order and with the values published on the source page.
const POTIONS = [
  { name: "Necromancy", basePrice: 237 },
  { name: "Luck", basePrice: 170 },
  { name: "Anti-Magic", basePrice: 154 },
  { name: "Inspiration", basePrice: 140 },
  { name: "Levitation", basePrice: 132 },
  { name: "Shrinking", basePrice: 121.5 },
  { name: "Hallucinations", basePrice: 120 },
  { name: "Enlargement", basePrice: 118 },
  { name: "Invisibility", basePrice: 115 },
  { name: "Libido", basePrice: 112 },
  { name: "Fear", basePrice: 110 },
  { name: "Rejuvenation", basePrice: 98 },
  { name: "Magical Vision", basePrice: 92 },
  { name: "Curse", basePrice: 90 },
  { name: "Rage", basePrice: 87 },
  { name: "Lightning Protection", basePrice: 83 },
  { name: "Fire Protection", basePrice: 79 },
  { name: "Frost Protection", basePrice: 77 },
  { name: "Acid Protection", basePrice: 76 },
  { name: "Charm", basePrice: 75.5 },
  { name: "Acid", basePrice: 72 },
  { name: "Fragrance", basePrice: 70 },
  { name: "Slipperiness", basePrice: 68.5 },
  { name: "Slowness", basePrice: 66 },
  { name: "Stench", basePrice: 64.5 },
  { name: "Gluing", basePrice: 64 },
  { name: "Lightning", basePrice: 61.5 },
  { name: "Light", basePrice: 54.5 },
  { name: "Poison Protection", basePrice: 51.5 },
  { name: "Sleep", basePrice: 49.5 },
  { name: "Stone Skin", basePrice: 49.5 },
  { name: "Swiftness", basePrice: 48 },
  { name: "Dexterity", basePrice: 46 },
  { name: "Explosion", basePrice: 43.5 },
  { name: "Mana", basePrice: 36.5 },
  { name: "Wild Growth", basePrice: 33 },
  { name: "Strength", basePrice: 29 },
  { name: "Fire", basePrice: 24.5 },
  { name: "Frost", basePrice: 20 },
  { name: "Poisoning", basePrice: 13 },
  { name: "Healing", basePrice: 10 },
];

// Strength / special-request-strength multipliers applied to a potion's base price.
const STRENGTH_OPTIONS = [
  { key: "tier1", label: "Tier I", multiplier: 1 },
  { key: "tier2", label: "Tier II", multiplier: 1.75 },
  { key: "tier3", label: "Tier III", multiplier: 2.5 },
  { key: "weak", label: "Special Request: Weak", multiplier: 3 },
  { key: "strong", label: "Special Request: Strong", multiplier: 3.75 },
];

// Special-request multipliers. Each is published on the source page as an independent
// checkbox-style bonus that applies when the customer's request of that type is met.
// The source does not state whether more than one "ingredient count" row (max 1/2/3
// types) can apply at once in the real game -- that is a game-mechanics question this
// page cannot answer from this source, so the calculator lets you check any combination
// and the page says so explicitly (see the on-page ambiguity note).
const SPECIAL_REQUEST_MULTIPLIERS = [
  { key: "noIngredientX", label: "Don't use Ingredient X", multiplier: 1.5 },
  { key: "atLeastOnceIngredientX", label: "Use at least once Ingredient X", multiplier: 1.5 },
  { key: "mainlyIngredientX", label: "Mainly use Ingredient X (>=50% of ingredients)", multiplier: 2 },
  { key: "max1Type", label: "Maximal 1 type of Ingredient", multiplier: 3 },
  { key: "max2Type", label: "Maximal 2 types of Ingredient", multiplier: 2 },
  { key: "max3Type", label: "Maximal 3 types of Ingredient", multiplier: 1.5 },
  { key: "fitting2nd", label: "Additional fitting Effect (2nd)", multiplier: 1.25 },
  { key: "fitting3rd", label: "Additional fitting Effect (3rd)", multiplier: 1.2 },
  { key: "fitting4th", label: "Additional fitting Effect (4th)", multiplier: 5 / 3 },
  { key: "fitting5th", label: "Additional fitting Effect (5th)", multiplier: 2 },
];

// Haggling multiplier ranges, applied after the price formula and also rounded down.
const HAGGLE_DIFFICULTIES = [
  { key: "veryEasy", label: "Very Easy", min: 1.0, max: 1.2 },
  { key: "easy", label: "Easy", min: 0.9, max: 1.3 },
  { key: "medium", label: "Medium", min: 0.8, max: 1.4 },
  { key: "hard", label: "Hard", min: 0.75, max: 1.45 },
  { key: "veryHard", label: "Very Hard", min: 0.7, max: 1.5 },
];

function findPotion(name) {
  return POTIONS.find(p => p.name === name) || null;
}

function findStrength(key) {
  return STRENGTH_OPTIONS.find(s => s.key === key) || null;
}

function findSpecialRequest(key) {
  return SPECIAL_REQUEST_MULTIPLIERS.find(s => s.key === key) || null;
}

function findHaggleDifficulty(key) {
  return HAGGLE_DIFFICULTIES.find(h => h.key === key) || null;
}

// main: { potionName, strengthKey }
// additionals: array (0-3) of { potionName, strengthKey }
// specialRequestKeys: array of SPECIAL_REQUEST_MULTIPLIERS keys that are checked
// tradingPercent, popularityPercent: numbers, e.g. 70 means +70% -> multiplier 1.7
// Formula per source: (Price*Strength + Additional) * SpecialRequestMultipliers * TradingTalent * Popularity,
// rounded down to the next natural number.
function computePrice({ main, additionals = [], specialRequestKeys = [], tradingPercent = 0, popularityPercent = 0 }) {
  const mainPotion = findPotion(main.potionName);
  const mainStrength = findStrength(main.strengthKey);
  if (!mainPotion || !mainStrength) return null;

  let sum = mainPotion.basePrice * mainStrength.multiplier;

  for (const add of additionals) {
    const p = findPotion(add.potionName);
    const s = findStrength(add.strengthKey);
    if (!p || !s) continue;
    sum += p.basePrice * s.multiplier;
  }

  let multiplier = 1;
  for (const key of specialRequestKeys) {
    const sr = findSpecialRequest(key);
    if (sr) multiplier *= sr.multiplier;
  }

  const tradingMultiplier = 1 + (Number(tradingPercent) || 0) / 100;
  const popularityMultiplier = 1 + (Number(popularityPercent) || 0) / 100;

  const unrounded = sum * multiplier * tradingMultiplier * popularityMultiplier;
  const rounded = Math.floor(unrounded);

  return { unrounded, rounded };
}

function haggleRange(roundedPrice, difficultyKey) {
  const d = findHaggleDifficulty(difficultyKey);
  if (!d) return null;
  return {
    min: Math.floor(roundedPrice * d.min),
    max: Math.floor(roundedPrice * d.max),
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    SOURCE,
    POTIONS,
    STRENGTH_OPTIONS,
    SPECIAL_REQUEST_MULTIPLIERS,
    HAGGLE_DIFFICULTIES,
    findPotion,
    findStrength,
    findSpecialRequest,
    findHaggleDifficulty,
    computePrice,
    haggleRange,
  };
}
