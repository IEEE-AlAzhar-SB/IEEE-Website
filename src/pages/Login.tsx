import { useState, type ChangeEvent, type FormEvent } from "react";
import { CgLock } from "react-icons/cg";
import { LuMail, LuArrowLeft } from "react-icons/lu";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { signIn, useSession } from "../lib/auth-client";

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
  const { data: sessionData, isPending } = useSession();

  if (!isPending && sessionData?.session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (response.error) {
        // Generic message — never echo backend text (user-enumeration oracle).
        setErrorMessage("Invalid email or password. Please try again.");
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
    <div className="flex h-screen w-full bg-[#033e66]">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#05568D] to-[#033e66] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>

        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition w-max z-10 font-medium text-sm"
        >
          <LuArrowLeft size={16} />
          Back to Homepage
        </Link>

        <div className="z-10 space-y-4 max-w-md">
          <span className="text-white font-bold tracking-wider text-sm uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">
            IEEE Al-Azhar Portal
          </span>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome Back, <br />
            <span className="text-white">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#033e66]">
        <div className="w-full max-w-md space-y-8 bg-[#05568D] p-8 rounded-2xl shadow-xl border border-slate-700/50">
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
                  className="w-full pl-10 pr-4 py-3 bg-[#033e66] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#05568D] focus:ring-2 focus:ring-[#05568D]/20 transition text-sm"
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
                  className="w-full pl-10 pr-10 py-3 bg-[#033e66] border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#05568D] focus:ring-2 focus:ring-[#05568D]/20 transition text-sm"
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
              className="w-full bg-white hover:bg-white/90 text-[#05568D] font-semibold py-3 px-4 rounded-xl shadow-lg shadow-black/20 transition transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In to System"}
            </button>
          </form>

          <div className="lg:hidden text-center pt-2">
            <Link
              to="/"
              className="text-xs text-white/80 hover:underline inline-flex items-center gap-1"
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
