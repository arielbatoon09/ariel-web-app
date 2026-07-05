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
  Compass
} from "lucide-react";

export const lucideIconMap: Record<string, React.ComponentType<any>> = {
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
  Compass
};

export interface Skill {
  name: string;
  color: string;
  slug?: string;
  lucideIcon?: string;
  iconUrl?: string;
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
    company: "Freelance & Independent Contracting",
    period: "2023 - Present",
    roles: [
      {
        title: "Lead Full-Stack Engineer / Consultant",
        period: "2023 - Present",
        description: "Partnering directly with startup founders and product teams to translate commercial objectives into premium technical specifications. Engineering high-performance full-stack web platforms, mobile application suites, and custom database integrations.",
        highlights: [
          "Successfully delivered 20+ projects, maintaining absolute transparency at every milestone.",
          "Architected responsive Next.js apps and cross-platform React Native/Expo apps.",
          "Optimized query performance and cloud costs using Supabase, PostgreSQL, and AWS."
        ]
      }
    ]
  },
  {
    company: "Tech Innovators Corp",
    period: "2020 - 2023",
    roles: [
      {
        title: "Senior Software Engineer",
        period: "2022 - 2023",
        description: "Led the front-end team in designing and building enterprise SaaS dashboard interfaces. Established standard linting rules, component design systems, and robust API integration layers.",
        highlights: [
          "Boosted page load speeds by 40% using server component streaming and advanced asset optimization.",
          "Mentored junior developers and introduced modern state management practices.",
          "Managed CI/CD deployment pipelines using GitHub Actions and AWS."
        ]
      },
      {
        title: "Software Engineer",
        period: "2020 - 2022",
        description: "Built and maintained dynamic client web applications, e-commerce stores, and backend RESTful APIs using Node.js, Express, and React.",
        highlights: [
          "Developed reusable UI component library reducing project bootstrap time by 30%.",
          "Integrated secure payment gateways and OAuth third-party authentications.",
          "Authored extensive API documentation to streamline third-party developer integrations."
        ]
      }
    ]
  }
];

export const TECH_STACK: { category: string; skills: Skill[] }[] = [
  {
    category: "Frontend",
    skills: [
      { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", slug: "typescript", color: "#3178C6" },
      { name: "React", slug: "react", color: "#61DAFB" },
      { name: "Next.js", slug: "nextdotjs", color: "#000000" },
      { name: "Vue.js", slug: "vuedotjs", color: "#4FC08D" },
      { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4" },
      { name: "SCSS", slug: "sass", color: "#CC6699" },
      { name: "Styled Components", slug: "styledcomponents", color: "#DB7093" },
      { name: "Vite", slug: "vite", color: "#646CFF" },
      { name: "Webpack", slug: "webpack", color: "#8DD6F9" },
      { name: "ESLint", slug: "eslint", color: "#4B32C3" },
      { name: "Prettier", slug: "prettier", color: "#F7B93E" }
    ]
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
      { name: "Python", slug: "python", color: "#3776AB" },
      { name: "Java", slug: "openjdk", color: "#F89820" },
      { name: "PHP", slug: "php", color: "#777BB4" },
      { name: "Express.js", slug: "express", color: "#000000" },
      { name: "NestJS", slug: "nestjs", color: "#E0234E" },
      { name: "FastAPI", slug: "fastapi", color: "#009688" },
      { name: "Spring Boot", slug: "springboot", color: "#6DB33F" },
      { name: "Laravel", slug: "laravel", color: "#FF2D20" },
      { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
      { name: "MySQL", slug: "mysql", color: "#4479A1" },
      { name: "MongoDB", slug: "mongodb", color: "#47A248" },
      { name: "DynamoDB", slug: "amazondynamodb", color: "#4053D6" },
      { name: "OAuth", slug: "oauth", color: "#EB5424" },
      { name: "JWT", slug: "jsonwebtokens", color: "#000000" },
      { name: "LDAP", lucideIcon: "Users", color: "#007ACC" },
      { name: "REST", lucideIcon: "Globe", color: "#4CAF50" },
      { name: "GraphQL", slug: "graphql", color: "#E10098" },
      { name: "gRPC", slug: "grpc", color: "#244C5A" },
      { name: "AWS Lambda", slug: "awslambda", color: "#FF9900" }
    ]
  },
  {
    category: "DevOps & Cloud",
    skills: [
      { name: "AWS", slug: "amazonwebservices", color: "#FF9900" },
      { name: "GCP", slug: "googlecloud", color: "#4285F4" },
      { name: "Azure", slug: "microsoftazure", color: "#0078D4" },
      { name: "GitHub Actions", slug: "githubactions", color: "#2088FF" },
      { name: "Jenkins", slug: "jenkins", color: "#D33833" },
      { name: "GitLab CI", slug: "gitlab", color: "#FC6D26" },
      { name: "Terraform", slug: "terraform", color: "#844FBA" },
      { name: "AWS CloudFormation", slug: "awscloudformation", color: "#FF9900" },
      { name: "Docker", slug: "docker", color: "#2496ED" },
      { name: "Kubernetes", slug: "kubernetes", color: "#326CE5" },
      { name: "Prometheus", slug: "prometheus", color: "#E6522C" },
      { name: "Grafana", slug: "grafana", color: "#F46800" },
      { name: "Datadog", slug: "datadog", color: "#632CA6" }
    ]
  },
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "TensorFlow", slug: "tensorflow", color: "#FF6F00" },
      { name: "PyTorch", slug: "pytorch", color: "#EE4C2C" },
      { name: "LangChain", slug: "langchain", color: "#1C3C3C" },
      { name: "Transformers", slug: "huggingface", color: "#FFD21E" },
      { name: "OpenAI", slug: "openai", color: "#412991" },
      { name: "Anthropic", slug: "anthropic", color: "#191919" },
      { name: "Mistral", slug: "mistral", color: "#FD7E14" },
      { name: "Hugging Face", slug: "huggingface", color: "#FFD21E" },
      { name: "LlamaIndex", lucideIcon: "Database", color: "#FF5722" },
      { name: "AutoGPT", lucideIcon: "Bot", color: "#00A86B" },
      { name: "Claude Code", slug: "anthropic", color: "#D97706" },
      { name: "Codex", slug: "openai", color: "#10B981" }
    ]
  },
  {
    category: "Security & Identity",
    skills: [
      { name: "AWS IAM", slug: "amazonaws", color: "#FF9900" },
      { name: "Azure AD", slug: "microsoftazure", color: "#0078D4" },
      { name: "Okta", slug: "okta", color: "#007DC1" },
      { name: "SAP CDC", slug: "sap", color: "#008FD3" },
      { name: "Auth0", slug: "auth0", color: "#EB5424" },
      { name: "Cognito", slug: "amazonaws", color: "#FF9900" },
      { name: "AES", lucideIcon: "Lock", color: "#10B981" },
      { name: "RSA", lucideIcon: "Key", color: "#3B82F6" },
      { name: "SHA", lucideIcon: "FileKey", color: "#F59E0B" },
      { name: "GDPR", lucideIcon: "ShieldCheck", color: "#003399" },
      { name: "SOC 2", lucideIcon: "ShieldAlert", color: "#6366F1" },
      { name: "ISO 27001", lucideIcon: "FileCheck", color: "#14B8A6" }
    ]
  },
  {
    category: "CMS & No-Code",
    skills: [
      { name: "WordPress", slug: "wordpress", color: "#21759B" },
      { name: "Strapi", slug: "strapi", color: "#2F2E8B" },
      { name: "Bubble", slug: "bubble", color: "#0000FF" },
      { name: "Webflow", slug: "webflow", color: "#146EF5" },
      { name: "Microsoft Power Platform", slug: "microsoft", color: "#0078D4" },
      { name: "n8n", slug: "n8n", color: "#FF6C37" }
    ]
  },
  {
    category: "Developer Tools",
    skills: [
      { name: "Git", slug: "git", color: "#F05032" },
      { name: "GitHub", slug: "github", color: "#181717" },
      { name: "GitLab", slug: "gitlab", color: "#FC6D26" },
      { name: "Bitbucket", slug: "bitbucket", color: "#0052CC" },
      { name: "VS Code", slug: "visualstudiocode", color: "#007ACC" },
      { name: "JetBrains IntelliJ", slug: "intellijidea", color: "#000000" },
      { name: "PyCharm", slug: "pycharm", color: "#000000" },
      { name: "Slack", slug: "slack", color: "#4A154B" },
      { name: "Discord", slug: "discord", color: "#5865F2" },
      { name: "Teams", slug: "microsoftteams", color: "#6264A7" },
      { name: "JIRA", slug: "jira", color: "#0052CC" },
      { name: "Trello", slug: "trello", color: "#0079BF" },
      { name: "ClickUp", slug: "clickup", color: "#7B68EE" }
    ]
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Issued 2024",
    id: "AWS-CCP-102",
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    date: "Issued 2023",
    id: "META-FED-993",
    link: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
  },
  {
    title: "Next.js & React Advanced Certification",
    issuer: "Vercel Ecosystem / Udemy",
    date: "Issued 2023",
    id: "VRC-ADV-884",
    link: "https://nextjs.org/learn"
  },
  {
    title: "Full-Stack Software Engineering Certificate",
    issuer: "Advanced Engineering Bootcamp",
    date: "Issued 2021",
    id: "FSE-BOOT-301",
    link: "https://www.freecodecamp.org/learn"
  },
  {
    title: "Google Project Management Certificate",
    issuer: "Google / Coursera",
    date: "Issued 2023",
    id: "GGL-PM-504",
    link: "https://www.coursera.org/professional-certificates/google-project-management"
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    date: "Issued 2022",
    id: "FCC-JS-832",
    link: "https://www.freecodecamp.org/certification/fcc1092a-3bdf-4ad4-aa3d-6ff3088b901a/javascript-algorithms-and-data-structures"
  },
  {
    title: "Certified ScrumMaster (CSM)",
    issuer: "Scrum Alliance",
    date: "Issued 2024",
    id: "CSM-601",
    link: "https://www.scrumalliance.org/get-certified"
  },
  {
    title: "UI/UX Design Specialist",
    issuer: "Interaction Design Foundation",
    date: "Issued 2023",
    id: "IDF-UIUX-212",
    link: "https://www.interaction-design.org/learning-paths/ui-designer"
  },
  {
    title: "MongoDB Certified Developer Associate",
    issuer: "MongoDB",
    date: "Issued 2024",
    id: "MDB-DEV-707",
    link: "https://learn.mongodb.com/pages/certification"
  }
];

export const PHILOSOPHIES: Philosophy[] = [
  {
    iconName: "Cpu",
    title: "Performance-First",
    description: "Writing lightweight, clean, and highly optimized code to deliver sub-second response times and excellent UX."
  },
  {
    iconName: "ShieldCheck",
    title: "Secure-by-Default",
    description: "Implementing strict data validation, secure authentication flows, and bulletproof server configurations."
  },
  {
    iconName: "Layers",
    title: "Scalable Architecture",
    description: "Designing components and databases with modularity in mind to support seamless future updates and high-load traffic."
  },
  {
    iconName: "Compass",
    title: "Strict Scoping & Delivery",
    description: "Aligning on clear constraints, building with absolute transparency, and sticking to agreed schedules."
  }
];
