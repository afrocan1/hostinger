import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function WebHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Web Hosting - Hostier"
      eyebrow="Hosting"
      title="Web Hosting Built to Scale With You"
      subtitle="Fast, secure hosting for personal sites and growing businesses — powered by LiteSpeed and optimized for WordPress."
      stats={[
        { value: "1,278,670+", label: "websites hosted" },
        { value: "99.9%", label: "uptime" },
        { value: "24/7", label: "support" },
      ]}
      plans={[
        {
          name: "Single Web Hosting",
          tagline: "Ideal solution for beginners",
          price: "₹69.00",
          period: "mo",
          mrp: "₹329",
          savePercent: "79%",
          renewNote: "₹159.00/mo when you renew",
          features: [
            "1 Website",
            "50 GB SSD Storage",
            "10,000 Visits Monthly",
            "1 Email Account",
          ],
        },
        {
          name: "Premium Web Hosting",
          tagline: "Perfect package for personal websites",
          price: "₹149.00",
          period: "mo",
          mrp: "₹329",
          savePercent: "79%",
          renewNote: "₹249.00/mo when you renew",
          featured: true,
          features: [
            "100 Websites",
            "100 GB SSD Storage",
            "25,000 Visits Monthly",
            "Free Email Account",
            "Unlimited Bandwidth",
          ],
        },
        {
          name: "Business Web Hosting",
          tagline: "Optimized for small and medium businesses",
          price: "₹249.00",
          period: "mo",
          mrp: "₹329",
          savePercent: "79%",
          renewNote: "₹499.00/mo when you renew",
          features: [
            "100 Websites",
            "200 GB SSD Storage",
            "100,000 Visits Monthly",
            "Free Email Account",
            "Unlimited Bandwidth",
            "Unlimited Database",
          ],
        },
      ]}
      perks={[
        { icon: "/assets/icons/Free SSL.svg", label: "Free SSL" },
        { icon: "/assets/icons/Free Migration.svg", label: "Free Migration" },
        { icon: "/assets/icons/PHP Speed Boost.svg", label: "PHP Speed Boost" },
        {
          icon: "/assets/icons/247365 Tech Support.svg",
          label: "24/7/365 Tech Support",
        },
      ]}
    />
  );
}
