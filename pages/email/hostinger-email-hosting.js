import HostingPlanTemplate from "../../components/HostingPlanTemplate";

export default function HostierEmailHosting() {
  return (
    <HostingPlanTemplate
      seoTitle="Email Hosting - Hostier"
      eyebrow="Email"
      title="Hostier Email Hosting"
      subtitle="Promote your business with every outreach — professional, ad-free email hosted on your own domain."
      plans={[
        {
          name: "Starter",
          tagline: "For solo founders and freelancers",
          price: 89,
          yearlyPrice: "₹899",
          buttonText: "Get Started",
          features: ["1 Email Account", "10 GB Storage", "Custom Domain Email"],
          includes: ["Also included", "Spam Protection", "Webmail Access"],
        },
        {
          name: "Business",
          tagline: "For small teams",
          price: 179,
          yearlyPrice: "₹1,799",
          featured: true,
          buttonText: "Get Started",
          features: ["5 Email Accounts", "50 GB Storage", "Custom Domain Email"],
          includes: [
            "Also included",
            "Spam Protection",
            "Webmail Access",
            "Email Forwarding",
          ],
        },
        {
          name: "Enterprise",
          tagline: "For established businesses",
          price: 349,
          yearlyPrice: "₹3,499",
          buttonText: "Get Started",
          features: [
            "Unlimited Email Accounts",
            "150 GB Storage",
            "Custom Domain Email",
          ],
          includes: [
            "Also included",
            "Spam Protection",
            "Webmail Access",
            "Email Forwarding",
            "Priority Support",
          ],
        },
      ]}
    />
  );
}
