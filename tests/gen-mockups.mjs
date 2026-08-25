/* Generate product-UI mockup screenshots for portfolio projects.
   Renders styled HTML screens in headless Edge → public/projects/<slug>-N.png */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

mkdirSync("public/projects", { recursive: true });

/* ------------------------------------------------------------------ */
const css = (a, b) => `
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',system-ui,sans-serif; }
  body { background:#0a0f1e; color:#e8edf6; width:1440px; height:900px; overflow:hidden; }
  .accent { color:${a}; }
  .top { height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 32px; border-bottom:1px solid rgba(255,255,255,.08); background:#0d1326; }
  .logo { font-weight:700; font-size:17px; display:flex; gap:10px; align-items:center; }
  .dot { width:26px; height:26px; border-radius:8px; background:linear-gradient(135deg,${a},${b}); }
  .nav { display:flex; gap:26px; font-size:13px; color:#9aa7bd; }
  .btn { background:linear-gradient(135deg,${a},${b}); color:#06101f; font-weight:600; padding:10px 22px; border-radius:10px; font-size:13px; }
  .wrap { display:flex; height:840px; }
  .side { width:230px; background:#0d1326; border-right:1px solid rgba(255,255,255,.07); padding:24px 16px; font-size:13px; color:#9aa7bd; }
  .side div { padding:11px 14px; border-radius:9px; margin-bottom:4px; }
  .side .on { background:${a}22; color:${a}; font-weight:600; }
  .main { flex:1; padding:30px 36px; }
  h1 { font-size:26px; margin-bottom:6px; }
  .sub { color:#8d99b0; font-size:13px; margin-bottom:26px; }
  .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:26px; }
  .card { background:#111936; border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:20px; }
  .card b { font-size:24px; display:block; margin-top:8px; }
  .card span { font-size:12px; color:#8d99b0; }
  .panel { background:#111936; border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:24px; }
  .bars { display:flex; align-items:flex-end; gap:14px; height:220px; margin-top:18px; }
  .bar { flex:1; border-radius:6px 6px 0 0; background:linear-gradient(180deg,${a},${b}55); }
  table { width:100%; border-collapse:collapse; font-size:13px; margin-top:14px; }
  th { text-align:left; color:#8d99b0; font-weight:500; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.09); }
  td { padding:13px 12px; border-bottom:1px solid rgba(255,255,255,.05); }
  .pill { padding:4px 12px; border-radius:99px; font-size:11px; background:${a}22; color:${a}; }
  .grid2 { display:grid; grid-template-columns:2fr 1fr; gap:18px; }
  .hero { height:840px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
    background:radial-gradient(circle at 30% 20%, ${a}33, transparent 55%), radial-gradient(circle at 75% 75%, ${b}2e, transparent 50%); }
  .hero h1 { font-size:64px; max-width:900px; line-height:1.08; }
  .hero p { color:#9aa7bd; font-size:18px; max-width:560px; margin:22px 0 34px; }
  .chip { display:inline-block; padding:8px 18px; border:1px solid ${a}66; color:${a}; border-radius:99px; font-size:12px; letter-spacing:2px; margin-bottom:26px; }
  .prods { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
  .prod { background:#111936; border:1px solid rgba(255,255,255,.07); border-radius:14px; overflow:hidden; }
  .ph { height:150px; background:linear-gradient(135deg,${a}44,${b}33); display:flex; align-items:center; justify-content:center; font-size:64px; }
  .ph em { font-style:normal; filter:drop-shadow(0 10px 24px rgba(0,0,0,.45)); }
  .tag { position:absolute; margin:-108px 0 0 96px; background:${a}; color:#06101f; font-size:10px; font-weight:700; padding:3px 10px; border-radius:99px; }
  .pb { padding:14px; font-size:13px; }
  .pb i { color:#8d99b0; font-style:normal; font-size:12px; display:block; margin-top:4px; }
  .price { color:${a}; font-weight:700; margin-top:8px; display:block; }
  .form { max-width:520px; margin:60px auto; }
  .fld { background:#111936; border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:15px 16px; color:#8d99b0; font-size:13px; margin-bottom:14px; }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .steps { display:flex; gap:10px; margin-bottom:34px; font-size:12px; color:#8d99b0; }
  .step { flex:1; text-align:center; padding-bottom:12px; border-bottom:2px solid rgba(255,255,255,.12); }
  .step.on { color:${a}; border-color:${a}; }
  .nodes { position:relative; height:640px; margin-top:20px; }
  .node { position:absolute; background:#111936; border:1px solid ${a}55; border-radius:12px; padding:16px 22px; font-size:13px; font-weight:600; }
  .node i { display:block; color:#8d99b0; font-weight:400; font-style:normal; font-size:11px; margin-top:4px; }
  svg.links { position:absolute; inset:0; }
  svg.links line { stroke:${a}44; stroke-width:2; }
  .wx { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:24px; }
  .wd { background:#111936; border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:22px; text-align:center; }
  .wd b { font-size:22px; }
  .big { font-size:76px; font-weight:700; }
`;

const top = (name) => `<div class="top"><div class="logo"><div class="dot"></div>${name}</div>
  <div class="nav"><span>Overview</span><span>Products</span><span>Reports</span><span>Settings</span></div>
  <div class="btn">New +</div></div>`;

const side = (items) =>
  `<div class="side">${items.map((s, i) => `<div class="${i === 0 ? "on" : ""}">${s}</div>`).join("")}</div>`;

const bars = (hs) => `<div class="bars">${hs.map((h) => `<div class="bar" style="height:${h}%"></div>`).join("")}</div>`;

const L = {
  dashboard: (o) => `${top(o.name)}<div class="wrap">${side(o.side)}<div class="main">
    <h1>${o.title}</h1><div class="sub">${o.sub}</div>
    <div class="cards">${o.stats.map(([v, l]) => `<div class="card"><span>${l}</span><b class="accent">${v}</b></div>`).join("")}</div>
    <div class="grid2"><div class="panel"><b>${o.chart}</b>${bars([48, 72, 38, 90, 62, 78, 44, 96, 58, 84, 70, 52])}</div>
    <div class="panel"><b>Recent activity</b><table>${o.rows.map((r) => `<tr><td>${r[0]}</td><td><span class="pill">${r[1]}</span></td></tr>`).join("")}</table></div></div></div></div>`,

  table: (o) => `${top(o.name)}<div class="wrap">${side(o.side)}<div class="main">
    <h1>${o.title}</h1><div class="sub">${o.sub}</div>
    <div class="panel"><table><tr>${o.cols.map((c) => `<th>${c}</th>`).join("")}</tr>
    ${o.rows.map((r) => `<tr>${r.map((c, i) => (i === r.length - 1 ? `<td><span class="pill">${c}</span></td>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}
    </table></div></div></div>`,

  landing: (o) => `${top(o.name)}<div class="hero"><div class="chip">${o.chip}</div>
    <h1>${o.title}</h1><p>${o.sub}</p><div class="btn">${o.cta}</div></div>`,

  store: (o) => `${top(o.name)}<div class="main" style="padding:36px">
    <h1>${o.title}</h1><div class="sub">${o.sub}</div>
    <div class="prods">${o.items.map(([n, c, p, e]) => `<div class="prod"><div class="ph"><em>${e}</em></div><div class="pb"><b>${n}</b><i>${c}</i><span class="price">${p}</span></div></div>`).join("")}
    ${o.items.map(([n, c, p, e]) => `<div class="prod"><div class="ph" style="filter:hue-rotate(40deg)"><em>${e}</em></div><span class="tag">SALE</span><div class="pb"><b>${n} Pro</b><i>${c}</i><span class="price">${p}</span></div></div>`).join("")}</div></div>`,

  checkout: (o) => `${top(o.name)}<div class="form">
    <div class="steps"><div class="step on">1. Cart</div><div class="step on">2. Shipping</div><div class="step">3. Payment</div><div class="step">4. Done</div></div>
    <h1>${o.title}</h1><div class="sub">${o.sub}</div>
    <div class="fld">Full name</div><div class="row2"><div class="fld">Email address</div><div class="fld">Phone</div></div>
    <div class="fld">Street address</div><div class="row2"><div class="fld">City</div><div class="fld">Postal code</div></div>
    <div class="btn" style="text-align:center">Continue to payment →</div></div>`,

  diagram: (o) => `${top(o.name)}<div class="main">
    <h1>${o.title}</h1><div class="sub">${o.sub}</div>
    <div class="nodes"><svg class="links">${o.links.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join("")}</svg>
    ${o.nodes.map(([x, y, n, d]) => `<div class="node" style="left:${x}px;top:${y}px">${n}<i>${d}</i></div>`).join("")}</div></div>`,

  weather: (o) => `${top(o.name)}<div class="main" style="text-align:center;padding-top:60px">
    <div class="chip">${o.chip}</div><h1 style="font-size:34px">${o.title}</h1>
    <div class="big accent">24°</div><div class="sub">Karachi, Pakistan — Clear skies</div>
    <div class="wx">${o.days.map(([d, t]) => `<div class="wd"><span>${d}</span><b class="accent" style="display:block;margin-top:10px">${t}</b></div>`).join("")}</div></div>`,
};

/* ------------------------------------------------------------------ */
const SHOTS = [
  // 04 e-commerce (cyan)
  ["ecommerce-platform-1", "#22e0ff", "#2563eb", L.store, { name: "NovaShop", title: "Featured products", sub: "Curated storefront with real-time inventory", items: [["Aurora Headset", "Audio", "$129", "🎧"], ["Pulse Watch", "Wearables", "$210", "⌚"], ["Drift Keyboard", "Accessories", "$89", "⌨️"], ["Nimbus Lamp", "Home", "$45", "💡"]] }],
  ["ecommerce-platform-2", "#22e0ff", "#2563eb", L.checkout, { name: "NovaShop", title: "Checkout", sub: "Secure multi-step checkout with validation" }],
  ["ecommerce-platform-3", "#22e0ff", "#2563eb", L.dashboard, { name: "NovaShop Admin", side: ["Dashboard", "Orders", "Products", "Customers", "Inventory", "Settings"], title: "Store overview", sub: "Live sales, orders and inventory health", chart: "Revenue — last 12 weeks", stats: [["$48.2k", "Revenue"], ["1,284", "Orders"], ["99.9%", "Checkout success"], ["312", "Low stock alerts"]], rows: [["Order #8841 placed", "paid"], ["Stock sync completed", "ok"], ["Refund #221 issued", "done"], ["New customer signup", "new"]] }],
  ["ecommerce-platform-4", "#22e0ff", "#2563eb", L.dashboard, { name: "NovaShop Admin", side: ["Analytics", "Dashboard", "Orders", "Products"], title: "Analytics", sub: "Conversion, traffic and product performance", chart: "Conversion rate trend", stats: [["3.8%", "Conversion"], ["214k", "Sessions"], ["$38", "Avg. order"], ["1.2s", "LCP"]], rows: [["Campaign UTM spike", "info"], ["A/B test #12 won", "win"], ["Cart recovery sent", "sent"], ["Weekly report ready", "ok"]] }],
  // 05 saas dashboard (violet)
  ["saas-dashboard-1", "#8b7bff", "#c084fc", L.dashboard, { name: "MetricsHQ", side: ["Overview", "Dashboards", "Reports", "Alerts", "Team", "Billing"], title: "Workspace overview", sub: "Live KPIs across all connected sources", chart: "Active users — realtime", stats: [["18.4k", "Active users"], ["60fps", "UI framerate"], ["42", "Widgets live"], ["99.98%", "Uptime"]], rows: [["Dashboard shared", "team"], ["Alert threshold hit", "alert"], ["Report exported", "pdf"], ["New widget added", "new"]] }],
  ["saas-dashboard-2", "#8b7bff", "#c084fc", L.table, { name: "MetricsHQ", side: ["Reports", "Overview", "Dashboards", "Alerts"], title: "Report builder", sub: "Custom reports with scheduled exports", cols: ["Report", "Owner", "Schedule", "Status"], rows: [["Weekly KPI digest", "S. Ahmed", "Mon 9:00", "active"], ["Churn analysis", "M. Hammad", "Daily", "active"], ["Revenue by region", "A. Khan", "1st of month", "paused"], ["Funnel breakdown", "S. Ali", "Fri 17:00", "active"], ["NPS summary", "Z. Raza", "Weekly", "draft"]] }],
  ["saas-dashboard-3", "#8b7bff", "#c084fc", L.dashboard, { name: "MetricsHQ", side: ["Live metrics", "Overview", "Reports"], title: "Live metrics", sub: "Streaming updates over WebSockets", chart: "Events per second", stats: [["9.6k", "Events/sec"], ["114ms", "P99 latency"], ["0", "Dropped frames"], ["12", "Streams"]], rows: [["Socket pool scaled", "auto"], ["Spike absorbed", "ok"], ["Snapshot saved", "done"], ["Cache warmed", "ok"]] }],
  // 06 backend system (teal)
  ["backend-system-1", "#2dd4bf", "#10b981", L.diagram, { name: "CoreGrid", title: "System architecture", sub: "Event-driven services behind an API gateway", nodes: [[80, 60, "API Gateway", "auth · rate limiting"], [420, 40, "Orders Service", "ASP.NET Core"], [420, 180, "Users Service", "ASP.NET Core"], [430, 330, "Billing Service", "ASP.NET Core"], [800, 150, "RabbitMQ", "event bus"], [1100, 60, "Workers", "retry + DLQ"], [1100, 260, "PostgreSQL", "primary + replicas"], [800, 400, "OpenTelemetry", "traces · logs"]], links: [[210, 90, 420, 70], [210, 100, 420, 210], [210, 110, 430, 360], [560, 80, 800, 180], [560, 220, 800, 190], [570, 360, 800, 200], [930, 170, 1100, 90], [930, 190, 1100, 290], [930, 200, 900, 400]] }],
  ["backend-system-2", "#2dd4bf", "#10b981", L.dashboard, { name: "CoreGrid Ops", side: ["Observability", "Services", "Queues", "Deploys"], title: "Observability", sub: "Traces, metrics and structured logs", chart: "Requests per minute", stats: [["5.1M", "Events/day"], ["118ms", "P99 latency"], ["0", "Failed deploys"], ["100%", "Trace coverage"]], rows: [["Deploy v2.14 rolled", "ok"], ["DLQ drained", "auto"], ["Alert resolved", "done"], ["Replica promoted", "ok"]] }],
  ["backend-system-3", "#2dd4bf", "#10b981", L.table, { name: "CoreGrid Ops", side: ["Queues", "Observability", "Services"], title: "Queue topology", sub: "Exchanges, bindings and consumer health", cols: ["Queue", "Consumers", "Rate", "Status"], rows: [["orders.created", "6", "1.2k/s", "healthy"], ["billing.charge", "4", "480/s", "healthy"], ["email.dispatch", "2", "220/s", "healthy"], ["orders.dlq", "1", "0.2/s", "watch"], ["audit.log", "3", "800/s", "healthy"]] }],
  // 07 interactive experience (fuchsia)
  ["interactive-experience-1", "#e879f9", "#8b7bff", L.landing, { name: "LUMEN", chip: "SCROLL-DRIVEN WEBGL", title: "A story told through scroll.", sub: "Camera choreography, liquid shaders and a cinematic narrative — rendered in real time.", cta: "Enter experience →" }],
  ["interactive-experience-2", "#e879f9", "#8b7bff", L.landing, { name: "LUMEN", chip: "SCENE 02 — DEPTHS", title: "Shaders that feel alive.", sub: "Custom GLSL displacement and fresnel materials reacting to every scroll tick.", cta: "Continue ↓" }],
  ["interactive-experience-3", "#e879f9", "#8b7bff", L.dashboard, { name: "LUMEN Studio", side: ["Scenes", "Materials", "Timeline", "Export"], title: "Scene editor", sub: "GSAP timeline synced to camera path", chart: "Frame time (ms)", stats: [["60fps", "Mid-range mobile"], ["14", "Camera keyframes"], ["6", "Shader passes"], ["4x", "Session time"]], rows: [["Quality tier: auto", "on"], ["Reduced motion path", "ok"], ["Texture atlas packed", "done"], ["Scene 03 published", "live"]] }],
  // 08 employee management (sky)
  ["employee-management-1", "#38bdf8", "#22e0ff", L.dashboard, { name: "StaffDesk", side: ["Dashboard", "Employees", "Departments", "Audit log", "Imports"], title: "HR overview", sub: "Head-count, joiners and pending reviews", chart: "Headcount by month", stats: [["248", "Employees"], ["12", "Joining this month"], ["4", "Pending reviews"], ["ms", "Search latency"]], rows: [["CSV import (240 rows)", "done"], ["Record #1182 updated", "audit"], ["Role changed — A. Khan", "audit"], ["Export generated", "ok"]] }],
  ["employee-management-2", "#38bdf8", "#22e0ff", L.table, { name: "StaffDesk", side: ["Employees", "Dashboard", "Departments"], title: "Employee records", sub: "Instant search across 248 records", cols: ["Name", "Department", "Joined", "Status"], rows: [["Ayesha Khan", "Engineering", "Mar 2023", "active"], ["Bilal Ahmed", "Design", "Jul 2022", "active"], ["Sana Raza", "Finance", "Jan 2024", "active"], ["Omar Farooq", "Engineering", "Sep 2021", "on leave"], ["Hira Shaikh", "HR", "Feb 2023", "active"]] }],
  // 09 expense tracker (amber)
  ["expense-tracker-1", "#fbbf24", "#f97316", L.dashboard, { name: "Spendly", side: ["Overview", "Transactions", "Budgets", "Reports"], title: "August overview", sub: "Income vs expenses at a glance", chart: "Spending by week", stats: [["$4,280", "Income"], ["$2,910", "Expenses"], ["$1,370", "Saved"], ["3", "Budget alerts"]], rows: [["Groceries — $84", "food"], ["Fuel — $40", "travel"], ["Netflix — $12", "subs"], ["Salary credited", "income"]] }],
  ["expense-tracker-2", "#fbbf24", "#f97316", L.dashboard, { name: "Spendly", side: ["Charts", "Overview", "Budgets"], title: "Category breakdown", sub: "Where the money actually goes", chart: "By category — this month", stats: [["38%", "Food & dining"], ["22%", "Transport"], ["18%", "Bills"], ["22%", "Other"]], rows: [["Budget: food 80% used", "warn"], ["Recurring detected", "auto"], ["Report exported", "pdf"], ["Goal reached", "win"]] }],
  // 10 weather app (blue)
  ["weather-app-1", "#60a5fa", "#818cf8", L.weather, { name: "SkyCast", chip: "LIVE FORECAST", title: "Karachi, Pakistan", days: [["Mon", "31°"], ["Tue", "33°"], ["Wed", "29°"], ["Thu", "30°"], ["Fri", "32°"]] }],
  ["weather-app-2", "#60a5fa", "#818cf8", L.landing, { name: "SkyCast", chip: "SEARCH ANY CITY", title: "Five-day forecasts, zero clutter.", sub: "Instant search, cached responses and smooth animated condition states.", cta: "Search city →" }],
];

/* ------------------------------------------------------------------ */
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();

for (const [file, a, b, layout, opts] of SHOTS) {
  await page.setContent(`<!doctype html><html><head><style>${css(a, b)}</style></head><body>${layout(opts)}</body></html>`);
  await new Promise((r) => setTimeout(r, 250));
  const out = `public/projects/${file}.png`;
  await page.screenshot({ path: out });
  console.log("saved", out);
}
await browser.close();
