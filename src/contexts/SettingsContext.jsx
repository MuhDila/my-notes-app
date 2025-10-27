import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [lang, setLang]   = useState(() => localStorage.getItem("lang") || "en");

    // apply theme -> <html class="dark"> untuk Tailwind
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
    }, [theme]);

    // persist language
    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const value = useMemo(() => ({
        theme,
        lang,
        toggleTheme: () => setTheme(t => (t === "dark" ? "light" : "dark")),
        toggleLang:  () => setLang(l => (l === "en" ? "id" : "en")),
    }), [theme, lang]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
}
