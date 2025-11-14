
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const storedOrders = localStorage.getItem('cupcakeOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('cupcakeOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para fazer um pedido.", variant: "destructive"});
      return;
    }
    const newOrder = { 
      id: `ORD-${Date.now()}`, 
      userId: user.id, 
      userName: user.name || user.email.split('@')[0],
      date: new Date().toISOString(), 
      status: 'Recebido', 
      ...orderData 
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    toast({ title: "Pedido Realizado!", description: "Seu pedido foi recebido com sucesso."});
    return newOrder;
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  const getAllOrders = () => {
    // This should be admin-only in a real app
    return orders;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // This should be admin-only
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({ title: "Status do Pedido Atualizado", description: `Pedido ${orderId} agora está ${newStatus}.`});
  };

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, getUserOrders, getAllOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
  