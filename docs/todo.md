# 🚀 Plano de Desenvolvimento Detalhado (Backlog MVP - 12 Semanas)

## **Fase 1: Configuração e Módulo de Autenticação Base (Semanas 1-2)**

### **Tarefa 1.0: Inicialização do Projeto e Infraestrutura Base**

- [x] 1.0.1 Configurar repositórios (Frontend: Flutter; Backend: Node.js/Monolito Modularizado).
- [x] 1.0.2 Configurar o ambiente de desenvolvimento local (Docker para PostgreSQL/PostGIS).
- [x] 1.0.3 Configurar *pipeline* CI/CD básica (Autobuild/Testes unitários simples).
- [x] 1.0.4 Configurar o *schema* inicial do banco de dados (Tabelas `Users` e `User_Credentials`).

**Dependências:** Nenhuma

### **Tarefa 1.1: Módulo de Usuário e Autenticação (sj-auth-service)**

- [x] 1.1.1 Implementar endpoint de Registro (`POST /users/register`).
    * *Contexto:* Receber nome, senha, CPF e e-mail (`@ufba.br`).
- [x] 1.1.2 Implementar a lógica de **Validação de Domínio** (`@ufba.br`) no registro (RF1).
- [x] 1.1.3 Implementar o endpoint de Login (`POST /users/login`).
    * *Contexto:* Gerar e retornar um JWT válido.
- [x] 1.1.4 Implementar a **Criptografia de Senha** (bcrypt) e **Criptografia do CPF** (RNF-Segurança).

**Dependências:** 1.0.4

### **Tarefa 1.2: Frontend - Tela de Login/Registro**

- [ ] 1.2.1 Configurar o projeto Flutter e o tema (Cores: Azul Vivo e Verde Esmeralda).
- [ ] 1.2.2 Implementar a tela de Registro e integração com o endpoint 1.1.1.
- [ ] 1.2.3 Implementar a tela de Login e manipulação de tokens JWT no Frontend.
- [ ] 1.2.4 Implementar uma **Tela de Espera/Verificação** (`Pending Verification`).

**Dependências:** 1.1.1, 1.1.3

**Status:** Scaffold `sj-client` criado com telas de `Login` e `Register` e serviço `Api` para chamadas `POST /users/register` e `POST /users/login`.

Updated files: `sj-client/pubspec.yaml`, `sj-client/lib/main.dart`, `sj-client/lib/screens/login.dart`, `sj-client/lib/screens/register.dart`, `sj-client/lib/services/api.dart`.

---

## **Fase 2: Validação, Perfis e Módulo Core Base (Semanas 3-4)**

### **Tarefa 2.0: Validação de E-mail e Perfis (sj-auth-service)**

- [x] 2.0.1 Implementar Serviço de E-mail (Ex: SendGrid/SES) para envio de links de confirmação (ou fallback por log).
- [x] 2.0.2 Implementar endpoint de **Confirmação de E-mail** (`GET /users/verify/:token`) (Auth-2.1).
- [x] 2.0.3 Criar *schema* para **Chave PIX** e implementar o endpoint de cadastro/edição (`PUT /profile/pix`).
- [x] 2.0.4 Implementar a lógica de *upload* e armazenamento seguro da **Foto de Perfil** (Auth-2.3).

**Dependências:** 1.1.4

**Status:** Implementado (mailer com `nodemailer` — loga link se SMTP não configurado; endpoints `/users/verify/:token`, `PUT /profile/pix`, `POST /profile/photo`).

### **Tarefa 2.1: Módulo de Caronas Core (sj-rides-core-api) - Setup Geo**

- [ ] 2.1.1 Configurar a API de Integração com o **Google Maps Platform (Geocoding API)**.
- [ ] 2.1.2 Criar *schema* `Rides` no PostGIS, incluindo campos `start_location` e `end_location` do tipo **`geometry(Point, 4326)`**.
- [ ] 2.1.3 Criar o endpoint de **Publicação de Carona** (`POST /rides`).
    * *Contexto:* Receber endereço de texto, chamar 2.1.1 para converter para $(lat, long)$ e salvar como `Point` (Rides-1.1).

- [x] 2.1.1 Configurar a API de Integração com o **Google Maps Platform (Geocoding API)** (env var `GOOGLE_MAPS_API_KEY`, fallback para log).
- [x] 2.1.2 Criar *schema* `Rides` no PostGIS, incluindo campos `start_location` e `end_location` do tipo **`geometry(Point, 4326)`**.
- [x] 2.1.3 Criar o endpoint de **Publicação de Carona** (`POST /rides`).
    * *Contexto:* Receber endereço de texto, chamar 2.1.1 para converter para $(lat, long)$ e salvar como `Point` (Rides-1.1). Se a API não estiver configurada, salva sem geometria e loga aviso.

**Dependências:** 1.0.4

**Status:** Implementado — `sj-backend/src/services/geocode.js`, `sj-backend/src/routes/rides.js`, `db/init.sql` atualizado.

### **Tarefa 2.2: Frontend - Tela de Perfil e Home**

- [ ] 2.2.1 Implementar a tela de **Edição de Perfil** (Nome, Foto, Chave PIX).
- [ ] 2.2.2 Implementar a tela **Home/Dashboard** com botões claros de **"Oferecer Carona"** e **"Buscar Carona"** (Princípio de Design: Foco na Ação).

**Dependências:** 2.0.4, 2.0.3

---

## **Fase 3: Matching Geográfico e Ciclo de Vida (Semanas 5-6)**

### **Tarefa 3.0: Algoritmo de Matching (sj-rides-core-api)**

- [ ] 3.0.1 Implementar o endpoint de **Busca de Caronas** (`GET /rides/search`) (Rides-1.2).
    * *Contexto:* Receber Partida e Destino do passageiro. Usar 2.1.1 para converter para `Point`.
- [ ] 3.0.2 Implementar a **Consulta PostGIS** principal: buscar caronas disponíveis (`status='Publicada'`) cuja rota intercepte um raio de **5 km** da rota do passageiro.
- [ ] 3.0.3 Implementar a **Sugestão de Preço** (RF4): Calcular a distância da rota (em km) e sugerir o valor de rateio.

**Dependências:** 2.1.3

### **Tarefa 3.1: Gerenciamento do Ciclo de Vida (sj-rides-core-api)**

- [ ] 3.1.1 Implementar endpoint de **Solicitação de Vaga** (`POST /rides/:id/request`) (Rides-1.3).
    * *Contexto:* Verificar vagas antes de criar o registro de solicitação.
- [ ] 3.1.2 Implementar endpoints de **Aceitar** e **Recusar** solicitação (`PUT /rides/:id/accept-request`).
    * *Contexto:* Ao aceitar o primeiro passageiro, atualizar o *status* da carona para **"Confirmada"**.
- [ ] 3.1.3 Implementar endpoint de **Início da Viagem** (`PUT /rides/:id/start`) (Rides-1.5).
    * *Contexto:* Atualizar *status* para **"Em Curso"**.

**Dependências:** 3.0.3

### **Tarefa 3.2: Frontend - Visualização e Solicitação**

- [ ] 3.2.1 Implementar a tela de **Busca de Caronas** (integração com 3.0.1).
- [ ] 3.2.2 Implementar o **Card de Carona** (exibindo nome do motorista e nota média).
- [ ] 3.2.3 Implementar o fluxo de **Solicitação de Vaga** e confirmação.

**Dependências:** 3.0.1, 3.1.2

---

## **Fase 4: Comunicação e Notificação (Semanas 7-8)**

### **Tarefa 4.0: Serviço de Notificação (sj-notify-service) - Setup**

- [ ] 4.0.1 Configurar o serviço de Push (Firebase Cloud Messaging - FCM para Android/iOS).
- [ ] 4.0.2 Criar endpoints internos para receber *triggers* de eventos do `sj-rides-core-api` (Ex: `/internal/notify/ride-accepted`).
- [ ] 4.0.3 Implementar a lógica de **Notificações Push** para eventos críticos (30 min antes da viagem, solicitação aceita/recusada) (Notify-3.1).

**Dependências:** 3.1.2

### **Tarefa 4.1: Chat Interno (sj-notify-service)**

- [ ] 4.1.1 Configurar a tecnologia de comunicação em tempo real (Ex: WebSockets ou Firebase Realtime Database/Firestore).
- [ ] 4.1.2 Implementar a lógica de **Ativação/Desativação do Chat** (RF5 - Regra P9).
    * *Contexto:* Chat ativo apenas se a carona estiver nos estados "Confirmada" ou "Em Curso".
- [ ] 4.1.3 Criar *schema* para mensagens (`Messages`) no banco de dados.

**Dependências:** 4.0.3

### **Tarefa 4.2: Frontend - Implementação do Chat**

- [ ] 4.2.1 Implementar a tela de **Chat Interno** (consumindo 4.1.1).
- [ ] 4.2.2 Implementar o recebimento e exibição de **Notificações Push** no aplicativo.

**Dependências:** 4.1.2, 4.0.3

---

## **Fase 5: Pagamento e Reputação (Semanas 9-10)**

### **Tarefa 5.0: Finalização e Rateio (sj-rides-core-api)**

- [ ] 5.0.1 Implementar endpoint de **Finalização da Viagem** (`PUT /rides/:id/finish`) (Rides-1.6).
    * *Contexto:* Atualizar *status* para **"Concluída"**.
- [ ] 5.0.2 Acionar o `sj-notify-service` (4.0.2) para enviar a **Notificação de Rateio Pendente** (Notify-3.3).
    * *Contexto:* Notificação deve incluir a chave PIX do motorista e o valor sugerido.
- [ ] 5.0.3 Implementar endpoints de **Confirmação Mútua do Pagamento** (`PUT /rides/:id/confirm-payment`).
    * *Contexto:* Requer que tanto o motorista quanto o passageiro confirmem para transicionar o *status* para "Aguardando Notas".

**Dependências:** 4.1.3

### **Tarefa 5.1: Reputação e Notas Mútuas (sj-auth-service)**

- [ ] 5.1.1 Criar *schema* `Ratings` para armazenar as notas e *feedback* (Auth-2.5).
- [ ] 5.1.2 Implementar a lógica de **Cálculo da Nota Média** e exibição no perfil.
- [ ] 5.1.3 Implementar endpoint de **Registro de Notas** (`POST /rides/:id/rate`).
- [ ] 5.1.4 Implementar a lógica de **Strikes** para cancelamentos tardios ou problemas graves.

**Dependências:** 5.0.3

### **Tarefa 5.2: Frontend - Fluxo Pós-Viagem**

- [ ] 5.2.1 Implementar a tela de **Confirmação de Rateio** (exibindo PIX e valor).
- [ ] 5.2.2 Implementar a tela de **Avaliação Mútua** (Notas e Feedback opcional).

**Dependências:** 5.0.3, 5.1.3

---

## **Fase 6: Testes, Ajustes e Lançamento (Semanas 11-12)**

### **Tarefa 6.0: Refinamento e Cobertura de Testes**

- [ ] 6.0.1 Implementar **Testes de Integração** para o fluxo completo (1.1.3 $\rightarrow$ 5.0.3).
- [ ] 6.0.2 Implementar **Testes Unitários** para as lógicas críticas (Matching Geográfico, Cálculo de Preço, Criptografia).
- [ ] 6.0.3 Revisão de código e *refactoring* para remover complexidade desnecessária.

**Dependências:** 5.1.4, 5.2.2

### **Tarefa 6.1: Deploy e Configuração de Produção**

- [ ] 6.1.1 Configurar o ambiente de Produção na Nuvem (Infraestrutura *Cloud*).
- [ ] 6.1.2 Finalizar a documentação técnica dos Módulos (APIs).
- [ ] 6.1.3 Testes de Stress e Performance (RNF-Escalabilidade).

**Dependências:** 6.0.1

### **Tarefa 6.2: Preparação para o Lançamento**

- [ ] 6.2.1 Testes de Aceitação do Usuário (UAT) com um grupo fechado da UFBA.
- [ ] 6.2.2 Preparar o aplicativo para as lojas (Google Play Store e Apple App Store).

**Dependências:** 6.1.3