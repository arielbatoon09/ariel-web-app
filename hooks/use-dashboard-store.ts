import { create } from "zustand";
import { ALL_PROJECTS } from "@/constants/projects";
import { ALL_ARTICLES } from "@/constants/articles";
import type { Category, Project, Article, Service, Order, Transaction, Customer } from "@/lib/schemas/dashboard";

interface DashboardState {
  works: Project[];
  articles: Article[];
  categories: Category[];
  services: Service[];
  orders: Order[];
  transactions: Transaction[];
  customers: Customer[];

  // Works Actions
  addWork: (project: Project) => void;
  updateWork: (project: Project) => void;
  deleteWork: (id: string) => void;
  toggleWorkStatus: (id: string) => void;

  // Articles Actions
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  toggleArticleStatus: (id: string) => void;

  // Categories Actions
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;

  // Services Actions
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  // Orders Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;

  // Transactions Actions
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: Transaction["status"]) => void;

  // Customers State & Actions
  selectedCustomerId: string | null;
  isDetailsOpen: boolean;
  isAddOpen: boolean;
  isLoadingCustomers: boolean;
  addCustomer: (customer: Customer) => void;
  setCustomers: (customers: Customer[]) => void;
  updateCustomerRole: (id: string, role: Customer["role"]) => void;
  toggleCustomerBlockStatus: (id: string) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomerId: (id: string | null) => void;
  setIsDetailsOpen: (open: boolean) => void;
  setIsAddOpen: (open: boolean) => void;
  setIsLoadingCustomers: (loading: boolean) => void;
}

// Prepopulated Categories
const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Web / SaaS", slug: "web-saas", target: "both" },
  { id: "cat-2", name: "Mobile Development", slug: "mobile-development", target: "works" },
  { id: "cat-3", name: "AI & Data Systems", slug: "ai-data-systems", target: "both" },
  { id: "cat-4", name: "Open Source", slug: "open-source", target: "works" },
  { id: "cat-5", name: "Engineering Insights", slug: "engineering", target: "articles" },
  { id: "cat-6", name: "UI/UX Design", slug: "design-systems", target: "both" },
];

// Prepopulated Services
const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    name: "Startup MVP Launch",
    description:
      "Validate your ideas with a fast-to-market, feature-complete Minimal Viable Product (MVP) designed to impress users and pitch to investors.",
    price: 150000,
    deliveryTime: "3 - 4 Weeks",
    features: [
      "Responsive Web App or Hybrid Mobile App",
      "User Authentication & Role Management (Supabase / Firebase)",
      "Essential Database & Schema Design",
      "Stripe / local payment provider integration",
      "Basic admin panel/dashboard for management",
    ],
    addOns: [
      { id: "addon-1", name: "Extra Mobile Build (iOS + Android)", price: 50000, description: "Build and publish to App Store and Google Play." },
      { id: "addon-2", name: "Analytics Dashboard", price: 25000, description: "Custom dashboards tracking conversion and telemetry metrics." },
    ],
  },
  {
    id: "srv-2",
    name: "Production Web App & SaaS",
    description:
      "A full-scale, secure, and highly optimized Software-as-a-Service (SaaS) web application ready for production, high user traffic, and operational scale.",
    price: 350000,
    deliveryTime: "6 - 8 Weeks",
    features: [
      "High-performance Next.js or React web application",
      "Complex relational database architecture (PostgreSQL, MySQL)",
      "Robust REST / GraphQL APIs and serverless endpoints",
      "Advanced administrative control deck and user dashboards",
      "Multi-tenant data isolation and role security",
    ],
    addOns: [
      { id: "addon-3", name: "Subscription Setup", price: 30000, description: "Advanced Stripe billing portals with usage metering." },
      { id: "addon-4", name: "Integration Pack", price: 45000, description: "Integrates Salesforce CRM, HubSpot, and custom Slack webhook alerts." },
    ],
  },
  {
    id: "srv-3",
    name: "AI Integration & Agents",
    description:
      "Inject intelligent capabilities into your workflow, including vector search engines, retrieval-augmented generation (RAG), and autonomous agents.",
    price: 200000,
    deliveryTime: "4 - 6 Weeks",
    features: [
      "Integration of Large Language Models (OpenAI, Gemini, Anthropic)",
      "Retrieval-Augmented Generation (RAG) for querying private documents",
      "Vector database setup & semantic indexing (Pinecone, pgvector)",
      "Deterministic fallback logic for structured JSON responses",
    ],
    addOns: [{ id: "addon-5", name: "Private Model Hosting", price: 60000, description: "Deploy local llama models securely on dedicated VPS." }],
  },
];

// Prepopulated Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    serviceId: "srv-1",
    customerName: "Juan Dela Cruz",
    customerEmail: "juan@example.com",
    status: "in-progress",
    addOnsSelected: ["addon-1"],
    totalAmount: 200000,
    createdAt: "2026-06-28",
  },
  {
    id: "ord-2",
    serviceId: "srv-2",
    customerName: "Samantha Miller",
    customerEmail: "samantha@startup.io",
    status: "pending",
    addOnsSelected: ["addon-3"],
    totalAmount: 380000,
    createdAt: "2026-07-04",
  },
  {
    id: "ord-3",
    serviceId: "srv-3",
    customerName: "Robert Chen",
    customerEmail: "robert@insight.corp",
    status: "completed",
    addOnsSelected: [],
    totalAmount: 200000,
    createdAt: "2026-05-15",
  },
];

// Prepopulated Transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    orderId: "ord-1",
    amount: 200000,
    status: "successful",
    paymentMethod: "Stripe Card",
    date: "2026-06-28 10:15 AM",
  },
  {
    id: "tx-2",
    orderId: "ord-2",
    amount: 380000,
    status: "pending",
    paymentMethod: "Bank Transfer",
    date: "2026-07-04 02:30 PM",
  },
  {
    id: "tx-3",
    orderId: "ord-3",
    amount: 200000,
    status: "successful",
    paymentMethod: "PayPal",
    date: "2026-05-15 11:00 AM",
  },
];

export const useDashboardStore = create<DashboardState>((set) => ({
  works: ALL_PROJECTS as Project[],
  articles: ALL_ARTICLES as Article[],
  categories: INITIAL_CATEGORIES,
  services: INITIAL_SERVICES,
  orders: INITIAL_ORDERS,
  transactions: INITIAL_TRANSACTIONS,

  // Works Actions
  addWork: (project) => set((state) => ({ works: [project, ...state.works] })),
  updateWork: (project) =>
    set((state) => ({
      works: state.works.map((w) => (w.id === project.id ? project : w)),
    })),
  deleteWork: (id) =>
    set((state) => ({
      works: state.works.filter((w) => w.id !== id),
    })),
  toggleWorkStatus: (id) =>
    set((state) => ({
      works: state.works.map((w) => (w.id === id ? { ...w, disabled: !w.disabled } : w)),
    })),

  // Articles Actions
  addArticle: (article) => set((state) => ({ articles: [article, ...state.articles] })),
  updateArticle: (article) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === article.id ? article : a)),
    })),
  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
  toggleArticleStatus: (id) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === id ? { ...a, disabled: !a.disabled } : a)),
    })),

  // Categories Actions
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  toggleCategoryStatus: (id) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, disabled: !c.disabled } : c)),
    })),

  // Services Actions
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  updateService: (service) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === service.id ? service : s)),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    })),
  toggleServiceStatus: (id) =>
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, disabled: !s.disabled } : s)),
    })),

  // Orders Actions
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),

  // Transactions Actions
  addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  // Customers State & Actions
  customers: [],
  selectedCustomerId: null,
  isDetailsOpen: false,
  isAddOpen: false,
  isLoadingCustomers: true,

  addCustomer: (customer) =>
    set((state) => ({
      customers: [customer, ...state.customers],
    })),

  setCustomers: (customers) =>
    set(() => ({
      customers,
    })),

  updateCustomerRole: (id, role) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, role } : c)),
    })),

  toggleCustomerBlockStatus: (id) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, disabled: !c.disabled } : c)),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  setSelectedCustomerId: (id) => set(() => ({ selectedCustomerId: id })),
  setIsDetailsOpen: (open) => set(() => ({ isDetailsOpen: open })),
  setIsAddOpen: (open) => set(() => ({ isAddOpen: open })),
  setIsLoadingCustomers: (loading) => set(() => ({ isLoadingCustomers: loading })),
}));
