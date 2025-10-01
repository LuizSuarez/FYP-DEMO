import { useLocation } from "react-router-dom";
import VerifyEmail from "../../components/VerifyEmail";

export default function VerifyEmailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  return (
    <VerifyEmail
      status={status}
      appName="DNAlytics"
      redirectDelay={2000}
    />
  );
}
