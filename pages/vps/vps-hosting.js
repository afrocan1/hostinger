import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function VpsHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="VPS Hosting - Hostier"
      eyebrow="VPS"
      title="VPS Hosting"
      subtitle="Dedicated resources, full root access, and predictable performance for projects that have outgrown shared hosting."
      plans={[
        {
          name: "VPS 1",
          tagline: "For small apps and staging environments",
          price: 699,
          yearlyPrice: "₹6,999",
          buttonText: "Get Started",
          features: ["2 vCPU", "4 GB RAM", "80 GB NVMe SSD", "4 TB Bandwidth"],
          includes: [
            "Also included",
            "Full Root Access",
            "Free Weekly Backups",
          ],
        },
        {
          name: "VPS 2",
          tagline: "For production apps and small teams",
          price: 1299,
          yearlyPrice: "₹12,999",
          featured: true,
          buttonText: "Get Started",
          features: ["4 vCPU", "8 GB RAM", "160 GB NVMe SSD", "8 TB Bandwidth"],
          includes: [
            "Also included",
            "Full Root Access",
            "Free Daily Backups",
            "Priority Support",
          ],
        },
        {
          name: "VPS 3",
          tagline: "For high-traffic and resource-heavy workloads",
          price: 2499,
          yearlyPrice: "₹24,999",
          buttonText: "Get Started",
          features: ["8 vCPU", "16 GB RAM", "320 GB NVMe SSD", "16 TB Bandwidth"],
          includes: [
            "Also included",
            "Full Root Access",
            "Free Daily Backups",
            "24/7 Priority Support",
            "Dedicated IP",
          ],
        },
      ]}
    />
  );
}
