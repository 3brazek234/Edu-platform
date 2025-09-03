import React, { useMemo } from "react";
import {
  Calendar,
  User,
  Package,
  CreditCard,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { usePackageStore, useSubjectStore } from "@/store/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitOrder, OrderPayload } from "@/services/submitOrder";
import { useState } from "react";

const OrderSummary: React.FC = () => {
  const { item: packageItem } = usePackageStore();
  const { item: subject } = useSubjectStore();

  const schema = z
    .object({
      firstName: z.string().min(5, "First name is required"),
      lastName: z.string().min(5, "Last name is required"),
      email: z.string().email("Email is invalid"),
      phone: z.string().min(1, "Phone number is required"),
      studentAge: z.string().min(1, "Student age is required"),
      preferredTime: z.string().optional(),
      goals: z.string().min(1, "Learning goals are required"),
      paymentMethod: z.enum(["card", "paypal"]),
      cardNumber: z.string().optional(),
      expiryDate: z.string().optional(),
      cvv: z.string().optional(),
      billingAddress: z.string().optional(),
      agreeTerms: z.boolean().refine((v) => v === true, "You must agree to the terms"),
      agreeNewsletter: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.paymentMethod === "card") {
        if (!data.cardNumber || data.cardNumber.trim().length < 4) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardNumber"], message: "Card number is required" });
        }
        if (!data.expiryDate || data.expiryDate.trim().length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiryDate"], message: "Expiry date is required" });
        }
        if (!data.cvv || data.cvv.trim().length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cvv"], message: "CVV is required" });
        }
      }
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldUnregister: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      studentAge: "",
      preferredTime: "",
      goals: "",
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      agreeTerms: false,
      agreeNewsletter: false,
    },
  });

  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [serverResponse, setServerResponse] = useState<unknown>(null);

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setServerSuccess("");
    try {
      type SubjectItem = {
        id: string | number;
        name: string;
        content: { rendered: string };
      };
      const typedSubject = subject as unknown as SubjectItem;

      const payload: OrderPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        studentAge: data.studentAge,
        preferredTime: data.preferredTime,
        goals: data.goals,
        paymentMethod: data.paymentMethod,
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        billingAddress: data.billingAddress,
        agreeTerms: data.agreeTerms,
        agreeNewsletter: data.agreeNewsletter,
        packageId: packageItem.id,
        packageName: packageItem.name,
        subjectId: String(typedSubject.id),
        subjectName: typedSubject.name,
      };

      const res = await submitOrder(payload);
      setServerSuccess("Order submitted successfully");
      setServerResponse(res);
    } catch (err: unknown) {
      if (err instanceof Error) setServerError(err.message);
      else setServerError(String(err));
    }
  };

  // compute pricing / paymentMethod unconditionally (hooks must run in same order)
  const discount = useMemo(() => {
    return packageItem ? (packageItem.originalPrice ? packageItem.originalPrice - packageItem.price : 0) : 0;
  }, [packageItem]);

  const tax = useMemo(() => {
    return packageItem ? Math.round(packageItem.price * 0.08) : 0;
  }, [packageItem]);

  const total = useMemo(() => {
    return packageItem ? packageItem.price + tax : 0;
  }, [packageItem, tax]);

  const paymentMethod = watch("paymentMethod");

  if (!subject || !packageItem) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              4
            </div>
            <span className="text-primary font-medium">Final Step</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Complete Your Order
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review your selection and provide your details to start learning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="fade-in-left">
            <div className="card-elevated p-8 sticky top-8">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

              {/* Subject */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <div className="text-2xl">
                  <Lock />
                </div>
                <div>
                  <div className="font-medium">Subject</div>
                  <div className="text-muted-foreground">
                    {" "}
                    {subject.content.rendered}
                  </div>
                </div>
              </div>

              {/* Package */}
              <div className="p-4 bg-muted/50 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {packageItem.name} Package
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {packageItem.sessions} one-on-one sessions
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-6 border-t border-card-border">
                <div className="flex justify-between">
                  <span>Package price</span>
                  <span>${packageItem.originalPrice || packageItem.price}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax}</span>
                </div>

                <div className="flex justify-between text-xl font-bold pt-3 border-t border-card-border">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 bg-success/10 text-success rounded-lg text-center">
                <Lock className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  100% Satisfaction Guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="fade-in-right">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="card-elevated p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`form-input ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student Age *
                  </label>
                  <select
                    className={`form-input ${
                      errors.studentAge ? "border-red-500" : ""
                    }`}
                    {...register("studentAge")}
                  >
                    <option value="">Select age range</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-14">11-14 years</option>
                    <option value="15-18">15-18 years</option>
                    <option value="18+">18+ years</option>
                  </select>
                  {errors.studentAge && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentAge.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="card-elevated p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Learning Preferences
                </h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Preferred Time
                  </label>
                  <select
                    className="form-input"
                    {...register("preferredTime")}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 9PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Learning Goals *
                  </label>
                  <textarea
                    className={`form-input h-24 ${
                      errors.goals ? "border-red-500" : ""
                    }`}
                    placeholder="What would you like to achieve? (e.g., improve grades, prepare for exams, build confidence)"
                    {...register("goals")}
                  />
                  {errors.goals && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.goals.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="card-elevated p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Information
                </h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="card"
                        {...register("paymentMethod")}
                        className="mr-2"
                      />
                      Credit Card
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="paypal"
                        {...register("paymentMethod")}
                        className="mr-2"
                      />
                      PayPal
                    </label>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className={`form-input ${
                          errors.cardNumber ? "border-red-500" : ""
                        }`}
                        {...register("cardNumber")}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className={`form-input ${
                            errors.expiryDate ? "border-red-500" : ""
                          }`}
                          {...register("expiryDate")}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className={`form-input ${
                            errors.cvv ? "border-red-500" : ""
                          }`}
                          {...register("cvv")}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>{" "}
                    *
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs">
                    {errors.agreeTerms.message}
                  </p>
                )}

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register("agreeNewsletter")}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I'd like to receive learning tips and updates via email
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : `Complete Order - $${total}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
