import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import Footer from "./components/layout/footer";
import type { JSX } from "react";
import PageContainer from "./components/layout/page-container";
import PageLoader from "./components/layout/page-loader";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const auth = useAuth();

  function ProtectedRoute({ children }: { children: JSX.Element }) {
    if (auth?.isLoading) {
      return (
        <PageContainer>
          <PageLoader />
        </PageContainer>
      );
    }

    return auth?.isLoggedIn ? children : <Navigate to="/login" replace />;
  }

  function PublicRoute({ children }: { children: JSX.Element }) {
    if (auth?.isLoading) {
      return (
        <PageContainer>
          <PageLoader />
        </PageContainer>
      );
    }

    return !auth?.isLoggedIn ? children : <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="h-screen flex flex-col">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageContainer>
                    <Store />
                  </PageContainer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <PageContainer>
                    <Login />
                  </PageContainer>
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <PageContainer>
                    <Signup />
                  </PageContainer>
                </PublicRoute>
              }
            />
            <Route
              path="*"
              element={
                <PublicRoute>
                  <PageContainer>
                    <NotFound />
                  </PageContainer>
                </PublicRoute>
              }
            />
          </Routes>
        </main>
        <Toaster />
        <footer>
          <Footer />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
