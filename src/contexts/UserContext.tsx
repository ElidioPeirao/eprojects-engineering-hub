
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  setPro: (id: string, isPro: boolean, expiryDays: number) => void;
  updateToolAccess: (id: string, toolIds: string[]) => void;
  checkProExpirations: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // Usuários iniciais
  const initialUsers: User[] = [
    {
      id: '1',
      username: 'Elidio',
      email: 'admin@eprojects.com',
      isPro: true,
      isAdmin: true,
      createdAt: new Date(),
      toolAccess: ['all'],
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      isPro: false,
      isAdmin: false,
      createdAt: new Date(),
      toolAccess: ['engineering-calculator', 'electrical-calculator'],
    },
  ];

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Carregar usuários do localStorage ou usar os iniciais
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    
    // Configurar verificação periódica de expiração Pro
    const interval = setInterval(checkProExpirations, 60 * 1000); // A cada minuto
    
    return () => clearInterval(interval);
  }, []);

  // Salvar usuários no localStorage sempre que mudam
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    );
    
    // Atualizar usuário logado se for o mesmo
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === id) {
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...updates }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const setPro = (id: string, isPro: boolean, expiryDays: number) => {
    const proExpiryDate = new Date();
    proExpiryDate.setDate(proExpiryDate.getDate() + expiryDays);
    
    updateUser(id, { 
      isPro,
      proExpiryDate: isPro ? proExpiryDate : undefined
    });
  };

  const updateToolAccess = (id: string, toolIds: string[]) => {
    updateUser(id, { toolAccess: toolIds });
  };

  const checkProExpirations = () => {
    const now = new Date();
    
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.isPro && user.proExpiryDate) {
          const expiryDate = new Date(user.proExpiryDate);
          if (expiryDate < now) {
            console.log(`Pro status expired for user ${user.username}`);
            return { ...user, isPro: false, proExpiryDate: undefined };
          }
        }
        return user;
      })
    );
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    setPro,
    updateToolAccess,
    checkProExpirations,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
