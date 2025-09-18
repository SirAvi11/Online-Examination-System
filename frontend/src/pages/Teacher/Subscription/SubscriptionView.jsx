import { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import PaymentModal from "./PaymentModal";

const SubscriptionView = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "INR 999",
      period: "per month",
      description: "Perfect for individual teachers starting out",
      features: [
        "Create up to 5 exams per month",
        "Question bank with up to 100 questions",
        "Basic progress tracking",
        "Exam results viewing",
        "Basic report generation",
        "Exam scheduler (limited)",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "INR 1999",
      period: "per month",
      description: "Best value for dedicated educators",
      features: [
        "Create unlimited exams",
        "Unlimited question bank",
        "Advanced student progress tracker",
        "Detailed exam reports with analytics",
        "Individual student result reports",
        "Full scheduler functionality",
        "Priority email support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "INR 4999",
      period: "per month",
      description: "For institutions and large departments",
      features: [
        "All Pro features plus:",
        "Multiple teacher accounts",
        "Centralized billing",
        "Custom branding",
        "Advanced analytics dashboard",
        "API access",
        "Dedicated account manager",
        "Onboarding assistance",
        "24/7 phone support",
      ],
      popular: false,
    },
  ];

  const getSelectedPlan = () => {
    return plans.find((plan) => plan.id === selectedPlan);
  };

  return (
    <div
      className="p-4"
      style={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div className="header-container mb-4 d-flex flex-row justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold">Choose Your Plan</h2>
          <p className="text-muted">
            Select the subscription that works best for your teaching needs
          </p>
        </div>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => setShowPaymentModal(true)}
            disabled={!selectedPlan}
          >
            <i className="bi bi-credit-card me-2"></i> Subscribe Now
          </Button>
        </div>
      </div>

      {/* Plans */}
      <div className="row g-4 justify-content-center">
        {plans.map((plan) => (
          <div key={plan.id} className="col-md-4">
            <div
              className={`card h-100 border-0 shadow-sm ${
                selectedPlan === plan.id
                  ? "border-primary border-3"
                  : "border-0"
              }`}
              style={{
                transition: "transform 0.3s, box-shadow 0.3s",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div
                  className="bg-primary text-white text-center py-2"
                  style={{
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  <small className="fw-bold">RECOMMENDED</small>
                </div>
              )}

              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold">{plan.name}</h5>
                  {selectedPlan === plan.id && (
                    <span className="badge bg-success">Selected</span>
                  )}
                </div>
                <p className="text-muted small">{plan.description}</p>

                <div className="my-3">
                  <span className="display-6 fw-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted ms-1">/{plan.period}</span>
                </div>

                <hr />

                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-circle-fill text-success me-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`btn w-100 py-2 fw-bold ${
                      selectedPlan === plan.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        plan={getSelectedPlan()}
      />
    </div>
  );
};

export default SubscriptionView;
