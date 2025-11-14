import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CalendarDays, Hash, DollarSign, Info, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrderStatusBadge = ({ status }) => {
  let bgColor, textColor, text;
  switch (status) {
    case 'Recebido':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      text = 'Recebido';
      break;
    case 'Em preparo':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      text = 'Em Preparo';
      break;
    case 'Enviado':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      text = 'Enviado';
      break;
    case 'Entregue':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-700';
      text = 'Entregue';
      break;
    case 'Cancelado':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      text = 'Cancelado';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      text = status;
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

const MyOrdersPage = () => {
  const { getUserOrders, loading: ordersLoading } = useOrders();
  const { user, loading: authLoading } = useAuth();
  
  const orders = getUserOrders();

  if (authLoading || ordersLoading) {
    return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Por favor, faça login para ver seus pedidos.</h1>
        <Button asChild className="mt-4 bg-pink-500 hover:bg-pink-600 text-white">
          <Link to="/login">Ir para Login</Link>
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center p-8"
      >
        <ShoppingBag size={80} className="text-pink-300 mb-6" />
        <h1 className="text-3xl font-fancy text-pink-600 mb-3">Você ainda não fez nenhum pedido.</h1>
        <p className="text-gray-600 mb-6">Explore nossa loja e encontre seus cupcakes favoritos!</p>
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
          <Link to="/">Ver Cupcakes</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-8"
    >
      <h1 className="text-4xl font-fancy text-center mb-10 text-pink-700">Meus Pedidos</h1>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm border-pink-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-pink-50 p-4 sm:p-6 border-b border-pink-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-xl font-fancy text-pink-600 flex items-center">
                    <Package size={24} className="mr-3 text-pink-500" />
                    Pedido #{order.id.substring(4)}
                  </CardTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
                <CardDescription className="text-pink-500 mt-1 flex items-center text-sm">
                  <CalendarDays size={16} className="mr-2" />
                  Realizado em: {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date).toLocaleTimeString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-pink-700 mb-2">Itens do Pedido:</h4>
                  <ul className="space-y-2">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between items-center text-sm text-gray-700 border-b border-pink-100 py-2 last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3 bg-pink-100">
                            <img  src={`https://raw.githubusercontent.com/EsVinicius/Projeto-Integrador-Transdisciplinar/81ed848dade8397223ac67ca2078a35f28079b4d/app/src/assets/products/${item.imageName}.jpg`} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-pink-200">
                  <div className="flex justify-between items-center font-semibold text-pink-600">
                    <span className="flex items-center"><DollarSign size={18} className="mr-1" />Total do Pedido:</span>
                    <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                {order.shippingAddress && (
                  <div className="text-sm text-gray-600">
                    <h4 className="font-semibold text-pink-700 mt-3 mb-1">Endereço de Entrega:</h4>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement}</p>
                    <p>{order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}</p>
                    <p>CEP: {order.shippingAddress.zip}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-pink-50 p-4 sm:p-6 border-t border-pink-200 flex justify-end">
                <Button variant="outline" size="sm" className="border-pink-500 text-pink-500 hover:bg-pink-100 hover:text-pink-600">
                  <Info size={16} className="mr-2" /> Detalhes do Pedido
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyOrdersPage;