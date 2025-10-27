import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import AuthGate from "../contexts/AuthGate";
import PrivateLayout from "./PrivateLayout";
import {dict} from "../utils/dict";
import {useSettings} from "../contexts/SettingsContext";
import CreatePage from "../pages/CreatePage";
import DetailPage from "../pages/DetailPage";

function NotesApp() {
    const { lang } = useSettings();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AuthGate require="auth">
                        <PrivateLayout title={dict[lang].homeTitle}><HomePage /></PrivateLayout>
                    </AuthGate>
                }
            />
            <Route
                path="/create"
                element={
                    <AuthGate require="auth">
                        <PrivateLayout title={dict[lang].create}><CreatePage /></PrivateLayout>
                    </AuthGate>
                }
            />
            <Route
                path="/detail/:id"
                element={
                    <AuthGate require="auth">
                        <PrivateLayout title={"Detail"}>
                            <DetailPage />
                        </PrivateLayout>
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
