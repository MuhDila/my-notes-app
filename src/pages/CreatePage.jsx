import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateInput from "../components/CreateInput";
import { addNote } from "../utils/api";

function CreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    async function onCreate({ title, body }) {
        setErrMsg("");
        setLoading(true);
        try {
            const res = await addNote({ title, body });
            if (res.error) {
                setErrMsg(res.message || "Gagal menyimpan catatan.");
                return;
            }
            navigate("/", { replace: true });
        } catch (e) {
            setErrMsg("Terjadi kesalahan jaringan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid place-items-center p-6">
            <div className="w-full max-w-sm space-y-4">
                <h1 className="text-xl font-semibold text-center">Create Note</h1>
                <CreateInput create={onCreate} loading={loading} />
                {errMsg && <p className="text-center text-sm text-red-600">{errMsg}</p>}
            </div>
        </div>
    );
}

export default CreatePage;
