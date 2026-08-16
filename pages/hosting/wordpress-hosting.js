import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function WordpressHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="WordPress Hosting - Hostier"
      eyebrow="Hosting"
      title="WordPress Hosting, Optimized End to End"
      subtitle="One-click installs, LiteSpeed caching, and automatic updates — managed hosting built specifically for WordPress."
      stats={[
        { value: "1-Click", label: "WordPress install" },
        { value: "99.9%", label: "uptime" },
        { value: "24/7", label: "support" },
      ]}
      plans={[
        {
          name: "WP Basic",
          tagline: "For a single WordPress site",
          price: "₹99.00",
          period: "mo",
          mrp: "₹399",
          savePercent: "75%",
          renewNote: "₹199.00/mo when you renew",
          features: ["1 Site", "10 GB SSD Storage", "Free SSL", "Auto Updates"],
        },
        {
          name: "WP Plus",
          tagline: "For multiple sites",
          price: "₹199.00",
          period: "mo",
          mrp: "₹599",
          savePercent: "67%",
          renewNote: "₹349.00/mo when you renew",
          featured: true,
          features: [
            "5 Sites",
            "50 GB SSD Storage",
            "Free SSL",
            "Auto Updates",
            "Daily Backups",
          ],
        },
        {
          name: "WP Agency",
          tagline: "For managing client sites",
          price: "₹399.00",
          period: "mo",
          mrp: "₹999",
          savePercent: "60%",
          renewNote: "₹699.00/mo when you renew",
          features: [
            "Unlimited Sites",
            "150 GB SSD Storage",
            "Free SSL",
            "Auto Updates",
            "Daily Backups",
            "Staging Environments",
          ],
        },
      ]}
      perks={[
        {
          icon: "/assets/icons/One-Click WordPress Installation.svg",
          label: "1-Click WordPress Install",
        },
        {
          icon: "/assets/icons/LiteSpeed Cache Plugin.svg",
          label: "LiteSpeed Cache Plugin",
        },
        {
          icon: "/assets/icons/eCommerce Optimization.svg",
          label: "eCommerce Optimization",
        },
        {
          icon: "/assets/icons/Auto Script Installer.svg",
          label: "Auto Script Installer",
        },
      ]}
    />
  );
}
