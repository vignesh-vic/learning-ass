import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BrainCircuit,
    Mail,
    Lock,
    User,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../services/authService";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [focusField, setFocusField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await authService.register(
                registerData.username,
                registerData.email,
                registerData.password
            );

            toast.success("Account created successfully.");

            navigate("/login");
        } catch (error) {
            setError(error.message);
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen  from-slate-50 via-white to-slate-50">

            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]  opacity-30" />

            <div className="relative w-full max-w-md px-6">

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10">

                    {/* Header */}

                    <div className="text-center mb-10">

                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200/25 mb-6">

                            <BrainCircuit
                                className="w-7 h-7 text-white"
                                strokeWidth={2}
                            />

                        </div>

                        <h1 className="text-2xl font-medium text-slate-900 mb-2">
                            Create an account
                        </h1>

                        <p className="text-slate-500 text-sm">
                            Start your AI-powered learning experience
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}

                        <div className="space-y-2">

                            <label className="block text-xs uppercase font-medium tracking-wide text-slate-700">
                                Username
                            </label>

                            <div className="relative">

                                <div
                                    className={`absolute inset-y-0 left-0 flex items-center pl-4 ${focusField === "username"
                                            ? "text-emerald-500"
                                            : "text-slate-400"
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                </div>

                                <input
                                    type="text"
                                    name="username"
                                    placeholder="yourusername"
                                    value={registerData.username}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField("username")}
                                    onBlur={() => setFocusField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-200/25 transition-all"
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div className="space-y-2">

                            <label className="block text-xs uppercase font-medium tracking-wide text-slate-700">
                                Email
                            </label>

                            <div className="relative">

                                <div
                                    className={`absolute inset-y-0 left-0 flex items-center pl-4 ${focusField === "email"
                                            ? "text-emerald-500"
                                            : "text-slate-400"
                                        }`}
                                >
                                    <Mail className="w-5 h-5" />
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={registerData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField("email")}
                                    onBlur={() => setFocusField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-200/25 transition-all"
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div className="space-y-2">

                            <label className="block text-xs uppercase font-medium tracking-wide text-slate-700">
                                Password
                            </label>

                            <div className="relative">

                                <div
                                    className={`absolute inset-y-0 left-0 flex items-center pl-4 ${focusField === "password"
                                            ? "text-emerald-500"
                                            : "text-slate-400"
                                        }`}
                                >
                                    <Lock className="w-5 h-5" />
                                </div>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="********"
                                    value={registerData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField("password")}
                                    onBlur={() => setFocusField(null)}
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-200/25 transition-all"
                                />

                            </div>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                <p className="text-xs text-red-600 text-center font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-12 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium flex justify-center items-center overflow-hidden transition-all duration-200 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center gap-2">

                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}

                            </span>

                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                        </button>

                    </form>

                    {/* Footer */}

                    <div className="mt-6 pt-6 border-t border-slate-200/60">

                        <p className="text-center text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-emerald-500 hover:text-emerald-700 font-semibold"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    By continuing, you agree to our Terms and Privacy Policy.
                </p>

            </div>

        </div>
    );
};

export default RegisterPage;