
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool } from '../types';

interface ToolContextType {
  tools: Tool[];
  addTool: (tool: Omit<Tool, 'id' | 'createdAt'>) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  getUserTools: (isPro: boolean, toolAccess: string[]) => Tool[];
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const useTools = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolProvider');
  }
  return context;
};

interface ToolProviderProps {
  children: ReactNode;
}

export const ToolProvider = ({ children }: ToolProviderProps) => {
  // Ferramentas iniciais
  const initialTools: Tool[] = [
    {
      id: 'engineering-calculator',
      name: 'Calculadora de Engenharia',
      description: 'Calculadora com funções avançadas para engenheiros',
      link: '/tools/engineering-calculator',
      icon: 'calculator',
      isPro: false,
      category: 'engineering',
      createdAt: new Date(),
    },
    {
      id: 'electrical-calculator',
      name: 'Calculadora Elétrica',
      description: 'Cálculos específicos para engenharia elétrica',
      link: '/tools/electrical-calculator',
      icon: 'wrench',
      isPro: false,
      category: 'electrical',
      createdAt: new Date(),
    },
    {
      id: 'advanced-tool-1',
      name: 'Ferramenta Avançada 1',
      description: 'Ferramenta exclusiva para usuários Pro',
      link: '/tools/advanced-tool-1',
      icon: 'settings',
      isPro: true,
      category: 'engineering',
      createdAt: new Date(),
    },
  ];

  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    // Carregar ferramentas do localStorage ou usar as iniciais
    const savedTools = localStorage.getItem('tools');
    if (savedTools) {
      setTools(JSON.parse(savedTools));
    } else {
      setTools(initialTools);
      localStorage.setItem('tools', JSON.stringify(initialTools));
    }
  }, []);

  // Salvar ferramentas no localStorage sempre que mudam
  useEffect(() => {
    if (tools.length > 0) {
      localStorage.setItem('tools', JSON.stringify(tools));
    }
  }, [tools]);

  const addTool = (tool: Omit<Tool, 'id' | 'createdAt'>) => {
    const newTool: Tool = {
      ...tool,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setTools(prevTools => [...prevTools, newTool]);
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === id ? { ...tool, ...updates } : tool
      )
    );
  };

  const deleteTool = (id: string) => {
    setTools(prevTools => prevTools.filter(tool => tool.id !== id));
  };

  const getUserTools = (isPro: boolean, toolAccess: string[]) => {
    // Admin tem acesso a todas as ferramentas
    if (toolAccess.includes('all')) {
      return tools;
    }
    
    // Filtrar ferramentas pelo acesso do usuário e status Pro
    return tools.filter(tool => 
      toolAccess.includes(tool.id) && (!tool.isPro || (tool.isPro && isPro))
    );
  };

  const value = {
    tools,
    addTool,
    updateTool,
    deleteTool,
    getUserTools,
  };

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
};
