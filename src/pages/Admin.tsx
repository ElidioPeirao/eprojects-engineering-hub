import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UserContext";
import { useTools } from "@/contexts/ToolContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Tool } from "@/types";
import { toast } from "@/components/ui/sonner";

const Admin = () => {
  const { currentUser, isAdmin } = useAuth();
  const { users, addUser, updateUser, deleteUser, setPro, setAdmin } = useUsers();
  const { tools, addTool, updateTool, deleteTool } = useTools();
  const navigate = useNavigate();

  // Estados para formulários
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsPro, setNewIsPro] = useState(false);
  const [newProDays, setNewProDays] = useState("30");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  
  const [newToolName, setNewToolName] = useState("");
  const [newToolDescription, setNewToolDescription] = useState("");
  const [newToolLink, setNewToolLink] = useState("");
  const [newToolIcon, setNewToolIcon] = useState("calculator");
  const [newToolCategory, setNewToolCategory] = useState<"engineering" | "electrical" | "custom">("custom");
  const [newToolIsPro, setNewToolIsPro] = useState(false);

  // Estados para diálogos
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isEditToolDialogOpen, setIsEditToolDialogOpen] = useState(false);
  const [isProDurationDialogOpen, setIsProDurationDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "user" | "tool" } | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);
  const [userForProSettings, setUserForProSettings] = useState<User | null>(null);
  const [proDurationDays, setProDurationDays] = useState("30");
  
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Funções para gerenciamento de usuários
  const handleAddUser = () => {
    if (!newUsername || !newEmail || !newPassword) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      email: newEmail,
      isPro: newIsPro,
      isAdmin: newIsAdmin,
      createdAt: new Date(),
      toolAccess: ['engineering-calculator', 'electrical-calculator'],
    };
    
    if (newIsPro) {
      const proExpiryDate = new Date();
      proExpiryDate.setDate(proExpiryDate.getDate() + parseInt(newProDays));
      newUser.proExpiryDate = proExpiryDate;
    }
    
    addUser(newUser);
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setNewIsPro(false);
    setNewProDays("30");
    setNewIsAdmin(false);
    setIsUserDialogOpen(false);
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${newUsername} foi criado com sucesso.`
    });
  };

  const handleEditUser = () => {
    if (!userToEdit) return;
    
    const updates: Partial<User> = {
      username: userToEdit.username,
      email: userToEdit.email,
      isPro: userToEdit.isPro,
      isAdmin: userToEdit.isAdmin,
    };
    
    if (userToEdit.isPro) {
      const proExpiryDate = new Date();
      if (userToEdit.proExpiryDate) {
        // Manter a data existente se já tiver
        updates.proExpiryDate = userToEdit.proExpiryDate;
      } else {
        // Adicionar 30 dias se não tiver data
        proExpiryDate.setDate(proExpiryDate.getDate() + 30);
        updates.proExpiryDate = proExpiryDate;
      }
    } else {
      updates.proExpiryDate = undefined;
    }
    
    updateUser(userToEdit.id, updates);
    setIsEditUserDialogOpen(false);
    setUserToEdit(null);
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso."
    });
  };

  const handleProDurationConfirm = () => {
    if (!userForProSettings) return;
    
    const days = parseInt(proDurationDays);
    if (isNaN(days) || days <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número válido de dias.",
        variant: "destructive"
      });
      return;
    }
    
    setPro(userForProSettings.id, true, days);
    setIsProDurationDialogOpen(false);
    setUserForProSettings(null);
    toast({
      title: "Status PRO atualizado",
      description: `Acesso PRO ativado por ${days} dias.`
    });
  };

  const toggleUserAdmin = (user: User) => {
    if (user.id === '1') {
      toast({
        title: "Operação não permitida",
        description: "Não é possível modificar o status de admin do usuário principal.",
        variant: "destructive"
      });
      return;
    }
    
    setAdmin(user.id, !user.isAdmin);
    toast({
      title: "Status de admin atualizado",
      description: user.isAdmin ? "Privilégios de admin removidos." : "Privilégios de admin concedidos."
    });
  };

  const openProDurationDialog = (user: User) => {
    setUserForProSettings(user);
    setProDurationDays("30");
    setIsProDurationDialogOpen(true);
  };

  const removeProAccess = (id: string) => {
    setPro(id, false, 0);
    toast({
      title: "Status PRO removido",
      description: "O acesso PRO foi removido deste usuário."
    });
  };

  // Funções para gerenciamento de ferramentas
  const handleAddTool = () => {
    if (!newToolName || !newToolDescription || !newToolLink) return;
    
    addTool({
      name: newToolName,
      description: newToolDescription,
      link: newToolLink,
      icon: newToolIcon,
      isPro: newToolIsPro,
      category: newToolCategory,
    });
    
    setNewToolName("");
    setNewToolDescription("");
    setNewToolLink("");
    setNewToolIcon("calculator");
    setNewToolCategory("custom");
    setNewToolIsPro(false);
    setIsToolDialogOpen(false);
  };

  const handleEditTool = () => {
    if (!toolToEdit) return;
    
    updateTool(toolToEdit.id, {
      name: toolToEdit.name,
      description: toolToEdit.description,
      link: toolToEdit.link,
      icon: toolToEdit.icon,
      isPro: toolToEdit.isPro,
      category: toolToEdit.category,
    });
    
    setIsEditToolDialogOpen(false);
    setToolToEdit(null);
  };

  // Função para confirmação de exclusão
  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === "user") {
      deleteUser(itemToDelete.id);
    } else {
      deleteTool(itemToDelete.id);
    }
    
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Formatar data
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Calcular dias restantes para expiração PRO
  const getRemainingProDays = (expiryDate: Date | undefined) => {
    if (!expiryDate) return 0;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  if (!currentUser || !isAdmin) {
    return null; // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-eprojects-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-eprojects-white/70">
            Gerencie usuários, ferramentas e configurações do EPROJECTS
          </p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="users" className="data-[state=active]:bg-eprojects-orange">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-eprojects-orange">
              Ferramentas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="glass-card mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-eprojects-white text-xl">Gerenciar Usuários</CardTitle>
                  <CardDescription className="text-eprojects-white/70">
                    Veja e gerencie os usuários da plataforma
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsUserDialogOpen(true)}
                  className="bg-eprojects-orange hover:bg-eprojects-orange/90"
                >
                  Novo Usuário
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-black/30">
                      <TableRow>
                        <TableHead className="text-eprojects-white">Usuário</TableHead>
                        <TableHead className="text-eprojects-white">Email</TableHead>
                        <TableHead className="text-eprojects-white">Status</TableHead>
                        <TableHead className="text-eprojects-white">Dias PRO Restantes</TableHead>
                        <TableHead className="text-eprojects-white">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-white/5">
                          <TableCell className="font-medium text-eprojects-white">
                            {user.username}
                            {user.isAdmin && (
                              <span className="ml-2 px-2 py-0.5 bg-eprojects-orange/20 text-eprojects-orange text-xs rounded-full">
                                Admin
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-eprojects-white/80">{user.email}</TableCell>
                          <TableCell>
                            {user.isPro ? (
                              <span className="px-2 py-1 bg-eprojects-orange/20 text-eprojects-orange text-xs rounded-full">
                                PRO
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                                Padrão
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-eprojects-white/80">
                            {user.isPro ? `${getRemainingProDays(user.proExpiryDate)} dias` : "N/A"}
                          </TableCell>
                          <TableCell className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                              onClick={() => {
                                setUserToEdit(user);
                                setIsEditUserDialogOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                            {user.isPro ? (
                              <Button
                                variant="outline"
                                className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                                onClick={() => removeProAccess(user.id)}
                              >
                                Remover PRO
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                                onClick={() => openProDurationDialog(user)}
                              >
                                Ativar PRO
                              </Button>
                            )}
                            {user.id !== '1' && (
                              <>
                                <Button
                                  variant="outline"
                                  className={`border-eprojects-orange ${user.isAdmin ? 'bg-eprojects-orange/20' : ''} text-eprojects-orange hover:bg-eprojects-orange hover:text-white`}
                                  onClick={() => toggleUserAdmin(user)}
                                >
                                  {user.isAdmin ? "Remover Admin" : "Tornar Admin"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                                  onClick={() => {
                                    setItemToDelete({ id: user.id, type: "user" });
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  Excluir
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools">
            <Card className="glass-card mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-eprojects-white text-xl">Gerenciar Ferramentas</CardTitle>
                  <CardDescription className="text-eprojects-white/70">
                    Adicione e configure ferramentas para os usuários
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsToolDialogOpen(true)}
                  className="bg-eprojects-orange hover:bg-eprojects-orange/90"
                >
                  Nova Ferramenta
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-black/30">
                      <TableRow>
                        <TableHead className="text-eprojects-white">Nome</TableHead>
                        <TableHead className="text-eprojects-white">Descrição</TableHead>
                        <TableHead className="text-eprojects-white">Link</TableHead>
                        <TableHead className="text-eprojects-white">Tipo</TableHead>
                        <TableHead className="text-eprojects-white">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools.map((tool) => (
                        <TableRow key={tool.id} className="border-white/5">
                          <TableCell className="font-medium text-eprojects-white">
                            {tool.name}
                            {tool.isPro && (
                              <span className="ml-2 px-2 py-0.5 bg-eprojects-orange/20 text-eprojects-orange text-xs rounded-full">
                                PRO
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-eprojects-white/80">
                            {tool.description}
                          </TableCell>
                          <TableCell className="text-eprojects-white/80 max-w-xs truncate">
                            {tool.link}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                              {tool.category}
                            </span>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="outline"
                              className="border-eprojects-orange text-eprojects-orange hover:bg-eprojects-orange hover:text-white"
                              onClick={() => {
                                setToolToEdit(tool);
                                setIsEditToolDialogOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => {
                                setItemToDelete({ id: tool.id, type: "tool" });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Excluir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Diálogo de Novo Usuário */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Adicionar Novo Usuário</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              Preencha os dados para criar uma nova conta de usuário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">Nome de Usuário</Label>
              <Input
                id="new-username"
                placeholder="Digite o nome de usuário"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="usuario@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite uma senha segura"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="new-is-pro" 
                checked={newIsPro}
                onCheckedChange={() => setNewIsPro(!newIsPro)}
              />
              <Label htmlFor="new-is-pro">Ativar modo PRO</Label>
            </div>
            {newIsPro && (
              <div className="space-y-2">
                <Label htmlFor="pro-days">Dias de acesso PRO</Label>
                <Input
                  id="pro-days"
                  type="number"
                  placeholder="Número de dias"
                  value={newProDays}
                  onChange={(e) => setNewProDays(e.target.value)}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
            )}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="new-is-admin" 
                checked={newIsAdmin}
                onCheckedChange={() => setNewIsAdmin(!newIsAdmin)}
              />
              <Label htmlFor="new-is-admin">Conceder privilégios de Admin</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUserDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddUser}
              className="bg-eprojects-orange hover:bg-eprojects-orange/90"
            >
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Edição de Usuário */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Editar Usuário</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              Edite as informações do usuário
            </DialogDescription>
          </DialogHeader>
          {userToEdit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Nome de Usuário</Label>
                <Input
                  id="edit-username"
                  value={userToEdit.username}
                  onChange={(e) => setUserToEdit({ ...userToEdit, username: e.target.value })}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-is-pro" 
                  checked={userToEdit.isPro}
                  onCheckedChange={() => setUserToEdit({ ...userToEdit, isPro: !userToEdit.isPro })}
                />
                <Label htmlFor="edit-is-pro">Modo PRO</Label>
              </div>
              {userToEdit.id !== '1' && (
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="edit-is-admin" 
                    checked={userToEdit.isAdmin}
                    onCheckedChange={() => setUserToEdit({ ...userToEdit, isAdmin: !userToEdit.isAdmin })}
                  />
                  <Label htmlFor="edit-is-admin">Privilégios de Admin</Label>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditUser}
              className="bg-eprojects-orange hover:bg-eprojects-orange/90"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Configuração de Duração PRO */}
      <Dialog open={isProDurationDialogOpen} onOpenChange={setIsProDurationDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Configurar Acesso PRO</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              {userForProSettings && `Definir período de acesso PRO para ${userForProSettings.username}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pro-duration">Dias de acesso PRO</Label>
              <Input
                id="pro-duration"
                type="number"
                value={proDurationDays}
                onChange={(e) => setProDurationDays(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsProDurationDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleProDurationConfirm}
              className="bg-eprojects-orange hover:bg-eprojects-orange/90"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Nova Ferramenta */}
      <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Adicionar Nova Ferramenta</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              Crie uma nova ferramenta para os usuários
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-tool-name">Nome da Ferramenta</Label>
              <Input
                id="new-tool-name"
                placeholder="Ex: Calculadora de Estruturas"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tool-description">Descrição</Label>
              <Input
                id="new-tool-description"
                placeholder="Descreva brevemente a ferramenta"
                value={newToolDescription}
                onChange={(e) => setNewToolDescription(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tool-link">Link</Label>
              <Input
                id="new-tool-link"
                placeholder="Ex: /tools/nome-da-ferramenta"
                value={newToolLink}
                onChange={(e) => setNewToolLink(e.target.value)}
                className="bg-black/50 border-white/20 text-eprojects-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tool-icon">Ícone</Label>
              <Select
                value={newToolIcon}
                onValueChange={setNewToolIcon}
              >
                <SelectTrigger className="bg-black/50 border-white/20 text-eprojects-white">
                  <SelectValue placeholder="Selecione um ícone" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-eprojects-white">
                  <SelectItem value="calculator">Calculadora</SelectItem>
                  <SelectItem value="wrench">Chave Inglesa</SelectItem>
                  <SelectItem value="settings">Engrenagens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tool-category">Categoria</Label>
              <Select
                value={newToolCategory}
                onValueChange={(value) => setNewToolCategory(value as "engineering" | "electrical" | "custom")}
              >
                <SelectTrigger className="bg-black/50 border-white/20 text-eprojects-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-eprojects-white">
                  <SelectItem value="engineering">Engenharia</SelectItem>
                  <SelectItem value="electrical">Elétrica</SelectItem>
                  <SelectItem value="custom">Customizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="new-tool-is-pro" 
                checked={newToolIsPro}
                onCheckedChange={() => setNewToolIsPro(!newToolIsPro)}
              />
              <Label htmlFor="new-tool-is-pro">Ferramenta exclusiva para PRO</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsToolDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddTool}
              className="bg-eprojects-orange hover:bg-eprojects-orange/90"
            >
              Adicionar Ferramenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Edição de Ferramenta */}
      <Dialog open={isEditToolDialogOpen} onOpenChange={setIsEditToolDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Editar Ferramenta</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              Altere os detalhes da ferramenta
            </DialogDescription>
          </DialogHeader>
          {toolToEdit && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tool-name">Nome da Ferramenta</Label>
                <Input
                  id="edit-tool-name"
                  value={toolToEdit.name}
                  onChange={(e) => setToolToEdit({ ...toolToEdit, name: e.target.value })}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tool-description">Descrição</Label>
                <Input
                  id="edit-tool-description"
                  value={toolToEdit.description}
                  onChange={(e) => setToolToEdit({ ...toolToEdit, description: e.target.value })}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tool-link">Link</Label>
                <Input
                  id="edit-tool-link"
                  value={toolToEdit.link}
                  onChange={(e) => setToolToEdit({ ...toolToEdit, link: e.target.value })}
                  className="bg-black/50 border-white/20 text-eprojects-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tool-icon">Ícone</Label>
                <Select
                  value={toolToEdit.icon}
                  onValueChange={(value) => setToolToEdit({ ...toolToEdit, icon: value })}
                >
                  <SelectTrigger className="bg-black/50 border-white/20 text-eprojects-white">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 text-eprojects-white">
                    <SelectItem value="calculator">Calculadora</SelectItem>
                    <SelectItem value="wrench">Chave Inglesa</SelectItem>
                    <SelectItem value="settings">Engrenagens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tool-category">Categoria</Label>
                <Select
                  value={toolToEdit.category}
                  onValueChange={(value) => setToolToEdit({ ...toolToEdit, category: value as "engineering" | "electrical" | "custom" })}
                >
                  <SelectTrigger className="bg-black/50 border-white/20 text-eprojects-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 text-eprojects-white">
                    <SelectItem value="engineering">Engenharia</SelectItem>
                    <SelectItem value="electrical">Elétrica</SelectItem>
                    <SelectItem value="custom">Customizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-tool-is-pro" 
                  checked={toolToEdit.isPro}
                  onCheckedChange={() => setToolToEdit({ ...toolToEdit, isPro: !toolToEdit.isPro })}
                />
                <Label htmlFor="edit-tool-is-pro">Ferramenta exclusiva para PRO</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditToolDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditTool}
              className="bg-eprojects-orange hover:bg-eprojects-orange/90"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-eprojects-white">
          <DialogHeader>
            <DialogTitle className="text-eprojects-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-eprojects-white/70">
              Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
