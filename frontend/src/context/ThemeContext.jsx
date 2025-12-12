import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // 🔒 Hard-lock theme to light
    const theme = "light";

    useEffect(() => {
        const root = document.documentElement;

        // Always force light mode classes
        root.classList.add("light");
        root.classList.remove("dark");

        // Optional: clean up any previously saved theme
        localStorage.removeItem("theme");
    }, []);

    // Toggle is intentionally a no-op to preserve API stability
    const toggleTheme = () => {
        // no-op: dark mode is disabled by design
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
