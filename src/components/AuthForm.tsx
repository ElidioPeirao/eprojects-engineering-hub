
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm = ({ isLogin = true }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta ao EPROJECTS!",
        });
      } else {
        if (!email.includes('@')) {
          throw new Error('Email inválido');
        }
        await register(username, email, password);
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada. Bem-vindo ao EPROJECTS!",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-2xl text-gradient-orange">
          {isLogin ? "Entrar" : "Criar Conta"}
        </CardTitle>
        <CardDescription className="text-eprojects-white/70">
          {isLogin 
            ? "Digite suas credenciais para acessar sua conta" 
            : "Preencha os dados abaixo para criar uma nova conta"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-eprojects-white">
              Usuário
            </label>
            <Input
              id="username"
              placeholder="Seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-black/50 border-white/20 text-eprojects-white"
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-eprojects-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-eprojects-white">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black/50 border-white/20 text-eprojects-white"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-eprojects-orange hover:bg-eprojects-orange/90"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <span className="mr-2">Processando</span>
                <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Registrar"
            )}
          </Button>
          
          <div className="text-sm text-center text-eprojects-white/70">
            {isLogin ? (
              <span>
                Não tem uma conta?{" "}
                <a href="/register" className="text-eprojects-orange hover:text-eprojects-orange-light">
                  Registre-se
                </a>
              </span>
            ) : (
              <span>
                Já tem uma conta?{" "}
                <a href="/login" className="text-eprojects-orange hover:text-eprojects-orange-light">
                  Entrar
                </a>
              </span>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
