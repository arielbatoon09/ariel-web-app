export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  timeline: string;
  targetAudience: string;
  features: string[];
  recommendedFor: string[];
}

export const ALL_SERVICES: ServicePackage[] = [
  {
    id: "01",
    title: "Startup MVP Launch",
    description: "Validate your ideas with a fast-to-market, feature-complete Minimal Viable Product (MVP) designed to impress users and pitch to investors.",
    priceRange: "₱150,000 - ₱250,000",
    timeline: "3 - 4 Weeks",
    targetAudience: "Early-stage startups, founders, and business owners looking to validate an idea rapidly.",
    features: [
      "Responsive Web App or Hybrid Mobile App",
      "User Authentication & Role Management (Supabase / Firebase)",
      "Essential Database & Schema Design",
      "Stripe / local payment provider integration",
      "Basic admin panel/dashboard for management",
      "Clean, well-documented React / Next.js code"
    ],
    recommendedFor: [
      "Testing market demand quickly",
      "Pitching a live functional app to investors",
      "Low starting capital validation"
    ]
  },
  {
    id: "02",
    title: "Production Web App & SaaS",
    description: "A full-scale, secure, and highly optimized Software-as-a-Service (SaaS) web application ready for production, high user traffic, and operational scale.",
    priceRange: "₱350,000 - ₱550,000",
    timeline: "6 - 8 Weeks",
    targetAudience: "Established businesses and growing startups looking to scale their digital operations or launch a commercial SaaS.",
    features: [
      "High-performance Next.js or React web application",
      "Complex relational database architecture (PostgreSQL, MySQL)",
      "Robust REST / GraphQL APIs and serverless endpoints",
      "Advanced administrative control deck and user dashboards",
      "Granular permission system and multi-tenant security",
      "Third-party API integrations (CRMs, logistics, messaging)",
      "Pixel-perfect custom UI matching premium design guidelines"
    ],
    recommendedFor: [
      "Commercial product launches",
      "Replacing legacy tools with custom solutions",
      "Multi-tenant or multi-tier subscription applications"
    ]
  },
  {
    id: "03",
    title: "AI Integration & Agents",
    description: "Inject intelligent capabilities into your workflow, including vector search engines, retrieval-augmented generation (RAG), and autonomous agents.",
    priceRange: "₱200,000 - ₱400,000",
    timeline: "4 - 6 Weeks",
    targetAudience: "Companies wanting to automate manual processes, enhance user interaction, or build next-generation smart apps.",
    features: [
      "Integration of Large Language Models (OpenAI, Gemini, Anthropic)",
      "Retrieval-Augmented Generation (RAG) for querying private documents",
      "Vector database setup & semantic indexing (Pinecone, pgvector)",
      "Deterministic fallback logic for structured JSON responses",
      "Automated agents executing multi-step business pipelines",
      "Semantic caching to reduce API token costs"
    ],
    recommendedFor: [
      "Automating customer support or operations",
      "Enabling smart semantic search on large datasets",
      "Building generative AI features directly into software"
    ]
  },
  {
    id: "04",
    title: "Technical Consulting & Scoping",
    description: "High-impact advisory for technical system design, security audits, performance optimization, and architectural blueprint scoping.",
    priceRange: "₱25,000 / week",
    timeline: "Ongoing / Flexible",
    targetAudience: "Teams seeking expert engineering advice, code reviews, or architectural guidance before building.",
    features: [
      "Detailed architectural blueprint and technical scoping document",
      "Comprehensive code reviews and performance bottleneck auditing",
      "Security practice review and recommendations",
      "Technological stack advisory for future-proof engineering",
      "Database schema and indexing performance reviews"
    ],
    recommendedFor: [
      "Scoping out large projects before committing budget",
      "Optimizing slow or legacy software applications",
      "Advising junior/mid-level development teams"
    ]
  }
];
