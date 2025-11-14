import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cupcakeUser');
      let users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
      
      // Ensure admin user exists
      const adminEmail = 'admin@docedelicia.com'; // Changed admin email
      const adminPassword = 'adminpassword123'; // Changed admin password
      const adminExists = users.some(u => u.email === adminEmail && u.role === 'admin');

      if (!adminExists) {
        const adminUser = { 
          id: 'admin001', 
          name: 'Administrador', 
          email: adminEmail, 
          password: adminPassword, // Store plain password for localStorage auth
          role: 'admin', 
          address: { street: 'Rua da Administração', number: '100', city: 'AdminCity', state: 'AS', zip: '00000-000', cpf: '111.111.111-11'} 
        };
        // Remove any old admin with different credentials if necessary, or just add new one
        users = users.filter(u => u.email !== adminEmail); // remove if exists with other role
        users.push(adminUser);
        localStorage.setItem('cupcakeUsers', JSON.stringify(users));
        console.log('Admin user created/updated in localStorage.');
      }
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Re-fetch full user data from the potentially updated users list
        const fullUser = users.find(u => u.email === parsedUser.email); 
        setUser(fullUser);
      }
      
    } catch (error) {
      console.error("Failed to load user from localStorage or setup admin", error);
      localStorage.removeItem('cupcakeUser');
      // Potentially clear cupcakeUsers if it's corrupted, or handle more gracefully
      // localStorage.removeItem('cupcakeUsers'); 
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = (name, email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => { 
        let users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
        if (users.find(u => u.email === email)) {
          toast({
            title: "Erro no Cadastro",
            description: "Este e-mail já está em uso.",
            variant: "destructive",
          });
          setLoading(false);
          reject(new Error("Email already exists"));
          return;
        }
        const newUser = { id: Date.now().toString(), name, email, password, role: 'customer', address: null };
        users.push(newUser);
        localStorage.setItem('cupcakeUsers', JSON.stringify(users));
        localStorage.setItem('cupcakeUser', JSON.stringify(newUser));
        setUser(newUser);
        toast({
          title: "Cadastro Realizado!",
          description: "Bem-vindo(a) à Doce Delícia!",
        });
        setLoading(false);
        resolve(newUser);
      }, 1000);
    });
  };

  const login = (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          localStorage.setItem('cupcakeUser', JSON.stringify(foundUser));
          setUser(foundUser);
          toast({
            title: "Login Efetuado!",
            description: `Bem-vindo(a) de volta, ${foundUser.name || foundUser.email.split('@')[0]}!`,
          });
          setLoading(false);
          resolve(foundUser);
        } else {
          toast({
            title: "Erro no Login",
            description: "E-mail ou senha inválidos.",
            variant: "destructive",
          });
          setLoading(false);
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('cupcakeUser');
    setUser(null);
    toast({
      title: "Logout Efetuado",
      description: "Até a próxima!",
    });
  };

  const updateUserProfile = (updatedData) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          setLoading(false);
          reject(new Error("User not logged in"));
          return;
        }
        let users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex === -1) {
          setLoading(false);
          reject(new Error("User not found"));
          return;
        }
        
        const updatedUser = { ...users[userIndex], ...updatedData };
        users[userIndex] = updatedUser;
        
        localStorage.setItem('cupcakeUsers', JSON.stringify(users));
        localStorage.setItem('cupcakeUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast({
          title: "Perfil Atualizado",
          description: "Suas informações foram salvas com sucesso.",
        });
        setLoading(false);
        resolve(updatedUser);
      }, 500);
    });
  };
  
  const requestPasswordReset = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // const users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
        // Simulating the check without exposing if email exists for security
        // if (users.find(u => u.email === email)) { ... }
        toast({
          title: "Recuperação de Senha",
          description: "Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.",
        });
        resolve();
      }, 1000);
    });
  };


  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUserProfile, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);