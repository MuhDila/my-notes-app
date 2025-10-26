import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import AuthGate from "../routes/AuthGate";

function NotesApp() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AuthGate require="auth">
                        <HomePage/>
                    </AuthGate>
                }
            />
            <Route
                path="/login"
                element={
                    <AuthGate require="guest">
                        <LoginPage/>
                    </AuthGate>
                }
            />
            <Route
                path="/register"
                element={
                    <AuthGate require="guest">
                        <RegisterPage/>
                    </AuthGate>
                }
            />
            {/* fallback */}
            <Route
                path="*"
                element={
                    <AuthGate require="auth">
                        <HomePage/>
                    </AuthGate>
                }
            />
        </Routes>
    );
}

export default NotesApp;
