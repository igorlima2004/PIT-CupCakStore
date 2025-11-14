import React, { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award } from 'lucide-react';

const HomePage = () => {
  const { products, categories, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  }

  const handleSpecialOrderClick = () => {
    window.open('https://wa.me/5511956076609', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-12">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-xl overflow-hidden p-8 md:p-16 text-center md:text-left bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20">
           <img  alt="Delicious cupcakes background" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1602742429271-318c1013fd36" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-fancy font-bold text-white mb-4"
            >
              Cupcakes Deliciosos & Artesanais
            </motion.h1>
            <motion.p 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-white/90 mb-8"
            >
              Descubra o sabor irresistível dos nossos cupcakes feitos com ingredientes selecionados e muito carinho. Perfeitos para qualquer ocasião especial!
            </motion.p>
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8"
            >
              <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg transition-transform hover:scale-105">Ver Cardápio</Button>
              <Button 
                size="lg" 
                onClick={handleSpecialOrderClick}
                className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg transition-transform hover:scale-105"
              >
                Encomendas Especiais
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center justify-center md:justify-start space-x-2 text-white/90"
            >
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm">Mais de 1000 clientes satisfeitos com avaliação média de 5 estrelas</span>
            </motion.div>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 100 }}
            className="hidden md:block rounded-lg overflow-hidden shadow-xl"
          >
             <img  alt="Assorted cupcakes" className="w-full h-auto object-cover" src="https://images.unsplash.com/photo-1695200795046-a26b45c03142" />
          </motion.div>
        </div>
         <div className="absolute top-4 right-4 bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-pulse">
          <Award className="inline mr-1 h-4 w-4" /> Novos sabores toda semana!
        </div>
      </motion.section>

      <section>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-fancy text-center mb-8 text-pink-700"
        >
          Nossos Deliciosos Cupcakes
        </motion.h2>
        <div className="flex justify-center space-x-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize transition-all duration-300 ${selectedCategory === category ? 'bg-pink-500 text-white scale-105' : 'border-pink-300 text-pink-500 hover:bg-pink-100 hover:border-pink-500'}`}
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Nenhum cupcake encontrado nesta categoria.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;