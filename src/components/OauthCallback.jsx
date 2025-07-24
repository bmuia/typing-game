import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseContext";

const OauthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Correctly using location hook

  useEffect(() => {
    console.log("OauthCallback is running...");

    const params = new URLSearchParams(location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      login(access, refresh); // ✅ Pass both tokens
      navigate("/dashboard");
    } else {
      console.error(
        "OAuthCallback: OAuth tokens missing in URL parameters. Navigating to /error"
      );
      navigate("/error");
    }
  }, [location, login, navigate]); // ✅ Dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
      <p>Logging you in securely...</p>
    </div>
  );
};

export default OauthCallback;
