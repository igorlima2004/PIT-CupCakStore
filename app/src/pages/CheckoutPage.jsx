
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, MapPin, User, Hash, Send } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, updateUserProfile } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState({ street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' });
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCpf(user.cpf || '');
      if (user.address) {
        setAddress(user.address);
        setUseProfileAddress(true);
      }
    }
  }, [user]);

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: "Carrinho Vazio", description: "Adicione itens ao carrinho antes de finalizar.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    const orderData = {
      items: cart,
      total: cartTotal,
      shippingAddress: useProfileAddress && user.address ? user.address : address,
      customerInfo: { name, cpf },
      paymentMethod,
    };
    
    addOrder(orderData);

    if (useProfileAddress && user.address && JSON.stringify(user.address) !== JSON.stringify(address)) {
      // User chose profile address but made changes, offer to save? Or assume these are one-off.
      // For simplicity, we'll just use what's filled.
    } else if (!useProfileAddress) {
      // Offer to save new address to profile
      await updateUserProfile({ address, cpf, name }); // Save name and cpf too
    }

    setTimeout(() => {
      setShowConfetti(true);
      clearCart();
      toast({
        title: "Compra Finalizada com Sucesso!",
        description: "Seu pedido foi processado. Obrigado por comprar na Doce Delícia!",
        className: "bg-green-500 text-white",
      });
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/my-orders');
      }, 3000); // Show confetti for 3 seconds
    }, 1500); // Simulate processing
  };
  
  const ConfettiPiece = ({ id }) => {
    const colors = ['bg-pink-400', 'bg-purple-400', 'bg-yellow-400', 'bg-teal-400'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 1;
    const randomDuration = 2 + Math.random() * 2;
  
    return (
      <motion.div
        key={id}
        className={`absolute w-3 h-5 ${randomColor} rounded-sm opacity-80`}
        style={{ left: `${randomX}vw`, top: '-20px' }}
        initial={{ y: -20, rotate: 0, opacity: 0 }}
        animate={{ 
          y: '100vh', 
          rotate: Math.random() * 720 - 360, 
          opacity: [1, 1, 0] 
        }}
        transition={{ 
          duration: randomDuration, 
          ease: "linear", 
          delay: randomDelay 
        }}
      />
    );
  };

  if (cart.length === 0 && !isProcessing) {
     return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">Seu carrinho está vazio.</h2>
            <Button onClick={() => navigate('/')} className="mt-4">Voltar às compras</Button>
        </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8"
    >
      {showConfetti && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}
        </div>
      )}
      <h1 className="text-4xl font-fancy text-center mb-10 text-pink-700">Finalizar Compra</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna de Informações e Endereço */}
          <Card className="shadow-xl rounded-xl bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader><CardTitle className="font-fancy text-pink-600">Informações Pessoais e Entrega</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-pink-700 flex items-center"><User size={16} className="mr-2 text-pink-400"/>Nome Completo</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="cpf" className="text-pink-700 flex items-center"><Hash size={16} className="mr-2 text-pink-400"/>CPF</Label>
                <Input id="cpf" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" required className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              
              {user && user.address && (
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox id="useProfileAddress" checked={useProfileAddress} onCheckedChange={setUseProfileAddress} className="border-pink-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"/>
                  <Label htmlFor="useProfileAddress" className="text-sm font-medium text-pink-700">Usar endereço do perfil</Label>
                </div>
              )}

              {!useProfileAddress && (
                <motion.div initial={{ opacity:0, height: 0 }} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-4 pt-2 overflow-hidden">
                  <h3 className="text-lg font-semibold text-pink-600 flex items-center"><MapPin size={20} className="mr-2 text-pink-400"/>Endereço de Entrega</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street" className="text-pink-700">Rua</Label>
                      <Input name="street" value={address.street} onChange={handleAddressChange} required={!useProfileAddress} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                    <div>
                      <Label htmlFor="number" className="text-pink-700">Número</Label>
                      <Input name="number" value={address.number} onChange={handleAddressChange} required={!useProfileAddress} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                  </div>
                  {/* Add more address fields: complement, neighborhood, city, state, zip as needed */}
                   <div>
                    <Label htmlFor="complement" className="text-pink-700">Complemento</Label>
                    <Input name="complement" value={address.complement} onChange={handleAddressChange} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="neighborhood" className="text-pink-700">Bairro</Label>
                      <Input name="neighborhood" value={address.neighborhood} onChange={handleAddressChange} required={!useProfileAddress} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-pink-700">Cidade</Label>
                      <Input name="city" value={address.city} onChange={handleAddressChange} required={!useProfileAddress} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state" className="text-pink-700">Estado (UF)</Label>
                      <Input name="state" value={address.state} onChange={handleAddressChange} required={!useProfileAddress} maxLength="2" className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                     <div>
                      <Label htmlFor="zip" className="text-pink-700">CEP</Label>
                      <Input name="zip" value={address.zip} onChange={handleAddressChange} required={!useProfileAddress} placeholder="00000-000" className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500"/>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Coluna de Pagamento e Resumo */}
          <Card className="shadow-xl rounded-xl bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader><CardTitle className="font-fancy text-pink-600">Pagamento e Resumo</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-pink-600 flex items-center"><CreditCard size={20} className="mr-2 text-pink-400"/>Método de Pagamento</h3>
                <div className="p-4 border border-green-300 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="text-green-600" />
                    <span className="font-medium text-green-700">PIX</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Pagamento rápido e seguro. Um QR Code será gerado (simulado).</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-pink-600">Resumo do Pedido</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600 py-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2).replace('.',',')}</span>
                  </div>
                ))}
                <hr className="my-2 border-pink-200"/>
                <div className="flex justify-between font-bold text-xl text-pink-700">
                  <span>Total</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.',',')}</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg py-3 transition-all transform hover:scale-105" disabled={isProcessing}>
                {isProcessing ? 'Processando...' : <><Send size={18} className="mr-2"/>Finalizar com PIX</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutPage;
  