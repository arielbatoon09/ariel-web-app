import {
  Users,
  Globe,
  Lock,
  Key,
  FileKey,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  BrainCircuit,
  Bot,
  Database,
  Cpu,
  Layers,
  Compass,
} from "lucide-react";

export const lucideIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Users,
  Globe,
  Lock,
  Key,
  FileKey,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  BrainCircuit,
  Bot,
  Database,
  Cpu,
  Layers,
  Compass,
};

export interface Skill {
  name: string;
  color: string;
  iconPath: string;
}

export interface ExperienceRole {
  title: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  period: string;
  roles: ExperienceRole[];
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  id: string;
  link: string;
}

export interface Philosophy {
  iconName: string; // Key in lucideIconMap
  title: string;
  description: string;
}

export const EXPERIENCES: Experience[] = [
  {
    company: "GrowthOps Asia",
    period: "Nov 2022 - Present",
    roles: [
      {
        title: "Web Developer",
        period: "Nov 2022 - Present",
        description:
          "Develop and maintain enterprise-level web applications using React.js, JavaScript, and Adobe Experience Manager (AEM). Responsible for building reusable components, enhancing performance, integrating RESTful APIs, and managing deployments across multiple environments. Actively contribute to frontend architecture improvements, code reviews, and Agile and Waterfalls development practices to ensure high-quality, scalable deliverables.",
        highlights: [
          "Began as a Contractual Developer, successfully transitioning to Regular Junior, and subsequently promoted to Mid-Level Web Developer.",
          "Responsible for constructing reusable frontend components, integrating RESTful APIs, and optimizing site performance.",
          "Collaborated in Agile and Waterfall project lifecycles to deliver robust solutions for enterprise clients.",
        ],
      },
    ],
  },
  {
    company: "College IT Department",
    period: "Jan 2025 - Present (Saturdays Only)",
    roles: [
      {
        title: "Part-Time Saturday Instructor & Capstone Adviser",
        period: "Jan 2025 - Present (Saturdays)",
        description:
          "Part-time IT Instructor and Capstone/Thesis Adviser dedicated to mentoring future IT professionals through hands-on instruction in modern software development, Generative AI, Full-stack engineering, and database systems. Provides academic and technical guidance for college capstone and thesis projects from conceptualization to deployment.",
        highlights: [
          "Delivering lectures and practical coding workshops on modern software development and database structures.",
          "Providing architectural and technical guidance for college capstone/thesis projects from design to deployment.",
        ],
      },
    ],
  },
  {
    company: "Independent / Freelance Projects",
    period: "2026 - Present (Selective)",
    roles: [
      {
        title: "Independent Software Engineer",
        period: "2020 - Present",
        description:
          "Designing and engineering custom software products, specializing in Websites & Web Apps, Custom Software, Mobile Development (iOS/Android), and Generative AI integrations.Sourced globally through platforms like Upwork, OnlineJobsPH, and direct referrals.",
        highlights: [
          "Websites & Web Apps: Building responsive, blazing-fast, and search-optimized Next.js/React platforms.",
          "Custom Software: Developing secure backend systems, robust APIs, and administrative control panels.",
          "Mobile Development: Engineering native-performance cross-platform iOS and Android mobile apps.",
          "Generative AI: Constructing AI-powered MVPs with intelligent chat, content generation, and custom LLM integrations.",
          "Continuing to actively accept select freelance side-projects depending on scope and operational alignment.",
        ],
      },
    ],
  },
  {
    company: "Contract Projects",
    period: "2023 & 2025",
    roles: [
      {
        title: "WordPress Developer (Contract) — TheWebsiteBuilders",
        period: "2023",
        description: "Partnered directly with this Australian company to build, deploy, and maintain custom business websites.",
        highlights: [
          "Developed responsive and performance-optimized websites using custom WordPress themes.",
          "Managed server setup, hosting environments, DNS routing, and secure website deployments.",
          "Maintained and improved existing sites to align with modern responsive web standards.",
        ],
      },
      {
        title: "WordPress Developer (Contract) — N2Seo",
        period: "2025",
        description: "Collaborated with a Texas-based private company on developing secure, SEO-friendly custom websites.",
        highlights: [
          "Created private websites built on WordPress optimized for fast loading speeds and search rankings.",
          "Handled server management, domain migrations, DNS record configuration, and production deployments.",
          "Ensured complete confidentiality and compliance under private project guidelines.",
        ],
      },
    ],
  },
];

export const TECH_STACK: { category: string; skills: Skill[] }[] = [
  {
    category: "Frontend",
    skills: [
      { name: "JavaScript", iconPath: "/technology/javascript.svg", color: "#F7DF1E" },
      { name: "TypeScript", iconPath: "/technology/typescript.svg", color: "#3178C6" },
      { name: "React", iconPath: "/technology/react.svg", color: "#61DAFB" },
      { name: "Next.js", iconPath: "/technology/nextdotjs.svg", color: "#000000" },
      { name: "Vue.js", iconPath: "/technology/vuedotjs.svg", color: "#4FC08D" },
      { name: "Nuxt.js", iconPath: "/technology/nuxt.svg", color: "#4FC08D" },
      { name: "React Native", iconPath: "/technology/react.svg", color: "#61DAFB" },
      { name: "Expo", iconPath: "/technology/expo.svg", color: "#000000" },
      { name: "Tailwind CSS", iconPath: "/technology/tailwindcss.svg", color: "#06B6D4" },
      { name: "Nativewind", iconPath: "/technology/nativewind.png", color: "#000000" },
      { name: "SCSS", iconPath: "/technology/sass.svg", color: "#CC6699" },
      { name: "Styled Components", iconPath: "/technology/styledcomponents.svg", color: "#DB7093" },
      { name: "Vite", iconPath: "/technology/vite.svg", color: "#646CFF" },
      { name: "Webpack", iconPath: "/technology/webpack.svg", color: "#8DD6F9" },
      { name: "ESLint", iconPath: "/technology/eslint.svg", color: "#4B32C3" },
      { name: "Prettier", iconPath: "/technology/prettier.svg", color: "#F7B93E" },
      { name: "Pinia", iconPath: "/technology/pinia.svg", color: "#453F3A" },
      { name: "Zustand", iconPath: "/technology/zustand.webp", color: "#453F3A" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", iconPath: "/technology/nodedotjs.svg", color: "#5FA04E" },
      { name: "Java", iconPath: "/technology/java.webp", color: "#F89820" },
      { name: "PHP", iconPath: "/technology/php.svg", color: "#777BB4" },
      { name: "Express.js", iconPath: "/technology/express.svg", color: "#000000" },
      { name: "Spring Boot", iconPath: "/technology/springboot.svg", color: "#6DB33F" },
      { name: "Laravel", iconPath: "/technology/laravel.svg", color: "#FF2D20" },
      { name: "PostgreSQL", iconPath: "/technology/postgresql.svg", color: "#4169E1" },
      { name: "MySQL", iconPath: "/technology/mysql.svg", color: "#4479A1" },
      { name: "MSSQL", iconPath: "/technology/mssql.webp", color: "#B61C1C" },
      { name: "SQLite", iconPath: "/technology/sqlite.svg", color: "#003955" },
      { name: "MongoDB", iconPath: "/technology/mongodb.svg", color: "#47A248" },
      { name: "Firebase", iconPath: "/technology/firebase.svg", color: "#DD2C00" },
      { name: "Supabase", iconPath: "/technology/supabase.svg", color: "#3FCF8E" },
      { name: "Redis", iconPath: "/technology/redis.svg", color: "#FF4438" },
      { name: "Upstash", iconPath: "/technology/upstash.svg", color: "#00E9A3" },
      { name: "BullMQ", iconPath: "/technology/bullmq.svg", color: "#D2D2D2" },
      { name: "AWS Lambda", iconPath: "/technology/aws.svg", color: "#FF9900" },
      { name: "OAuth", iconPath: "/technology/oauth.webp", color: "#EB5424" },
      { name: "JWT", iconPath: "/technology/jsonwebtokens.svg", color: "#000000" },
      { name: "REST", iconPath: "/technology/rest.png", color: "#4CAF50" },
      { name: "GraphQL", iconPath: "/technology/graphql.svg", color: "#E10098" },
    ],
  },
  {
    category: "DevOps & Cloud",
    skills: [
      { name: "AWS", iconPath: "/technology/aws.svg", color: "#FF9900" },
      { name: "Azure", iconPath: "/technology/azure.svg", color: "#0078D4" },
      { name: "Hostinger", iconPath: "/technology/hostinger.svg", color: "#6747C7" },
      { name: "OVHCloud", iconPath: "/technology/ovhcloud.png", color: "#00009F" },
      { name: "Vultr", iconPath: "/technology/vultr.png", color: "#007CFC" },
      { name: "Cloudflare", iconPath: "/technology/cloudflare.png", color: "#F48120" },
      { name: "GitHub Actions", iconPath: "/technology/githubactions.svg", color: "#2088FF" },
      { name: "GitLab CI", iconPath: "/technology/gitlab.svg", color: "#FC6D26" },
      { name: "Docker", iconPath: "/technology/docker.svg", color: "#2496ED" },
      { name: "Prometheus", iconPath: "/technology/prometheus.svg", color: "#E6522C" },
      { name: "Grafana", iconPath: "/technology/grafana.svg", color: "#F46800" },
    ],
  },
  {
    category: "LLM & AI",
    skills: [
      { name: "Hugging Face", iconPath: "/technology/huggingface.svg", color: "#FFD21E" },
      { name: "LangChain", iconPath: "/technology/langchain.png", color: "#7FC8FF" },
      { name: "React Native AI", iconPath: "/technology/reactnativeai.svg", color: "#462A73" },
      { name: "OpenAI", iconPath: "/technology/openai.webp", color: "#040405" },
      { name: "Anthropic", iconPath: "/technology/anthropic.png", color: "#D97757" },
      { name: "DeepSeek", iconPath: "/technology/deepseek.png", color: "#4D6BFE" },
      { name: "Gemini", iconPath: "/technology/gemini.webp", color: "#3296DC" },
      { name: "Qwen Opensource", iconPath: "/technology/qwen.png", color: "#623AE7" },
      { name: "LLama Opensource", iconPath: "/technology/llama.png", color: "#040405" },
      { name: "Gemma Opensource", iconPath: "/technology/gemma.png", color: "#328FFF" },
    ],
  },
  {
    category: "Security & Identity",
    skills: [
      { name: "SAP CDC", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "Auth0", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "AES", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "RSA", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "SHA", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "GDPR", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "SOC 2", iconPath: "/technology/security.webp", color: "#3AAF3C" },
      { name: "ISO 27001", iconPath: "/technology/security.webp", color: "#3AAF3C" },
    ],
  },
  {
    category: "CMS & No-Code",
    skills: [
      { name: "WordPress", iconPath: "/technology/wordpress.webp", color: "#21759B" },
      { name: "AEM", iconPath: "/technology/aem.svg", color: "#2B1B0C" },
      { name: "Weebly", iconPath: "/technology/weebly.png", color: "#3678FC" },
      { name: "Wix", iconPath: "/technology/wix.png", color: "#000000" },
    ],
  },
  {
    category: "Tools & Collaboration",
    skills: [
      { name: "Git", iconPath: "/technology/git.webp", color: "#F05133" },
      { name: "GitHub", iconPath: "/technology/github.png", color: "#455A64" },
      { name: "GitLab", iconPath: "/technology/gitlab.svg", color: "#FC6D26" },
      { name: "Bitbucket", iconPath: "/technology/bitbucket.png", color: "#2684FF" },
      { name: "VS Code", iconPath: "/technology/vscode.webp", color: "#007ACC" },
      { name: "Antigravity IDE", iconPath: "/technology/antigravity.png", color: "#3887F2" },
      { name: "Cursor", iconPath: "/technology/cursor.png", color: "#424242" },
      { name: "Slack", iconPath: "/technology/slack.webp", color: "#4A154B" },
      { name: "Teams", iconPath: "/technology/teams.png", color: "#6264A7" },
      { name: "JIRA", iconPath: "/technology/jira.png", color: "#0052CC" },
      { name: "Trello", iconPath: "/technology/trello.png", color: "#2481FC" },
      { name: "Figma", iconPath: "/technology/figma.webp", color: "#F24E1E" },
      { name: "Google Workspace", iconPath: "/technology/google-workspace.png", color: "#59C36A" },
    ],
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    title: "Develop Generative AI Applications: Get Started",
    issuer: "IBM",
    date: "Issued Apr 2026",
    id: "E542S9F02JE1",
    link: "https://www.coursera.org/account/accomplishments/records/E542S9F02JE1",
  },
  {
    title: "Generative AI: Foundation Models and Platforms",
    issuer: "IBM",
    date: "Issued Apr 2026",
    id: "XASR5KK2TRQB",
    link: "https://www.coursera.org/account/accomplishments/records/XASR5KK2TRQB",
  },
  {
    title: "Generative AI: Prompt Engineering Basics",
    issuer: "IBM",
    date: "Issued Apr 2026",
    id: "6A0A0DV9TV1V",
    link: "https://www.coursera.org/account/accomplishments/records/6A0A0DV9TV1V",
  },
  {
    title: "Generative AI: Introduction and Applications",
    issuer: "IBM",
    date: "Issued Apr 2026",
    id: "WV6N084TXRKA",
    link: "https://www.coursera.org/account/accomplishments/records/WV6N084TXRKA",
  },
  {
    title: "Software Engineering: Modeling Software Systems using UML",
    issuer: "Coursera",
    date: "Issued Oct 2025",
    id: "G8JS07EAAD64",
    link: "https://coursera.org/verify/G8JS07EAAD64",
  },
  {
    title: "Software Engineering: Software Design and Project Management",
    issuer: "Coursera",
    date: "Issued Oct 2025",
    id: "52ABQGIVL4AR",
    link: "https://www.coursera.org/account/accomplishments/records/52ABQGIVL4AR",
  },
  {
    title: "Software Engineering: Implementation and Testing",
    issuer: "Coursera",
    date: "Issued Oct 2025",
    id: "QDY94JLP6PRB",
    link: "https://www.coursera.org/account/accomplishments/records/QDY94JLP6PRB",
  },
  {
    title: "Technical Partner Certificate II",
    issuer: "AppliedAI",
    date: "Issued Jul 2025",
    id: "687f7a808bce9dd9950d42a8",
    link: "https://mycourse.app/7H0HzIgg6C6R6Rqt7",
  },
  {
    title: "Professional Scrum Master I",
    issuer: "Scrum.org",
    date: "Issued Apr 2024",
    id: "1087388",
    link: "https://bit.ly/3ZeNwtD",
  },
];

export const PHILOSOPHIES: Philosophy[] = [
  {
    iconName: "Cpu",
    title: "Performance-First",
    description: "Writing lightweight, clean, and highly optimized code to deliver sub-second response times and excellent UX.",
  },
  {
    iconName: "ShieldCheck",
    title: "Secure-by-Default",
    description: "Implementing strict data validation, secure authentication flows, and bulletproof server configurations.",
  },
  {
    iconName: "Layers",
    title: "Scalable Architecture",
    description: "Designing components and databases with modularity in mind to support seamless future updates and high-load traffic.",
  },
  {
    iconName: "Compass",
    title: "Strict Scoping & Delivery",
    description: "Aligning on clear constraints, building with absolute transparency, and sticking to agreed schedules.",
  },
];
