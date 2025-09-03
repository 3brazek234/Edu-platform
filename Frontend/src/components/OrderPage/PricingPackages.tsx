import { usePackageStore } from "@/store/store";
import { Package } from "@/types/interface";
import { Check, Crown, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    description: "Perfect for trying out our platform",
    sessions: 4,
    price: 120,
    originalPrice: 160,
    features: [
      "4 one-on-one sessions",
      "Basic study materials",
      "Progress tracking",
      "Email support",
      "Flexible scheduling",
    ],
    color: "text-primary",
  },
  {
    id: "popular",
    name: "Most Popular",
    icon: Crown,
    description: "Best value for consistent learning",
    sessions: 12,
    price: 324,
    originalPrice: 480,
    features: [
      "12 one-on-one sessions",
      "Premium study materials",
      "Advanced progress tracking",
      "Priority support",
      "Homework assistance",
      "Exam preparation",
      "Parent progress reports",
    ],
    popular: true,
    recommended: true,
    color: "text-warning",
  },
  {
    id: "intensive",
    name: "Intensive",
    icon: Users,
    description: "Maximum learning acceleration",
    sessions: 24,
    price: 600,
    originalPrice: 960,
    features: [
      "24 one-on-one sessions",
      "All premium materials",
      "Dedicated learning coach",
      "24/7 priority support",
      "Custom curriculum",
      "Weekly progress calls",
      "College prep assistance",
      "Guaranteed results",
    ],
    color: "text-success",
  },
];

const PricingPackages = () => {
  const { addToCart, item } = usePackageStore();
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              2
            </div>
            <span className="text-primary font-medium">Step 2</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Choose Your Package
          </h2>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-primary text-primary-foreground rounded-xl p-6 mb-8 text-center fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6" />
            <span className="text-lg font-semibold">Limited Time Offer</span>
          </div>
          <p className="text-primary-foreground/90">
            Save up to 37% on multi-session packages. Offer expires in 24 hours!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = item?.id === pkg.id;
            const discount = pkg.originalPrice
              ? Math.round(
                  ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
                )
              : 0;

            return (
              <div
                key={pkg.id}
                className={`pricing-card group cursor-pointer ${
                  pkg.popular ? "featured" : ""
                } ${isSelected ? "ring-2 ring-primary" : ""}`}
                onClick={() => addToCart(pkg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    addToCart(pkg);
                  }
                }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 ${pkg.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${pkg.color}`} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {pkg.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {pkg.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${pkg.originalPrice}
                        </span>
                        <span className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-4xl font-bold text-primary mb-1">
                    ${pkg.price}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {pkg.sessions} sessions • $
                    {Math.round(pkg.price / pkg.sessions)}/session
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-success-foreground" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    pkg.popular
                      ? "btn-primary"
                      : isSelected
                      ? "bg-success text-success-foreground"
                      : "btn-secondary hover:btn-primary"
                  }`}
                >
                  {isSelected ? "Selected" : `Choose ${pkg.name}`}
                </button>

                {/* Value indicator */}
                {pkg.originalPrice && (
                  <div className="text-center mt-4 text-sm text-success font-medium">
                    You save ${pkg.originalPrice - pkg.price}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12 fade-in-up">
          <div className="bg-card border border-card-border rounded-xl p-6 max-w-md mx-auto">
            <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-semibold mb-2">100% Satisfaction Guarantee</h4>
            <p className="text-sm text-muted-foreground">
              Not satisfied after your first session? Get a full refund, no
              questions asked.
            </p>
          </div>
        </div>

        {/* Continue button */}
        {item && (
          <div className="text-center mt-12 fade-in-up">
            <button className="btn-primary text-lg px-8 py-4" onClick={() => {
              navigate("/order");
            }}>
              Continue to Checkout
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPackages;
