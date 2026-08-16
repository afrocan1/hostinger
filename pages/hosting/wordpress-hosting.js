import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function WordpressHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="WordPress Hosting"
      eyebrow="Hosting"
      title="WordPress Hosting"
      subtitle="Optimized, managed solutions built specifically for WordPress."
      plans={[
        {
          name: "WP Basic",
          description: "For a single WordPress site",
          price: "$3.99",
          period: "mo",
          features: ["1 Site", "10GB SSD Storage", "Free SSL", "Auto Updates"],
        },
        {
          name: "WP Plus",
          description: "For multiple sites",
          price: "$6.99",
          period: "mo",
          featured: true,
          features: [
            "5 Sites",
            "50GB SSD Storage",
            "Free SSL",
            "Auto Updates",
            "Daily Backups",
          ],
        },
        {
          name: "WP Agency",
          description: "For managing client sites",
          price: "$14.99",
          period: "mo",
          features: [
            "Unlimited Sites",
            "150GB SSD Storage",
            "Free SSL",
            "Auto Updates",
            "Daily Backups",
            "Staging Environments",
          ],
        },
      ]}
    />
  );
}
