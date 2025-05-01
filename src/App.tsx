
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ToolProvider } from "./contexts/ToolContext";
import { UserProvider } from "./contexts/UserContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

import EngineeringCalculator from "./pages/tools/EngineeringCalculator";
import ElectricalCalculator from "./pages/tools/ElectricalCalculator";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <ToolProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                
                {/* Rotas de ferramentas */}
                <Route path="/tools/engineering-calculator" element={<EngineeringCalculator />} />
                <Route path="/tools/electrical-calculator" element={<ElectricalCalculator />} />
                
                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ToolProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
