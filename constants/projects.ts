export interface CaseStudy {
  challenge: string;
  solution: string;
  results: string[];
  role: string;
  timeline: string;
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
  features: {
    title: string;
    description: string;
  }[];
}

export interface Project {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  link: string;
  categories: ("web" | "mobile" | "ai-data" | "open-source")[];
  caseStudy: CaseStudy;
}

export const ALL_PROJECTS: Project[] = [
  {
    id: "01",
    categories: ["web"],
    tag: "Custom SaaS / Web Platform",
    title: "Apex Logistics Platform",
    description:
      "An automated administrative panel and client portal engineered to streamline cargo tracking, automated billing, and live routing pipelines.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    link: "/work/01",
    caseStudy: {
      role: "Lead Systems Architect & Full-Stack Developer",
      timeline: "4 Months (Q1 2026)",
      client: "Apex Global Logistics Inc.",
      liveUrl: "https://apex-logistics.demo",
      githubUrl: "https://github.com/example/apex-logistics",
      challenge:
        "Apex Logistics was managing cargo manifests, client communications, and billing across disconnected spreadsheets. Manifest errors occurred on 8% of global shipments, causing significant customs delays and administrative overhead.",
      solution:
        "Engineered a centralized web portal and administrative control deck. Built automated cargo ingest forms with JSON schema validation, dynamic freight routing calculations using OpenRouteService API, and stripe-powered automated invoicing triggered by geolocation checkpoints.",
      features: [
        {
          title: "Real-time Telemetry & Ingestion",
          description: "Streams cargo position coordinates and dynamically estimates ETA based on traffic, customs queues, and weather data.",
        },
        {
          title: "Automated Dynamic Billing",
          description: "Generates cryptographic, audited PDF invoices automatically upon successful delivery confirmation at terminal checkpoints.",
        },
        {
          title: "Role-Based Security Portal",
          description: "Strict isolation of tenant, dispatcher, and administrator scopes using JWT validation and row-level PostgreSQL security.",
        },
      ],
      results: [
        "Reduced manifest entry errors from 8% to less than 0.2% via strict client-side validation.",
        "Decreased average invoice settlement time by 42% utilizing automated billing workflows.",
        "Increased dispatch efficiency, saving operators an estimated 14 hours per week.",
      ],
    },
  },
  {
    id: "02",
    categories: ["mobile"],
    tag: "Mobile E-Commerce App",
    title: "Nova Retail Mobile App",
    description:
      "An offline-first, high-conversion mobile shopping experience featuring secure checkouts, real-time push alerts, and fluid catalog browsing.",
    imageSrc: "/projects/project-retail.png",
    tags: ["React Native", "TypeScript", "FastAPI"],
    link: "/work/02",
    caseStudy: {
      role: "Mobile Software Engineer",
      timeline: "3 Months (Q4 2025)",
      client: "Nova Retail Group",
      liveUrl: "https://nova-retail.demo",
      challenge:
        "The existing mobile site suffered from high cart abandonment (68%) due to poor network resilience in retail stores, resulting in lost revenue during peak hours.",
      solution:
        "Developed an offline-first mobile application using React Native and SQLite local cache synchronization. Implemented background queue syncing for carts, instant image decompression, and seamless Apple/Google Pay integrations.",
      features: [
        {
          title: "Offline Sync Engine",
          description: "Allows users to browse catalogs and add items to cart offline, syncing changes to the API server once connectivity resumes.",
        },
        {
          title: "Optimized Visual Loading",
          description: "Integrates progressive JPEGs and caching libraries to load high-resolution catalog images with zero perceived latency.",
        },
        {
          title: "Direct Native Integrations",
          description: "Integrated biometric authorization and native OS pay sheets for frictionless 1-tap checkout processes.",
        },
      ],
      results: [
        "Reduced checkout bounce rates by 35% through 1-tap payments and offline persistence.",
        "Boosted overall conversion rates by 22% within 90 days of launch.",
        "99.9% crash-free session rating across both iOS and Android installations.",
      ],
    },
  },
  {
    id: "03",
    categories: ["ai-data", "web"],
    tag: "AI / Enterprise Software",
    title: "Insight Document Search",
    description:
      "A semantic search engine and AI-powered document analyzer utilizing vector databases to deliver instant, contextual answers for enterprise files.",
    imageSrc: "/projects/project-search.png",
    tags: ["Python", "OpenAI", "Pinecone"],
    link: "/work/03",
    caseStudy: {
      role: "AI Integration Engineer",
      timeline: "5 Months (Q2 2026)",
      client: "Insight Corp",
      liveUrl: "https://insight-search.demo",
      challenge:
        "Employees spent hours daily scanning PDFs, DOCX, and scanned logs to resolve technical questions, leading to slow customer support response times.",
      solution:
        "Built a Retrieval-Augmented Generation (RAG) pipeline that parses raw documents, generates embeddings, stores them in Pinecone, and uses OpenAI GPT-4o to answer natural language queries based on document context.",
      features: [
        {
          title: "Semantic Vector Parsing",
          description: "Tokenizes and chunks massive files while preserving structural metadata to ensure accurate retrieval context.",
        },
        {
          title: "Interactive Q&A Sandbox",
          description: "An elegant, real-time chat interface allowing users to converse with their documents with annotated citations.",
        },
        {
          title: "Auto-indexing Pipelines",
          description: "Listens to folder mutations in S3/Google Drive, automatically triggering re-embeddings on document addition or deletion.",
        },
      ],
      results: [
        "Cut document review and research times by over 70% for customer service staff.",
        "Delivered query responses in under 1.2 seconds utilizing vector search indexes.",
        "Enabled ingestion of over 100k pages of legacy documents with automatic structure recovery.",
      ],
    },
  },
  {
    id: "04",
    categories: ["web"],
    tag: "IoT / Web Application",
    title: "Solaria Energy Monitor",
    description:
      "An interactive telemetry platform analyzing industrial solar panel arrays, tracking power output grid efficiency, and battery depletion metrics.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["Next.js", "GraphQL", "TimescaleDB"],
    link: "/work/04",
    caseStudy: {
      role: "Full-Stack Engineer",
      timeline: "3 Months (Q3 2025)",
      client: "Solaria Systems",
      liveUrl: "https://solaria-monitor.demo",
      challenge:
        "Solar array monitoring dashboard lagged under real-time telemetry inputs, causing missed alert thresholds for hardware degradation.",
      solution:
        "Designed a high-throughput time-series visualization system utilizing TimescaleDB and GraphQL subscriptions. Created hyper-responsive Canvas-based charting overlays displaying live performance indicators.",
      features: [
        {
          title: "Sub-Second Live Updates",
          description: "Receives raw UDP inverter telemetry packets, parses metrics, and broadcasts them via GraphQL subscriptions.",
        },
        {
          title: "Hardware Predictive Analytics",
          description: "Flags inverter outputs falling below historical averages, prompting preemptive maintenance alerts.",
        },
        {
          title: "Canvas Visualization Canvas",
          description: "Custom chart renders capable of plotting 50,000 data points smoothly at 60 frames per second.",
        },
      ],
      results: [
        "Improved dashboard rendering performance by 5x under heavy network loads.",
        "Facilitated discovery of 12 faulty inverters within the first month, saving solar assets worth thousands.",
        "Increased system uptime visibility to 99.98%.",
      ],
    },
  },
  {
    id: "05",
    categories: ["ai-data", "web"],
    tag: "Enterprise / Security",
    title: "Aegis Cyber Dashboard",
    description:
      "A real-time threat monitoring and log analysis cockpit built for network security operations, offering instant incident alert routing.",
    imageSrc: "/projects/project-search.png",
    tags: ["React", "Go", "Elasticsearch"],
    link: "/work/05",
    caseStudy: {
      role: "Security Infrastructure Engineer",
      timeline: "4 Months (Q4 2025)",
      client: "Aegis Cyber Solutions",
      liveUrl: "https://aegis-cyber.demo",
      challenge: "Security operators were overwhelmed by log fatigue, struggling to distinguish active network intrusions from baseline noise.",
      solution:
        "Engineered a reactive threat cockpit utilizing Go backend parsers feeding into Elasticsearch. Developed a customizable, widget-based dashboard that correlates logs into structured security events.",
      features: [
        {
          title: "Log Correlation Engine",
          description: "Aggregates raw system logs and parses threat signatures against active database rules.",
        },
        {
          title: "Reactive Alert System",
          description: "Sends push notifications and PagerDuty escalations within 300ms of critical threat detections.",
        },
        {
          title: "Custom Workspace Builder",
          description: "Allows operators to drag, drop, and configure log visualization components on demand.",
        },
      ],
      results: [
        "Reduced Mean Time to Detect (MTTD) threats from 24 minutes to 15 seconds.",
        "Consolidated average log volume by 80% using smart correlation filters.",
        "Increased analyst threat dispatch speed by 3x.",
      ],
    },
  },
  {
    id: "06",
    categories: ["web"],
    tag: "Fintech API System",
    title: "Quantum Ledger Engine",
    description:
      "A high-frequency ledger processing engine with double-entry cryptographic audits and sub-millisecond transaction execution pipelines.",
    imageSrc: "/projects/project-retail.png",
    tags: ["Rust", "gRPC", "Redis"],
    link: "/work/06",
    caseStudy: {
      role: "Backend Core Architect",
      timeline: "6 Months (Q1-Q2 2025)",
      client: "Quantum Capital Group",
      challenge:
        "Legacy database transactions suffered from locking issues under peak trading volumes, resulting in system lag and double-entry discrepancies.",
      solution:
        "Created an in-memory double-entry accounting ledger engine in Rust. Uses event sourcing for absolute transaction histories, gRPC protocols for inter-service communication, and Redis for distributed locking.",
      features: [
        {
          title: "In-Memory Event Sourcing",
          description: "Tracks all balance modifications as a immutable chronological log, making balances completely auditable.",
        },
        {
          title: "Sub-Millisecond gRPC APIs",
          description: "Facilitates lightning-fast transaction throughput with compact protocol buffer payloads.",
        },
        {
          title: "Cryptographic Verification",
          description: "Hashes every ledger state statefully, verifying the integrity of ledger histories dynamically.",
        },
      ],
      results: [
        "Achieved 25,000 transactions per second throughput with sub-millisecond latency profiles.",
        "Removed double-spending and ledger locking anomalies completely.",
        "Maintained 100% data consistency audits across six consecutive fiscal months.",
      ],
    },
  },
  {
    id: "07",
    categories: ["open-source", "web"],
    tag: "Open Source Library",
    title: "HyperQuery SQL Parser",
    description:
      "A lightweight, zero-dependency SQL parsing library optimized for sub-millisecond Abstract Syntax Tree (AST) generation and type-safe query inspection.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["TypeScript", "Parser", "SQL", "Open Source"],
    link: "/work/07",
    caseStudy: {
      role: "Author / Core Maintainer",
      timeline: "Active Open Source",
      githubUrl: "https://github.com/example/hyperquery",
      challenge:
        "Existing JavaScript SQL parsers were slow, had bloated dependencies, or lacked correct type support for complex dialects, making them difficult to use in client-side or edge environments.",
      solution:
        "Authored a hand-crafted recursive descent parser in pure TypeScript. Built with zero dependencies, it generates clean ASTs and includes full type mappings for PostgreSQL, MySQL, and SQLite dialects.",
      features: [
        {
          title: "Recursive Descent Tokenizer",
          description: "Efficiently scans strings and classifies tokens with minimal memory footprint.",
        },
        {
          title: "Comprehensive AST Generator",
          description: "Translates raw SQL queries into highly inspectable node trees, facilitating programmatic rewrites.",
        },
        {
          title: "Dialect Customization Hooks",
          description: "Exposes clear extension APIs to support proprietary or custom SQL dialects easily.",
        },
      ],
      results: [
        "Earned over 1,500 GitHub Stars from the developer community.",
        "Executed AST parsing in under 0.8ms on edge network environments.",
        "Currently downloaded over 50,000 times monthly via NPM.",
      ],
    },
  },
  {
    id: "08",
    categories: ["open-source", "web"],
    tag: "BaseUI Tailwind Integration",
    title: "BaseUI Tailwind Integration",
    description: "A plug-and-play preset to unify Headless MUI Base UI component states with Tailwind CSS utility classes and layout variables.",
    imageSrc: "/projects/project-retail.png",
    tags: ["TailwindCSS", "CSS", "BaseUI", "Open Source"],
    link: "/work/08",
    caseStudy: {
      role: "Author / Core Maintainer",
      timeline: "Active Open Source",
      githubUrl: "https://github.com/example/baseui-tailwind",
      challenge:
        "Styling headless components with Tailwind state variants (e.g., active, disabled, open) required verbose utility class composition that cluttered codebases.",
      solution:
        "Created an open-source preset extension for Tailwind config. It maps Headless MUI state attributes directly to clean Tailwind modifiers (e.g., ui-open:bg-black), simplifying frontend component styling.",
      features: [
        {
          title: "Custom Variant Engine",
          description: "Extends Tailwind CSS parser engine to match UI attribute states seamlessly.",
        },
        {
          title: "Clean Utility Aliasing",
          description: "Provides shorthand classes mapping directly to focus, active, and invalid states.",
        },
        {
          title: "Zero-bloat Runtime",
          description: "Runs entirely at build time, ensuring zero performance overhead on production websites.",
        },
      ],
      results: [
        "Simplified frontend UI class strings by an average of 45% in active projects.",
        "Integrated by over 80 production teams worldwide.",
        "Received active community feedback and contributions from 14+ developers.",
      ],
    },
  },
];
