
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-orange mb-6">
            EPROJECTS
          </h1>
          <p className="text-xl md:text-2xl text-eprojects-white mb-8">
            Plataforma de Ferramentas de Engenharia
          </p>
          <p className="text-eprojects-white/70 max-w-2xl mb-12">
            Acesse calculadoras especializadas para engenharia elétrica e civil, 
            ferramentas de simulação e muito mais. Disponível para todos os profissionais 
            e estudantes da área.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="text-lg px-8 py-3 bg-eprojects-orange hover:bg-eprojects-orange/80 text-white"
              onClick={() => navigate("/register")}
            >
              <a href="/register">Criar Conta</a>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="text-lg px-8 py-3 border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange/10"
              onClick={() => navigate("/login")}
            >
              <a href="/login">Entrar</a>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-eprojects-orange/20 flex items-center justify-center mb-4">
              <span className="text-eprojects-orange text-2xl">🔧</span>
            </div>
            <h3 className="text-xl font-semibold text-eprojects-white mb-2">Calculadoras Especializadas</h3>
            <p className="text-eprojects-white/70">
              Acesse calculadoras de engenharia e elétrica para realizar cálculos técnicos com precisão.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-eprojects-orange/20 flex items-center justify-center mb-4">
              <span className="text-eprojects-orange text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-eprojects-white mb-2">Acesso PRO</h3>
            <p className="text-eprojects-white/70">
              Desbloqueie ferramentas avançadas e exclusivas com a assinatura PRO.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-eprojects-orange/20 flex items-center justify-center mb-4">
              <span className="text-eprojects-orange text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-eprojects-white mb-2">Acessível em Todos os Dispositivos</h3>
            <p className="text-eprojects-white/70">
              Use nossas ferramentas no desktop, tablet ou smartphone, onde e quando precisar.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/10 py-6 mt-16">
        <div className="container px-4">
          <p className="text-center text-eprojects-white/50">
            © 2025 EPROJECTS - Plataforma de Ferramentas de Engenharia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
