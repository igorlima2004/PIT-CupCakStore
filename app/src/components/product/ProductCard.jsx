
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };
  
  const getImageUrl = (imageName) => {
    // This is a placeholder. In a real app, you'd have a mapping or image URLs.
    // For now, we use img-replace for all images.
    return null; 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(255, 105, 180, 0.3)" }}
      className="w-full"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader className="p-0 relative">
          <div className="aspect-square w-full overflow-hidden">
            <img  
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110" 
              alt={product.name}
             src={`https://raw.githubusercontent.com/EsVinicius/Projeto-Integrador-Transdisciplinar/81ed848dade8397223ac67ca2078a35f28079b4d/app/src/assets/products/${product.imageName}.jpg`} /> {/*  */}
          </div>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full text-pink-500 hover:text-pink-600">
            <Heart size={20} />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-fancy text-pink-700 mb-1">{product.name}</CardTitle>
          <CardDescription className="text-sm text-gray-600 mb-2 h-16 overflow-hidden text-ellipsis">{product.description}</CardDescription>
          <p className="text-xl font-semibold text-pink-500">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </CardContent>
        <CardFooter className="p-4 border-t border-pink-100">
          <Button onClick={handleAddToCart} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition-all transform hover:scale-105">
            <ShoppingCart size={18} className="mr-2" /> Adicionar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
  