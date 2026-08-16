import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function WebHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Web Hosting"
      eyebrow="Hosting"
      title="Web Hosting"
      subtitle="Fast, reliable hosting for small to medium websites."
      plans={[
        {
          name: "Starter",
          description: "For personal sites and blogs",
          price: "$2.99",
          period: "mo",
          features: ["1 Website", "10GB SSD Storage", "Free SSL", "24/7 Support"],
        },
        {
          name: "Business",
          description: "For growing websites",
          price: "$5.99",
          period: "mo",
          featured: true,
          features: [
            "Unlimited Websites",
            "50GB SSD Storage",
            "Free SSL",
            "Free Domain",
            "Priority Support",
          ],
        },
        {
          name: "Pro",
          description: "For high-traffic sites",
          price: "$9.99",
          period: "mo",
          features: [
            "Unlimited Websites",
            "150GB SSD Storage",
            "Free SSL",
            "Free Domain",
            "Dedicated IP",
            "Priority Support",
          ],
        },
      ]}
    />
  );
}
