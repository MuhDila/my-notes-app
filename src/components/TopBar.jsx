import { useSettings } from "../contexts/SettingsContext";
import {
    MoonIcon,
    SunIcon,
    LanguageIcon,
    ArrowRightEndOnRectangleIcon
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { clearAccessToken } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { dict } from "../utils/dict";

export default function TopBar({ title = "Notes" }) {
    const { theme, toggleTheme, lang, toggleLang } = useSettings();
    const navigate = useNavigate();

    const L = dict[lang]?.topbar ?? dict.en.topbar; // fallback to EN if missing
    // show the target mode on the button (same behavior as before)
    const THEME_LABEL = theme === "dark" ? L.themeLight : L.themeDark;

    function onLogout() {
        if (!window.confirm(L.confirmLogout)) return;
        clearAccessToken();
        localStorage.removeItem("currentUser");
        navigate("/login", { replace: true });
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50
                       dark:bg-neutral-900/70 dark:border-neutral-800">
            <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 h-14">
                <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>

                <div className="flex items-center gap-2">
                    {/* Language */}
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm
                       hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                        title={L.toggleLanguage}
                        aria-label={L.toggleLanguage}
                    >
                        <LanguageIcon className="h-4 w-4" />
                        <span className="font-medium">{lang.toUpperCase()}</span>
                    </button>

                    {/* Theme */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm
                       hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                        title={L.toggleTheme}
                        aria-label={L.toggleTheme}
                    >
                        {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                        <span className="font-medium">{THEME_LABEL}</span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={onLogout}
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm
                       hover:bg-red-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                        title={L.logout}
                        aria-label={L.logout}
                    >
                        <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                        <span className="font-medium">{L.logout}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

TopBar.propTypes = { title: PropTypes.string };