import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import Aos from "aos";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Aos.init({
      duration: 800,
      offset: 100,
    });
  }, []);
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
export default MyApp;
