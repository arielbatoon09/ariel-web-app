export interface ArticleSection {
  title: string;
  body: string;
}

export interface Article {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  link: string;
  categories: ("engineering" | "design" | "ai" | "business")[];
  date: string;
  readTime: string;
  author: string;
  sections: ArticleSection[];
}

export const ALL_ARTICLES: Article[] = [
  {
    id: "01",
    categories: ["engineering"],
    tag: "Software Engineering & Architecture",
    title: "Optimizing Next.js Server Components for Extreme Scale",
    description: "A deep dive into minimizing hydration mismatch, leveraging partial pre-rendering, and tuning caching behaviors for production workloads.",
    imageSrc: "/projects/project-logistics.png", // Reusing existing project image placeholder
    tags: ["Next.js", "React 19", "Web Performance"],
    link: "/article/01",
    date: "July 2, 2026",
    readTime: "6 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "The Hydration Challenge in React 19",
        body: "Hydration mismatch is one of the most common causes of visual flicker and performance degradation in server-side rendered (SSR) web applications. By understanding the core mechanics of how React matches server-rendered HTML with client-side interactive bundles, we can eliminate blocking CPU cycles during page loads."
      },
      {
        title: "Leveraging Partial Pre-Rendering (PPR)",
        body: "Partial Pre-Rendering allows developer to serve a static shell instantly while streaming dynamic components over the same HTTP request. This bridges the gap between static site generation (SSG) and dynamic server rendering, resulting in sub-100ms Largest Contentful Paint (LCP) times even for personalized pages."
      },
      {
        title: "Advanced Caching & Revalidation Strategies",
        body: "By implementing granular cache-control headers, stale-while-revalidate configurations, and Next.js segment configs, you can scale dynamic applications to millions of hits without overwhelming your backend databases. We explore tag-based cache revalidation and how to design robust fallback states."
      }
    ]
  },
  {
    id: "02",
    categories: ["engineering", "design"],
    tag: "Mobile Development",
    title: "Designing Clean Offline-First Architectures in React Native",
    description: "How to engineer cross-platform mobile apps with local database syncing, robust queue management, and resilient UI state indicators.",
    imageSrc: "/projects/project-retail.png",
    tags: ["React Native", "SQLite", "Architecture"],
    link: "/article/02",
    date: "June 24, 2026",
    readTime: "8 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "The Imperative of Offline-First Mobile Design",
        body: "Mobile networks are inherently unreliable. Users expect apps to perform flawlessly in subways, elevators, and crowded venues. Building an offline-first experience requires shifting from API-first thinking to local-first database architectures."
      },
      {
        title: "SQLite Sync Engines & Conflict Resolution",
        body: "We examine how to structure an SQLite local database, implement transactional writes, and construct an automated sync engine. This sync engine processes background queues and resolves conflicts gracefully using timestamp-based or server-override strategies when the client re-establishes internet access."
      },
      {
        title: "Resilient UI & Optimistic States",
        body: "Providing users with immediate visual feedback is essential. By utilizing optimistic state updates in React Native, we can render updates instantly in the UI before they are confirmed by the server, accompanied by subtle micro-animations that communicate sync progress."
      }
    ]
  },
  {
    id: "03",
    categories: ["ai"],
    tag: "Artificial Intelligence Integration",
    title: "Integrating Intelligent AI Agents into Production SaaS Workflows",
    description: "An architectural guide to deploying autonomous LLM agents with deterministic logic guards, semantic vector search, and structured JSON outputs.",
    imageSrc: "/projects/project-fitness.png",
    tags: ["AI Agents", "LLM", "Vector Databases"],
    link: "/article/03",
    date: "June 15, 2026",
    readTime: "7 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "Moving Beyond Simple Chat Interfaces",
        body: "Integrating AI into software should go far beyond adding a basic chat window. Real business value comes from building autonomous agents that execute multi-step workflows, query custom data sources, and trigger real-world application API actions."
      },
      {
        title: "Enforcing Structured JSON Outputs",
        body: "To connect language models to deterministic application logic, you must guarantee that the model outputs structured data (like strict JSON) every time. We review schema-guided generation techniques and fallback validator pipelines that make AI agent actions 100% reliable."
      },
      {
        title: "Semantic Vector Search & Context Retrieval",
        body: "Learn how to build a Retrieval-Augmented Generation (RAG) pipeline that retrieves precise context blocks from vector databases. We cover embedding strategies, chunking methodologies, and metadata filtering to supply the agent with relevant knowledge without exceeding context limits."
      }
    ]
  },
  {
    id: "04",
    categories: ["design"],
    tag: "Design Systems & UI",
    title: "Building Consistent Token Systems for Dark & Light Themes",
    description: "Best practices for architecting CSS variables, semantic keys, and layout tokens that feel natural in both day and night modes.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["CSS", "Design Systems", "Themes"],
    link: "/article/04",
    date: "June 08, 2026",
    readTime: "5 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "Semantic Tokens vs. Raw Values",
        body: "Never map values directly to raw hex codes. Instead, build a semantic layer like `--color-bg-primary` mapping to different values per theme. This abstract layer simplifies styling and ensures consistency."
      }
    ]
  },
  {
    id: "05",
    categories: ["business"],
    tag: "Product Strategy",
    title: "Scaling Startup MVPs without Architectural Regret",
    description: "How to balance rapid feature validation with technical structure, choosing the right databases, infrastructure, and API boundaries.",
    imageSrc: "/projects/project-retail.png",
    tags: ["MVPs", "Startups", "Scale"],
    link: "/article/05",
    date: "May 29, 2026",
    readTime: "7 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "The MVP Trap",
        body: "Many startups build MVPs so quickly they become unmaintainable spaghetti. We look at modular scoping that allows rewriting without complete rebuilds."
      }
    ]
  },
  {
    id: "06",
    categories: ["engineering"],
    tag: "Database Design",
    title: "Designing SQL Database Schemas for Complex Workflows",
    description: "A guide to relational schema creation, normalization levels, indices optimization, and PostgreSQL replication configuration.",
    imageSrc: "/projects/project-fitness.png",
    tags: ["SQL", "Database", "PostgreSQL"],
    link: "/article/06",
    date: "May 15, 2026",
    readTime: "9 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "Indexing Strategies for Speed",
        body: "Indices are crucial for high-speed lookups, but over-indexing ruins write performance. We detail how to select key attributes for B-Tree indices."
      }
    ]
  },
  {
    id: "07",
    categories: ["ai"],
    tag: "Machine Learning Integration",
    title: "Fine-Tuning Models vs. RAG: Choosing the Right Approach",
    description: "A comparative evaluation of custom model fine-tuning and context-based document injection for production environments.",
    imageSrc: "/projects/project-logistics.png",
    tags: ["RAG", "Fine-Tuning", "LLMs"],
    link: "/article/07",
    date: "May 03, 2026",
    readTime: "6 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "When to Fine-Tune",
        body: "Fine-tuning updates model weights to adapt behavior or syntax, but not facts. RAG is better for injecting real-time data libraries."
      }
    ]
  },
  {
    id: "08",
    categories: ["engineering"],
    tag: "Web APIs & Integration",
    title: "REST vs. GraphQL in High-Load Enterprise Systems",
    description: "Evaluating payload sizes, request structures, security, caching, and rate limiting rules for modern web applications.",
    imageSrc: "/projects/project-retail.png",
    tags: ["APIs", "REST", "GraphQL"],
    link: "/article/08",
    date: "April 20, 2026",
    readTime: "8 min read",
    author: "Ariel Batoon",
    sections: [
      {
        title: "Optimized Payload Transfer",
        body: "GraphQL excels at dynamic query selection to prevent over-fetching, but REST caches much better at CDN levels. We discuss combining both approaches."
      }
    ]
  }
];
