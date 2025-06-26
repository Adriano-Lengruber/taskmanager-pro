Prompt para Desenvolvimento de Gerenciador de Projetos e Tarefas
Objetivo: Criar uma plataforma modular e extensível que combine a usabilidade do ClickUp, a robustez em metodologias ágeis do Jira e a flexibilidade visual do Monday.com, com inovações em IA e automação.
________________________________________
1. Requisitos Técnicos Essenciais
Arquitetura e Escalabilidade
•	Backend: Microsserviços em Node.js/Python com mensageria RabbitMQ/Kafka para processamento assíncrono
•	Frontend: Componentes React/TypeScript reutilizáveis com sistema de temas e personalização de CSS.
•	Banco de Dados: Multi-modelo (PostgreSQL para dados estruturados, MongoDB para documentos, Redis para cache)
•	Escalabilidade: Auto-scaling baseado em Kubernetes com balanceamento de carga para 10k+ usuários concorrentes.
Integrações e Extensibilidade
•	API REST/GraphQL: Documentação Swagger/OpenAPI com SDKs em Python, JS e Java 
•	Webhooks e Zapier: Suporte nativo a 200+ integrações (Slack, GitHub, Google Workspace) 
•	Marketplace de Plugins: Sandbox para extensões seguras (ex: templates de automação, conectores CRM).
________________________________________
2. Funcionalidades-Chave Baseadas em Benchmarks
Gestão de Tarefas (Inspirado no ClickUp)
•	Hierarquia Flexível: Tarefas > Subtarefas > Checklists > Itens de Ação 
•	Atribuição Múltipla: Tarefas compartilhadas entre usuários/equipes com repartição de carga visual 
•	Dependências Inteligentes: Bloqueio automático de tarefas predecessoras não concluídas (ex: "Esperando aprovação") 
Metodologias de Trabalho (Inspirado no Jira)
•	Fluxos Ágeis: Boards Scrum/Kanban com sprints, burndown charts e roadmaps 
•	Customização de Workflows: Editor visual para estados (ex: "To Do" → "In Progress" → "QA") com gatilhos condicionais 
•	Gestão de Issues: Rastreamento de bugs com link para commits Git (ex: integração Bitbucket/GitLab) 
Visualização de Dados (Inspirado no Monday.com)
•	7 Modos de Visualização:
o	Timeline (Gantt) com arrastar-e-soltar de dependências.
o	Quadros Kanban com WIP limits 
o	Tabelas com fórmulas tipo Excel (ex: SUM($Orçamento)).
o	Calendário de marcos e recursos 
•	Dashboards Personalizáveis: Widgets arrastáveis (gráficos, relatórios de carga, métricas OKR) 
Automações e IA
•	Assistente de IA:
o	Estimativa de prazos com base em histórico.
o	Sugestão de priorização de tarefas 
•	Automações Low-Code:
o	"Quando tarefa concluída → Notificar canal Slack + Atualizar planilha Google".
o	"Quando prazo expirar → Reatribuir automaticamente" 
________________________________________
3. Critérios de Usabilidade e Performance
UX/UI
•	Onboarding Intuitivo: Tutoriais interativos + templates pré-configurados (ex: "Plano de Marketing", "Sprint Dev") 
•	Acessibilidade: WCAG 2.1 AA, modo escuro, leitor de tela.
•	Mobile-First: Apps iOS/Android offline-capable com sincronização em background.
Governança e Segurança
•	RBAC Avançado: Permissões granulares (ex: "Visualizar Tarefas" vs. "Editar Orçamento") 89.
•	Conformidade: GDPR, SOC 2, LGPD com opção de data center local/EUA/UE 
•	Auditoria: Logs de atividades exportáveis em CSV/PDF.
Performance
•	Tempo de carregamento: <1.5s para dashboards com 500+ tarefas.
•	Uptime SLA: 99.95% com backups diários.
________________________________________
4. Modelo de Negócios e Precificação
•	Camadas Gratuitas: Até 10 usuários, 3 projetos ativos, 100 automações/mês 
•	Planos Premium:
o	Básico ($7/usuário/mês): Projetos ilimitados + 10GB armazenamento
o	Empresarial ($16/usuário/mês): IA avançada + SSO + relatórios customizados 
•	Modelo On-Premise: Licença perpétua para setores regulados (ex: saúde, governo) 
________________________________________
5. Diferenciais Competitivos
•	AI Studio: Treinamento de modelos específicos por domínio (ex: jurídico, construção civil) 
•	Ecossistema de Templates: Comunidade para compartilhamento de fluxos (ex: "Sprint para App MVP") 
•	Soberania de Dados: Criptografia end-to-end com chaves gerenciadas pelo cliente
