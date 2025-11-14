import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UserCircle, LogOut, PieChart, MessageSquare, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-fancy font-bold text-pink-600 hover:text-pink-700 transition-colors">
          Doce Delícia
        </Link>

        {/* Campo de busca removido */}
        {/* <div className="flex-1 max-w-md mx-4">
          <Input 
            type="search" 
            placeholder="Buscar cupcakes..." 
            className="w-full rounded-full bg-pink-50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
          />
        </div> */}

        <nav className="flex items-center space-x-4 ml-auto"> {/* ml-auto para alinhar à direita após remover busca */}
          <Link to="/cart" className="relative text-gray-600 hover:text-pink-600 transition-colors">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {cartItemCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`} alt={user.email} />
                    <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Olá, {user.name || user.email.split('@')[0]}!</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-account')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Minha Conta</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Meus Pedidos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/feedback')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Feedback</span>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Admin</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <PieChart className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600">
              <UserCircle className="mr-2 h-4 w-4" />
              Login / Cadastro
            </Button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;