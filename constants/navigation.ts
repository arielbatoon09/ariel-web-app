export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterService {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Works", href: "/works" },
  { label: "Articles", href: "/articles" }
];

export const SOCIALS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Read.cv", href: "https://read.cv" }
];

export const FOOTER_SERVICES: FooterService[] = [
  { label: "Product Design", href: "/services" },
  { label: "Frontend Engineering", href: "/services" },
  { label: "Full-Stack Development", href: "/services" },
  { label: "Design Systems", href: "/services" },
  { label: "Technical Consulting", href: "/services" }
];

export const CONTACT_INFO = {
  phone: "+63 945 568 4578",
  whatsapp: "https://wa.me/639455684578",
  whatsappLabel: "+63 945 568 4578",
  location: "Zamboanga City, Philippines"
};
