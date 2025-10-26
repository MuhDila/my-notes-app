import {useState} from "react";
import PropTypes from "prop-types";
import {EyeIcon, EyeSlashIcon, ArrowPathIcon} from "@heroicons/react/24/outline";

function LoginInput({login, loading = false}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!loading) login({email, password});
    };

    return (
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3" aria-busy={loading}>
            {/* Email */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Password + toggle */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="h-11 w-full rounded-lg border border-neutral-300 px-3 pr-10 outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={loading}
                        className="absolute inset-y-0 right-2 grid place-items-center rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-neutral-500"/> :
                            <EyeIcon className="h-5 w-5 text-neutral-500"/>}
                        <span className="sr-only">{showPassword ? "Hide" : "Show"}</span>
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !email || !password}
                className="mt-2 h-11 w-full rounded-lg bg-lime-500 font-medium text-black hover:bg-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 animate-spin"/> Signing in...
          </span>
                ) : (
                    "Sign in"
                )}
            </button>
        </form>
    );
}

LoginInput.propTypes = {
    login: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default LoginInput;
