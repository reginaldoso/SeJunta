## 📄 Documento de Requisitos do Produto (PRD) – MVP

### **"Se Junta!!" - Plataforma de Rateio de Caronas UFBA**

| Detalhe | Valor |
| :--- | :--- |
| **Versão do Documento** | 1.0 (Requisitos Fechados) |
| **Público-Alvo** | Comunidade Interna da UFBA (Estudantes, Professores e Servidores) |
| **Status** | Pronto para Estimativa de Esforço |
| **Data de Conclusão** | Dezembro/2025 |

---

## 1. Visão Geral do Projeto

### 1.1. Objetivo

Criar uma plataforma mobile de rateio de caronas para a comunidade UFBA, focada em segurança, exclusividade e economia. O objetivo é reduzir o custo de transporte, diminuir o tráfego nos *campi* e fortalecer a comunidade, facilitando a conexão direta (P2P) entre motoristas e passageiros para o compartilhamento de custos (rateio).

### 1.2. Restrições Chave

* **Exclusividade:** Acesso restrito a usuários com e-mail institucional **`@ufba.br`**.
* **Modelo Financeiro:** O aplicativo **não intermedia pagamentos** (não retém dinheiro). O pagamento (rateio) é feito diretamente do passageiro para o motorista via **PIX**.
* **Segurança:** Alta prioridade para a verificação de identidade (CPF e Foto Obrigatória).

---

## 2. Requisitos Principais

### 2.1. Requisitos Funcionais (RFs)

* **RF1: Cadastro e Validação UFBA:** Registro de usuário obrigatório via e-mail `@ufba.br` e verificação de identidade (CPF/Foto).
* **RF2: Oferta e Busca de Carona:** Motoristas podem publicar caronas (Partida, Destino, Horário, Vagas). Passageiros podem buscar caronas por rota compatível (Geolocalização).
* **RF3: Ciclo de Vida da Carona:** Gestão da transição pelos 5 estados: Publicada $\rightarrow$ Confirmada $\rightarrow$ Em Curso $\rightarrow$ Concluída $\rightarrow$ Finalizada.
* **RF4: Rateio e Confirmação:** O sistema informa o valor sugerido de rateio. A confirmação do pagamento PIX é feita via **Confirmação Mútua** no aplicativo, sem verificação bancária.
* **RF5: Comunicação:** Chat interno ativado apenas após a confirmação da carona.
* **RF6: Reputação:** Sistema de notas mútuas (1 a 5 estrelas) e registro de **Strikes** para cancelamentos tardios.

### 2.2. Requisitos Não Funcionais (RNFs)

* **RNF-Segurança:** Todos os dados sensíveis (CPF, Chaves PIX) devem ser armazenados com **criptografia robusta (em repouso)**. A transmissão de dados deve ser protegida por TLS/SSL (HTTPS).
* **RNF-Confiabilidade:** O serviço principal deve operar com uma **disponibilidade mínima de $99.5\%$**, com arquitetura redundante.
* **RNF-Escalabilidade:** O sistema deve ser capaz de suportar um aumento de **10 vezes** no volume de transações em 12 meses, através de uma arquitetura modularizada.

---

## 3. Funcionalidades Principais (MVP)

### 3.1. Funcionalidades por Módulo

| Módulo | Funcionalidade Chave | História de Usuário (Exemplo) |
| :--- | :--- | :--- |
| **`sj-rides-core-api`** | Publicação de carona com coordenadas (PostGIS). | **Rides-1.1:** Motorista publica nova oferta de carona com Partida, Destino e Vagas. |
| | Algoritmo de *Matching* por Rota (5 km). | **Rides-1.2:** Passageiro busca caronas no raio de 5 km da sua rota. |
| **`sj-auth-service`** | Cadastro com Verificação de E-mail `@ufba.br`. | **Auth-2.1:** Novo usuário se cadastra com e-mail institucional e CPF. |
| | Registro de Chave PIX (Criptografada). | **Auth-2.4:** Usuário registra Chave PIX. |
| **`sj-notify-service`** | Notificações Push para Solicitações/Aceitações. | **Notify-3.1:** Motorista recebe push de "Nova solicitação de vaga". |
| | Chat Interno Ativado/Desativado por Estado. | **Notify-3.2:** Chat é ativado quando carona está "Confirmada". |

---

## 4. Componentes Principais

### 4.1. Módulos Lógicos (Backend)

A arquitetura inicial é um **Monolito Modularizado**, para equilibrar velocidade de desenvolvimento e escalabilidade futura. 

* **Módulo Usuário e Autenticação (`sj-auth-service`):** Login, Perfis, Verificação de Identidade, Reputação/Strikes.
* **Módulo Caronas e Matching (Core) (`sj-rides-core-api`):** Criação/Busca de Caronas, *Matching* Geográfico, Gestão de Ciclo de Vida, Cancelamentos.
* **Módulo Comunicação e Notificação (`sj-notify-service`):** Chat Interno, Notificações Push/E-mail.

---

## 5. Fluxo do Aplicativo/Usuário

### 5.1. Fluxo Crítico: Oferta e Confirmação de Carona

1.  **Publicação:** Motorista publica carona.
2.  **Busca/Solicitação:** Passageiro busca carona compatível e envia solicitação.
3.  **Aceitação:** Motorista aceita a solicitação. A carona transiciona para **"Confirmada"** e o Chat é ativado.
4.  **Viagem:** Motorista inicia e finaliza a viagem no app. A carona transiciona para **"Concluída"**.
5.  **Rateio:** Passageiro recebe os dados de PIX e realiza o pagamento. Ambos confirmam no app.
6.  **Finalização:** Carona transiciona para **"Finalizada"**. Troca de notas mútuas.

---

## 6. Pilha de Tecnologias

* **Frontend (Mobile):** **Flutter** (Desenvolvimento *cross-platform* rápido e alta performance).
* **Backend (Core):** **Node.js (Express/NestJS)** (Eficiência I/O para Chat/Push e velocidade de desenvolvimento).
* **Banco de Dados:** **PostgreSQL + PostGIS** (Robustez relacional e capacidade geoespacial crítica para o *matching*).
* **API Externa Crítica:** **Google Maps Platform** (Geocoding e cálculo de distância preciso).
* **Arquitetura:** **Monolito Modularizado** (Equilíbrio entre velocidade de MVP e preparação para Microsserviços futuros).

---

## 7. Plano de Implementação

### 7.1. Estimativa de Prazo

* **Prazo Máximo Sugerido para MVP:** **12 Semanas** (Com equipe de 3 Desenvolvedores Plenos).

### 7.2. Cláusula de Isenção de Responsabilidade (TOS)

> **O 'Se Junta!!' é estritamente uma Plataforma de Conexão (Matchmaking) para compartilhamento não comercial de custos de viagem.** O aplicativo não é, e não se destina a ser, um fornecedor ou operador de serviços de transporte. O 'Se Junta!!' e seus desenvolvedores/mantenedores **não assumem qualquer responsabilidade** por incidentes, danos, acidentes, perdas, ou disputas que possam surgir entre motoristas e passageiros, incluindo, mas não se limitando a, acidentes de trânsito, lesões pessoais, ou danos materiais. **O Motorista e o Passageiro assumem integralmente os riscos inerentes à carona.**

---