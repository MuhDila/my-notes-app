import {Navigate, useLocation} from "react-router-dom";
import {getAccessToken} from "../utils/api";

function AuthGate({children, require = "auth"}) {
    const token = getAccessToken();
    const location = useLocation();

    if (require === "auth" && !token) {
        // belum login: ke /login, simpan tujuan semula
        return <Navigate to="/login" replace state={{from: location}}/>;
    }
    if (require === "guest" && token) {
        // sudah login: balik ke tujuan semula atau ke /
        const from = location.state?.from?.pathname || "/";
        return <Navigate to={from} replace/>;
    }
    return children;
}

export default AuthGate;