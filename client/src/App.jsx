import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button } from '@heroui/react';
import { WallpaperProvider } from "./context/WallpaperContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { Route, Routes, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader.jsx";

export default function App() {

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <PageLoader />
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
      </WallpaperProvider>
    </ThemeProvider>
  );
}
