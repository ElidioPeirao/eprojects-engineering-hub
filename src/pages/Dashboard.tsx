
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useTools } from "@/contexts/ToolContext";
import ToolCard from "@/components/ToolCard";
import { Tool } from "@/types";

const Dashboard = () => {
  const { currentUser, isAdmin, isPro } = useAuth();
  const { getUserTools } = useTools();
  const [standardTools, setStandardTools] = useState<Tool[]>([]);
  const [proTools, setProTools] = useState<Tool[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const allTools = getUserTools(
      currentUser.isPro,
      currentUser.toolAccess
    );
    
    setStandardTools(allTools.filter(tool => !tool.isPro));
    setProTools(allTools.filter(tool => tool.isPro));
  }, [currentUser, navigate, getUserTools]);

  if (!currentUser) {
    return null; // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-eprojects-white mb-2">
            Bem-vindo, {currentUser.username}!
          </h1>
          <p className="text-eprojects-white/70">
            {isPro ? (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 bg-eprojects-orange rounded-full animate-pulse-orange"></span>
                <span>Você tem acesso PRO</span>
              </span>
            ) : (
              "Acesso padrão"
            )}
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-eprojects-white mb-6 border-b border-white/10 pb-2">
            Ferramentas Padrão
          </h2>
          
          {standardTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-eprojects-white/70">Nenhuma ferramenta disponível.</p>
          )}
        </div>
        
        {isPro && proTools.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-eprojects-white mb-6 border-b border-white/10 pb-2">
              Ferramentas PRO
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
