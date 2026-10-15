# Bozeman, Big Sky & Paradise Valley, MT — STR Market & Location Analysis

Static site (no build step), the same template as the Galveston and Island Park sites. It covers **Sections 2–6**:
- Market
- Location Analysis by Bedroom Size
- Why Location Changes the Rate
- Traveller Demographics
- STR Regulations

It also has the **Underwritten Properties** page (`underwritten.html`), which has no sheets yet: new listings start from a blank template. No buy boxes yet.

Live: https://ifrahamstr.github.io/BozemanMarketAnalysis/ (repo `ifrahamSTR/BozemanMarketAnalysis`).

## Where the content comes from

- **Listings:** `../Bozeman Big Sky Paradise Valley - MT - Greater Area.xlsx` (snapshot 2026-10-14) → `Cleaned_Data`, entire homes only: 419 of 446 (23 private and 4 hotel rooms left out).
- **The Montana STR Revenue Discovery site, reused rather than re-researched** (`Tools/STRClusterDiscovery/Montana/webpage`):
  - Section 6: its research for the Bozeman, Big Sky and Paradise Valley regions, verified 2026-09-18. It covers Bozeman's Type 3 freeze (Ordinance 2149), Big Sky's two-county split and 4% resort tax, Livingston's 2026 permit, the Gardiner resort tax, the covenant cases (*Myers*, *Brandt*) and the 1.90% STR property-tax rate;
  - the statewide comparison. Montana's median actual revenue is $35.3k; the Big Sky region's is $59.2k, Bozeman's $45.6k and Paradise Valley's $47.9k. 148 of Montana's 281 $90k+ listings sit in these three regions.
- **City-limit counts:** US Census TIGER boundaries (`../notebooks/city_limits_tiger.json`). 86 homes are inside Bozeman, 36 inside Belgrade, 33 inside Livingston and 2 inside Manhattan.
- **New research (2026-10-14), with sources on the page:**
  - BZN: a record 2,809,419 passengers in 2025;
  - Big Sky Resort: 5,850 skiable acres;
  - NPS: Yellowstone visits, the year-round North Entrance road, and the monthly shares that give the season strip;
  - MSU: 17,165 students in fall 2025.
- **Hero photo:** the Yellowstone River in Paradise Valley (public domain, Wikimedia Commons).

## Location model (kept simple)

`../notebooks/market_common.py`:
- **Distance to town:** straight-line km to the nearest town or resort centre (downtown Bozeman, Belgrade, Manhattan, Livingston, Gardiner, Big Sky Town Center, Big Sky Resort). Three bands: in town under 3 km (164 homes), 3–15 km out (142) and 15 km+ out (113).
- **Six Ward areas:** Bozeman (153), Belgrade & Manhattan (87), Big Sky & Gallatin Canyon (39), Livingston (51), Paradise Valley (82) and Gardiner (7).

Findings:
- Out-of-town homes earn more within size: 1.12× typical vs 0.89× in town. 3BRs show the biggest gap (1.37× vs 0.87×).
- Big Sky leads the areas (1.28×), then Paradise Valley (1.10×). Livingston is weakest (0.64×).
- The hot tub is the clearest product signal: 23% of homes have one, but 34 of the 42 Top 10% do.

## Pipeline

1. `python ../notebooks/build_overview_notebook.py`, then run `jupyter nbconvert --to notebook --execute --inplace --ExecutePreprocessor.kernel_name=str ../notebooks/bozeman_overview.ipynb`.
2. `python scripts/generate_webpage_data.py`.
3. Underwriting: put "UW'ing - NN.csv" exports in `underwriting/source_csv/` (none yet), then run `python scripts/build_underwritten.py`. It runs `node tests/test_underwritten.mjs` (30 checks).

   Until this market has its own sheets, new listings start from `underwriting/template/UW'ing - template (from Island Park 112).csv`:
   - only the financing and tax assumptions carry over;
   - setup starts with the five standard lines and OPEX with the fifteen standard lines (see below); revenue starts blank;
   - the comp columns are the newer layout (Firepit / Outdoor Dining / Pack and Play).
4. Browser test: `NODE_PATH=<playwright-core node_modules> node tests/test_underwritten_browser.mjs`.

Match by location keeps to the target's area, with bedrooms ±1, revenue $90k+ (69 of the 419 homes) and nearest first.

**Standard setup lines (2026-10-14):** every new underwriting sheet made on the page carries the five lines every "UW'ing" sheet has, in their usual rows: Furniture / Decor / Essentials (row 5), Misc, CoHost Essentials, Design/Project Management and Install/Staging/Warehousing (rows 16–19). A line that is missing or has no amount gets Galveston file 101's amount ($50,000 / $25,000 / $3,500 / $25,000 / $18,250); a line the starting sheet already prices keeps its own amount. Rule: `UWRules.withStandardSetup` in `js/underwritten/uw-rules.js`, applied when a listing is created and whenever a new-listing sheet is shown or downloaded.

**Standard OPEX lines (2026-10-15):** every new underwriting sheet made on the page carries all fifteen monthly OPEX lines with a value, never empty. A missing or blank line gets Galveston file 101's amount, rounded: Internet $100, Utilities $500, Pest Control $50, Pool/Hot Tub Maintenance $200, Outdoor/Landscaping $100, Software $0, Household Supplies $250, Cleaning $275 × 6 turns ($1,650), Other $0, Property Taxes $900 (101 has $924), Insurance HOI $600, CapEx Reserve $500, MISC $0, HOA fees $0, PMI $0. That's $4,850 a month in total. A $0 line is written as the sheet's "$ -". A line the starting sheet already prices keeps its own amount. Rule: `UWRules.withStandardOpex` in `js/underwritten/uw-rules.js`.
