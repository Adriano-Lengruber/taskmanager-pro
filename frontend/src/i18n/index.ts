// Sistema de internacionalização simples
// TODO: Implementar com react-i18next para maior robustez

export type Language = 'pt-BR' | 'en-US';

export interface Translations {
  // Navegação e layout
  navigation: {
    dashboard: string;
    projects: string;
    tasks: string;
    reports: string;
    settings: string;
    logout: string;
  };

  // Autenticação
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    loginButton: string;
    registerButton: string;
    forgotPassword: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginSuccess: string;
    logoutSuccess: string;
    registerSuccess: string;
    invalidCredentials: string;
    emailAlreadyExists: string;
    passwordsDoNotMatch: string;
    fieldRequired: string;
  };

  // Projetos
  projects: {
    title: string;
    subtitle: string;
    createProject: string;
    editProject: string;
    deleteProject: string;
    projectName: string;
    projectKey: string;
    projectDescription: string;
    noProjects: string;
    noProjectsDescription: string;
    projectCreated: string;
    projectUpdated: string;
    projectDeleted: string;
    deleteConfirmation: string;
    deleteWarning: string;
    active: string;
    inactive: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    nameRequired: string;
    keyRequired: string;
    createFailed: string;
    deleteFailed: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcomeBack: string;
    welcomeMessage: string;
    totalTasks: string;
    completed: string;
    inProgress: string;
    projects: string;
    recentTasks: string;
    recentProjects: string;
    noTasksYet: string;
    noProjectsYet: string;
    createFirstTask: string;
    createFirstProject: string;
    active: string;
    urgent: string;
    blocked: string;
    inReview: string;
  };

  // Tasks e Hierarquia
  tasks: {
    title: string;
    subtitle: string;
    createTask: string;
    editTask: string;
    deleteTask: string;
    taskTitle: string;
    taskDescription: string;
    priority: string;
    status: string;
    assignee: string;
    dueDate: string;
    noTasks: string;
    noTasksDescription: string;
    taskCreated: string;
    taskUpdated: string;
    taskDeleted: string;
    high: string;
    medium: string;
    low: string;
    todo: string;
    inProgress: string;
    done: string;
  };

  // Hierarquia de Tarefas
  hierarchy: {
    checklist: string;
    checklists: string;
    actionItem: string;
    actionItems: string;
    addChecklist: string;
    addActionItem: string;
    checklistTitle: string;
    checklistDescription: string;
    actionItemTitle: string;
    actionItemDescription: string;
    completed: string;
    checklistMarkedComplete: string;
    checklistMarkedIncomplete: string;
    actionItemCreated: string;
    createActionItemError: string;
    toggleChecklistError: string;
    actionItemTitleRequired: string;
    subtasks: string;
    addSubtask: string;
    taskHierarchy: string;
    completionPercentage: string;
  };

  // Geral
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    create: string;
    update: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    actions: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    navigation: {
      dashboard: 'Painel',
      projects: 'Projetos',
      tasks: 'Tarefas',
      reports: 'Relatórios',
      settings: 'Configurações',
      logout: 'Sair',
    },

    auth: {
      login: 'Entrar',
      register: 'Cadastrar',
      logout: 'Sair',
      email: 'E-mail',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      fullName: 'Nome completo',
      loginButton: 'Entrar',
      registerButton: 'Cadastrar',
      forgotPassword: 'Esqueci minha senha',
      alreadyHaveAccount: 'Já tem uma conta?',
      dontHaveAccount: 'Não tem uma conta?',
      loginSuccess: 'Login realizado com sucesso!',
      logoutSuccess: 'Logout realizado com sucesso!',
      registerSuccess: 'Cadastro realizado com sucesso!',
      invalidCredentials: 'Credenciais inválidas',
      emailAlreadyExists: 'E-mail já está em uso',
      passwordsDoNotMatch: 'As senhas não coincidem',
      fieldRequired: 'Este campo é obrigatório',
    },

    dashboard: {
      title: 'Painel',
      welcomeBack: 'Bem-vindo de volta',
      welcomeMessage: 'Aqui está o que está acontecendo com seus projetos e tarefas hoje.',
      totalTasks: 'Total de Tarefas',
      completed: 'Concluídas',
      inProgress: 'Em Progresso',
      projects: 'Projetos',
      recentTasks: 'Tarefas Recentes',
      recentProjects: 'Projetos Recentes',
      noTasksYet: 'Nenhuma tarefa ainda. Crie sua primeira tarefa!',
      noProjectsYet: 'Nenhum projeto ainda. Crie seu primeiro projeto!',
      createFirstTask: 'Crie sua primeira tarefa!',
      createFirstProject: 'Crie seu primeiro projeto!',
      active: 'Ativo',
      urgent: 'Urgente',
      blocked: 'Bloqueado',
      inReview: 'Em Revisão',
    },

    projects: {
      title: 'Projetos',
      subtitle: 'Gerencie seus projetos e suas configurações',
      createProject: 'Criar Projeto',
      editProject: 'Editar Projeto',
      deleteProject: 'Excluir Projeto',
      projectName: 'Nome do projeto',
      projectKey: 'Chave do projeto',
      projectDescription: 'Descrição do projeto',
      noProjects: 'Nenhum projeto',
      noProjectsDescription: 'Comece criando um novo projeto.',
      projectCreated: 'Projeto criado com sucesso!',
      projectUpdated: 'Projeto atualizado com sucesso!',
      projectDeleted: 'Projeto excluído com sucesso!',
      deleteConfirmation: 'Tem certeza que deseja excluir',
      deleteWarning: 'Esta ação não pode ser desfeita.',
      active: 'Ativo',
      inactive: 'Inativo',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
      nameRequired: 'Nome é obrigatório',
      keyRequired: 'Chave é obrigatória',
      createFailed: 'Falha ao criar projeto',
      deleteFailed: 'Falha ao excluir projeto',
    },

    tasks: {
      title: 'Tarefas',
      subtitle: 'Gerencie suas tarefas e atividades',
      createTask: 'Criar Tarefa',
      editTask: 'Editar Tarefa',
      deleteTask: 'Excluir Tarefa',
      taskTitle: 'Título da tarefa',
      taskDescription: 'Descrição da tarefa',
      priority: 'Prioridade',
      status: 'Status',
      assignee: 'Responsável',
      dueDate: 'Data de vencimento',
      noTasks: 'Nenhuma tarefa',
      noTasksDescription: 'Comece criando uma nova tarefa.',
      taskCreated: 'Tarefa criada com sucesso!',
      taskUpdated: 'Tarefa atualizada com sucesso!',
      taskDeleted: 'Tarefa excluída com sucesso!',
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
      todo: 'A fazer',
      inProgress: 'Em progresso',
      done: 'Concluído',
    },

    hierarchy: {
      checklist: 'Lista de verificação',
      checklists: 'Listas de verificação',
      actionItem: 'Item de ação',
      actionItems: 'Itens de ação',
      addChecklist: 'Adicionar lista',
      addActionItem: 'Adicionar item',
      checklistTitle: 'Título da lista',
      checklistDescription: 'Descrição da lista',
      actionItemTitle: 'Título do item',
      actionItemDescription: 'Descrição do item',
      completed: 'concluído(s)',
      checklistMarkedComplete: 'Lista marcada como concluída!',
      checklistMarkedIncomplete: 'Lista desmarcada!',
      actionItemCreated: 'Item de ação criado com sucesso!',
      createActionItemError: 'Erro ao criar item de ação',
      toggleChecklistError: 'Erro ao alterar status da lista',
      actionItemTitleRequired: 'Título do item é obrigatório',
      subtasks: 'Subtarefas',
      addSubtask: 'Adicionar subtarefa',
      taskHierarchy: 'Hierarquia da tarefa',
      completionPercentage: 'Porcentagem de conclusão',
    },

    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      warning: 'Aviso',
      info: 'Informação',
      yes: 'Sim',
      no: 'Não',
      ok: 'OK',
      cancel: 'Cancelar',
      save: 'Salvar',
      edit: 'Editar',
      delete: 'Excluir',
      create: 'Criar',
      update: 'Atualizar',
      view: 'Visualizar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      search: 'Pesquisar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      actions: 'Ações',
      name: 'Nome',
      description: 'Descrição',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      status: 'Status',
    },
  },

  'en-US': {
    navigation: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      reports: 'Reports',
      settings: 'Settings',
      logout: 'Logout',
    },

    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      fullName: 'Full name',
      loginButton: 'Sign in',
      registerButton: 'Sign up',
      forgotPassword: 'Forgot password',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      loginSuccess: 'Login successful!',
      logoutSuccess: 'Logout successful!',
      registerSuccess: 'Registration successful!',
      invalidCredentials: 'Invalid credentials',
      emailAlreadyExists: 'Email already exists',
      passwordsDoNotMatch: 'Passwords do not match',
      fieldRequired: 'This field is required',
    },

    dashboard: {
      title: 'Dashboard',
      welcomeBack: 'Welcome back',
      welcomeMessage: "Here's what's happening with your projects and tasks today.",
      totalTasks: 'Total Tasks',
      completed: 'Completed',
      inProgress: 'In Progress',
      projects: 'Projects',
      recentTasks: 'Recent Tasks',
      recentProjects: 'Recent Projects',
      noTasksYet: 'No tasks yet. Create your first task!',
      noProjectsYet: 'No projects yet. Create your first project!',
      createFirstTask: 'Create your first task!',
      createFirstProject: 'Create your first project!',
      active: 'Active',
      urgent: 'Urgent',
      blocked: 'Blocked',
      inReview: 'In Review',
    },

    projects: {
      title: 'Projects',
      subtitle: 'Manage your projects and their settings',
      createProject: 'Create Project',
      editProject: 'Edit Project',
      deleteProject: 'Delete Project',
      projectName: 'Project name',
      projectKey: 'Project key',
      projectDescription: 'Project description',
      noProjects: 'No projects',
      noProjectsDescription: 'Get started by creating a new project.',
      projectCreated: 'Project created successfully!',
      projectUpdated: 'Project updated successfully!',
      projectDeleted: 'Project deleted successfully!',
      deleteConfirmation: 'Are you sure you want to delete',
      deleteWarning: 'This action cannot be undone.',
      active: 'Active',
      inactive: 'Inactive',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      nameRequired: 'Name is required',
      keyRequired: 'Key is required',
      createFailed: 'Failed to create project',
      deleteFailed: 'Failed to delete project',
    },

    tasks: {
      title: 'Tasks',
      subtitle: 'Manage your tasks and activities',
      createTask: 'Create Task',
      editTask: 'Edit Task',
      deleteTask: 'Delete Task',
      taskTitle: 'Task title',
      taskDescription: 'Task description',
      priority: 'Priority',
      status: 'Status',
      assignee: 'Assignee',
      dueDate: 'Due date',
      noTasks: 'No tasks',
      noTasksDescription: 'Get started by creating a new task.',
      taskCreated: 'Task created successfully!',
      taskUpdated: 'Task updated successfully!',
      taskDeleted: 'Task deleted successfully!',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      todo: 'To do',
      inProgress: 'In progress',
      done: 'Done',
    },

    hierarchy: {
      checklist: 'Checklist',
      checklists: 'Checklists',
      actionItem: 'Action item',
      actionItems: 'Action items',
      addChecklist: 'Add checklist',
      addActionItem: 'Add item',
      checklistTitle: 'Checklist title',
      checklistDescription: 'Checklist description',
      actionItemTitle: 'Item title',
      actionItemDescription: 'Item description',
      completed: 'completed',
      checklistMarkedComplete: 'Checklist marked as complete!',
      checklistMarkedIncomplete: 'Checklist unmarked!',
      actionItemCreated: 'Action item created successfully!',
      createActionItemError: 'Error creating action item',
      toggleChecklistError: 'Error toggling checklist status',
      actionItemTitleRequired: 'Item title is required',
      subtasks: 'Subtasks',
      addSubtask: 'Add subtask',
      taskHierarchy: 'Task hierarchy',
      completionPercentage: 'Completion percentage',
    },

    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      actions: 'Actions',
      name: 'Name',
      description: 'Description',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      status: 'Status',
    },
  },
};

// Hook personalizado para usar as traduções
export const useTranslations = (language: Language = 'pt-BR') => {
  return translations[language];
};

// Função para obter uma tradução específica
export const t = (key: string, language: Language = 'pt-BR'): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
