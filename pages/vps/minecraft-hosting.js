import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function MinecraftHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Minecraft Server Hosting - Hostier"
      eyebrow="VPS"
      title="Minecraft Server Hosting"
      subtitle="Low-latency, DDoS-protected servers built for smooth gameplay — instant setup, no plugins to configure manually."
      plans={[
        {
          name: "Dirt",
          tagline: "For small friend groups",
          price: 349,
          yearlyPrice: "₹3,499",
          buttonText: "Get Started",
          features: ["Up to 10 Players", "4 GB RAM", "20 GB NVMe SSD"],
          includes: [
            "Also included",
            "DDoS Protection",
            "1-Click Modpack Install",
          ],
        },
        {
          name: "Iron",
          tagline: "For active communities",
          price: 699,
          yearlyPrice: "₹6,999",
          featured: true,
          buttonText: "Get Started",
          features: ["Up to 30 Players", "8 GB RAM", "40 GB NVMe SSD"],
          includes: [
            "Also included",
            "DDoS Protection",
            "1-Click Modpack Install",
            "Automated Backups",
          ],
        },
        {
          name: "Diamond",
          tagline: "For large public servers",
          price: 1299,
          yearlyPrice: "₹12,999",
          buttonText: "Get Started",
          features: ["Up to 100 Players", "16 GB RAM", "80 GB NVMe SSD"],
          includes: [
            "Also included",
            "DDoS Protection",
            "1-Click Modpack Install",
            "Automated Backups",
            "Priority Support",
          ],
        },
      ]}
    />
  );
}
