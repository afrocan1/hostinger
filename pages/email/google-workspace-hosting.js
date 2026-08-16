import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function GoogleWorkspaceHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Google Workspace Email Hosting - Hostier"
      eyebrow="Email"
      title="Google Workspace Email Hosting"
      subtitle="Custom @yourdomain.com email, Gmail, Docs, and Meet — all under your own brand, backed by Google's infrastructure."
      plans={[
        {
          name: "Business Starter",
          tagline: "For individuals and small teams",
          price: 175,
          yearlyPrice: "₹1,750",
          buttonText: "Get Started",
          features: [
            "Custom Email @yourdomain.com",
            "30 GB Cloud Storage",
            "Video Meetings up to 100 Participants",
          ],
          includes: [
            "Also included",
            "Security & Admin Controls",
            "24/7 Support",
          ],
        },
        {
          name: "Business Standard",
          tagline: "For growing teams that need more room",
          price: 350,
          yearlyPrice: "₹3,500",
          featured: true,
          buttonText: "Get Started",
          features: [
            "Custom Email @yourdomain.com",
            "2 TB Cloud Storage",
            "Video Meetings up to 150 Participants",
          ],
          includes: [
            "Also included",
            "Security & Admin Controls",
            "Recording for Meetings",
            "24/7 Support",
          ],
        },
        {
          name: "Business Plus",
          tagline: "For teams that need advanced controls",
          price: 590,
          yearlyPrice: "₹5,900",
          buttonText: "Get Started",
          features: [
            "Custom Email @yourdomain.com",
            "5 TB Cloud Storage",
            "Video Meetings up to 500 Participants",
          ],
          includes: [
            "Also included",
            "Enhanced Security & Management",
            "Recording for Meetings",
            "24/7 Priority Support",
          ],
        },
      ]}
    />
  );
}
