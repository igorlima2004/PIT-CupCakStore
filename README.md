# 🧁 Loja de Cupcakes – Projeto Integrador

Este é um sistema web desenvolvido em React como parte do Projeto Integrador Transdisciplinar da graduação em Engenharia de Software (Universidade Cruzeiro do Sul). A aplicação simula uma loja virtual de cupcakes com funcionalidades completas de vitrine, carrinho, pedidos e painel administrativo.

---

## 📁 Como rodar o projeto

Para iniciar o projeto, siga os passos abaixo:

1. Acesse a pasta `/app` do repositório.
2. Instale as dependências com o comando:
   ```
   npm install
   ```
3. Inicie a aplicação localmente:
   ```
   npm run dev
   ```
4. Rodar os testes automatizados:
   ```
   npm run test
   ```

⚠️ **Pré-requisitos:**  
- Ter o [Node.js](https://nodejs.org/) instalado na máquina (versão 16 ou superior).  
- Ter o [npm](https://www.npmjs.com/) instalado (vem junto com o Node.js).

---

## ✨ Funcionalidades principais

- Página inicial (vitrine de cupcakes)
- Carrinho com adição, remoção e total em tempo real
- Cadastro/login de usuários
- Checkout com escolha de endereço (salvo ou novo)
- Simulação de pagamento via Pix
- Acompanhamento de pedidos com status
- Página "Minha Conta" e "Meus Pedidos"
- Área administrativa com controle de pedidos (drag & drop)
- Dashboard com total de vendas e gráfico
- Feedback com nota e comentário
- Máscara de CPF no checkout
- Animação visual ao finalizar pedido

---

>A versão deste repositório não está conectada a serviços externos como Supabase por conter dados sensíveis e informações privadas de pagamento, preservadas por segurança. Apesar disso, o princípio de recepção, manipulação e persistência de dados (CRUD) segue a mesma lógica da arquitetura planejada com Supabase, portanto não há diferenças práticas significativas entre esta versão e uma eventual integração futura (que já foi feita, testada e validada).

---

## 🧱 Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em React, com separação clara de responsabilidades entre componentes, contextos, páginas, dados e recursos compartilhados. A estrutura foi pensada para facilitar a escalabilidade, manutenção e reutilização de código.

### 📂 Estrutura de Pastas

```
src/
├── __tests__/              → Testes automatizados da aplicação (usando React Testing Library)
├── assets/products/        → Imagens dos produtos (cupcakes) usadas no catálogo
├── components/             → Componentes reutilizáveis
│   ├── layout/             → Estrutura de layout comum (ex: Navbar, Footer)
│   ├── product/            → Componentes específicos dos produtos (ex: ProductCard)
│   └── shared/             → Elementos visuais e utilitários compartilhados
├── contexts/               → Contextos globais para gerenciamento de estado
│   ├── AuthContext.jsx     → Autenticação e controle de sessão
│   ├── CartContext.jsx     → Lógica e estado do carrinho
│   ├── OrderContext.jsx    → Controle de pedidos e status
│   └── ProductContext.jsx  → Gerenciamento dos dados dos produtos
├── data/
│   └── products.js         → Lista estática de cupcakes para vitrine
├── lib/
│   └── utils.js            → Formatação de CPF, cálculo de totais etc.
├── pages/                  → Páginas principais da aplicação (rotas)
│   ├── AdminDashboardPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── FeedbackPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── MyAccountPage.jsx
│   ├── MyOrdersPage.jsx
│   ├── NotFoundPage.jsx
│   ├── PasswordResetPage.jsx
│   └── SignupPage.jsx
├── App.jsx
├── main.jsx
├── index.css
├── setupTests.js
```

---

Desenvolvido por **Igor Vinicius Alvarenga Lima**  
Bacharelado de Engenharia de Software – Universidade Cruzeiro do Sul