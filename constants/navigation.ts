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
  { label: "Articles", href: "/articles" },
];

export const SOCIALS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/arielbatoon09" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/arielbatoon" },
  { label: "Facebook", href: "https://www.facebook.com/itsarielbatoon" },
];

export const FOOTER_SERVICES: FooterService[] = [
  { label: "Product Design", href: "/services" },
  { label: "Frontend Engineering", href: "/services" },
  { label: "Full-Stack Development", href: "/services" },
  { label: "Design Systems", href: "/services" },
  { label: "Technical Consulting", href: "/services" },
];

export const CONTACT_INFO = {
  email: "info.arielbatoon@gmail.com",
  phone: "+63 967 421 4639",
  whatsapp: "https://wa.me/639674214639",
  whatsappLabel: "+63 967 421 4639",
  location: "Cebu City, Philippines",
};
