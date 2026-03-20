import { useState } from "react";

interface SubscriptionBannerProps {
  title?: string;
  description?: string;
  placeholderText?: string;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Default({
  title = "Subscribe to our newsletter",
  description = "Stay up to date with the latest news and articles.",
  placeholderText = "Enter your email",
  submitButtonText = "Subscribe",
  successMessage = "Thank you for subscribing!",
  errorMessage = "Please enter a valid email address.",
}: SubscriptionBannerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {title}
        </h2>
        <p className="text-blue-100 mb-6">{description}</p>

        {status === "success" ? (
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg inline-block">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <label htmlFor="subscription-email" className="sr-only">
                Email address
              </label>
              <input
                id="subscription-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder={placeholderText}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  status === "error"
                    ? "border-red-400 bg-red-50"
                    : "border-transparent"
                }`}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "email-error" : undefined}
              />
              {status === "error" && (
                <p id="email-error" className="text-red-200 text-sm mt-1 text-left">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? "Sending..." : submitButtonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
