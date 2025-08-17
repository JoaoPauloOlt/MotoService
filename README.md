# MotoService

Site institucional da MotoService, uma oficina especializada em motos.

## Tecnologias Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Next.js 14

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
   - Copie `env.example` para `.env.local`
   - Atualize `MONGODB_URI` com sua string de conexão do MongoDB Atlas
   - Atualize `JWT_SECRET` com uma chave segura

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Funcionalidades

- Design responsivo
- Seções: Início, Serviços, Sobre e Contato
- Lista de serviços com preços
- Formulário de contato
- **Sistema de Autenticação Completo** 🔐
  - Login e registro de usuários
  - Proteção de rotas
  - Tokens JWT seguros
  - Sessões persistentes
- **Sistema de Agendamento Protegido** 🆕
  - Requer login para acessar
  - Seleção de serviço
  - Calendário com datas disponíveis
  - Escolha de horários
  - Formulário pré-preenchido com dados do usuário
  - Confirmação de agendamento
- Menu mobile
- Animações CSS
- Integração com MongoDB Atlas

## Estrutura do Projeto

- `pages/index.tsx` - Página principal
- `pages/login.tsx` - Sistema de autenticação (login/registro) 🔐
- `pages/agendamento.tsx` - Sistema de agendamento protegido 🆕
- `pages/_app.tsx` - Configuração da aplicação com AuthProvider
- `pages/_document.tsx` - Configuração do HTML
- `pages/api/auth/` - APIs de autenticação (login, registro, verificação)
- `contexts/AuthContext.tsx` - Contexto de autenticação 🔐
- `models/` - Modelos do MongoDB (User, Appointment)
- `lib/mongodb.ts` - Configuração de conexão com MongoDB
- `global.css` - Estilos globais e variáveis CSS
- `public/img/` - Diretório de imagens
- `package.json` - Dependências do projeto
- `tsconfig.json` - Configuração do TypeScript
- `tailwind.config.js` - Configuração do Tailwind CSS
- `postcss.config.js` - Configuração do PostCSS
- `env.example` - Exemplo de variáveis de ambiente

## Páginas Disponíveis

- **/** - Página inicial com serviços e informações
- **/login** - Sistema de autenticação (login/registro) 🔐
- **/agendamento** - Sistema de agendamento protegido (requer login) 🆕

## 🔐 Sistema de Autenticação

O sistema agora requer login para acessar o agendamento:

1. **Registro**: Usuários podem criar uma conta com nome, email, telefone e senha
2. **Login**: Autenticação com email e senha
3. **Proteção**: A página de agendamento só é acessível para usuários logados
4. **Sessões**: Tokens JWT com validade de 7 dias
5. **Segurança**: Senhas criptografadas com bcrypt
