import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, MinusCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 border-b border-pink-200 last:border-b-0 bg-white rounded-lg shadow-sm mb-3"
    >
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-pink-100">
          <img  src={`https://raw.githubusercontent.com/EsVinicius/Projeto-Integrador-Transdisciplinar/81ed848dade8397223ac67ca2078a35f28079b4d/app/src/assets/products/${item.imageName}.jpg`} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-semibold text-pink-700">{item.name}</h3>
          <p className="text-sm text-gray-500">R$ {item.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-pink-500 hover:text-pink-700">
            <MinusCircle size={20} />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value);
              if (!isNaN(newQuantity)) {
                updateQuantity(item.id, newQuantity > 0 ? newQuantity : 1);
              }
            }}
            className="w-12 text-center border-pink-300 focus:border-pink-500 focus:ring-pink-500"
            min="1"
          />
          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-pink-500 hover:text-pink-700">
            <PlusCircle size={20} />
          </Button>
        </div>
        <p className="font-semibold text-pink-600 w-20 text-right">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </Button>
      </div>
    </motion.div>
  );
};

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center p-8"
      >
        <ShoppingBag size={80} className="text-pink-300 mb-6" />
        <h1 className="text-3xl font-fancy text-pink-600 mb-3">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-6">Que tal explorar nossos deliciosos cupcakes?</p>
        <Button onClick={() => navigate('/')} className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
          Continuar Comprando
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8"
    >
      <h1 className="text-4xl font-fancy text-center mb-10 text-pink-700">Seu Carrinho</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-0">
              <AnimatePresence>
                {cart.map(item => (
                  <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
          {cart.length > 0 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 0.5 }} className="mt-6 flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/')} className="border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600">
                Continuar Comprando
              </Button>
              <Button variant="outline" onClick={clearCart} className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} className="mr-2" /> Limpar Carrinho
              </Button>
            </motion.div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <Card className="shadow-xl rounded-xl bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl font-fancy text-pink-600 text-center">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Entrega</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <hr className="border-pink-200 my-2" />
              <div className="flex justify-between text-xl font-semibold text-pink-700">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/checkout')} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg py-3 transition-all transform hover:scale-105">
                Finalizar Compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;