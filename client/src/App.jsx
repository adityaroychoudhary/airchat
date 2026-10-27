import { useEffect } from "react";
import { WallpaperProvider } from "./context/WallpaperContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { Route, Routes, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { Toaster } from "react-hot-toast"

export default function App() {

  const { isSignedIn, isLoaded, getToken } = useAuth();

  // Select primitive state only; action functions are stable and can be read
  // from Zustand's store API without creating a new snapshot object.
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (!isLoaded) return;

    const { checkAuth, clearAuth } = useAuthStore.getState();
    if (isSignedIn) checkAuth(getToken);
    else clearAuth();
  }, [getToken, isLoaded, isSignedIn]);

  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>
        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  );
}
