/**
 * Content/config layer for the Bozeman, Big Sky & Paradise Valley, MT market &
 * location page (Sections 2-6; no buy boxes yet). Same template as the
 * Galveston, Boone and Island Park sites, organised around bedroom size: every
 * location comparison is made within a size bucket ("vs. typical" = revenue /
 * market median for that size).
 *
 * Prose and config only. Every number shown is read from js/region_data.js
 * (generated from notebooks/bozeman_overview.ipynb); prose that quotes a number
 * computes it from that data, except the statewide comparison (Montana STR
 * Revenue Discovery data, Sept 2026), the city-limit counts (US Census TIGER
 * boundaries, notebooks/city_limits_tiger.json) and the researched market
 * facts, which carry their sources. The location question is kept simple:
 * straight-line distance to the nearest town or resort centre, plus six
 * reference areas.
 */
function photo(relPath, alt, caption) {
  return { file: "assets/" + relPath, alt: alt, caption: caption };
}
const MARKET_NAME = "Bozeman, Big Sky & Paradise Valley, MT";
const _ls = (s, l) => LOCATION.locSize[s][l];
const _area = (name) => LOCATION.areas.find((a) => a.name === name);
const _lad = (s) => LOCATION.ladder.find((r) => r.size === s);
const _x = (c) => fmtX(c.idx);
const _am = (k, s) => LOCATION.amenBySize[k][s];
const _drv = (k) => LOCATION.drivers.find((d) => d.driver === k);
const IN = "In town (under 3 km)", MID = "3–15 km out", OUT = "15 km+ out";
const BZ = "Bozeman", BG = "Belgrade & Manhattan", BS = "Big Sky & Gallatin Canyon", LV = "Livingston", PV = "Paradise Valley", GD = "Gardiner";
const _top = () => Object.values(LOCATION.top10BySize).reduce((a, c) => a + c, 0);
// Homes inside each city's limits (US Census TIGER places, checked 2026-10-14); the rest are unincorporated.
const IN_BOZEMAN = 86, IN_BELGRADE = 36, IN_LIVINGSTON = 33, IN_MANHATTAN = 2;

// ---------------------------------------------------------------------------
// Overview (top of page)
// ---------------------------------------------------------------------------
const HERO = {
  title: "Around Bozeman, the country and a hot tub pay; the city is closed to new whole-home STRs",
  sub: (() => {
    const b = _area(BS), p = _area(PV), t = LOCATION.top10BySize;
    return "Three Montana markets in one: the Gallatin Valley around Bozeman, Big Sky, and Paradise Valley down to Gardiner. Bedroom count sets the baseline (" + (t["4BR"] + t["5BR+"]) + " of the " + _top() + " Top 10% listings have 4 bedrooms or more). " +
      "On top of it, homes out of town earn more than homes in town: " + _x(_ls("All sizes", OUT)) + " a typical home their size 15 km or more from a town centre, against " + _x(_ls("All sizes", IN)) + " in town. Big Sky & Gallatin Canyon leads the areas (" + fmtX(b.idx) + "), then Paradise Valley (" + fmtX(p.idx) + "). " +
      "The hot tub is the clearest product signal: only " + Math.round((_drv("hot_tub").nWith / MARKET_STATS.n) * 100) + "% of homes have one, but " + LOCATION.top10Amen.hot_tub + " of the " + _top() + " Top 10% do. " +
      "Rules matter as much as revenue here: the City of Bozeman issues no new non-owner-occupied whole-home STR permits (Section 6).";
  })(),
};

const FOOTER_NOTE = () =>
  "Preliminary. No property has been underwritten and no buy box has been set. Revenue figures are gross Revenue Potential benchmarks from the market dataset (" +
  MARKET_STATS.n + " entire-home listings around Bozeman, Big Sky, Livingston, Paradise Valley and Gardiner, <span class=\"nowrap\">" + MARKET_STATS.snapshot + "</span> snapshot), not a full underwriting model. Read any cell under 8 homes as directional.";

// ---------------------------------------------------------------------------
// Section 2 — Market context (MARKET_OVERVIEW is in the research section below)
// ---------------------------------------------------------------------------
const DISTRIBUTION_NOTE = () => {
  const t = LOCATION.top10BySize;
  return "Half the homes earn more than " + fmtK(MARKET_STATS.median) + "; the Top 10% starts at " + fmtCurrency(REVENUE_DISTRIBUTION.p90) + ". That tail is mostly large homes (" +
    t["4BR"] + " 4BRs and " + t["5BR+"] + " 5BR+ of the " + _top() + "), with " + t["3BR"] + " 3BRs; only " + (t["Studio-1BR"] + t["2BR"]) + " are 2BR or smaller.";
};

const LADDER_NOTE = () => {
  const s = _lad("Studio-1BR"), two = _lad("2BR"), three = _lad("3BR"), four = _lad("4BR"), five = _lad("5BR+");
  return "Revenue climbs with every bedroom: " + fmtK(s.median) + " for a studio or 1BR, " + fmtK(two.median) + " for a 2BR, " + fmtK(three.median) + " for a 3BR, " + fmtK(four.median) + " for a 4BR and " + fmtK(five.median) +
    " for 5BR+, where the nightly rate reaches " + fmtCurrency(five.adr) + " and occupancy dips to " + five.occ + "%. Because size moves revenue this much, every location comparison below is made within the same size.";
};

const DRIVERS_NOTE =
  "<strong>Screening signals, not proven uplift.</strong> Each row compares listings with and without a feature on two measures: how often they reach the top quarter <em>for their size</em>, and what they earn against a typical home their size (1.00× = typical). Rows with fewer than 15 homes on either side are marked \"few homes\". Hot tubs and saunas cluster in Big Sky and in rural homes, so those signals overlap with location.";

const DRIVER_ROWS = [
  { key: "Big Sky & Gallatin Canyon area", label: "Big Sky & Gallatin Canyon", group: "Location · area", note: "The strongest area, with the highest nightly rates (see Section 3)." },
  { key: "Paradise Valley area", label: "Paradise Valley", group: "Location · area", note: "Ahead of typical, led by its 3BRs." },
  { key: OUT, label: "15 km or more from a town centre", group: "Location · distance", note: "Rural homes earn more at every size up to 4BR (see Section 3)." },
  { key: IN, label: "In town (under 3 km)", group: "Location · distance", note: "Behind typical: downtown Bozeman, Belgrade and especially Livingston." },
  { key: "hot_tub", label: "Hot tub", group: "Amenity", note: "The clearest signal, at every size; large homes without one fall well behind (4BR " + fmtX(_am("hot_tub", "4BR").idxWithout) + ", 5BR+ " + fmtX(_am("hot_tub", "5BR+").idxWithout) + ")." },
  { key: "sauna", label: "Sauna", group: "Amenity", note: _drv("sauna").nWith + " homes; a signal up to 4BR." },
  { key: "waterfront", label: "Waterfront (host-listed)", group: "Amenity · water", note: "Only " + _drv("waterfront").nWith + " homes, mostly on rivers and creeks." },
  { key: "game_room", label: "Game room", group: "Amenity", note: "A 4BR signal." },
  { key: "outdoor_dining_area", label: "Outdoor dining", group: "Amenity", note: "Common; a small signal." },
  { key: "fire_pit", label: "Fire pit", group: "Amenity", note: "Common; a small signal." },
  { key: "pool", label: "Pool", group: "Amenity", note: "Only " + _drv("pool").nWith + " homes." },
  { key: "Superhost", label: "Superhost", group: "Operations", note: "Most hosts here are Superhosts, so it separates little." },
];

// ---------------------------------------------------------------------------
// Section 3 — Location by bedroom size
// ---------------------------------------------------------------------------
const MAP_CONFIG = {
  lede:
    "Bedroom count sets the baseline; location can nudge a home above or below it. Every comparison here is within the same size: <strong>1.00× = what a typical home that size earns in this market</strong>. The location question is kept simple: <strong>straight-line distance to the nearest town or resort centre</strong> (downtown Bozeman, Belgrade, Manhattan, Livingston, Gardiner, Big Sky Town Center or Big Sky Resort), in three bands, plus <strong>six reference areas</strong>.",
  marketInterpretation:
    "In the bottom-left panel (tap “show” on a phone), <strong>untick all but one bedroom size</strong> to see where that size earns. Green = top quarter for its size, gold = middle half, grey = bottom quarter; bigger dots = more bedrooms. Click an area outline for its numbers by size. The six areas are clusters of listing coordinates, used as reference geography only, and Airbnb shows approximate locations.",
};

const LOC_READS = {
  "Studio-1BR": (() => "Little difference: " + _x(_ls("Studio-1BR", IN)) + " in town against " + _x(_ls("Studio-1BR", OUT)) + " 15 km+ out.")(),
  "2BR": (() => "Out of town pays: " + _x(_ls("2BR", OUT)) + " typical 15 km+ out (" + _ls("2BR", OUT).n + " homes), against " + _x(_ls("2BR", IN)) + " in town.")(),
  "3BR": (() => "The biggest gap: " + _x(_ls("3BR", OUT)) + " typical 15 km+ out (" + _ls("3BR", OUT).n + " homes), " + _x(_ls("3BR", MID)) + " on the edge of town and " + _x(_ls("3BR", IN)) + " in town.")(),
  "4BR": (() => "Out of town again: " + _x(_ls("4BR", OUT)) + " typical 15 km+ out (" + _ls("4BR", OUT).n + " homes), against " + _x(_ls("4BR", IN)) + " in town and " + _x(_ls("4BR", MID)) + " on the edge.")(),
  "5BR+": "Few homes at every distance; the few in town earn least.",
  "All sizes": "The × figures are size-adjusted; the dollar figures are not, and partly reflect where the large homes are.",
};

const AREA_GRID_NOTE = () => {
  const b = _area(BS), p = _area(PV), z = _area(BZ), g = _area(BG), l = _area(LV), d = _area(GD);
  return "<strong>Big Sky & Gallatin Canyon is the strongest area</strong> (" + fmtX(b.idx) + " typical for its sizes, median " + fmtK(b.medianRev) + "), ahead at every size with homes to show, though each rests on few homes. " +
    "<strong>Paradise Valley</strong> is next (" + fmtX(p.idx) + "), led by its 3BRs (" + fmtX(p.bySize["3BR"].idx) + ", " + p.bySize["3BR"].n + " homes). Bozeman, the largest pool (" + z.n + " homes), earns about typical (" + fmtX(z.idx) + "); Belgrade & Manhattan is below (" + fmtX(g.idx) + "), weakest at 3BR and 4BR. " +
    "<strong>Livingston is the weakest</strong> (" + fmtX(l.idx) + "), mostly in-town studios, 1BRs and 2BRs. Gardiner looks strong (" + fmtX(d.idx) + ") on only " + d.n + " homes. Figures in grey, tagged \"few homes\", rest on fewer than 8 homes.";
};

const SIZE_GUIDE = {
  "Studio-1BR": {
    head: "Location matters little; a hot tub does.",
    look: (() => "Bozeman or Paradise Valley, where most small homes earn about typical, or Big Sky. A hot tub lifts a studio or 1BR from " + fmtX(_am("hot_tub", "Studio-1BR").idxWithout) + " to " + fmtX(_am("hot_tub", "Studio-1BR").idxWith) + " typical.")(),
    avoid: "Livingston in town, where small homes earn about two-thirds of typical.",
    proof: () => "In town " + fmtK(_ls("Studio-1BR", IN).median) + " · 3–15&nbsp;km " + fmtK(_ls("Studio-1BR", MID).median) + " · 15&nbsp;km+ " + fmtK(_ls("Studio-1BR", OUT).median),
  },
  "2BR": {
    head: "Out of town, ideally Big Sky or Paradise Valley.",
    look: "Big Sky, or a rural 2BR in Paradise Valley, both well above typical.",
    avoid: "An in-town 2BR, especially in Livingston.",
    proof: () => "In town " + fmtK(_ls("2BR", IN).median) + " · 3–15&nbsp;km " + fmtK(_ls("2BR", MID).median) + " · 15&nbsp;km+ " + fmtK(_ls("2BR", OUT).median) + " (" + _ls("2BR", OUT).n + " homes)",
  },
  "3BR": {
    head: "Rural, with a hot tub.",
    look: (() => "Paradise Valley (" + fmtX(_area(PV).bySize["3BR"].idx) + " typical) or other homes 15 km+ out. A hot tub lifts a 3BR to " + fmtX(_am("hot_tub", "3BR").idxWith) + ".")(),
    avoid: "In-town 3BRs and Belgrade & Manhattan, both well below typical.",
    proof: () => "In town " + fmtK(_ls("3BR", IN).median) + " · 3–15&nbsp;km " + fmtK(_ls("3BR", MID).median) + " · 15&nbsp;km+ " + fmtK(_ls("3BR", OUT).median) + " (" + _ls("3BR", OUT).n + " homes)",
  },
  "4BR": {
    head: "A hot tub first; then out of town.",
    look: (() => "Any area, with a hot tub (4BRs without one earn " + fmtX(_am("hot_tub", "4BR").idxWithout) + " typical); rural 4BRs and Bozeman's 4BRs earn above typical.")(),
    avoid: "A 4BR without a hot tub, or in Belgrade & Manhattan (" + "well below typical).",
    proof: () => "In town " + fmtK(_ls("4BR", IN).median) + " · 3–15&nbsp;km " + fmtK(_ls("4BR", MID).median) + " · 15&nbsp;km+ " + fmtK(_ls("4BR", OUT).median) + " (" + _ls("4BR", OUT).n + " homes)",
  },
  "5BR+": {
    head: "Few homes; a hot tub is the must-have.",
    look: "A group home with a hot tub anywhere outside town. Big Sky's few lead.",
    avoid: (() => "A large home without a hot tub (" + fmtX(_am("hot_tub", "5BR+").idxWithout) + " typical).")(),
    proof: () => "In town " + fmtK(_ls("5BR+", IN).median) + " · 3–15&nbsp;km " + fmtK(_ls("5BR+", MID).median) + " · 15&nbsp;km+ " + fmtK(_ls("5BR+", OUT).median),
  },
};

// ---------------------------------------------------------------------------
// Section 5 — Demographics
// ---------------------------------------------------------------------------
const DEMOGRAPHICS_NOTE = () => {
  const b = DEMOGRAPHICS.byBedroom, s = b.find((r) => r.label === "Studio-1BR"), big = b.find((r) => r.label === "5BR+");
  const r = (v) => Math.round(v), M = DEMOGRAPHICS.marketWide;
  return "These are review-derived signals, not verified demographics. On the average listing, " + r(M.kids) + "% of reviews come from stays with kids, " + r(M.group) + "% from group trips and " + r(M.pet) + "% from stays with a pet. " +
    "Small homes are couples' and solo trips (" + r(s.other) + "% \"Other\" at studio–1BR). From 3BR up, groups take over: at 5BR+ " + r(big.group) + "% of reviews are from group trips (ski and fishing groups, reunions) and " + r(big.kids) + "% from stays with kids.";
};

// ---------------------------------------------------------------------------
// Section 2 — Market context. Statewide comparison from the Montana STR
// Revenue Discovery dataset (Snowflake, 2026-09-18: 4,277 Montana listings;
// its Bozeman, Big Sky and Paradise Valley regions hold 685, 251 and 247).
// Researched 2026-10-14: BZN year-end release, MSU News Service, Big Sky
// Resort mountain stats, NPS. Regulations: the Montana site's research,
// verified 2026-09-18.
// ---------------------------------------------------------------------------
const MARKET_OVERVIEW = {
  heroImage: photo(
    "overview/paradise-valley-yellowstone-river.jpg",
    "The Yellowstone River curving through Paradise Valley in summer, with cottonwoods on the bank, golden grass in the foreground and dry hills behind under a clear sky",
    'The Yellowstone River in Paradise Valley. "Yellowstone River, flowing through Paradise Valley" by Warrenfish at English Wikipedia, <a href="https://commons.wikimedia.org/wiki/File:Yellowstone_River,_flowing_through_Paradise_Valley.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>, public domain.'
  ),
  chips: [
    { label: "Record 2.81M Passengers at BZN (2025)" },
    { label: "Big Sky: 5,850 Skiable Acres" },
    { label: "Yellowstone's Year-Round North Entrance" },
    { label: "Bozeman: No New Whole-Home STR Permits" },
  ],
  attractions: [
    "<strong>Bozeman Yellowstone International Airport (BZN)</strong>: a record 2,809,419 passengers in 2025, up 6.3% on 2024, which puts the whole market a direct flight away.",
    "<strong>Big Sky Resort</strong>: 5,850 skiable acres, 4,350 vertical feet from Lone Peak's 11,166 ft summit, about an hour south of Bozeman up the Gallatin Canyon.",
    "<strong>Yellowstone National Park</strong>: 4,762,988 recreation visits in 2025. Its North Entrance at Gardiner, at the head of Paradise Valley, is on the only park road generally open to regular cars all year (to Cooke City), per NPS.",
    "<strong>Montana State University</strong>: a record 17,165 students in fall 2025, which brings move-in, graduation and football weekends to Bozeman.",
  ],
  visitorStats: {
    headline: "These three regions against the rest of Montana (Montana STR Revenue Discovery data, September 2026); each tile says what it covers",
    breakdown: [
      { value: "$59.2k", label: "Median Actual Revenue, Big Sky Region (Montana: $35.3k)" },
      { value: "$45.6k", label: "Median Actual Revenue, Bozeman Region (Paradise Valley: $47.9k)" },
      { value: "148 of 281", label: "Montana Listings Earning $90k+ That Sit in These Three Regions" },
      { value: "$377", label: "Median Nightly Rate, Big Sky Region (Montana: $213)" },
    ],
  },
  watchOuts: [
    "🚫 <strong>The City of Bozeman is closed to new whole-home STRs.</strong> Since Ordinance 2149 (December 2023) no new non-owner-occupied (Type 3) permits are issued; about 100 grandfathered permits remain, and they don't transfer on sale. " + IN_BOZEMAN + " of the " + MARKET_STATS.n + " homes in this dataset sit inside city limits.",
    "🏘️ <strong>Covenants can bar STRs even where zoning allows them.</strong> The Montana Supreme Court held in <em>Myers v. Kleinhans</em> (2024) and <em>Brandt v. R&amp;R Mountain Escapes</em> (2025) that \"no commercial use\" covenants bar short-term rentals. Check every subdivision's covenants.",
    "💸 <strong>STRs carry a higher property tax.</strong> Montana's 2025–2026 reform taxes STR and non-owner-occupied homes at a flat 1.90% of assessed value, against a tiered rate from about 0.76% for owner-occupied and long-term rentals.",
    "🧾 <strong>Guest taxes vary by town.</strong> 8% state lodging tax everywhere, plus a 4% resort tax in Big Sky and in Gardiner (12% in total there).",
  ],
  sources: [
    { label: "BZN 2025 year-end passengers", url: "https://bozemanairport.com/yearend2025" },
    { label: "Big Sky Resort mountain stats", url: "https://www.bigskyresort.com/mountain-info" },
    { label: "NPS: Yellowstone 2025 visitation", url: "https://www.nps.gov/yell/learn/news/26004.htm" },
    { label: "NPS: Yellowstone park roads", url: "https://www.nps.gov/yell/planyourvisit/parkroads.htm" },
    { label: "MSU: fall 2025 enrollment", url: "https://www.montana.edu/news/24786/montana-state-enrolls-record-17-165-students-sets-records-for-graduation-rates-and-student-retention" },
    { label: "Montana STR Revenue Discovery", url: "https://ifrahamstr.github.io/MontanaRevenueDiscovery/" },
    { label: "City of Bozeman: short-term rentals", url: "https://www.bozemanmt.gov/services/short-term-rentals" },
    { label: "Brandt v. R&R Mountain Escapes (2025 MT 155)", url: "https://law.justia.com/cases/montana/supreme-court/2025/da-23-0716.html" },
  ],
};

// ---------------------------------------------------------------------------
// Section 4 — Why location changes the rate (js/destination.js engine).
// ---------------------------------------------------------------------------
const DEST_LEDE = "Why guests choose each part of the market, and why Big Sky and the rural homes earn the most. Click an area.";
const DEST_RESEARCHED = "2026-10-14";
const DEST_KIND = {
  city: ["College town & airport", "#2E7D6B"],
  valley: ["Gallatin Valley towns", "#8B5FA7"],
  ski: ["Ski resort & canyon", "#3C6E9E"],
  river: ["River town", "#D07A1F"],
  rural: ["Rural valley & hot springs", "#C0473F"],
  park: ["Yellowstone gateway", "#7A5C2E"],
};
function DEST_AREAS() {
  const z = _area(BZ), g = _area(BG), b = _area(BS), l = _area(LV), p = _area(PV), d = _area(GD);
  return [
    {
      id: "bozeman", name: BZ, kind: "city", tags: ["About typical", "Largest pool of homes"],
      zones: [{ lat: 45.657, lng: -111.097, r: 5000, tip: "Bozeman", tipShort: "Bozeman", dir: "top" }],
      why: "Downtown Bozeman's Main Street, Montana State University, Bridger Bowl a short drive north, and BZN airport next door.",
      season: "Summer, ski weekends at Bridger Bowl and Big Sky, and MSU's football and graduation weekends.",
      matters: "About typical for its sizes (" + fmtX(z.idx) + ") on the most homes (" + z.n + "), with " + z.top10N + " Top 10% listings. Inside city limits, though, no new whole-home STR permits are issued.",
    },
    {
      id: "belgrade", name: BG, kind: "valley", tags: ["Below typical", "Near the airport"],
      zones: [{ lat: 45.783, lng: -111.151, r: 6000, tip: "Belgrade & Manhattan", tipShort: "Belgrade", dir: "top" }],
      why: "Belgrade, next to BZN, and Manhattan, west across the Gallatin Valley: practical bases, farther from the mountains.",
      season: "Summer and ski-season overflow from Bozeman.",
      matters: "Below typical for its sizes (" + fmtX(g.idx) + "), weakest at 3BR and 4BR.",
    },
    {
      id: "bigsky", name: BS, kind: "ski", tags: ["The strongest area", "Highest nightly rates"],
      zones: [{ lat: 45.273, lng: -111.31, r: 7000, tip: "Big Sky & Gallatin Canyon", tipShort: "Big Sky", dir: "left" }],
      why: "Big Sky Resort (5,850 skiable acres, Lone Peak), Meadow Village and Town Center, and the Gallatin Canyon's river and trails on the road up from Bozeman.",
      season: "Ski season, December to April, and summer: hiking, the Gallatin River, and Yellowstone's West Entrance about an hour south.",
      matters: "The strongest area (" + fmtX(b.idx) + " typical for its sizes, median " + fmtK(b.medianRev) + "), ahead at every size with homes to show, with " + b.top10N + " Top 10% listings. Its homes carry a 4% resort tax and are often under HOA or club rules.",
    },
    {
      id: "livingston", name: LV, kind: "river", tags: ["The weakest area", "Mostly small in-town homes"],
      zones: [{ lat: 45.664, lng: -110.599, r: 4000, tip: "Livingston", tipShort: "Livingston", dir: "right" }],
      why: "The town of Livingston on the Yellowstone River, the gateway to Paradise Valley, about 40 km east of Bozeman.",
      season: "Summer fishing, floating and Yellowstone trips.",
      matters: "The weakest area (" + fmtX(l.idx) + " typical), mostly studios, 1BRs and 2BRs in town.",
    },
    {
      id: "paradise", name: PV, kind: "rural", tags: ["Ahead of typical", "Strong 3BRs"],
      zones: [{ lat: 45.389, lng: -110.717, r: 9000, tip: "Paradise Valley", tipShort: "Paradise Valley", dir: "right" }],
      why: "US-89 south of Livingston along the Yellowstone River: ranch land, Pray and Emigrant, Chico Hot Springs, and the road to Yellowstone's North Entrance.",
      season: "Summer fishing and Yellowstone trips; the North Entrance road stays open in winter.",
      matters: "Ahead of typical (" + fmtX(p.idx) + "), led by its 3BRs (" + fmtX(p.bySize["3BR"].idx) + "), with " + p.top10N + " Top 10% listings.",
    },
    {
      id: "gardiner", name: GD, kind: "park", tags: ["Few homes", "At the park gate"],
      zones: [{ lat: 45.126, lng: -110.83, r: 6000, tip: "Gardiner", tipShort: "Gardiner", dir: "bottom" }],
      why: "Gardiner, at Yellowstone's North Entrance and the Roosevelt Arch.",
      season: "Summer park trips, and winter: the road through the North Entrance stays open.",
      matters: "Strong on paper (" + fmtX(d.idx) + ") but only " + d.n + " homes; it carries a 4% resort tax.",
    },
  ];
}
// Context markers (lat, lng, label, color), from notebooks/landmarks.json.
const DEST_POINTS = [
  [45.67928, -111.0333, "Downtown Bozeman", "#2E7D6B"], [45.66392, -111.07928, "Montana State University", "#2E7D6B"],
  [45.7835, -111.15698, "BZN airport", "#8B5FA7"], [45.8175, -110.8965, "Bridger Bowl", "#3C6E9E"],
  [45.28121, -111.41119, "Big Sky Resort", "#3C6E9E"], [45.25991, -111.30592, "Big Sky Town Center", "#3C6E9E"],
  [45.66239, -110.56159, "Livingston", "#D07A1F"], [45.33771, -110.69216, "Chico Hot Springs", "#C0473F"],
  [45.0295, -110.70867, "Yellowstone North Entrance", "#7A5C2E"],
];
// Month bands: Yellowstone's average share of annual visits by month (NPS, 2014-2018: Jun-Aug
// about 64%) and the ski season at Big Sky and Bridger Bowl (December to April).
const DEST_SEASON = {
  months: ["ski", "ski", "ski", "ski", "mid", "peak", "peak", "peak", "high", "mid", "low", "ski"],
  marks: ["", "", "", "Ski closing", "", "", "July 4th", "", "Labor Day", "", "", "Christmas"],
  legend: [["peak", "Summer: Yellowstone, rivers and trails"], ["high", "September"], ["mid", "May and October shoulders"], ["ski", "Ski season: Big Sky and Bridger Bowl"], ["low", "November: between the seasons"]],
  caption: "<strong>Two seasons, not one:</strong> summer carries Yellowstone, the rivers and the trails (June to August averaged about 64% of the park's visits, NPS 2014–2018), and winter brings Big Sky's and Bridger Bowl's ski season. That's why the ski and rural homes earn the most. November and the spring melt are the quiet weeks.",
};
const DEST_BRIDGE = [
  ["Guests come for the mountains and Yellowstone: the ski slopes, the rivers and the park, all a drive from town.", "Homes out in that country, in Big Sky and Paradise Valley, carry the clearest location premium."],
  ["Bozeman is the gateway (airport, MSU, Main Street), but its homes earn about typical, and its city limits are closed to new whole-home STRs.", "For an investor, the question is often where an STR is allowed before where it earns most."],
];
const DEST_SOURCES = [
  { label: "NPS: Yellowstone visitation by month", url: "https://www.nps.gov/yell/planyourvisit/visitationstats.htm" },
  { label: "NPS: Yellowstone park roads", url: "https://www.nps.gov/yell/planyourvisit/parkroads.htm" },
  { label: "Big Sky Resort mountain stats", url: "https://www.bigskyresort.com/mountain-info" },
  { label: "BZN 2025 year-end passengers", url: "https://bozemanairport.com/yearend2025" },
];

// ---------------------------------------------------------------------------
// Section 6 — STR regulations. From the Montana STR Revenue Discovery site's
// research (verified 2026-09-18), one block per jurisdiction group.
// ---------------------------------------------------------------------------
const STR_REGULATIONS = {
  lede: "Three different rulebooks: the City of Bozeman, which is closed to new whole-home STRs; Big Sky, split between two counties and run largely by covenants; and Livingston and Park County, the most open. Montana-wide, covenants can bar STRs even where zoning allows them, and STRs pay a higher property tax.",
  blocks: [
    {
      name: "Bozeman, Belgrade & Manhattan",
      badge: "Gallatin Valley",
      appliesTo: "<strong>Applies to</strong> the Bozeman and Belgrade & Manhattan areas. " + IN_BOZEMAN + " of the " + MARKET_STATS.n + " homes sit inside Bozeman's city limits, " + IN_BELGRADE + " inside Belgrade's and " + IN_MANHATTAN + " inside Manhattan's; the rest are in unincorporated Gallatin County.",
      alert: "⚠️ <strong>No new non-owner-occupied whole-home STRs inside Bozeman.</strong> Since Ordinance 2149 (December 14, 2023), Type 3 permits are closed; about 100 grandfathered permits remain and they don't transfer on sale.",
      tier: "Verify / Heavier Constraints",
      tierKey: "moderate",
      tierNote: "Bozeman allows owner-occupied STRs (Types 1 and 2) but no new whole-home investor STRs. Belgrade, Manhattan and unincorporated Gallatin County are lighter-touch, but county zoning only allows uses a district names.",
      permitResidency: [
        "Permit required? Yes, everywhere. Bozeman registers Type 1/2/3 STRs (state and county licensing, fire inspection, floor plan, annual renewal); Type 3 is closed to new entrants. Belgrade requires a city STR license (City Code §10-3-47). Manhattan and unincorporated Gallatin County rely on a general business license, plus the statewide Public Accommodations License (MCA Title 50, ch. 51) through the Gallatin City-County Health Department.",
        "Primary residence required? In Bozeman, Types 1 and 2 must be the operator's primary residence; only the closed Type 3 pool is exempt. Belgrade, Manhattan and the county have no owner-occupancy rule.",
      ],
      operatingLimits: [
        "Bozeman: Type 3 capped at the roughly 100 grandfathered units and shrinking; Types 1 and 2 have no numeric cap but are limited to certain zones (R-2 to R-5, R-O, REMU and some commercial and mixed-use districts).",
        "Gallatin County zoning names STRs in only two of its 22 districts (Big Sky and Hebgen Lake); in a zoned district that doesn't name them, they aren't permitted.",
        "Taxes: 8% Montana lodging facility sales and use tax; no local resort tax in Bozeman, Belgrade, Manhattan or this part of the county.",
      ],
      investorNotes: [
        "Underwrite either an owner-occupied Type 1/2 STR inside Bozeman, or a whole-home STR in Belgrade, Manhattan or the unincorporated county, always with a parcel-level covenant check.",
        "Montana's 2025–2026 property-tax reform taxes STR and non-owner-occupied homes at a flat 1.90% of assessed value, against about 0.76–1.10% for owner-occupied and qualifying long-term rentals.",
        "<em>Myers v. Kleinhans</em> (2024, a Gallatin-area subdivision) and <em>Brandt v. R&amp;R Mountain Escapes</em> (2025 MT 155): covenants against \"commercial use\" bar STRs even without STR language and even where zoning allows them. A 2025 bill (SB 336) to override this died in the House.",
      ],
      sources: [
        { label: "City of Bozeman: short-term rentals", url: "https://www.bozemanmt.gov/services/short-term-rentals" },
        { label: "Belgrade City Code §10-3-47", url: "https://codelibrary.amlegal.com/codes/belgrademt/latest/belgrade_mt/0-0-0-8827" },
        { label: "Montana Free Press: Bozeman STR vote", url: "https://montanafreepress.org/2023/10/18/bozeman-votes-to-ban-some-short-term-rentals-grandfathers-others/" },
        { label: "Myers v. Kleinhans (2024)", url: "https://law.justia.com/cases/montana/supreme-court/2024/da-24-0069.html" },
        { label: "Brandt v. R&R Mountain Escapes (2025)", url: "https://law.justia.com/cases/montana/supreme-court/2025/da-23-0716.html" },
      ],
    },
    {
      name: "Big Sky",
      badge: "Unincorporated · two counties",
      appliesTo: "<strong>Applies to</strong> the Big Sky & Gallatin Canyon area. Big Sky has no town government; the Gallatin County side (Meadow Village, Town Center, Spanish Peaks) and the Madison County side (the resort base, Moonlight Basin, Yellowstone Club) have different rules.",
      tier: "Verify / Heavier Constraints",
      tierKey: "moderate",
      tierNote: "No county STR permit on either side. Gallatin County's Big Sky zoning explicitly allows vacation rentals; Madison County has no zoning, so HOA and club covenants decide. A 4% resort tax applies across Big Sky.",
      permitResidency: [
        "Permit required? No county STR permit on either side; the statewide Public Accommodations License (through the Gallatin City-County Health Department) is the requirement everywhere.",
        "Primary residence required? No county rule. Owner-occupancy or rental limits come only from HOA, subdivision or club covenants (Big Sky Owners Association sub-associations, Spanish Peaks, Moonlight Basin, Yellowstone Club).",
      ],
      operatingLimits: [
        "No county cap. In practice the limits are covenant-based and property-specific: some BSOA sub-associations set their own registration, fees and occupancy limits; rental rights in Spanish Peaks and Moonlight Basin vary lot by lot.",
        "Taxes: 12% on a typical stay, 8% state lodging tax + 4% Big Sky Resort Tax (3% base + 1% infrastructure), collected by the Big Sky Resort Area District across both counties.",
      ],
      investorNotes: [
        "On the Madison County side (the resort, Moonlight Basin, Yellowstone Club) there is no public zoning at all, so the property's own covenants decide; <em>Brandt</em> confirms courts will enforce \"no commercial use\" covenants.",
        "Yellowstone Club real estate is members-only and not a conventional STR target.",
        "Gallatin County's zoning that authorizes STRs in the Big Sky district does not extend to the Madison County side.",
      ],
      sources: [
        { label: "Big Sky Resort Tax FAQ", url: "https://resorttax.org/frequently-asked-questions/" },
        { label: "Gallatin County STR FAQs", url: "https://www.gallatinmt.gov/planning-community-development/pages/short-term-rental-faqs" },
        { label: "Madison County planning regulations", url: "https://madisoncountymt.gov/314/Planning-Office-Regulations" },
        { label: "Explore Big Sky: a tale of two counties", url: "https://www.explorebigsky.com/the-big-sky-way-a-tale-of-two-counties/51965" },
      ],
    },
    {
      name: "Livingston, Paradise Valley & Gardiner",
      badge: "Park County",
      appliesTo: "<strong>Applies to</strong> the Livingston, Paradise Valley and Gardiner areas. " + IN_LIVINGSTON + " homes sit inside Livingston's city limits; the rest are in unincorporated Park County (Pray, Emigrant, Gardiner).",
      tier: "Verify / Heavier Constraints",
      tierKey: "moderate",
      tierNote: "The most open part of the market: Livingston's new two-tier permit (January 1, 2026) has no cap and allows non-owner-occupied STRs, and unincorporated Park County has almost no STR-specific rules. Gardiner adds a 4% resort tax and real political pressure over housing.",
      permitResidency: [
        "Permit required? In Livingston, yes: Type 1 (owner present) or Type 2 (non-owner-occupied, with a responsible contact within a 45-minute drive), under the new Chapter 30 zoning effective January 1, 2026; the fee is set by separate resolution. Unincorporated Park County has no STR permit; the statewide Public Accommodations License (through Park County Environmental Health) applies.",
        "Primary residence required? No, in Livingston or the county.",
      ],
      operatingLimits: [
        "Livingston allows STRs in every zoning district except Light Industrial, Capital Facilities and PUDs, with no cap. Park County has no STR cap, ban or owner-occupancy rule.",
        "Taxes: 8% state lodging tax; plus 4% Gardiner Resort Tax inside the Gardiner district (12% there). Livingston is too large to levy a resort tax.",
      ],
      investorNotes: [
        "<em>Myers v. Kleinhans</em> (2024): operating an Airbnb is a \"commercial business\" that breaches covenants against commercial use. Check the covenants of Paradise Valley's older river-corridor subdivisions along US-89.",
        "Gardiner has active political pressure over STR-driven housing loss (a 2025 neighborhood plan of unconfirmed STR content), so today's loose rules there may not last.",
        "Livingston's system is only months old: confirm the permit fee and enforcement with the city's Building & Planning office.",
      ],
      sources: [
        { label: "Livingston Chapter 30 zoning (2025)", url: "https://www.livingstonmontana.org/sites/default/files/fileattachments/building_amp_planning/page/2245/ch30_zoning_adopted_final_to_municode.pdf" },
        { label: "Park County zoning", url: "https://www.parkcountymt.gov/Government-Departments/Planning/Zoning-Applicaitons/" },
        { label: "Gardiner Resort Tax FAQ", url: "https://www.gardinerresorttax.com/faqs" },
        { label: "Myers v. Kleinhans (2024)", url: "https://law.justia.com/cases/montana/supreme-court/2024/da-24-0069.html" },
      ],
    },
  ],
  note: "From the Montana STR Revenue Discovery site's research, verified September 18, 2026. City-limit counts from the U.S. Census boundaries. Rules change, so confirm with the city or county before you buy.",
};
