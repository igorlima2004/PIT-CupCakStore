import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { useProducts } from '@/contexts/ProductContext';

// Mocks
vi.mock('@/contexts/ProductContext');
vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    cart: [],
    cartTotal: 0
  }),
}));

const mockProducts = [
  { id: '1', name: 'Cupcake Chocolate', category: 'tradicional', price: 10 },
  { id: '2', name: 'Cupcake Morango', category: 'tradicional', price: 12 },
];

beforeEach(() => {
  useProducts.mockReturnValue({
    products: mockProducts,
    categories: ['all', 'tradicional'],
    loading: false,
  });
});

const renderPage = () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

test('renderiza título e botões principais', () => {
  renderPage();

  expect(screen.getByText(/Cupcakes Deliciosos/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ver cardápio/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /encomendas especiais/i })).toBeInTheDocument();
});

test('renderiza categorias de filtro', () => {
  renderPage();

  expect(screen.getByRole('button', { name: /todos/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /tradicional/i })).toBeInTheDocument();
});

test('exibe produtos corretamente', () => {
  renderPage();

  expect(screen.getByText('Cupcake Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Cupcake Morango')).toBeInTheDocument();
});

test('filtra produtos por categoria', () => {
  renderPage();

  const btnTradicional = screen.getByRole('button', { name: /tradicional/i });
  fireEvent.click(btnTradicional);

  expect(screen.getByText('Cupcake Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Cupcake Morango')).toBeInTheDocument();
});

test('exibe mensagem quando não há produtos', () => {
  useProducts.mockReturnValueOnce({
    products: [],
    categories: ['all'],
    loading: false,
  });

  renderPage();

  expect(screen.getByText(/nenhum cupcake encontrado/i)).toBeInTheDocument();
});
