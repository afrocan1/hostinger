import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function CloudHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Cloud Hosting - Hostier"
      eyebrow="Hosting"
      title="Cloud Hosting for High-Traffic Projects"
      subtitle="Dedicated resources and auto-scaling infrastructure built for large-scale, mission-critical websites."
      stats={[
        { value: "99.9%", label: "uptime SLA" },
        { value: "4x", label: "faster under load" },
        { value: "24/7", label: "priority support" },
      ]}
      plans={[
        {
          name: "Cloud Startup",
          tagline: "For apps finding their footing",
          price: "₹699.00",
          period: "mo",
          mrp: "₹1,499",
          savePercent: "53%",
          renewNote: "₹999.00/mo when you renew",
          features: ["2 vCPU", "4 GB RAM", "80 GB SSD", "Auto Scaling"],
        },
        {
          name: "Cloud Growth",
          tagline: "For scaling products",
          price: "₹1,299.00",
          period: "mo",
          mrp: "₹2,499",
          savePercent: "48%",
          renewNote: "₹1,999.00/mo when you renew",
          featured: true,
          features: [
            "4 vCPU",
            "8 GB RAM",
            "160 GB SSD",
            "Auto Scaling",
            "Load Balancer",
          ],
        },
        {
          name: "Cloud Enterprise",
          tagline: "For mission-critical workloads",
          price: "₹2,499.00",
          period: "mo",
          mrp: "₹4,999",
          savePercent: "50%",
          renewNote: "₹3,999.00/mo when you renew",
          features: [
            "8 vCPU",
            "16 GB RAM",
            "320 GB SSD",
            "Auto Scaling",
            "Load Balancer",
            "24/7 Priority Support",
          ],
        },
      ]}
      perks={[
        { icon: "/assets/icons/DDoS Protection.svg", label: "DDoS Protection" },
        {
          icon: "/assets/icons/Access Management.svg",
          label: "Access Management",
        },
        {
          icon: "/assets/icons/Automated backups.svg",
          label: "Automated Backups",
        },
        { icon: "/assets/icons/99.svg", label: "99.9% Uptime Guarantee" },
      ]}
    />
  );
}
