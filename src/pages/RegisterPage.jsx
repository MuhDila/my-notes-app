import RegisterInput from "../components/RegisterInput";
import {register as apiRegister} from "../utils/api";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");

    async function onRegister(user) {
        setErrMsg("");
        setOkMsg("");
        setLoading(true);
        try {
            const {error} = await apiRegister(user);
            if (error) {
                setErrMsg("Registrasi gagal. Coba lagi.");
                return;
            }
            setOkMsg("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (e) {
            setErrMsg("Terjadi kesalahan jaringan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <div className="w-full max-w-sm space-y-4">
                <h1 className="text-xl font-semibold text-center">Register</h1>
                <RegisterInput register={onRegister} loading={loading}/>
                {errMsg && <p className="text-center text-sm text-red-600">{errMsg}</p>}
                {okMsg && <p className="text-center text-sm text-green-600">{okMsg}</p>}
                <p className="text-center text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-lime-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;