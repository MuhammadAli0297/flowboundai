export const navLinks = [
  { label: "Product", href: "/product" },
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
]

// Curated Services nav dropdown. `expand: true` gives that service a nested
// flyout of its capabilities; slugs are looked up against src/data/services.ts
// so labels/capability names stay in sync with the actual page content.
export const servicesMenu: { slug: string; expand: boolean }[] = [
  { slug: "inventory", expand: true },
  { slug: "supplier-management", expand: true },
  { slug: "autonomous", expand: true },
  { slug: "customer-service", expand: false },
  { slug: "quality-monitoring", expand: false },
]

export const footerLinks = {
  product: [
    { label: "What it is", href: "/product" },
    { label: "Services", href: "/services" },
    { label: "How it works", href: "/how-it-works" },
    { label: "vs. SAP", href: "/#sap" },
  ],
  company: [
    { label: "Blog", href: "/blog" },
    { label: "Who we serve", href: "/#smb" },
    { label: "Request a pilot", href: "/#cta" },
  ],
}
