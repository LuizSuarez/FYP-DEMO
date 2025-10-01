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
      msg="We've sent a verification link to your email. Please wait for verification by an administrator."
      redirectDelay={2000}
    />
  );
}
