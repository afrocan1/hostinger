import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function CyberpanelHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Cyber Panel Hosting - Hostier"
      eyebrow="VPS"
      title="Cyber Panel Hosting"
      subtitle="Manage your server through a free, open-source control panel running on LiteSpeed — no cPanel license required."
      plans={[
        {
          name: "CP Starter",
          tagline: "For your first control-panel VPS",
          price: 899,
          yearlyPrice: "₹8,999",
          buttonText: "Get Started",
          features: [
            "2 vCPU",
            "4 GB RAM",
            "80 GB NVMe SSD",
            "CyberPanel Pre-installed",
          ],
          includes: [
            "Also included",
            "OpenLiteSpeed Web Server",
            "Free SSL",
          ],
        },
        {
          name: "CP Business",
          tagline: "For agencies managing client sites",
          price: 1599,
          yearlyPrice: "₹15,999",
          featured: true,
          buttonText: "Get Started",
          features: [
            "4 vCPU",
            "8 GB RAM",
            "160 GB NVMe SSD",
            "CyberPanel Pre-installed",
          ],
          includes: [
            "Also included",
            "LiteSpeed Web Server",
            "Free SSL",
            "Free Daily Backups",
          ],
        },
        {
          name: "CP Pro",
          tagline: "For large-scale multi-tenant hosting",
          price: 2999,
          yearlyPrice: "₹29,999",
          buttonText: "Get Started",
          features: [
            "8 vCPU",
            "16 GB RAM",
            "320 GB NVMe SSD",
            "CyberPanel Pre-installed",
          ],
          includes: [
            "Also included",
            "LiteSpeed Web Server",
            "Free SSL",
            "Free Daily Backups",
            "24/7 Priority Support",
          ],
        },
      ]}
    />
  );
}
