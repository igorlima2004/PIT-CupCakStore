import React, { useState, useEffect, useMemo } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ShoppingCart, Package, Users, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Mock Chart Component - replace with actual chart library if needed
const SimpleBarChart = ({ data, dataKey, xAxisKey, title }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-4">Sem dados para exibir no gráfico.</p>;
  }
  const maxValue = Math.max(...data.map(item => item[dataKey]), 0);

  return (
    <Card className="col-span-1 md:col-span-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-fancy text-purple-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64 md:h-80 p-4">
        <div className="flex h-full items-end space-x-2 md:space-x-4 overflow-x-auto pb-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0 w-12 md:w-16">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item[dataKey] / (maxValue || 1)) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md"
                title={`${item[xAxisKey]}: ${item[dataKey]}`}
              />
              <span className="text-xs mt-1 text-gray-600 truncate">{item[xAxisKey]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const AdminDashboardPage = () => {
  const { getAllOrders, updateOrderStatus, loading: ordersLoading } = useOrders();
  const [orders, setOrders] = useState([]);
  const [draggingOrder, setDraggingOrder] = useState(null);

  useEffect(() => {
    if (!ordersLoading) {
      setOrders(getAllOrders());
    }
  }, [getAllOrders, ordersLoading]);

  const orderStatuses = ['Recebido', 'Em preparo', 'Enviado', 'Entregue', 'Cancelado'];

  const handleDragStart = (e, order) => {
    setDraggingOrder(order.id);
    e.dataTransfer.setData('orderId', order.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId && draggingOrder === orderId) {
      updateOrderStatus(orderId, newStatus);
      // Optimistically update local state or refetch
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
    }
    setDraggingOrder(null);
  };

  const dashboardStats = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => order.status !== 'Cancelado' ? sum + order.total : sum, 0);
    const totalOrders = orders.length;
    const ordersByStatus = orderStatuses.reduce((acc, status) => {
      acc[status] = orders.filter(order => order.status === status).length;
      return acc;
    }, {});
    
    // Example data for chart (sales per month - mock)
    const salesData = [
      { month: 'Jan', sales: Math.random() * 5000 }, { month: 'Fev', sales: Math.random() * 5000 },
      { month: 'Mar', sales: Math.random() * 5000 }, { month: 'Abr', sales: totalSales > 0 ? totalSales : Math.random() * 5000 },
      { month: 'Mai', sales: Math.random() * 5000 }, { month: 'Jun', sales: Math.random() * 5000 },
    ];

    return { totalSales, totalOrders, ordersByStatus, salesData };
  }, [orders]);

  if (ordersLoading) {
    return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8"
    >
      <h1 className="text-4xl font-fancy text-center mb-10 admin-gradient-text">Painel Administrativo</h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-6 bg-purple-100 text-purple-700">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Dashboard</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Gerenciar Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <motion.div 
            initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <StatCard icon={<DollarSign />} title="Vendas Totais" value={`R$ ${dashboardStats.totalSales.toFixed(2).replace('.', ',')}`} color="text-green-500" />
            <StatCard icon={<ShoppingCart />} title="Total de Pedidos" value={dashboardStats.totalOrders.toString()} color="text-blue-500" />
            <StatCard icon={<Users />} title="Novos Clientes (Mês)" value="12" color="text-indigo-500" description="Simulado" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SimpleBarChart data={dashboardStats.salesData} dataKey="sales" xAxisKey="month" title="Vendas Mensais (Simulado)" />
            <Card className="md:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-fancy text-purple-700">Pedidos por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {orderStatuses.map(status => (
                    <li key={status} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{status}:</span>
                      <span className="font-semibold text-purple-600">{dashboardStats.ordersByStatus[status] || 0}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          {orders.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-10 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">Nenhum pedido encontrado.</h3>
                <p className="text-gray-500 mt-2">Quando novos pedidos chegarem, eles aparecerão aqui.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {orderStatuses.map(status => (
                <div 
                  key={status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                  className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[200px] border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-purple-700 mb-3 text-center capitalize">{status}</h2>
                  <div className="space-y-3">
                    {orders.filter(order => order.status === status).map(order => (
                      <motion.div
                        key={order.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, order)}
                        layoutId={order.id}
                        className={`p-3 bg-white rounded shadow-sm cursor-grab ${draggingOrder === order.id ? 'opacity-50 ring-2 ring-purple-500' : ''}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                      >
                        <p className="font-medium text-sm text-purple-800">Pedido #{order.id.substring(4)}</p>
                        <p className="text-xs text-gray-600">{order.userName}</p>
                        <p className="text-xs text-gray-500">Total: R$ {order.total.toFixed(2).replace('.', ',')}</p>
                        <p className="text-xs text-gray-500">Itens: {order.items.reduce((sum, i) => sum + i.quantity, 0)}</p>
                      </motion.div>
                    ))}
                    {orders.filter(order => order.status === status).length === 0 && (
                      <p className="text-xs text-gray-400 text-center pt-4">Arraste pedidos para esta coluna.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, description, color = "text-gray-700" }) => (
  <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }}>
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

export default AdminDashboardPage;