
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular um banco de dados para desenvolvimento
  const simulatedUsers: Record<string, User & { password: string }> = {
    admin: {
      id: '1',
      username: 'Elidio',
      email: 'admin@eprojects.com',
      isPro: true,
      isAdmin: true,
      password: '76255',
      createdAt: new Date(),
      toolAccess: ['all'],
    },
    user1: {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      isPro: false,
      isAdmin: false,
      password: '123456',
      createdAt: new Date(),
      toolAccess: ['engineering-calculator', 'electrical-calculator'],
    },
  };

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Verificar expiração do modo Pro
    if (currentUser && currentUser.isPro && currentUser.proExpiryDate) {
      const expiryDate = new Date(currentUser.proExpiryDate);
      if (expiryDate < new Date()) {
        const updatedUser = { ...currentUser, isPro: false };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Buscar usuário na nossa "base de dados"
    const userRecord = Object.values(simulatedUsers).find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (!userRecord) {
      throw new Error('Credenciais inválidas');
    }
    
    // Remover o campo password antes de salvar o usuário na sessão
    const { password: _, ...userWithoutPassword } = userRecord;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar se o usuário já existe
    const userExists = Object.values(simulatedUsers).some(
      u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userExists) {
      throw new Error('Usuário ou email já existe');
    }
    
    // Criar novo usuário
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username,
      email,
      isPro: false,
      isAdmin: false,
      password,
      createdAt: new Date(),
      toolAccess: ['engineering-calculator', 'electrical-calculator'], // Ferramentas básicas
    };
    
    // Adicionar à "base de dados"
    simulatedUsers[username] = newUser;
    
    // Remover o campo password antes de salvar o usuário na sessão
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin: currentUser?.isAdmin || false,
    isPro: currentUser?.isPro || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
