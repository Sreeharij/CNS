import React, { useRef, useState, useEffect } from "react";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db,initAuthPersistence } from "../firebase/config";

const createUserProfile = async (user, name = "Guest") => {
  if (user.isAnonymous) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      name,
      email: user.email || "",
      favorites: [],
      createdAt: serverTimestamp(),
    });
  }
};


const Index = () => {
  useEffect(() => {
    initAuthPersistence().catch((err) =>
      console.error("Persistence setup failed:", err)
    );
  }, []);


  const aboutRef = useRef(null);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const handleScrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      await createUserProfile(auth.currentUser);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await createUserProfile(auth.currentUser);
      navigate("/dashboard");
    } catch (err) {
      alert("Google Sign-In failed: " + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = registerData;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(auth.currentUser, name); // pass name here
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };
  

  const handleGuestLogin = async () => {
    try {
      if (!auth.currentUser){
        await signInAnonymously(auth);
      }
      navigate("/dashboard");
    } catch (err) {
      alert("Guest login failed: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col md:flex-row h-screen overflow-hidden">
        <Hero onLearnMoreClick={handleScrollToAbout} />

        {auth.currentUser ? (
          <div className="flex flex-col items-center justify-center w-full p-8 text-center">
            <h2 className="text-3xl font-bold text-nitc-darkBlue mb-4">Welcome back to Campus Navigation System</h2>
            <p className="text-gray-600 mb-6">You're already logged in.</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-8">
            <div className="w-full max-w-md transition-all duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-nitc-darkBlue mb-2">Welcome to CNS</h2>
                  <p className="text-gray-600">Choose an option to continue your journey</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-nitc-blue hover:bg-nitc-darkBlue text-white py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    Login with Credentials
                  </button>

                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full bg-nitc-green hover:bg-green-700 text-white py-3 rounded-xl transition duration-300 shadow-md"
                  >
                    Create New Account
                  </button>

                  <div className="flex items-center justify-between text-gray-400 text-sm pt-4">
                    <hr className="flex-grow border-gray-200" />
                    <span className="px-3">or continue as</span>
                    <hr className="flex-grow border-gray-200" />
                  </div>

                  <button
                    onClick={handleGuestLogin}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition duration-300 border"
                  >
                    Guest Explorer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div ref={aboutRef}>
        <AboutSection />
      </div>

      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Campus Navigation System - NIT Calicut. All rights reserved.
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600">
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-nitc-darkBlue">Login to Your Account</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-blue"
                />
              </div>
              <button type="submit" className="w-full bg-nitc-darkBlue text-white py-2 rounded-lg hover:opacity-90 transition">
                Sign In
              </button>
              <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button onClick={() => setShowRegisterModal(false)} className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600">
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-nitc-darkBlue">Create New Account</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <button type="submit" className="w-full bg-nitc-green text-white py-3 rounded-lg hover:bg-green-700 transition">
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
