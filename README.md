# 🏍️ MotoService - Sistema de Agendamento

Sistema completo de agendamento de serviços para oficina de motos com autenticação, tema dark e integração WhatsApp.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** (login/registro/logout)
- 📅 **Sistema de agendamentos** com verificação de conflitos
- 🎨 **Tema dark** com detalhes em verde
- 📱 **Integração WhatsApp** com mensagens automáticas
- ⏰ **Horários dinâmicos** (segunda-sexta, sábados, domingos)
- 🚫 **Limitação inteligente**: 1 agendamento por horário por dia
- 📱 **Responsivo** para todos os dispositivos

## 🚀 Deploy no Render

### **Passo 1: Preparar o Projeto**

1. **Fazer commit das alterações:**
```bash
git add .
git commit -m "Preparando para deploy no Render"
git push origin main
```

2. **Verificar se o build funciona localmente:**
```bash
npm run build
```

### **Passo 2: Criar Conta no Render**

1. Acesse [render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New +" → "Web Service"

### **Passo 3: Conectar o Repositório**

1. **Connect Repository:**
   - Selecione seu repositório GitHub
   - Escolha a branch `main`

2. **Configure o Serviço:**
   - **Name:** `motoservice-app`
   - **Environment:** `Node`
   - **Region:** `Oregon (US West)` ou mais próxima
   - **Branch:** `main`

### **Passo 4: Configurar Build**

1. **Build Command:**
```bash
npm ci && npm run build
```

2. **Start Command:**
```bash
npm start
```

**⚠️ IMPORTANTE:** Use `npm ci` em vez de `npm install` para builds mais rápidos e confiáveis.

### **Passo 5: Configurar Variáveis de Ambiente**

Clique em "Environment" e adicione:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/motoservice?retryWrites=true&w=majority
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
NEXTAUTH_SECRET=sua-chave-nextauth-super-secreta-aqui
NEXTAUTH_URL=https://motoservice.onrender.com
```

**⚠️ IMPORTANTE:**
- **MONGODB_URI:** Sua string de conexão do MongoDB Atlas
- **JWT_SECRET:** Gere uma string aleatória forte
- **NEXTAUTH_SECRET:** Gere outra string aleatória forte

### **Passo 6: Deploy**

1. Clique em **"Create Web Service"**
2. Aguarde o build (pode demorar 5-10 minutos)
3. Seu app estará disponível em: `https://motoservice.onrender.com`

## 🔧 Troubleshooting

### **Erro de TypeScript no Build:**
Se você encontrar erro de TypeScript durante o build:

1. **Verifique se as dependências estão corretas:**
   - `typescript`, `@types/node`, `@types/react` devem estar em `dependencies`
   - Não em `devDependencies`

2. **Use o comando correto no Render:**
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`

3. **Verifique o arquivo .npmrc:**
   - Deve conter `legacy-peer-deps=true` e `production=false`

### **Erro de MongoDB:**
- Verifique se a `MONGODB_URI` está correta
- Confirme se o IP do Render está liberado no MongoDB Atlas
- Teste a conexão localmente primeiro

## 🔧 Configuração Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Criar arquivo .env:**
```bash
cp .env.example .env
# Editar com suas credenciais
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
├── pages/                 # Páginas Next.js
│   ├── api/auth/         # APIs de autenticação
│   ├── agendamento.tsx   # Página de agendamento
│   ├── meus-agendamentos.tsx # Lista de agendamentos
│   ├── login.tsx         # Página de login
│   └── register.tsx      # Página de registro
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── models/               # Modelos Mongoose
│   ├── User.ts          # Modelo de usuário
│   └── Appointment.ts   # Modelo de agendamento
├── lib/                  # Utilitários
│   └── mongodb.ts       # Conexão MongoDB
└── styles/               # Estilos CSS
    └── global.css       # Estilos globais
```

## 🌐 URLs do Sistema

- **Home:** `/`
- **Login:** `/login`
- **Registro:** `/register`
- **Agendamento:** `/agendamento`
- **Meus Agendamentos:** `/meus-agendamentos`

## 🔒 Segurança

- **Autenticação JWT** com cookies seguros
- **Validação de rotas** protegidas
- **Verificação de conflitos** no backend
- **Sanitização de dados** em todas as entradas

## 📱 Responsividade

- **Mobile-first** design
- **Tailwind CSS** para estilos responsivos
- **Componentes adaptáveis** para todos os tamanhos

## 🎨 Tema

- **Dark mode** com fundo preto
- **Detalhes em verde** (#22c55e) - cor da logo
- **Gradientes** e sombras personalizadas
- **Animações** suaves e transições

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📞 Suporte

Para dúvidas sobre o deploy ou funcionalidades, consulte a documentação do Render ou entre em contato.

---

**🎯 Status:** ✅ Pronto para deploy no Render!
**🔧 Última atualização:** Sistema de agendamentos com limitação por horário
**🎨 Tema:** Dark mode com detalhes verdes
**🔐 Autenticação:** Completa e segura
