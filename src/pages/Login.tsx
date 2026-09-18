import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { CgLock } from "react-icons/cg";
import { LuMail, LuArrowLeft } from "react-icons/lu";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { usePrefetchRoute } from "../hooks/usePrefetchRoute";
import { signIn } from "../lib/auth-client";

type LoginCredentials = {
  email: string;
  password: string;
};

function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const prefetchHome = usePrefetchRoute("home");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (response.error) {
        console.error(response.error);
        setErrorMessage(
          response.error.message || "Unable to sign in. Please try again.",
        );
        return;
      }
      navigate("/dashboard", { replace: true });
    } catch {
      setErrorMessage("Unable to connect to the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen w-full bg-[#0a192f]">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F3063] to-[#1E61C9] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/10 rounded-full blur-2xl"></div>

        <Link
          to="/"
          viewTransition
          {...prefetchHome}
          className="flex items-center gap-2 text-white/80 hover:text-white transition w-max z-10 font-medium text-sm"
        >
          <LuArrowLeft size={16} />
          Back to Homepage
        </Link>

        <div className="z-10 space-y-4 max-w-md">
          <span className="text-blue-300 font-bold tracking-wider text-sm uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            IEEE Al-Azhar Portal
          </span>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome Back, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
              Board Administrator
            </span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Access the control panel to manage board members, update official
            records, and oversee student branch operations.
          </p>
        </div>

        <p className="text-white/40 text-xs z-10">
          &copy; 2026 IEEE Al-Azhar Student Branch. All rights reserved.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#0F172A]">
        <div className="w-full max-w-md space-y-8 bg-[#1E293B] p-8 rounded-2xl shadow-xl border border-slate-700/50">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Account Login
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider block"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LuMail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider block"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <CgLock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-[#0F172A] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff size={18} />
                  ) : (
                    <HiOutlineEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In to System"}
            </button>
          </form>

          <div className="lg:hidden text-center pt-2">
            <Link
              to="/"
              viewTransition
              {...prefetchHome}
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <LuArrowLeft size={12} /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
