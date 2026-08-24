export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  year: string;
  featured?: boolean;
  size: "large" | "small" | "wide" | "tall";
  hue: string; // accent gradient for the visual panel
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  tech: string[];
  challenges: string[];
  results: string[];
  gallery: { label: string; gradient: string }[];
  demo?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "ecommerce-platform",
    index: "01",
    title: "E-Commerce Platform",
    category: "Full Stack",
    tagline: "A production-grade storefront with real-time inventory.",
    description:
      "Complete commerce system with catalog, cart, checkout, payments and an admin dashboard for inventory and order management.",
    year: "2025",
    featured: true,
    size: "large",
    hue: "from-cyan-500/50 via-sky-600/30 to-blue-900/20",
    overview:
      "A full commerce experience built end-to-end: customer storefront, secure checkout and a back-office admin. Designed for speed, SEO and conversion.",
    problem:
      "Small retailers needed a fast, reliable storefront without the cost and lock-in of large SaaS commerce platforms.",
    solution:
      "A custom Next.js storefront backed by an ASP.NET Core API. Server-rendered product pages for SEO, optimistic cart updates, and a role-based admin panel.",
    architecture: [
      "Next.js App Router frontend with server components for product pages",
      "ASP.NET Core REST API with layered architecture",
      "PostgreSQL with EF Core, optimized read models for catalog queries",
      "Redis cache for sessions and hot product data",
      "Dockerized services with CI/CD pipeline",
    ],
    features: [
      "Product catalog with faceted search and filters",
      "Cart and multi-step checkout with validation",
      "Stripe payment integration",
      "Order tracking and email notifications",
      "Admin dashboard: inventory, orders, analytics",
    ],
    tech: ["Next.js", "TypeScript", "ASP.NET Core", "C#", "PostgreSQL", "Redis", "Docker", "Stripe"],
    challenges: [
      "Keeping inventory consistent under concurrent checkouts — solved with optimistic concurrency and row versioning.",
      "Cold-start performance on product pages — solved with ISR and edge caching.",
    ],
    results: [
      "Sub-second LCP on product pages",
      "99.9% checkout success rate in load tests",
      "40% faster admin workflows vs. previous tooling",
    ],
    gallery: [
      { label: "Storefront", gradient: "from-cyan-400/40 to-blue-900/40" },
      { label: "Checkout Flow", gradient: "from-sky-400/40 to-indigo-900/40" },
      { label: "Admin Dashboard", gradient: "from-teal-400/40 to-cyan-900/40" },
      { label: "Analytics", gradient: "from-blue-400/40 to-slate-900/40" },
    ],
    demo: "https://example.com",
    github: "https://github.com/",
  },
  {
    slug: "saas-dashboard",
    index: "02",
    title: "SaaS Dashboard",
    category: "Frontend",
    tagline: "A data-dense analytics workspace that stays fast.",
    description:
      "Multi-tenant analytics dashboard with live charts, custom reports, role-based access and a plugin-style widget system.",
    year: "2025",
    featured: true,
    size: "small",
    hue: "from-violet-500/50 via-purple-600/30 to-indigo-900/20",
    overview:
      "An analytics workspace for SaaS teams: configurable dashboards, live metrics and shareable reports — engineered to stay responsive with thousands of data points on screen.",
    problem:
      "Teams drowned in disconnected spreadsheets and slow BI tools that couldn't be embedded into their daily workflow.",
    solution:
      "A widget-driven dashboard where every chart is a composable module. Virtualized tables, streamed queries and aggressive memoization keep the UI at 60fps.",
    architecture: [
      "React + TypeScript SPA with code-split widget modules",
      "Node.js BFF aggregating internal APIs",
      "WebSocket channel for live metric streams",
      "PostgreSQL with materialized views for aggregates",
    ],
    features: [
      "Drag-and-drop dashboard builder",
      "Live-updating charts and KPIs",
      "Custom report exports (CSV / PDF)",
      "Role-based access control",
      "Dark/light theming",
    ],
    tech: ["React", "TypeScript", "Node.js", "WebSockets", "PostgreSQL", "Docker"],
    challenges: [
      "Rendering 10k+ points without jank — solved with canvas-based charts and windowing.",
      "Widget isolation — each widget is sandboxed with its own error boundary and data contract.",
    ],
    results: [
      "60fps interactions on data-heavy views",
      "Report generation time cut from minutes to seconds",
    ],
    gallery: [
      { label: "Overview", gradient: "from-violet-400/40 to-purple-900/40" },
      { label: "Report Builder", gradient: "from-fuchsia-400/40 to-violet-900/40" },
      { label: "Live Metrics", gradient: "from-purple-400/40 to-indigo-900/40" },
    ],
    demo: "https://example.com",
    github: "https://github.com/",
  },
  {
    slug: "backend-system",
    index: "03",
    title: "Backend System",
    category: "Backend",
    tagline: "A resilient API platform processing millions of events.",
    description:
      "Event-driven backend platform: authentication, queues, background workers and observability — built to scale horizontally.",
    year: "2024",
    featured: true,
    size: "wide",
    hue: "from-teal-500/50 via-emerald-600/30 to-cyan-900/20",
    overview:
      "The invisible backbone: a distributed backend handling auth, event ingestion and async processing with full observability.",
    problem:
      "A growing product needed to move from a single monolith to something that could absorb traffic spikes without downtime.",
    solution:
      "Decomposed the monolith into focused services communicating over a message queue, with idempotent workers and structured logging throughout.",
    architecture: [
      "ASP.NET Core services behind an API gateway",
      "RabbitMQ for event distribution",
      "Background workers with retry + dead-letter queues",
      "PostgreSQL + read replicas",
      "OpenTelemetry traces and structured logs",
    ],
    features: [
      "JWT auth with refresh rotation",
      "Rate limiting and request validation",
      "Async job pipeline with progress tracking",
      "Health checks and self-healing workers",
    ],
    tech: ["C#", ".NET", "ASP.NET Core", "RabbitMQ", "PostgreSQL", "Docker", "OpenTelemetry"],
    challenges: [
      "Exactly-once semantics for financial events — solved with idempotency keys and transactional outbox.",
      "Zero-downtime deploys — solved with rolling releases and backward-compatible migrations.",
    ],
    results: [
      "5M+ events/day processed reliably",
      "p99 latency under 120ms",
      "Zero-downtime deployments achieved",
    ],
    gallery: [
      { label: "Architecture", gradient: "from-teal-400/40 to-emerald-900/40" },
      { label: "Observability", gradient: "from-emerald-400/40 to-cyan-900/40" },
      { label: "Queue Topology", gradient: "from-green-400/40 to-teal-900/40" },
    ],
    github: "https://github.com/",
  },
  {
    slug: "interactive-experience",
    index: "04",
    title: "Interactive Experience",
    category: "3D / Creative",
    tagline: "A WebGL story told through scroll.",
    description:
      "Award-style interactive microsite: scroll-driven 3D scenes, shader materials and a cinematic narrative structure.",
    year: "2025",
    featured: true,
    size: "tall",
    hue: "from-fuchsia-500/50 via-violet-600/30 to-purple-900/20",
    overview:
      "An experiment in narrative WebGL — the page is a camera path, and scrolling is the director. Custom shaders, GSAP-driven timelines, fully responsive.",
    problem:
      "Static marketing pages fail to communicate products that are inherently spatial and interactive.",
    solution:
      "A scroll-orchestrated 3D scene where content sections and camera choreography are a single synchronized timeline.",
    architecture: [
      "React Three Fiber scene graph",
      "GSAP ScrollTrigger driving camera + material uniforms",
      "Custom GLSL displacement / fresnel shaders",
      "Lenis smooth scroll synced to GSAP ticker",
    ],
    features: [
      "Scroll-scrubbed camera choreography",
      "Liquid shader materials",
      "Adaptive quality based on device",
      "Reduced-motion accessible fallback",
    ],
    tech: ["Three.js", "React Three Fiber", "GSAP", "GLSL", "TypeScript", "Next.js"],
    challenges: [
      "Keeping 60fps with post-processing on mid-range devices — solved with dynamic resolution scaling.",
      "Making WebGL accessible — solved with a full static fallback and reduced-motion path.",
    ],
    results: [
      "Average session time 4x the previous static page",
      "Runs at 60fps on mid-range mobile",
    ],
    gallery: [
      { label: "Scene 01", gradient: "from-fuchsia-400/40 to-violet-900/40" },
      { label: "Scene 02", gradient: "from-violet-400/40 to-fuchsia-900/40" },
      { label: "Shader Detail", gradient: "from-pink-400/40 to-purple-900/40" },
    ],
    demo: "https://example.com",
    github: "https://github.com/",
  },
  {
    slug: "employee-management",
    index: "05",
    title: "Employee Management",
    category: "Full Stack",
    tagline: "HR records without the friction.",
    description:
      "Add, edit, delete and search employee records with a clean dashboard, audit trail and CSV import/export.",
    year: "2024",
    size: "small",
    hue: "from-sky-500/50 via-cyan-600/30 to-blue-900/20",
    overview:
      "A focused internal tool for HR teams: fast record management, search that feels instant, and an audit trail for compliance.",
    problem: "HR data lived in spreadsheets — error-prone, unauditable and slow to search.",
    solution:
      "A CRUD-focused dashboard with server-side search, optimistic UI and full change history.",
    architecture: [
      "Next.js frontend with server actions",
      "PostgreSQL with Prisma ORM",
      "Full-text search indexes",
    ],
    features: [
      "Instant search and filtering",
      "Bulk CSV import/export",
      "Change audit trail",
      "Role-based permissions",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    challenges: ["Bulk import validation at scale — solved with streamed row-by-row validation."],
    results: ["Record lookup time reduced from minutes to milliseconds"],
    gallery: [
      { label: "Dashboard", gradient: "from-sky-400/40 to-cyan-900/40" },
      { label: "Records", gradient: "from-cyan-400/40 to-blue-900/40" },
    ],
    github: "https://github.com/",
  },
  {
    slug: "expense-tracker",
    index: "06",
    title: "Expense Tracker",
    category: "Frontend",
    tagline: "Money, visualized honestly.",
    description:
      "Track income and expenses with monthly summaries, category charts and budgets that actually alert you.",
    year: "2024",
    size: "small",
    hue: "from-amber-500/45 via-orange-600/25 to-red-900/20",
    overview:
      "A personal finance app that turns raw transactions into clear monthly narratives with charts and budget alerts.",
    problem: "Budgeting apps either overwhelm with features or oversimplify into uselessness.",
    solution: "A minimal, chart-first tracker with fast entry and offline-capable local-first data.",
    architecture: ["React SPA with local-first storage", "Chart layer with canvas rendering", "Optional cloud sync API"],
    features: ["Quick-add transactions", "Category breakdown charts", "Monthly summaries", "Budget alerts", "Dark mode"],
    tech: ["React", "TypeScript", "Node.js", "Charts", "Tailwind CSS"],
    challenges: ["Offline/online sync conflicts — solved with last-write-wins + manual merge UI."],
    results: ["4.8★ average user feedback in beta"],
    gallery: [
      { label: "Overview", gradient: "from-amber-400/40 to-orange-900/40" },
      { label: "Charts", gradient: "from-orange-400/40 to-red-900/40" },
    ],
    github: "https://github.com/",
  },
  {
    slug: "weather-app",
    index: "07",
    title: "Weather App",
    category: "Frontend",
    tagline: "Five-day forecasts, zero clutter.",
    description:
      "Search any city with API-backed forecasts, animated conditions and automatic dark mode.",
    year: "2023",
    size: "wide",
    hue: "from-blue-500/50 via-indigo-600/30 to-slate-900/20",
    overview:
      "A weather client focused on glanceability: current conditions, a 5-day outlook and beautiful animated condition states.",
    problem: "Most weather sites bury the forecast under ads and noise.",
    solution: "A single-purpose app with instant search, cached responses and smooth condition transitions.",
    architecture: ["Next.js with edge-cached API routes", "OpenWeather API integration", "Service-worker offline cache"],
    features: ["City search with suggestions", "5-day forecast", "Animated condition states", "Auto dark mode"],
    tech: ["Next.js", "TypeScript", "OpenWeather API", "Tailwind CSS"],
    challenges: ["API rate limits — solved with edge caching and stale-while-revalidate."],
    results: ["Loads in under 1s on 3G"],
    gallery: [
      { label: "Search", gradient: "from-blue-400/40 to-indigo-900/40" },
      { label: "Forecast", gradient: "from-indigo-400/40 to-slate-900/40" },
    ],
    demo: "https://example.com",
    github: "https://github.com/",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
