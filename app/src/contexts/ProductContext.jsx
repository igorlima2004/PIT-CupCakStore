
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cupcakeProducts } from '@/data/products';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(cupcakeProducts);
      const uniqueCategories = [...new Set(cupcakeProducts.map(p => p.category))];
      setCategories(['all', ...uniqueCategories]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
  