"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/common/connect-dialog";
import Image from "next/image";
import Link from "next/link";
import { CtaSection } from "@/components/common/cta-section";
import { 
  ArrowUpRight, 
  Briefcase, 
  Award, 
  Code2, 
  GraduationCap, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Compass,
  Users,
  Globe,
  Lock,
  Key,
  FileKey,
  ShieldAlert,
  FileCheck,
  BrainCircuit,
  Bot,
  Database,
  ChevronDown
} from "lucide-react";

// Experience Data
const EXPERIENCES = [
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

// Tech Stack Data
const lucideIconMap: Record<string, React.ComponentType<any>> = {
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
  Database
};

interface Skill {
  name: string;
  color: string;
  slug?: string;
  lucideIcon?: string;
  iconUrl?: string;
}

const TECH_STACK: { category: string; skills: Skill[] }[] = [
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

// Certificates Data
const CERTIFICATES = [
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

// Engineering Philosophy Data
const PHILOSOPHIES = [
  {
    icon: Cpu,
    title: "Performance-First",
    description: "Writing lightweight, clean, and highly optimized code to deliver sub-second response times and excellent UX."
  },
  {
    icon: ShieldCheck,
    title: "Secure-by-Default",
    description: "Implementing strict data validation, secure authentication flows, and bulletproof server configurations."
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description: "Designing components and databases with modularity in mind to support seamless future updates and high-load traffic."
  },
  {
    icon: Compass,
    title: "Strict Scoping & Delivery",
    description: "Aligning on clear constraints, building with absolute transparency, and sticking to agreed schedules."
  }
];

export function AboutDetails() {
  const [activeCategory, setActiveCategory] = useState("Frontend");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <Section id="about-details" containerClassName="pt-4 md:pt-6 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-16">
        
        {/* Header Title */}
        <SectionHeading
          label="About Me"
          title="Ariel Batoon. Software Engineer & Product Builder."
          description="A detailed look at my experience, technical skillset, philosophy, and professional background."
        />

        {/* Top Profile Intro Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          
          {/* Profile Image Column (Left) */}
          <div className="lg:col-span-5 relative group flex flex-col justify-stretch">
            <div className="absolute inset-[-8px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-none pointer-events-none group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-300 z-10" />
            <div className="absolute top-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            <div className="absolute bottom-[-8px] right-[-8px] select-none pointer-events-none text-[10px] font-light text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:scale-150 transition-all duration-300 z-20">
              +
            </div>
            
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-full min-h-[400px] overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none flex-1">
              <Image
                src="/ariel-batoon-profile-day.png"
                alt="Ariel Batoon Profile (Light Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover block dark:hidden"
                priority
              />
              <Image
                src="/ariel-batoon-profile-night.png"
                alt="Ariel Batoon Profile (Dark Mode)"
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover hidden dark:block"
                priority
              />
            </div>
          </div>

          {/* Biography Content Column (Right) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground font-sans tracking-tight">
                Crafting robust software architectures with absolute clarity.
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                I am a Full-Stack Engineer specializing in constructing scalable, modern digital environments. Over the past 3+ years, I have worked across diverse paradigms, engineering frontend systems, responsive web dashboards, relational and non-relational database systems, and mobile applications.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                My approach is rooted in collaborative engineering. I act as an extension of a founder's vision—translating nebulous product ideas into comprehensive technical specifications, implementing features on schedule, and maintaining high code standards.
              </p>
            </div>

            {/* Core Values / Professional Highlights - Clean Intersecting Cross Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 relative mt-6 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 gap-y-6 sm:gap-y-0">
              {/* Intersection Center Plus (+) Symbol */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-[11px] font-light text-neutral-400 dark:text-neutral-500 bg-background px-1 hidden sm:block z-10">
                +
              </div>

              {/* Stat 1: 3+ Years */}
              <div className="sm:border-r sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  3+ Years Experience
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Active engineering across both corporate departments and independent freelance products.
                </p>
              </div>

              {/* Stat 2: 20+ Projects */}
              <div className="sm:border-b sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pb-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  20+ Completed Projects
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Successfully delivering full-stack platforms, custom systems, and mobile applications.
                </p>
              </div>

              {/* Detail 3: Full-Stack */}
              <div className="sm:border-r sm:border-dashed sm:border-neutral-200 sm:dark:border-neutral-800 pt-6 sm:pr-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Full-Stack Architecture
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Engineering secure backends, robust database structures, and snappy frontend interfaces.
                </p>
              </div>

              {/* Detail 4: Transparency */}
              <div className="pt-6 sm:pl-6 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution & Transparency
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Locking down project scope, holding weekly syncs, and deploying high-uptime software.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-8 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <Briefcase className="size-5 text-neutral-400" />
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">Work Experience</h3>
          </div>
          
          <div className="relative border-l border-dashed border-neutral-300 dark:border-neutral-700 ml-3 pl-8 space-y-12">
            {EXPERIENCES.map((exp, index) => {
              const isPresent = exp.period.toLowerCase().includes("present");
              return (
                <div key={index} className="relative group space-y-4">
                  {/* Timeline node marker - perfectly centered on line */}
                  <span className={cn(
                    "absolute -left-10 top-1 size-4 flex items-center justify-center text-[8px] font-bold select-none transition-all duration-300 border border-dashed",
                    isPresent 
                      ? "border-neutral-900 dark:border-neutral-100 text-neutral-50 dark:text-neutral-950 bg-neutral-900 dark:bg-neutral-100 border-solid scale-105"
                      : "bg-background border-neutral-400 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500",
                    "group-hover:border-neutral-900 dark:group-hover:border-neutral-100 group-hover:text-foreground group-hover:bg-neutral-50 dark:group-hover:bg-neutral-900 group-hover:scale-110"
                  )}>
                    +
                  </span>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h4 className="text-base font-bold text-foreground font-sans group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-250">{exp.company}</h4>
                      </div>
                      {isPresent ? (
                        <span className="text-[10px] font-mono border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-background px-2.5 py-0.5 uppercase tracking-wider font-bold select-none transition-all duration-300">
                          Present
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-neutral-500 uppercase w-fit select-none">
                          {exp.period}
                        </span>
                      )}
                    </div>

                    {/* Roles layout without duplicate vertical lines or boxes */}
                    <div className="space-y-6 pt-2">
                      {exp.roles.map((role, rIdx) => (
                        <div 
                          key={rIdx} 
                          className={cn(
                            "space-y-3 relative",
                            rIdx > 0 && "border-t border-dashed border-neutral-250 dark:border-neutral-800 pt-6 mt-6"
                          )}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-sm font-bold text-foreground/80 font-sans">{role.title}</h5>
                            <span className="text-[9px] font-mono text-neutral-450">{role.period}</span>
                          </div>
                          
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans max-w-3xl">
                            {role.description}
                          </p>
                          
                          {/* Highlights list with small bullet points matching description color */}
                          <div className="space-y-1.5 pl-1.5">
                            {role.highlights.map((highlight, hIdx) => (
                              <div 
                                key={hIdx} 
                                className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed font-sans"
                              >
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="space-y-8 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Code2 className="size-5 text-neutral-400" />
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">Technical Skillset</h3>
            </div>
            
            {/* Category Selector Dropdown */}
            <div className="relative inline-block text-left z-30">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 px-3 py-2 text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-foreground hover:border-neutral-450 cursor-pointer min-w-[200px] uppercase tracking-wider transition-colors duration-200"
              >
                <span>Category: {activeCategory}</span>
                <ChevronDown className={cn("size-3.5 text-neutral-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </button>
              
              {isDropdownOpen && (
                <>
                  {/* Invisible backdrop to close the dropdown when clicking outside */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1 w-full min-w-[200px] z-20 border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-md">
                    {TECH_STACK.map((group) => (
                      <button
                        key={group.category}
                        onClick={() => {
                          setActiveCategory(group.category);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-[10px] font-mono hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors uppercase tracking-wider cursor-pointer border-b border-dashed border-neutral-100 last:border-0 dark:border-neutral-850",
                          activeCategory === group.category
                            ? "text-foreground font-bold bg-neutral-100/50 dark:bg-neutral-900/80"
                            : "text-neutral-500 hover:text-foreground"
                        )}
                      >
                        {group.category}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Compact Grid of Interactive Tech Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TECH_STACK.find((group) => group.category === activeCategory)?.skills.map((skill, idx) => {
              const LucideIconComponent = skill.lucideIcon ? lucideIconMap[skill.lucideIcon] : null;
              
              return (
                <div
                  key={idx}
                  className="group relative flex items-center gap-2.5 p-2.5 border border-dashed border-neutral-250 dark:border-neutral-750 bg-neutral-100/30 dark:bg-neutral-800/10 hover:bg-white dark:hover:bg-neutral-900/50 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    "--hover-border": skill.color,
                  } as React.CSSProperties}
                >
                  {/* Subtle Border Glow on Hover */}
                  <div 
                    className="absolute inset-0 border border-dashed border-transparent group-hover:border-[var(--hover-border)] transition-colors duration-300 pointer-events-none" 
                  />
                  
                  {/* Tech Icon Container */}
                  <div className="size-5 shrink-0 flex items-center justify-center relative">
                    {skill.iconUrl ? (
                      <img
                        src={skill.iconUrl}
                        alt={skill.name}
                        className="size-4.5 object-contain transition-all duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : skill.slug ? (
                      <img
                        src={`https://cdn.simpleicons.org/${skill.slug}`}
                        alt={skill.name}
                        className="size-4.5 object-contain filter dark:brightness-95 transition-all duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : LucideIconComponent ? (
                      <LucideIconComponent 
                        className="size-4.5 transition-all duration-300 group-hover:scale-110" 
                        style={{ color: skill.color }} 
                      />
                    ) : (
                      <Code2 className="size-4.5 text-neutral-400" />
                    )}
                  </div>

                  {/* Tech Name */}
                  <span className="text-[10px] font-mono truncate text-neutral-600 dark:text-neutral-355 group-hover:text-foreground transition-colors">
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engineering Philosophy */}
        <div className="space-y-8 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <Cpu className="size-5 text-neutral-400" />
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">Engineering Philosophy</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PHILOSOPHIES.map((phi, idx) => {
              const Icon = phi.icon;
              return (
                <div key={idx} className="border border-dashed border-neutral-300 dark:border-neutral-700 p-6 space-y-3 flex items-start gap-4">
                  <div className="p-2 border border-dashed border-neutral-300 dark:border-neutral-700 shrink-0">
                    <Icon className="size-5 text-neutral-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold font-sans text-foreground">{phi.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">{phi.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="space-y-8 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-neutral-400" />
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">Certificates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATES.map((cert, idx) => (
              <Link 
                key={idx} 
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 p-6 bg-neutral-50/20 dark:bg-neutral-900/10 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/30 space-y-3 relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold font-sans text-foreground group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200">{cert.title}</h4>
                    <p className="text-xs text-neutral-400 font-mono">{cert.issuer}</p>
                  </div>
                  <span className="text-[9px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-900 dark:group-hover:border-neutral-105 px-2 py-0.5 text-neutral-400 group-hover:text-foreground select-none uppercase transition-colors duration-300">
                    CERT
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-3 group-hover:border-neutral-350 dark:group-hover:border-neutral-750 transition-colors duration-300">
                  <span>{cert.date}</span>
                  <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">ID: {cert.id}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-8 pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <GraduationCap className="size-5 text-neutral-400" />
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">Education</h3>
          </div>

          <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-6 max-w-3xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <h4 className="text-sm font-bold text-foreground font-sans">Bachelor of Science in Information Technology</h4>
                <p className="text-xs text-neutral-400 font-mono tracking-wide">Specialization in Software Engineering</p>
              </div>
              <span className="text-[10px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-neutral-500 uppercase w-fit">
                Graduated
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-2">
              Focus on systems analysis, database design structures, object-oriented concepts, and project management. Completed advanced electives in secure application architecture and web-based solutions.
            </p>
          </div>
        </div>
        
        {/* CTA Contact Footer */}
        <CtaSection />

      </div>
    </Section>
  );
}
