import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await requestPasswordReset(email);
      setMessage('Se um e-mail correspondente for encontrado em nosso sistema, um link de redefinição de senha será enviado.');
      toast({
        title: "Solicitação Enviada",
        description: "Verifique sua caixa de entrada para as instruções de redefinição de senha.",
      });
      setEmail('');
    } catch (err) {
      // Even if error, show generic message for security
      setMessage('Se um e-mail correspondente for encontrado em nosso sistema, um link de redefinição de senha será enviado.');
      toast({
        title: "Erro na Solicitação",
        description: "Ocorreu um problema. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-[calc(100vh-250px)] py-12"
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-sm border-pink-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-fancy text-pink-600">Redefinir Senha</CardTitle>
          <CardDescription className="text-pink-500">Insira seu e-mail para receber instruções de como redefinir sua senha.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 bg-green-50 border border-green-300 text-green-700 rounded-md"
            >
              <p>{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-pink-700">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg py-3 transition-all transform hover:scale-105" disabled={isLoading}>
                {isLoading ? 'Enviando...' : <><Send size={18} className="mr-2"/> Enviar Instruções</>}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Link to="/login" className="text-sm text-pink-600 hover:text-pink-700 hover:underline flex items-center">
            <ArrowLeft size={16} className="mr-1" /> Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PasswordResetPage;