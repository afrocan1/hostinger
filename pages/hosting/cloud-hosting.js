import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function CloudHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Cloud Hosting"
      eyebrow="Hosting"
      title="Cloud Hosting"
      subtitle="Scalable infrastructure built for large-scale projects."
      plans={[
        {
          name: "Cloud Startup",
          description: "For apps finding their footing",
          price: "$24.99",
          period: "mo",
          features: ["2 vCPU", "4GB RAM", "80GB SSD", "Auto Scaling"],
        },
        {
          name: "Cloud Growth",
          description: "For scaling products",
          price: "$49.99",
          period: "mo",
          featured: true,
          features: [
            "4 vCPU",
            "8GB RAM",
            "160GB SSD",
            "Auto Scaling",
            "Load Balancer",
          ],
        },
        {
          name: "Cloud Enterprise",
          description: "For mission-critical workloads",
          price: "$99.99",
          period: "mo",
          features: [
            "8 vCPU",
            "16GB RAM",
            "320GB SSD",
            "Auto Scaling",
            "Load Balancer",
            "24/7 Priority Support",
          ],
        },
      ]}
    />
  );
}
