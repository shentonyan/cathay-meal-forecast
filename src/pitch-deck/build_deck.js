// Rebuilds pitch/cathay_meal_forecast_pitch.pptx. Run from the repository root:
//   cd src/pitch-deck && npm install && cd ../.. && node src/pitch-deck/build_deck.js
var pptxgen = require('pptxgenjs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var fs = require('fs');
var fa = require('react-icons/fa');

var pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Cathay Meal Forecast: Zero-Waste Inflight Catering';
pres.author = 'Cathay Hackathon Team';

// ---------- design tokens (Pure Minimal) ----------
var INK = '0B3B3C', WHITE = 'FFFFFF', ACC = '006564', ACC_L = 'D9BE8C', ACC_BG = 'E6F1EF', GOLD = 'B8955A';
var GRAY = '5B6B6B', GRAY_L = '8A9898', LINE = 'DDE7E5', SURF = 'F5F8F7';
var GREEN = '15803D', GREEN_BG = 'ECFDF3', AMBER = '8C6D35', AMBER_BG = 'F6F0E4', RED = 'DC2626', RED_BG = 'FEF2F2';
var H = 'Archivo', B = 'JetBrains Mono';
var TOTAL = 9;

var ICON_DIR = 'src/pitch-deck/.icons/';
fs.mkdirSync(ICON_DIR, { recursive: true });
var iconN = 0;
function icon(slide, Comp, color, x, y, s) {
  var svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size: '256' }));
  var p = ICON_DIR + 'i' + (iconN++) + '.svg';
  fs.writeFileSync(p, svg, { encoding: 'utf8' });
  slide.addImage({ path: p, x: x, y: y, w: s, h: s });
}
function iconCircle(slide, Comp, bg, fg, x, y, d) {
  slide.addShape(pres.shapes.OVAL, { x: x, y: y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
  var s = d * 0.5;
  icon(slide, Comp, fg, x + (d - s) / 2, y + (d - s) / 2, s);
}

function header(slide, n, section, title) {
  slide.background = { color: WHITE };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: ACC }, line: { color: ACC } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.08, y: 0, w: 0.03, h: 5.625, fill: { color: GOLD }, line: { color: GOLD } });
  slide.addText(('0' + n).slice(-2) + '  ·  ' + section, { x: 0.5, y: 0.28, w: 6, h: 0.25, fontFace: B, fontSize: 9, color: ACC, bold: true, charSpacing: 2, margin: 0 });
  // title: up to ~48 chars mixed case, box w=9 -> max = 9/(48*0.011) = 17pt by formula; Archivo is narrow, use 24pt and verify visually
  slide.addText(title, { x: 0.5, y: 0.58, w: 9.0, h: 0.6, fontFace: H, fontSize: 24, bold: true, color: INK, margin: 0, valign: 'middle' });
  slide.addText('Cathay Meal Forecast  ·  ' + n + ' / ' + TOTAL, { x: 0.5, y: 5.28, w: 5, h: 0.22, fontFace: B, fontSize: 8, color: GRAY_L, margin: 0 });
  slide.addText('Cathay Hackathon 2026', { x: 6.5, y: 5.28, w: 3.0, h: 0.22, fontFace: B, fontSize: 8, color: GRAY_L, margin: 0, align: 'right' });
}

// =====================================================================
// SLIDE 1 — Cover
// =====================================================================
var s1 = pres.addSlide();
s1.background = { color: INK };
s1.addShape(pres.shapes.RECTANGLE, { x: 9.7, y: 0, w: 0.3, h: 5.625, fill: { color: GOLD }, line: { color: GOLD } });
iconCircle(s1, fa.FaPlane, GOLD, WHITE, 0.6, 0.6, 0.55);
icon(s1, fa.FaUtensils, ACC_L, 1.3, 0.72, 0.32);
s1.addText('CATHAY HACKATHON 2026', { x: 0.6, y: 1.45, w: 6, h: 0.3, fontFace: B, fontSize: 11, color: ACC_L, bold: true, charSpacing: 4, margin: 0 });
// 'Cathay Meal Forecast' 20 chars, w=8.6 -> 8.6/(20*0.011) = 39pt
s1.addText('Cathay Meal Forecast', { x: 0.6, y: 1.8, w: 8.6, h: 0.85, fontFace: H, fontSize: 38, bold: true, color: WHITE, margin: 0 });
s1.addText('Zero-waste inflight catering, powered by AI', { x: 0.6, y: 2.72, w: 8.6, h: 0.45, fontFace: H, fontSize: 18, color: 'D6E4E2', margin: 0 });
s1.addText('Load the right meal, for the right passenger, on the right flight.', { x: 0.6, y: 3.3, w: 8.6, h: 0.35, fontFace: B, fontSize: 11, color: GRAY_L, margin: 0 });
s1.addShape(pres.shapes.LINE, { x: 0.6, y: 4.55, w: 8.6, h: 0, line: { color: '2E6465', width: 1 } });
s1.addText('AI  ·  Sustainability  ·  Cost', { x: 0.6, y: 4.7, w: 4.2, h: 0.3, fontFace: B, fontSize: 10, color: ACC_L, margin: 0 });
s1.addText('Team pitch  ·  November 2026', { x: 5.0, y: 4.7, w: 4.2, h: 0.3, fontFace: B, fontSize: 10, color: GRAY_L, margin: 0, align: 'right' });
s1.addNotes('Hi, we are the Meal Forecast team. Our idea: use AI and pre-orders so Cathay loads the right meal for the right passenger on the right flight, cutting food waste and cost at the same time.');

// =====================================================================
// SLIDE 2 — Problem
// =====================================================================
var s2 = pres.addSlide();
header(s2, 2, 'THE PROBLEM', 'We fly food around the world just to burn it');
s2.addText('Every surplus meal is cooked, chilled, loaded, flown thousands of kilometres, and then destroyed.', { x: 0.5, y: 1.5, w: 4.1, h: 1.45, fontFace: H, fontSize: 18, color: INK, margin: 0, valign: 'top' });
s2.addText('About a third of all cabin waste is food and drink that nobody touched. That is a cost problem and a sustainability problem at the same time.', { x: 0.5, y: 3.05, w: 4.1, h: 1.2, fontFace: B, fontSize: 10.5, color: GRAY, margin: 0, valign: 'top', lineSpacingMultiple: 1.25 });
s2.addText('Sources: IATA cabin waste audits (2023), IATA fact sheet', { x: 0.5, y: 4.75, w: 4.1, h: 0.25, fontFace: B, fontSize: 7.5, color: GRAY_L, margin: 0 });
var stats = [
  ['0.94 kg', 'cabin waste per passenger (2023 audits)'],
  ['3.6M t', 'of cabin waste in 2023, set to double by 2040'],
  ['34%', 'of cabin waste is untouched food & drink'],
  ['US$6B', 'of resources incinerated or landfilled every year']
];
stats.forEach(function (st, i) {
  var cx = 5.0 + (i % 2) * 2.35, cy = 1.45 + Math.floor(i / 2) * 1.85;
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: 2.15, h: 1.65, fill: { color: SURF }, line: { color: LINE, width: 1 }, rectRadius: 0.08 });
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy + 0.25, w: 0.06, h: 0.55, fill: { color: i === 2 ? RED : ACC }, line: { color: i === 2 ? RED : ACC } });
  // '0.94 kg' 7 chars, w=1.85 -> 1.85/(7*0.011)= 24pt
  s2.addText(st[0], { x: cx + 0.2, y: cy + 0.2, w: 1.85, h: 0.65, fontFace: H, fontSize: 24, bold: true, color: i === 2 ? RED : INK, margin: 0, valign: 'middle' });
  s2.addText(st[1], { x: cx + 0.2, y: cy + 0.9, w: 1.8, h: 0.6, fontFace: B, fontSize: 8.5, color: GRAY, margin: 0, valign: 'top' });
});
s2.addNotes('IATA audits show 0.94 kg of cabin waste per passenger, 3.6 million tonnes in 2023. Up to 34% is food and drink nobody touched, worth around 6 billion US dollars a year.');

// =====================================================================
// SLIDE 3 — Why recycling can't fix it
// =====================================================================
var s3 = pres.addSlide();
header(s3, 3, 'THE CONSTRAINT', 'Why recycling can\'t fix it');
var steps3 = [
  [fa.FaUtensils, 'Cook', 'Meals produced for every booked seat'],
  [fa.FaTruck, 'Load', 'Extra weight added to the aircraft'],
  [fa.FaPlane, 'Fly', '~30 kg fuel per extra tonne per hour'],
  [fa.FaFire, 'Burn', 'Category 1 waste: incinerate or deep-bury']
];
steps3.forEach(function (st, i) {
  var bx = 0.5 + i * 2.3, by = 1.45, burn = i === 3;
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: 1.95, h: 1.45, fill: { color: burn ? RED_BG : SURF }, line: { color: burn ? RED : LINE, width: burn ? 1.5 : 1 }, rectRadius: 0.08 });
  iconCircle(s3, st[0], burn ? RED : INK, WHITE, bx + 0.18, by + 0.18, 0.45);
  s3.addText(st[1], { x: bx + 0.75, y: by + 0.2, w: 1.1, h: 0.42, fontFace: H, fontSize: 16, bold: true, color: burn ? RED : INK, margin: 0, valign: 'middle' });
  s3.addText(st[2], { x: bx + 0.18, y: by + 0.78, w: 1.65, h: 0.6, fontFace: B, fontSize: 8.5, color: burn ? RED : GRAY, margin: 0, valign: 'top' });
  if (i < 3) s3.addShape(pres.shapes.LINE, { x: bx + 2.0, y: by + 0.72, w: 0.25, h: 0, line: { color: GRAY_L, width: 1.5, endArrowType: 'triangle' } });
});
// callout
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.2, w: 5.2, h: 1.75, fill: { color: ACC_BG }, line: { color: ACC_BG }, rectRadius: 0.08 });
s3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.2, w: 0.07, h: 1.75, fill: { color: ACC }, line: { color: ACC } });
s3.addText('Forecast before you load', { x: 0.8, y: 3.35, w: 4.7, h: 0.4, fontFace: H, fontSize: 17, bold: true, color: ACC, margin: 0 });
s3.addText('EU Regulation 1069/2009 and UK rules require international catering waste to be incinerated or buried. Cooked meals cannot be recycled or donated. The only lever left is source reduction: load less, load smarter.', { x: 0.8, y: 3.8, w: 4.75, h: 1.1, fontFace: B, fontSize: 9, color: INK, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
// end-of-life
s3.addText('Cathay already excels at end-of-life', { x: 6.0, y: 3.2, w: 3.5, h: 0.3, fontFace: H, fontSize: 12, bold: true, color: INK, margin: 0 });
s3.addText('2,250 t', { x: 6.0, y: 3.55, w: 1.5, h: 0.45, fontFace: H, fontSize: 20, bold: true, color: GREEN, margin: 0 });
s3.addText('donated via Feeding Hong Kong since 2014', { x: 7.45, y: 3.55, w: 2.05, h: 0.5, fontFace: B, fontSize: 8, color: GRAY, margin: 0, valign: 'middle' });
s3.addText('+200%', { x: 6.0, y: 4.2, w: 1.5, h: 0.45, fontFace: H, fontSize: 20, bold: true, color: GREEN, margin: 0 });
s3.addText('food-waste recycling capacity at Cathay Dining (2025)', { x: 7.45, y: 4.2, w: 2.05, h: 0.5, fontFace: B, fontSize: 8, color: GRAY, margin: 0, valign: 'middle' });
s3.addText('The missing piece is source reduction.', { x: 6.0, y: 4.75, w: 3.5, h: 0.25, fontFace: B, fontSize: 8, italic: true, color: ACC, margin: 0 });
s3.addNotes('Regulation is the twist: cooked international catering waste is a Category 1 by-product and must be burned or buried. Cathay already does great work at the end of life. What is missing is not loading the surplus in the first place.');

// =====================================================================
// SLIDE 4 — Proof
// =====================================================================
var s4 = pres.addSlide();
header(s4, 4, 'EVIDENCE', 'Proof it works: KLM cut food waste by 63%');
s4.addText('Reported food waste reduction (%)', { x: 0.5, y: 1.35, w: 5.2, h: 0.3, fontFace: B, fontSize: 9, color: GRAY, margin: 0 });
s4.addChart(pres.charts.BAR, [{
  name: 'Waste reduction', labels: ['KLM TRAYS (AI no-show forecast)', 'Restaurant ML (upper bound)', 'Winnow kitchen AI', 'Restaurant ML (lower bound)'], values: [63, 52, 50, 14]
}], {
  x: 0.4, y: 1.65, w: 5.3, h: 3.3, barDir: 'bar', chartColors: [ACC, 'B7D6D1', 'B7D6D1', 'B7D6D1'],
  catAxisLabelFontFace: B, catAxisLabelFontSize: 8, catAxisLabelColor: INK, catAxisOrientation: 'maxMin',
  valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 75, valAxisMinVal: 0,
  showValue: true, dataLabelFormatCode: '0"%"', dataLabelFontFace: H, dataLabelFontSize: 11, dataLabelColor: INK, dataLabelPosition: 'outEnd',
  barGapWidthPct: 45, showLegend: false
});
var cards4 = [
  ['Lufthansa', 'AI image recognition of returned trays, by route and cabin'],
  ['Emirates', 'Business-class main-course pre-select, 14 days to 24 h out'],
  ['Japan Airlines', 'Ethical Choice Meal Skip, all international routes since 2022']
];
cards4.forEach(function (c, i) {
  var cy = 1.4 + i * 0.82;
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.0, y: cy, w: 3.5, h: 0.72, fill: { color: SURF }, line: { color: LINE }, rectRadius: 0.06 });
  s4.addText(c[0], { x: 6.15, y: cy + 0.07, w: 3.2, h: 0.25, fontFace: H, fontSize: 11, bold: true, color: INK, margin: 0 });
  s4.addText(c[1], { x: 6.15, y: cy + 0.33, w: 3.25, h: 0.34, fontFace: B, fontSize: 7.5, color: GRAY, margin: 0, valign: 'top' });
});
s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.0, y: 3.92, w: 3.5, h: 1.05, fill: { color: INK }, line: { color: INK }, rectRadius: 0.06 });
s4.addText('THE GAP', { x: 6.15, y: 4.0, w: 3.2, h: 0.22, fontFace: B, fontSize: 8, bold: true, color: ACC_L, charSpacing: 3, margin: 0 });
s4.addText('Pre-order schemes publish no results, and academic models use synthetic data. No one combines pre-orders, per-dish forecasts and load optimisation.', { x: 6.15, y: 4.24, w: 3.25, h: 0.7, fontFace: B, fontSize: 7.5, color: WHITE, margin: 0, valign: 'top' });
s4.addNotes('KLM already proved the concept: forecasting how many passengers actually board cut food waste 63%, about 111 tonnes a year. Others run pre-order or skip-meal options but publish no results. Research models mostly use synthetic data. Nobody has put pre-orders, per-dish forecasting and load optimisation together. That is our gap.');

// =====================================================================
// SLIDE 5 — Solution
// =====================================================================
var s5 = pres.addSlide();
header(s5, 5, 'OUR SOLUTION', 'Three layers, one learning loop');
var sol = [
  [fa.FaMobileAlt, 'Pre-order for every cabin', 'Choose My Meal opens to Economy and Premium Economy. Pre-order for +50 Asia Miles, skip for +150, and see your CO2 saved.'],
  [fa.FaBrain, 'Forecast per flight, per dish', 'Gradient boosting predicts no-shows and dish shares by route, time, season and passenger mix. Pre-orders become certain demand.'],
  [fa.FaSlidersH, 'Optimise the load', 'A newsvendor rule sets each dish\'s quantity at a chosen service level, so nobody goes hungry and first choice stays high.']
];
sol.forEach(function (c, i) {
  var cx = 0.5 + i * 3.1, cy = 1.4;
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: 2.8, h: 2.8, fill: { color: SURF }, line: { color: LINE }, rectRadius: 0.08 });
  s5.addText('0' + (i + 1), { x: cx + 0.2, y: cy + 0.2, w: 0.9, h: 0.5, fontFace: H, fontSize: 26, bold: true, color: ACC, margin: 0 });
  iconCircle(s5, c[0], INK, WHITE, cx + 2.0, cy + 0.2, 0.55);
  s5.addText(c[1], { x: cx + 0.2, y: cy + 0.9, w: 2.45, h: 0.55, fontFace: H, fontSize: 13, bold: true, color: INK, margin: 0, valign: 'top' });
  s5.addText(c[2], { x: cx + 0.2, y: cy + 1.5, w: 2.45, h: 1.2, fontFace: B, fontSize: 8.5, color: GRAY, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
  if (i < 2) s5.addShape(pres.shapes.LINE, { x: cx + 2.83, y: cy + 1.4, w: 0.24, h: 0, line: { color: ACC, width: 1.5, endArrowType: 'triangle' } });
});
s5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.4, w: 9.0, h: 0.6, fill: { color: ACC_BG }, line: { color: ACC_BG }, rectRadius: 0.08 });
icon(s5, fa.FaSyncAlt, ACC, 0.7, 4.53, 0.34);
s5.addText([
  { text: 'Learning loop: ', options: { bold: true, color: ACC } },
  { text: 'returned trays and actual consumption retrain the model after every flight.', options: { color: INK } }
], { x: 1.2, y: 4.45, w: 8.2, h: 0.5, fontFace: B, fontSize: 9.5, margin: 0, valign: 'middle' });
s5.addNotes('Three layers. One: open pre-ordering to every cabin and reward it with Asia Miles, including a bigger reward for skipping a meal. Two: a gradient boosting model forecasts no-shows and dish shares, with pre-orders treated as certain demand. Three: a newsvendor rule converts that forecast into a load plan at a chosen service level. Actual consumption feeds back into the model.');

// =====================================================================
// SLIDE 6 — Live demo
// =====================================================================
var s6 = pres.addSlide();
header(s6, 6, 'LIVE DEMO', 'Live demo: from one passenger to the whole network');
function frame(sl, x, label) {
  sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.35, w: 2.8, h: 2.85, fill: { color: SURF }, line: { color: LINE }, rectRadius: 0.06 });
  sl.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.35, w: 2.8, h: 0.3, fill: { color: INK }, line: { color: INK } });
  sl.addText(label, { x: x + 0.12, y: 1.35, w: 2.6, h: 0.3, fontFace: B, fontSize: 8, bold: true, color: WHITE, margin: 0, valign: 'middle' });
}
// screen 1
frame(s6, 0.5, '1  PASSENGER APP');
var rows = [['Braised beef noodles', '+50'], ['Chicken tikka masala', '+50'], ['Mushroom penne (V)', '+50'], ['Skip meal, I\'ll sleep', '+150']];
rows.forEach(function (r, i) {
  var ry = 1.78 + i * 0.47, sel = i === 1;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.65, y: ry, w: 2.5, h: 0.38, fill: { color: sel ? ACC_BG : WHITE }, line: { color: sel ? ACC : LINE, width: sel ? 1.25 : 0.75, dashType: i === 3 ? 'dash' : 'solid' }, rectRadius: 0.05 });
  s6.addText(r[0], { x: 0.75, y: ry, w: 1.85, h: 0.38, fontFace: B, fontSize: 7.5, color: INK, margin: 0, valign: 'middle' });
  s6.addText(r[1], { x: 2.55, y: ry, w: 0.5, h: 0.38, fontFace: H, fontSize: 9, bold: true, color: AMBER, margin: 0, valign: 'middle', align: 'right' });
});
s6.addText('Confirm choice', { x: 0.65, y: 3.7, w: 2.5, h: 0.36, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, fill: { color: ACC }, fontFace: H, fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0 });
// screen 2
frame(s6, 3.6, '2  FLIGHT FORECAST · CX 251');
s6.addChart(pres.charts.BAR, [
  { name: 'Legacy', labels: ['Beef', 'Chicken', 'Veg'], values: [102, 102, 51] },
  { name: 'AI', labels: ['Beef', 'Chicken', 'Veg'], values: [75, 111, 51] }
], {
  x: 3.65, y: 1.7, w: 2.7, h: 1.85, barDir: 'col', chartColors: ['D1D5DB', ACC], barGapWidthPct: 60,
  catAxisLabelFontFace: B, catAxisLabelFontSize: 7, valAxisHidden: true, valGridLine: { style: 'none' },
  showLegend: true, legendPos: 't', legendFontSize: 7, legendFontFace: B, showValue: false
});
s6.addText([
  { text: 'Meals loaded  ', options: { color: GRAY } }, { text: '255 → 237', options: { bold: true, color: INK } }
], { x: 3.75, y: 3.62, w: 2.5, h: 0.22, fontFace: B, fontSize: 8, margin: 0 });
s6.addText([
  { text: 'Wasted/flight  ', options: { color: GRAY } }, { text: '27 → 9 (−66%)', options: { bold: true, color: GREEN } }
], { x: 3.75, y: 3.86, w: 2.5, h: 0.22, fontFace: B, fontSize: 8, margin: 0 });
// screen 3
frame(s6, 6.7, '3  IMPACT DASHBOARD');
var tiles = [['$18.4M', 'net savings / yr', AMBER], ['1,695 t', 'food avoided', GREEN], ['5,442 t', 'CO2e avoided', GREEN], ['3.39M', 'meals saved', INK]];
tiles.forEach(function (t, i) {
  var tx = 6.85 + (i % 2) * 1.27, ty = 1.8 + Math.floor(i / 2) * 1.17;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: tx, y: ty, w: 1.18, h: 1.05, fill: { color: WHITE }, line: { color: LINE }, rectRadius: 0.05 });
  s6.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty + 0.15, w: 0.04, h: 0.4, fill: { color: t[2] }, line: { color: t[2] } });
  // '$18.4M' 6 chars, w=1.0 -> 1.0/(6*0.011) = 15pt
  s6.addText(t[0], { x: tx + 0.1, y: ty + 0.12, w: 1.04, h: 0.45, fontFace: H, fontSize: 14, bold: true, color: t[2], margin: 0, valign: 'middle' });
  s6.addText(t[1], { x: tx + 0.1, y: ty + 0.6, w: 1.04, h: 0.38, fontFace: B, fontSize: 7, color: GRAY, margin: 0, valign: 'top' });
});
var caps = [
  ['Pre-order or skip', 'Economy passenger chooses, earns Asia Miles and sees the CO2 saved.'],
  ['Simulate 1,000 flights', 'Less waste, and first choice still rises from 96% to 97%.'],
  ['Scale to the network', 'Annual dollars and tonnes, with every assumption on a slider.']
];
caps.forEach(function (c, i) {
  var cx = 0.5 + i * 3.1;
  s6.addText(c[0], { x: cx, y: 4.3, w: 2.8, h: 0.25, fontFace: H, fontSize: 10.5, bold: true, color: INK, margin: 0 });
  s6.addText(c[1], { x: cx, y: 4.56, w: 2.8, h: 0.5, fontFace: B, fontSize: 7.5, color: GRAY, margin: 0, valign: 'top' });
});
s6.addNotes('Switch to the live demo now. Screen 1: an Economy passenger on CX 251 to London pre-orders or skips and earns miles. Screen 2: the forecast for that flight. Simulating 1,000 flights, we load 237 meals instead of 255, waste falls from 27 to 9 meals per flight, and first-choice availability actually goes up. Screen 3: the network dashboard, where judges can move any assumption.');

// =====================================================================
// SLIDE 7 — Impact
// =====================================================================
var s7 = pres.addSlide();
header(s7, 7, 'IMPACT', 'What Cathay saves every year');
function pillar(sl, x, tag, tagColor, tagBg, hero, heroSub, items) {
  sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: 1.35, w: 4.35, h: 3.5, fill: { color: WHITE }, line: { color: LINE }, rectRadius: 0.08 });
  sl.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.35, w: 4.35, h: 0.07, fill: { color: tagColor }, line: { color: tagColor } });
  sl.addText(tag, { x: x + 0.25, y: 1.55, w: 1.9, h: 0.26, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, fill: { color: tagBg }, fontFace: B, fontSize: 8, bold: true, color: tagColor, charSpacing: 2, align: 'center', valign: 'middle', margin: 0 });
  // 'US$18.4M' 8 chars, w=3.9 -> 3.9/(8*0.011)= 44pt; use 32pt
  sl.addText(hero, { x: x + 0.25, y: 1.88, w: 3.9, h: 0.6, fontFace: H, fontSize: 32, bold: true, color: tagColor, margin: 0, valign: 'middle' });
  sl.addText(heroSub, { x: x + 0.25, y: 2.48, w: 3.9, h: 0.25, fontFace: B, fontSize: 8.5, color: GRAY, margin: 0 });
  items.forEach(function (it, i) {
    var ry = 2.9 + i * 0.37, last = i === items.length - 1;
    sl.addShape(pres.shapes.LINE, { x: x + 0.25, y: ry, w: 3.85, h: 0, line: { color: LINE, width: 0.75 } });
    sl.addText(it[0], { x: x + 0.25, y: ry + 0.03, w: 2.7, h: 0.32, fontFace: B, fontSize: 8.5, bold: !!it[3], color: INK, margin: 0, valign: 'middle' });
    sl.addText(it[1], { x: x + 2.9, y: ry + 0.03, w: 1.2, h: 0.32, fontFace: H, fontSize: 10.5, bold: true, color: it[2] || INK, margin: 0, valign: 'middle', align: 'right' });
  });
}
pillar(s7, 0.5, 'COST', AMBER, AMBER_BG, 'US$18.4M', 'net savings per year (base case)', [
  ['Meal production avoided', '$20.3M'],
  ['Fuel from lighter aircraft', '$0.3M'],
  ['Incineration fees avoided', '$0.4M'],
  ['Asia Miles incentives', '−$1.1M', RED],
  ['Platform running cost', '−$1.5M', RED]
]);
pillar(s7, 5.15, 'SUSTAINABILITY', GREEN, GREEN_BG, '1,695 t', 'food waste avoided per year', [
  ['Meals not thrown away', '3.39M'],
  ['Jet fuel saved', '381 t'],
  ['CO2 from fuel', '1,205 t'],
  ['CO2e embodied in food', '4,237 t'],
  ['Total CO2e avoided', '5,442 t', GREEN, true]
]);
s7.addText('Illustrative base case: 25M full-service passengers · 0.17 kg untouched food per passenger (IATA ratios) · 35% AI reduction + 15% pre-order uptake · US$6 and 0.5 kg per meal.', { x: 0.5, y: 4.9, w: 9.0, h: 0.3, fontFace: B, fontSize: 7, color: GRAY_L, margin: 0, valign: 'middle' });
s7.addNotes('Two outcomes in one system. Cost: about 18 million US dollars net per year, mainly from meals we no longer produce, after paying for miles and the platform. Sustainability: about 1,700 tonnes of food and 5,400 tonnes of CO2e avoided every year. These are illustrative numbers using IATA ratios. With Cathay data, every assumption gets replaced.');

// =====================================================================
// SLIDE 8 — Why Cathay
// =====================================================================
var s8 = pres.addSlide();
header(s8, 8, 'WHY CATHAY', 'Why Cathay, why now');
var why = [
  [fa.FaClipboardCheck, 'Choose My Meal already exists', 'Its insights already adjust later catering, but only for First and Business. We extend it to every cabin.'],
  [fa.FaIndustry, 'Cathay Dining scale', '~83,800 meals a day for 45+ airlines. The engine can become a B2B product for third-party carriers.'],
  [fa.FaUsers, '36M+ passengers in 2025, up 27%', 'Growth makes over-catering more expensive every year. Small per-passenger gains add up fast.'],
  [fa.FaLeaf, 'A proven per-passenger KPI culture', 'Single-use plastics cut from 7.7 to 1.7 items per passenger. Food waste per passenger is the natural next KPI.']
];
why.forEach(function (w, i) {
  var cx = 0.5 + (i % 2) * 4.6, cy = 1.4 + Math.floor(i / 2) * 1.8;
  s8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: 4.4, h: 1.6, fill: { color: SURF }, line: { color: LINE }, rectRadius: 0.08 });
  s8.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 0.06, h: 1.6, fill: { color: ACC }, line: { color: ACC } });
  iconCircle(s8, w[0], ACC_BG, ACC, cx + 0.25, cy + 0.25, 0.6);
  s8.addText(w[1], { x: cx + 1.05, y: cy + 0.22, w: 3.2, h: 0.4, fontFace: H, fontSize: 12.5, bold: true, color: INK, margin: 0, valign: 'middle' });
  s8.addText(w[2], { x: cx + 1.05, y: cy + 0.68, w: 3.2, h: 0.85, fontFace: B, fontSize: 8.5, color: GRAY, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
});
s8.addNotes('Why Cathay specifically: the pre-order platform already exists, Cathay Dining gives us scale and a B2B route, passenger numbers are growing fast, and Cathay has already shown it can hit per-passenger cabin targets with plastics.');

// =====================================================================
// SLIDE 9 — Roadmap & ask
// =====================================================================
var s9 = pres.addSlide();
s9.background = { color: INK };
s9.addShape(pres.shapes.RECTANGLE, { x: 9.7, y: 0, w: 0.3, h: 5.625, fill: { color: GOLD }, line: { color: GOLD } });
s9.addText('09  ·  ROADMAP', { x: 0.5, y: 0.28, w: 6, h: 0.25, fontFace: B, fontSize: 9, color: ACC_L, bold: true, charSpacing: 2, margin: 0 });
s9.addText('Roadmap & ask', { x: 0.5, y: 0.58, w: 8.8, h: 0.6, fontFace: H, fontSize: 26, bold: true, color: WHITE, margin: 0, valign: 'middle' });
var phases = [
  ['0–3 MONTHS', 'Pilot', 'HKG–LHR, LAX and JFK on Cathay load and return data. Target: −30% untouched meals at ≥97% first choice.'],
  ['YEAR 2', 'Scale long-haul', 'All long-haul flights. Economy pre-order with an Asia Miles A/B test.'],
  ['YEAR 3+', 'Network & B2B', 'Full network, then offer the engine to Cathay Dining\'s airline clients.']
];
s9.addShape(pres.shapes.LINE, { x: 0.65, y: 1.55, w: 6.3, h: 0, line: { color: '2E6465', width: 1.5 } });
phases.forEach(function (p, i) {
  var px = 0.5 + i * 2.25;
  s9.addShape(pres.shapes.OVAL, { x: px + 0.05, y: 1.44, w: 0.22, h: 0.22, fill: { color: GOLD }, line: { color: INK, width: 2 } });
  s9.addText(p[0], { x: px, y: 1.8, w: 1.5, h: 0.26, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, fill: { color: '0F4A4B' }, fontFace: B, fontSize: 7.5, bold: true, color: ACC_L, align: 'center', valign: 'middle', margin: 0 });
  s9.addText(p[1], { x: px, y: 2.15, w: 2.1, h: 0.38, fontFace: H, fontSize: 15, bold: true, color: WHITE, margin: 0, valign: 'middle' });
  s9.addText(p[2], { x: px, y: 2.55, w: 2.05, h: 0.85, fontFace: B, fontSize: 7.5, color: 'D6E4E2', margin: 0, valign: 'top' });
});
s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.5, w: 6.65, h: 1.0, fill: { color: '0F4A4B' }, line: { color: GOLD, width: 1 }, rectRadius: 0.08 });
s9.addText('OUR ASK', { x: 0.75, y: 3.6, w: 2, h: 0.25, fontFace: B, fontSize: 8, bold: true, color: ACC_L, charSpacing: 3, margin: 0 });
var asks = ['12 months of load & return data', 'A catering planner partner', 'An Asia Miles incentive sandbox'];
asks.forEach(function (a, i) {
  var ax = 0.75 + i * 2.15;
  icon(s9, fa.FaCheckCircle, ACC_L, ax, 3.98, 0.24);
  s9.addText(a, { x: ax + 0.3, y: 3.92, w: 1.8, h: 0.45, fontFace: B, fontSize: 7.5, color: WHITE, margin: 0, valign: 'middle' });
});

// QR card
s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.45, y: 1.3, w: 2.0, h: 3.2, fill: { color: WHITE }, line: { color: GOLD, width: 1.5 }, rectRadius: 0.08 });
s9.addImage({ path: 'docs/assets/demo-qr-plain.png', x: 7.6, y: 1.45, w: 1.7, h: 1.7 });
s9.addText('Scan to try the demo', { x: 7.5, y: 3.25, w: 1.9, h: 0.3, fontFace: H, fontSize: 11, bold: true, color: ACC, align: 'center', margin: 0 });
s9.addText('Passenger app · Forecast · Impact dashboard', { x: 7.55, y: 3.58, w: 1.8, h: 0.4, fontFace: B, fontSize: 7, color: GRAY, align: 'center', margin: 0, valign: 'top' });
s9.addText('shentonyan.github.io/cathay-meal-forecast', { x: 7.5, y: 4.05, w: 1.9, h: 0.3, fontFace: B, fontSize: 6, italic: false, color: ACC, align: 'center', margin: 0 });
s9.addText('Fewer meals in the bin. Same first choice.', { x: 0.5, y: 4.7, w: 6.8, h: 0.45, fontFace: H, fontSize: 18, italic: true, bold: true, color: ACC_L, margin: 0, valign: 'middle' });
s9.addNotes('We want to start small: a three-month pilot on three HKG long-haul routes using real load and return data, targeting 30% fewer untouched meals. Then all long-haul with Economy pre-ordering, then the full network and Cathay Dining clients. Our ask is data access, a catering planner to work with, and an Asia Miles sandbox. Scan the QR code to try the demo yourself. Fewer meals in the bin, same first choice. Thank you.');

pres.writeFile({ fileName: 'pitch/cathay_meal_forecast_pitch.pptx' }).then(function () { console.log('Saved pitch/cathay_meal_forecast_pitch.pptx'); });
