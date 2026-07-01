import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";

export const ptBRCopy: Copy = {
  locale: {
    label: "Idioma",
    ptBR: "Português (Brasil)",
    esMX: "Español (México)",
    zhCN: "中文 (简体)",
    enUS: "English (US)",
  },
  app: {
    title: "Faça sua Pergunta!",
    subtitle: "Escreva sua dúvida ou comentário. Participe!",
    requirementsTitle: "Antes de começar",
    requirements: [
      "Use Chrome ou Edge (HTTPS ou localhost)",
      "Impressora térmica 57/58mm (ESC/POS)",
      "USB funciona direto no Linux/macOS; no Windows, use Serial com porta COM",
      "Bluetooth Classic? Emparelha no sistema e conecta via Serial",
    ],
    dismissError: "Ok, entendi",
    helpButtonLabel: "Ver requisitos antes de começar",
    helpClose: "Fechar",
    loading: "Preparando tudo…",
  },
  printer: {
    title: "Impressora",
    settingsButtonLabelConnected: "Configurar impressora — conectada",
    settingsButtonLabelDisconnected: "Configurar impressora — desconectada",
    description: "Primeiro passo: escolhe como conectar a impressora de 57mm.",
    connectedPrefix: "Tudo certo —",
    disconnect: "Trocar impressora",
    connecting: "Escolhe a impressora na janelinha do navegador…",
    connections: [
      {
        type: "usb",
        label: "USB",
        hint: "Cabo USB — ideal no Linux/macOS. Windows? Vai de Serial.",
      },
      {
        type: "bluetooth",
        label: "Bluetooth",
        hint: "Sem fio (BLE). Bluetooth clássico? Emparelha e usa Serial.",
      },
      {
        type: "serial",
        label: "Serial",
        hint: "Porta serial — Bluetooth emparelhado ou COM virtual no Windows.",
      },
    ],
  },
  form: {
    title: "Manda sua pergunta",
    description: "Vai sair no ticket — pode ser dúvida, feedback ou elogio.",
    nameLabel: "Como te chamam?",
    namePlaceholder: "Ex.: Ana, João…",
    questionLabel: "O que você quer perguntar?",
    questionPlaceholder: "Manda ver — sem vergonha.",
    submit: "Imprimir!",
    submitting: "Saindo do forno…",
    success: "Pronto! Seu ticket saiu da impressora.",
    notConnected: "Ops — conecta a impressora primeiro.",
    printFailed:
      "Algo deu errado na impressora (papel, cabo ou energia). Dá uma olhada e tenta de novo.",
  },
  validation: {
    nameRequired: "Precisamos do seu nome para o ticket.",
    nameTooLong: `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
    questionRequired: "Escreve algo antes de imprimir.",
    questionTooLong: `Mensagem deve ter no máximo ${MAX_QUESTION_LENGTH} caracteres.`,
    invalid: "Confere os campos e tenta de novo.",
  },
  errors: {
    unsupportedBrowser(type) {
      const labels = { usb: "USB", bluetooth: "Bluetooth", serial: "Serial" };
      return `Seu navegador não curte ${labels[type]} — tenta Chrome ou Edge.`;
    },
    connectFailed: "Não rolou conectar. Tenta de novo?",
    printFailed: "A impressão não saiu. Verifica a impressora e tenta outra vez.",
    notConnected: "Ops — conecta a impressora primeiro.",
  },
  meta: {
    title: "Perguntas no papel · Cursor",
    description:
      "Envie perguntas e comentários para impressão térmica ao vivo — direto do navegador.",
  },
  notFound: {
    meta: {
      title: "404 — Página não encontrada",
    },
    title: "Página não encontrada",
    description:
      "Essa rota não existe. A capivara também não sabe onde você queria chegar.",
    imageAlt: "Capivara olhando sem entender nada",
    homeLink: "Voltar para a home",
  },
  credit: {
    meta: {
      title: "Ticket de crédito · Cursor",
      description:
        "Gere tickets de crédito com QR code para impressão térmica em eventos.",
    },
    auth: {
      title: "Acesso restrito",
      description: "Digite a senha do módulo de crédito para continuar.",
      passwordLabel: "Senha",
      passwordPlaceholder: "Senha do módulo",
      submit: "Entrar",
      submitting: "Verificando…",
      invalidPassword: "Senha incorreta.",
      passwordRequired: "Informe a senha.",
      invalidRequest: "Requisição inválida.",
      notConfigured:
        "Módulo indisponível — configure CREDIT_MODULE_PASSWORD no .env.",
      logout: "Sair",
    },
    app: {
      title: "Ticket de crédito",
      subtitle: "Imprima vouchers com QR code para resgate de crédito.",
    },
    form: {
      title: "Dados do ticket",
      description: "O nome do evento e o link saem na impressão.",
      eventNameLabel: "Nome do evento",
      eventNamePlaceholder: "Ex.: Cursor Meetup Recife",
      newEventOption: "+ Novo evento…",
      addEventButton: "Salvar",
      eventAdded: "Evento salvo na lista.",
      creditLinkLabel: "Link para o crédito",
      creditLinkPlaceholder: "https://…",
      submit: "Imprimir ticket",
      submitting: "Imprimindo…",
      success: "Ticket de crédito enviado para a impressora.",
      notConnected: "Conecte a impressora antes de imprimir.",
      printFailed:
        "Falha na impressão. Verifique papel, cabo ou energia e tente de novo.",
    },
    list: {
      title: "Lista de Tickets",
      description:
        "Importe links de CSV ou XLS (uma coluna com URLs, uma por linha, sem cabeçalho) e clique para preencher o formulário.",
      filterLabel: "Buscar link",
      filterPlaceholder: "URL, código, evento ou status (pendente/impresso)…",
      filterClear: "Limpar busca",
      filterStats(filtered, total) {
        return `${filtered} de ${total} link${total === 1 ? "" : "s"}`;
      },
      importButton: "Importar CSV/XLS",
      importing: "Importando…",
      clearButton: "Limpar lista",
      empty: "Nenhum link importado. Use o botão acima para carregar um arquivo.",
      noResults: "Nenhum link corresponde ao filtro.",
      statusPrinted: "impresso",
      statusPending: "pendente",
      importEmpty: "Nenhum link válido encontrado no arquivo.",
      importFailed: "Não foi possível ler o arquivo. Verifique o formato.",
      importSuccess(count) {
        return `${count} link${count === 1 ? "" : "s"} importado${count === 1 ? "" : "s"}.`;
      },
      importSkipped(count) {
        return `${count} linha${count === 1 ? "" : "s"} ignorada${count === 1 ? "" : "s"}.`;
      },
      stats(total, printed) {
        return `${total} no total · ${printed} impresso${printed === 1 ? "" : "s"}`;
      },
    },
    validation: {
      eventNameRequired: "Informe o nome do evento.",
      eventNameTooLong: `Nome do evento deve ter no máximo ${MAX_EVENT_NAME_LENGTH} caracteres.`,
      creditLinkRequired: "Informe o link para o crédito.",
      creditLinkTooLong: `Link deve ter no máximo ${MAX_CREDIT_LINK_LENGTH} caracteres.`,
      creditLinkInvalid: "Use um link válido começando com http:// ou https://.",
      invalid: "Confira os campos e tente de novo.",
    },
    events: {
      selectLabel: "Eventos salvos",
      selectPlaceholder: "Selecione um evento…",
      addNew: "Novo evento (digitar abaixo)",
    },
  },
};
