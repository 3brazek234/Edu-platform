
import { CheckCircle, ArrowRight } from "lucide-react";
import { usePackageStore, useSubjectStore } from "@/store/store";

const OrderPage = () => {
  const { item } = usePackageStore();
  const { item: selectedSubject } = useSubjectStore();

  if (item && selectedSubject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success-foreground" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. You'll receive a confirmation email
            shortly with next steps.
          </p>

          <div className="space-y-4 text-left bg-card/80 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="flex justify-between">
              <span>Subject:</span>
              <span className="font-medium">{selectedSubject?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{item?.name}</span>
            </div>
          </div>

          <button
            className="btn-primary w-full"
            onClick={() => window.location.reload()}
          >
            Start Another Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }
};

export default OrderPage;
