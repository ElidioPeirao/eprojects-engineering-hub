
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black border-b border-white/10 px-4 py-3">
      <div className="container flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center gap-6">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-eprojects-white hover:text-eprojects-orange transition-colors">
                Dashboard
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="text-eprojects-white hover:text-eprojects-orange transition-colors">
                  Administração
                </Link>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-eprojects-white/70">
                  Olá, {currentUser.username}
                </span>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                >
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                asChild
                variant="outline" 
                className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
              >
                <Link to="/login">Entrar</Link>
              </Button>
              <Button 
                asChild
                className="bg-eprojects-orange text-white hover:bg-eprojects-orange/80"
              >
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-eprojects-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-black/95 border-b border-white/10 px-4 py-4">
          <div className="flex flex-col space-y-4">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-eprojects-white hover:text-eprojects-orange transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-eprojects-white hover:text-eprojects-orange transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administração
                  </Link>
                )}
                
                <span className="text-eprojects-white/70">
                  Olá, {currentUser.username}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-eprojects-orange text-white hover:bg-eprojects-orange/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">Criar Conta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
