# Projeto Lógico Banco de Dados

Projeto lógico do banco de dados do PIT(Projeto Integrador Transdisciplinar) do CupCakeStore:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    street VARCHAR(255) NOT NULL,
    number VARCHAR(10),
    complement VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    address_id INT NOT NULL REFERENCES addresses(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente',
    payment_method VARCHAR(50) DEFAULT 'Pix',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    order_id INT REFERENCES orders(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Dicionário de Dados

Este dicionário de dados documenta as tabelas criadas para o projeto "Loja de Cupcakes", baseado na arquitetura React descrita no README. Ele inclui descrições das tabelas, colunas, tipos de dados, restrições e relacionamentos. O banco é relacional (ex.: PostgreSQL), com foco em funcionalidades como autenticação, carrinho, pedidos e painel administrativo. As restrições garantem integridade (ex.: chaves estrangeiras) e validação (ex.: CHECK para ratings).

### 1. **Tabela: users** (Usuários)

- **Descrição**: Armazena informações de usuários para cadastro, login e sessão (mapeia AuthContext). Suporta autenticação segura com hash de senha.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do usuário (auto-incremento).
    - `name` (VARCHAR(255) NOT NULL): Nome completo do usuário.
    - `email` (VARCHAR(255) UNIQUE NOT NULL): Endereço de email único para login.
    - `password_hash` (VARCHAR(255) NOT NULL): Hash criptografado da senha (usar bcrypt).
    - `cpf` (VARCHAR(14) UNIQUE): CPF do usuário, mascarado conforme utils.js (pode ser NULL).
    - `created_at` (TIMESTAMP DEFAULT NOW()): Data e hora de criação do registro.
    - `updated_at` (TIMESTAMP DEFAULT NOW()): Data e hora da última atualização.

### 2. **Tabela: products** (Produtos)

- **Descrição**: Contém o catálogo de cupcakes (substitui dados estáticos em data/products.js). Usada para vitrine e cálculos de preço.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do produto (auto-incremento).
    - `name` (VARCHAR(255) NOT NULL): Nome do cupcake (ex.: "Cupcake de Chocolate").
    - `description` (TEXT): Descrição detalhada do produto (pode ser NULL).
    - `price` (DECIMAL(10,2) NOT NULL): Preço unitário em reais (com 2 casas decimais).
    - `image_url` (VARCHAR(500)): URL da imagem do produto (de assets/products/, pode ser NULL).
    - `stock` (INT DEFAULT 0): Quantidade em estoque (padrão 0).
    - `category` (VARCHAR(100)): Categoria do produto (ex.: "Tradicional", pode ser NULL).
    - `created_at` (TIMESTAMP DEFAULT NOW()): Data e hora de criação do registro.

### 3. **Tabela: addresses** (Endereços)

- **Descrição**: Salva endereços de entrega para usuários (usado no checkout). Permite múltiplos endereços por usuário, com um padrão.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do endereço (auto-incremento).
    - `user_id` (INT NOT NULL, FOREIGN KEY REFERENCES users(id)): ID do usuário dono do endereço (relacionamento obrigatório).
    - `street` (VARCHAR(255) NOT NULL): Nome da rua.
    - `number` (VARCHAR(10)): Número do endereço (pode ser NULL).
    - `complement` (VARCHAR(255)): Complemento do endereço (ex.: "Apto 101", pode ser NULL).
    - `city` (VARCHAR(100) NOT NULL): Cidade.
    - `state` (VARCHAR(50) NOT NULL): Estado (ex.: "SP").
    - `zip_code` (VARCHAR(10) NOT NULL): Código postal (CEP).
    - `is_default` (BOOLEAN DEFAULT FALSE): Indica se é o endereço padrão do usuário.

### 4. **Tabela: carts** (Carrinhos)

- **Descrição**: Representa o carrinho de compras de cada usuário (mapeia CartContext). Permite gerenciamento em tempo real.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do carrinho (auto-incremento).
    - `user_id` (INT NOT NULL, FOREIGN KEY REFERENCES users(id)): ID do usuário dono do carrinho (relacionamento obrigatório).
    - `created_at` (TIMESTAMP DEFAULT NOW()): Data e hora de criação do carrinho.

### 5. **Tabela: cart_items** (Itens do Carrinho)

- **Descrição**: Detalha os produtos adicionados ao carrinho, com quantidades (suporta adição/removação em tempo real).
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do item (auto-incremento).
    - `cart_id` (INT NOT NULL, FOREIGN KEY REFERENCES carts(id)): ID do carrinho associado (relacionamento obrigatório).
    - `product_id` (INT NOT NULL, FOREIGN KEY REFERENCES products(id)): ID do produto (relacionamento obrigatório).
    - `quantity` (INT NOT NULL): Quantidade do produto no carrinho.
    - `added_at` (TIMESTAMP DEFAULT NOW()): Data e hora em que o item foi adicionado.

### 6. **Tabela: orders** (Pedidos)

- **Descrição**: Registra pedidos feitos pelos usuários, com status para acompanhamento (mapeia OrderContext e painel admin, suporta drag & drop).
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do pedido (auto-incremento).
    - `user_id` (INT NOT NULL, FOREIGN KEY REFERENCES users(id)): ID do usuário que fez o pedido (relacionamento obrigatório).
    - `address_id` (INT NOT NULL, FOREIGN KEY REFERENCES addresses(id)): ID do endereço de entrega (relacionamento obrigatório).
    - `total` (DECIMAL(10,2) NOT NULL): Valor total do pedido (calculado via utils.js).
    - `status` (VARCHAR(50) DEFAULT 'Pendente'): Status do pedido (ex.: "Pendente", "Em Preparo", "Enviado", "Entregue").
    - `payment_method` (VARCHAR(50) DEFAULT 'Pix'): Método de pagamento (ex.: "Pix").
    - `created_at` (TIMESTAMP DEFAULT NOW()): Data e hora do pedido.
    - `updated_at` (TIMESTAMP DEFAULT NOW()): Data e hora da última atualização.

### 7. **Tabela: order_items** (Itens do Pedido)

- **Descrição**: Lista os produtos incluídos em cada pedido, com preços na época da compra.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do item (auto-incremento).
    - `order_id` (INT NOT NULL, FOREIGN KEY REFERENCES orders(id)): ID do pedido associado (relacionamento obrigatório).
    - `product_id` (INT NOT NULL, FOREIGN KEY REFERENCES products(id)): ID do produto (relacionamento obrigatório).
    - `quantity` (INT NOT NULL): Quantidade do produto no pedido.
    - `price` (DECIMAL(10,2) NOT NULL): Preço unitário do produto na época da compra.

### 8. **Tabela: feedbacks** (Feedbacks)

- **Descrição**: Armazena avaliações dos usuários após pedidos (mapeia FeedbackPage), com notas e comentários.
- **Colunas**:
    - `id` (SERIAL PRIMARY KEY): Identificador único do feedback (auto-incremento).
    - `user_id` (INT NOT NULL, FOREIGN KEY REFERENCES users(id)): ID do usuário que deu o feedback (relacionamento obrigatório).
    - `order_id` (INT, FOREIGN KEY REFERENCES orders(id)): ID do pedido relacionado (opcional, pode ser NULL).
    - `rating` (INT CHECK (rating >= 1 AND rating <= 5)): Nota de avaliação (de 1 a 5 estrelas).
    - `comment` (TEXT): Comentário opcional do usuário (pode ser NULL).
    - `created_at` (TIMESTAMP DEFAULT NOW()): Data e hora do feedback.

### Notas Gerais sobre o Dicionário

- **Tipos de Dados**: Baseados em PostgreSQL (ex.: SERIAL para auto-incremento, DECIMAL para preços).
- **Restrições**: Incluem PRIMARY KEY, FOREIGN KEY para integridade referencial, UNIQUE para evitar duplicatas (ex.: email, CPF), e CHECK para validações (ex.: rating).
- **Relacionamentos**: Todos os FOREIGN KEY garantem consistência (ex.: um pedido sempre vinculado a um usuário).
- **Uso no Projeto**: Esse dicionário facilita a integração com React (ex.: queries em contextos) e testes. Para implementar.