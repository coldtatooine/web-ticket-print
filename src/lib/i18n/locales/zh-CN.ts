import {
  MAX_CREDIT_LINK_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/constants";
import type { Copy } from "@/lib/i18n/types";

export const zhCNCopy: Copy = {
  locale: {
    label: "语言",
    ptBR: "Português (Brasil)",
    esMX: "Español (México)",
    zhCN: "中文 (简体)",
    enUS: "English (US)",
  },
  app: {
    title: "提出你的问题！",
    subtitle: "写下你的疑问或评论。快来参与！",
    requirementsTitle: "开始之前",
    requirements: [
      "请使用 Chrome 或 Edge（HTTPS 或 localhost）",
      "57/58mm 热敏打印机（ESC/POS）",
      "USB 在 Linux/macOS 上可直接使用；Windows 请用 Serial 连接 COM 端口",
      "经典蓝牙？在系统中配对后通过 Serial 连接",
    ],
    dismissError: "好的，知道了",
    helpButtonLabel: "查看开始前的要求",
    helpClose: "关闭",
    loading: "正在准备…",
  },
  printer: {
    title: "打印机",
    settingsButtonLabelConnected: "配置打印机 — 已连接",
    settingsButtonLabelDisconnected: "配置打印机 — 未连接",
    description: "第一步：选择如何连接 57mm 打印机。",
    connectedPrefix: "已就绪 —",
    disconnect: "更换打印机",
    connecting: "请在浏览器弹窗中选择打印机…",
    connections: [
      {
        type: "usb",
        label: "USB",
        hint: "USB 线缆 — 适合 Linux/macOS。Windows？请用 Serial。",
      },
      {
        type: "bluetooth",
        label: "蓝牙",
        hint: "无线（BLE）。经典蓝牙？配对后使用 Serial。",
      },
      {
        type: "serial",
        label: "Serial",
        hint: "串口 — 已配对蓝牙或 Windows 虚拟 COM。",
      },
    ],
  },
  form: {
    title: "发送你的问题",
    description: "将打印在小票上 — 可以是提问、反馈或鼓励。",
    nameLabel: "怎么称呼你？",
    namePlaceholder: "例如：小明、Ana…",
    questionLabel: "你想问什么？",
    questionPlaceholder: "尽管写 — 别害羞。",
    submit: "打印！",
    submitting: "正在打印…",
    success: "完成！小票已从打印机输出。",
    notConnected: "请先连接打印机。",
    printFailed: "打印出错（纸张、线缆或电源）。请检查后重试。",
  },
  validation: {
    nameRequired: "小票上需要你的名字。",
    nameTooLong: `姓名最多 ${MAX_NAME_LENGTH} 个字符。`,
    questionRequired: "打印前请先填写内容。",
    questionTooLong: `消息最多 ${MAX_QUESTION_LENGTH} 个字符。`,
    invalid: "请检查字段后重试。",
  },
  errors: {
    unsupportedBrowser(type) {
      const labels = { usb: "USB", bluetooth: "蓝牙", serial: "Serial" };
      return `你的浏览器不支持 ${labels[type]} — 请尝试 Chrome 或 Edge。`;
    },
    connectFailed: "连接失败。要再试一次吗？",
    printFailed: "打印未成功。请检查打印机后重试。",
    notConnected: "请先连接打印机。",
  },
  meta: {
    title: "纸上提问 · Cursor",
    description: "在浏览器中发送问题和评论，实时热敏打印。",
  },
  credit: {
    meta: {
      title: "积分小票 · Cursor",
      description: "生成带二维码的积分小票，用于活动现场热敏打印。",
    },
    auth: {
      title: "受限访问",
      description: "请输入积分模块密码以继续。",
      passwordLabel: "密码",
      passwordPlaceholder: "模块密码",
      submit: "登录",
      submitting: "验证中…",
      invalidPassword: "密码不正确。",
      passwordRequired: "请输入密码。",
      invalidRequest: "无效请求。",
      notConfigured: "模块不可用 — 请在 .env 中配置 CREDIT_MODULE_PASSWORD。",
      logout: "退出",
    },
    app: {
      title: "积分小票",
      subtitle: "打印带二维码的凭证以兑换积分。",
    },
    form: {
      title: "小票信息",
      description: "活动名称和链接将打印在小票上。",
      eventNameLabel: "活动名称",
      eventNamePlaceholder: "例如：Cursor Meetup 上海",
      newEventOption: "+ 新活动…",
      addEventButton: "保存",
      eventAdded: "活动已保存到列表。",
      creditLinkLabel: "积分链接",
      creditLinkPlaceholder: "https://…",
      submit: "打印小票",
      submitting: "打印中…",
      success: "积分小票已发送至打印机。",
      notConnected: "打印前请先连接打印机。",
      printFailed: "打印失败。请检查纸张、线缆或电源后重试。",
    },
    list: {
      title: "小票列表",
      description:
        "从 CSV 或 XLS 导入链接（单列 URL，每行一个，无需表头），点击即可填充表单。",
      filterLabel: "搜索链接",
      filterPlaceholder: "URL、代码、活动或状态（待打印/已打印）…",
      filterClear: "清除搜索",
      filterStats(filtered, total) {
        return `${filtered} / ${total} 条链接`;
      },
      importButton: "导入 CSV/XLS",
      importing: "导入中…",
      clearButton: "清空列表",
      empty: "暂无导入链接。请使用上方按钮加载文件。",
      noResults: "没有匹配的链接。",
      statusPrinted: "已打印",
      statusPending: "待打印",
      importEmpty: "文件中未找到有效链接。",
      importFailed: "无法读取文件，请检查格式。",
      importSuccess(count) {
        return `已导入 ${count} 个链接。`;
      },
      importSkipped(count) {
        return `跳过 ${count} 行。`;
      },
      stats(total, printed) {
        return `共 ${total} 条 · 已打印 ${printed} 条`;
      },
    },
    validation: {
      eventNameRequired: "请输入活动名称。",
      eventNameTooLong: `活动名称最多 ${MAX_EVENT_NAME_LENGTH} 个字符。`,
      creditLinkRequired: "请输入积分链接。",
      creditLinkTooLong: `链接最多 ${MAX_CREDIT_LINK_LENGTH} 个字符。`,
      creditLinkInvalid: "请使用以 http:// 或 https:// 开头的有效链接。",
      invalid: "请检查字段后重试。",
    },
    events: {
      selectLabel: "已保存活动",
      selectPlaceholder: "选择活动…",
      addNew: "新活动（在下方输入）",
    },
  },
};
