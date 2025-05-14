import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../../contexts/ThemeContext";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;