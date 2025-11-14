import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <AlertTriangle className="w-32 h-32 text-pink-400 mb-8" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-6xl font-fancy font-bold text-pink-600 mb-4"
      >
        404
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-2xl text-pink-500 mb-8"
      >
        Oops! Página não encontrada.
      </motion.p>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-gray-600 max-w-md mb-10"
      >
        Parece que o cupcake que você procura se escondeu! Que tal voltar para a nossa vitrine principal e encontrar outras delícias?
      </motion.p>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-transform hover:scale-105 px-8 py-3 text-lg">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar para a Página Inicial
          </Link>
        </Button>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 opacity-30">
        <div className="w-12 h-12 bg-pink-200 rounded-full animate-bounce delay-0"></div>
        <div className="w-12 h-12 bg-purple-200 rounded-full animate-bounce delay-200"></div>
        <div className="w-12 h-12 bg-rose-200 rounded-full animate-bounce delay-400"></div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;