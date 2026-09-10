import { CONTACT_INFO, SOCIALS } from "@/constants/navigation";

export const SITE_URL = "https://arielbatoon.com";

const telephone = CONTACT_INFO.phone.replace(/\s+/g, "");

export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Lahug",
  addressLocality: "Cebu City",
  addressRegion: "Cebu",
  postalCode: "6000",
  addressCountry: "PH",
} as const;

export const person = {
  "@type": "Person",
  name: "Ariel Batoon",
  jobTitle: "Full-Stack Software Engineer",
  url: SITE_URL,
  email: CONTACT_INFO.email,
  telephone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cebu City",
    addressRegion: "Cebu",
    addressCountry: "PH",
  },
  sameAs: SOCIALS.map((social) => social.href.split("?")[0]),
} as const;

type JsonLdOffer = {
  name: string;
  description: string | null;
};

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ariel Batoon — Software Engineer",
    image: `${SITE_URL}/icons/ab-logo-text-dark.png`,
    url: SITE_URL,
    telephone,
    priceRange: "$$$",
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.3312,
      longitude: 123.8986,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: person.sameAs,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Cebu City" },
      { "@type": "Country", name: "Philippines" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Singapore" },
    ],
  };
}

export function aboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      ...person,
      url: `${SITE_URL}/about`,
      knowsAbout: [
        "Software Engineering",
        "Full-Stack Web Development",
        "React Native Mobile App Development",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Database Scoping",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Bachelor of Science in Information Technology (Software Engineering)",
      },
    },
  };
}

export function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: person,
  };
}

export function servicesJsonLd(offers: JsonLdOffer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Software Development Services Cebu",
    provider: person,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Engineering Packages",
      itemListElement: offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description,
        },
      })),
    },
  };
}

export function articlesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ariel Batoon Engineering Insights",
    description: "Technical insights on Next.js, database designs, and frontend rendering performance.",
    publisher: person,
  };
}

export function worksJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Ariel Batoon Software Portfolio",
    author: person,
    description: "A collection of SaaS products, high-performance web systems, and mobile applications developed for clients globally.",
  };
}

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

type SeoFields = {
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

export function webPageJsonLd({
  name,
  description,
  path,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "ContactPage" | "AboutPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "Ariel Batoon",
      url: SITE_URL,
    },
    author: person,
  };
}

export function bookJsonLd() {
  return {
    ...webPageJsonLd({
      name: "Book a Free 30-Min Discovery Call",
      description:
        "Select a convenient time on the calendar to discuss your project, technical requirements, or potential collaborations with Ariel Batoon.",
      path: "/book",
    }),
    mainEntity: {
      "@type": "Service",
      name: "Discovery Call",
      description: "Free 30-minute project discovery and scoping call.",
      provider: person,
    },
  };
}

export function articleJsonLd(article: {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  date: string;
  author: string;
  seo?: SeoFields | null;
}) {
  const url = article.seo?.canonicalUrl || `${SITE_URL}/article/${article.slug}`;
  const image = article.seo?.ogImage || article.imageSrc;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: person,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(url),
    },
    url: absoluteUrl(url),
  };
}

export function workJsonLd(project: {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  tags: string[];
  seo?: SeoFields | null;
  caseStudy?: {
    client?: string;
    liveUrl?: string;
  };
}) {
  const url = project.seo?.canonicalUrl || `${SITE_URL}/work/${project.slug}`;
  const image = project.seo?.ogImage || project.imageSrc;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: image ? absoluteUrl(image) : undefined,
    url: absoluteUrl(url),
    author: person,
    keywords: project.tags.join(", "),
    ...(project.caseStudy?.client ? { about: project.caseStudy.client } : {}),
    ...(project.caseStudy?.liveUrl ? { sameAs: [project.caseStudy.liveUrl] } : {}),
  };
}

export function serviceDetailJsonLd(service: {
  name: string;
  slug: string;
  description: string;
  price: number;
  deliveryTime: string;
  imageSrc?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: person,
    image: service.imageSrc ? absoluteUrl(service.imageSrc) : undefined,
    url: `${SITE_URL}/service/${service.slug}`,
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "PHP",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/service/${service.slug}/checkout`,
      description: `${service.deliveryTime} delivery`,
    },
  };
}

export function serviceCheckoutJsonLd(service: { name: string; slug: string }) {
  return webPageJsonLd({
    name: `Checkout - ${service.name}`,
    description: `Complete your booking for the ${service.name} package.`,
    path: `/service/${service.slug}/checkout`,
  });
}
