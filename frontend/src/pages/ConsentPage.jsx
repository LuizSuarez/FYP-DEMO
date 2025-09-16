import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConsent } from "../context/consentContext";
import { useToast } from "@/hooks/use-toast";

const ConsentForm = () => {
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const { handleSignConsent } = useConsent();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || !fullName || !date) {
      toast({ title: "Please read and sign the consent form before proceeding." });
      return;
    }

    try {
      const data = await handleSignConsent();
      console.log("Consent signed:", data);

      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Failed to sign consent. Please try again." });
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Genomic Data Consent Form
        </h1>

        <div className="h-64 overflow-y-scroll p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200">
          <p>
            <strong>1. Purpose of Data Collection</strong>
            <br />
            Your genomic data will be used for providing personalized health
            insights, disease risk prediction, and for improving our genomic
            analysis models.
          </p>
          <p className="mt-3">
            <strong>2. What Data We Collect</strong>
            <br />
            We collect your genomic sequence data and associated
            health/biometric information you provide.
          </p>
          <p className="mt-3">
            <strong>3. How We Use Your Data</strong>
            <br />
            • To provide you with personalized reports and predictions.
            <br />
            • To advance research and improve the accuracy of our platform.
            <br />• Your identifiable data will <em>not</em> be shared with
            third parties without your explicit consent.
            <br />• Aggregated, de-identified data may be used for scientific
            research.
          </p>
          <p className="mt-3">
            <strong>4. Risks & Benefits</strong>
            <br />
            While genomic analysis provides valuable insights, results may not
            be definitive or diagnostic. There is a minimal risk of unauthorized
            access, but we implement strong safeguards.
          </p>
          <p className="mt-3">
            <strong>5. Confidentiality & Security</strong>
            <br />
            Your data is stored securely in compliance with privacy standards.
          </p>
          <p className="mt-3">
            <strong>6. Voluntary Participation & Right to Withdraw</strong>
            <br />
            You may withdraw consent and request deletion of your data at any
            time.
          </p>
          <p className="mt-3">
            <strong>7. Contact Information</strong>
            <br />
            If you have questions, contact dnalyticsofficial@gmail.com
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label
              htmlFor="agree"
              className="text-slate-700 dark:text-slate-200"
            >
              I have read and understood the consent form, and I agree to share
              my genomic data.
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Full Name (Digital Signature)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold hover:from-teal-700 hover:to-cyan-700"
          >
            Agree & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsentForm;
