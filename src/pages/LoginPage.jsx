import {useLocation, useNavigate, Link} from "react-router-dom";
import {useState} from "react";
import LoginInput from "../components/LoginInput";
import {getUserLogged, login, putAccessToken} from "../utils/api";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    async function onLogin({email, password}) {
        setErrMsg("");
        setLoading(true);
        try {
            const {error, data} = await login({email, password});
            if (error || !data?.accessToken) {
                setErrMsg("Email atau password salah.");
                return;
            }

            putAccessToken(data.accessToken);

            const me = await getUserLogged();
            if (!me.error) {
                localStorage.setItem("currentUser", JSON.stringify(me.data));
            }

            navigate(from, {replace: true});
        } catch (e) {
            setErrMsg("Terjadi kesalahan jaringan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <div className="w-full max-w-sm space-y-4">
                <h1 className="text-xl font-semibold text-center">Login</h1>
                <LoginInput login={onLogin} loading={loading}/>
                {errMsg && <p className="text-center text-sm text-red-600">{errMsg}</p>}
                <p className="text-center text-sm text-neutral-600">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-medium text-lime-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
