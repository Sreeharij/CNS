import React, { useState } from "react";
import { signInWithGoogle, logout } from "../firebase/auth";

function Auth({ setUser }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const user = await signInWithGoogle();
    setUser(user);
    setLoading(false);
  };
  return (
    <div className="auth">
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Auth;
