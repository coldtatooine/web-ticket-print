# web-ticket-print

Browser-based thermal ticket printing for live events — Q&A tickets and credit vouchers with QR codes, sent directly to ESC/POS printers over Web USB, Web Bluetooth, or Web Serial.

---

## English

### Overview

**web-ticket-print** is a [Next.js](https://nextjs.org) app for printing 57/58mm thermal receipts from the browser. It targets event setups where attendees submit questions or staff print credit redemption vouchers.

Inspired by [ticket-printer-os](https://github.com/maddiedreese/ticket-printer-os) by Maddie Reese — an open-source ticket printer for live events.

Two modules are available:

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Live Q&A tickets (name, question/comment, timestamp) | Public |
| `/credit` | Credit vouchers with event name, QR code, redemption URL, and batch link import | Password-protected |

Printing runs entirely in the browser via the [Point of Sale](https://github.com/NielsLeenheer/ReceiptPrinterEncoder) Web API drivers — no native print server required.

### Features

- **Question tickets** — Name, question/comment, date/time, and Cursor brand logo on 57/58mm paper (~32 columns).
- **Credit tickets** — Event name, QR code, and printable URL for credit redemption.
- **Batch import (`/credit`)** — Import credit links from CSV, XLS, or XLSX; two-column UI with ticket list and print form; print status tracking persisted in the browser.
- **Event registry (`/credit`)** — Saved event names in `localStorage`; dropdown in the form after the first successful print.
- **Printer connections** — USB, Bluetooth (BLE), and Serial (COM port / paired Bluetooth Classic).
- **ESC/POS encoding** — Uses `@point-of-sale/receipt-printer-encoder` with automatic language/codepage detection from the printer driver.
- **Requirements help** — In-app dialog with browser and hardware prerequisites.

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.9 (App Router, Webpack) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Design system | `@gogogo/design-system` (local workspace package) |
| Printing | `@point-of-sale/webusb-receipt-printer`, `webbluetooth-receipt-printer`, `webserial-receipt-printer`, `receipt-printer-encoder` |
| Spreadsheet import | `xlsx` (CSV / XLS / XLSX parsing in the credit module) |
| Language | TypeScript 5 |

### Requirements

#### Browser

- **Chrome** or **Edge** (Chromium-based browsers with Web USB / Web Bluetooth / Web Serial support).
- The app must be served over **HTTPS** or **`http://localhost`** — browser device APIs are blocked on plain HTTP in production.

#### Printer

- **57/58mm thermal receipt printer** with **ESC/POS** support.
- Default USB vendor/product IDs in code target **Netum 58mm** (`0x0416` / `0x5011`); other ESC/POS printers generally work when selected in the browser picker.
- Paper width: **32 character columns**.

#### Connection notes by platform

| Connection | Linux / macOS | Windows |
|------------|---------------|---------|
| USB | Supported via Web USB | Use **Serial** with a virtual COM port instead |
| Bluetooth | BLE via Web Bluetooth | Pair in system settings, then connect via **Serial** |
| Serial | COM / `/dev/tty*` ports | Virtual COM port or paired Bluetooth Classic |

### Installation

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone <repository-url>
cd web-ticket-print
npm install
```

### Environment variables

Create a `.env` file in the project root (not committed — see `.gitignore`):

```env
# Required to enable the /credit module
CREDIT_MODULE_PASSWORD=your-secure-password
```

| Variable | Required | Description |
|----------|----------|-------------|
| `CREDIT_MODULE_PASSWORD` | For `/credit` only | Password for the credit ticket module. If unset, `/credit` shows a “module unavailable” message. |

**Notes:**

- If the password contains `$`, escape it in `.env`: `\$`
- Session cookies last **8 hours** after successful login.
- Auth API: `POST /api/credit/auth` (login), `DELETE /api/credit/auth` (logout).

There is no `.env.example` in the repository; copy the snippet above.

### Scripts

```bash
npm run dev      # Development server (Webpack) at http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

Both `dev` and `build` use the `--webpack` flag (required for Point of Sale printer library aliases in `next.config.ts`).

### Usage

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click the printer icon (top right) and choose **USB**, **Bluetooth**, or **Serial**
4. Approve the browser device picker and confirm the connection
5. Fill in the form and click **Imprimir!** (Print)

For credit tickets, go to [http://localhost:3000/credit](http://localhost:3000/credit), enter the module password, then use the batch workflow below.

#### Credit module workflow (`/credit`)

The credit screen uses a **two-column layout**:

| Column | Purpose |
|--------|---------|
| Left — **Ticket list** | Import links, filter, and select tickets (`pending` / `printed` badges) |
| Right — **Print form** | Event name + credit link; filled automatically when you click a list item |

**Typical flow:**

1. Connect the printer (same as the Q&A module).
2. Click **Import CSV/XLS** and select a spreadsheet file.
3. Click a link in the list — the form is populated with the URL (and event name, if present in the file).
4. Enter or select the event name and click **Print**.
5. On successful print, the ticket is marked **printed** and the event name is saved for future use.

**Spreadsheet format**

Primary use case: **one column, no header** — one `http://` or `https://` URL per row:

```text
https://credit.example.com/ticket/1
https://credit.example.com/ticket/2
https://credit.example.com/ticket/3
```

Also supported (optional):

- **Two columns with header** — link + event name (`link`, `url`, `evento`, `event`, etc.).
- **Two columns without header** — column 1 = URL, column 2 = event name.

Invalid or duplicate URLs are skipped or merged (duplicates keep their **printed** status).

**Browser storage (`localStorage`)**

| Key | Content |
|-----|---------|
| `web-ticket-print-credit-tickets` | Imported links: `{ id, url, eventName?, printed, importedAt }` |
| `web-ticket-print-credit-events` | Event names saved after successful prints: `{ id, name, createdAt }` |

Data stays in the browser only — clearing site data removes the list and events. There is no server-side persistence for imports.

### Production

```bash
npm run build
npm run start
```

Deploy to any Node.js host (e.g. Vercel). Ensure:

- HTTPS is enabled (required for Web USB / Bluetooth / Serial outside localhost).
- `CREDIT_MODULE_PASSWORD` is set in the hosting environment if you use `/credit`.

### Internationalization (i18n)

Locale infrastructure lives under `src/lib/i18n/`:

| Locale | Status |
|--------|--------|
| `pt-BR` | Default locale |
| `en-US` | Available |
| `es-MX` | Available |
| `zh-CN` | Available |

The UI uses `LocaleProvider` (`src/contexts/LocaleContext.tsx`) and the `useCopy()` hook. The language selector appears in the top-right toolbar (before the printer icon, separated by a divider) on `/` and `/credit`. Preference is persisted in `localStorage` under `LOCALE_STORAGE_KEY` (`web-ticket-print-locale`). The credit module additionally stores imported tickets and event names under `web-ticket-print-credit-tickets` and `web-ticket-print-credit-events` (see [Credit module workflow](#credit-module-workflow-credit)). Server metadata and API error fallbacks still use the default locale (`pt-BR`) via `src/lib/copy.ts`.

### Project structure

```
src/
├── app/                    # Next.js routes (/, /credit, API)
├── components/             # React UI (forms, printer panel, auth, CreditTicketList)
├── hooks/                  # usePrinter, useCreditStorage
├── lib/
│   ├── format-ticket.ts    # Q&A ticket ESC/POS encoding
│   ├── format-credit-ticket.ts
│   ├── import-ticket-links.ts  # CSV/XLS/XLSX parser for credit links
│   ├── storage/credit-storage.ts  # localStorage CRUD (tickets + events)
│   ├── printer/            # Printer service and encoder options
│   ├── i18n/               # Locale types, provider, and copy files
│   └── copy.ts             # Default-locale copy for server/metadata
├── types/                  # credit-import, credit-ticket, ticket payloads
packages/
└── design-system/          # @gogogo/design-system tokens and CSS
public/                     # Logos and brand assets for tickets
```

### License

[MIT](LICENSE) — Copyright (c) 2026 Alê Lima

---

## Português (Brasil)

### Visão geral

**web-ticket-print** é um app [Next.js](https://nextjs.org) para imprimir recibos térmicos de 57/58mm direto do navegador. Foi pensado para eventos ao vivo: participantes enviam perguntas ou a equipe imprime vouchers de crédito.

Inspirado em [ticket-printer-os](https://github.com/maddiedreese/ticket-printer-os), de Maddie Reese — impressora de tickets open source para eventos ao vivo.

Dois módulos estão disponíveis:

| Rota | Função | Acesso |
|------|--------|--------|
| `/` | Tickets de perguntas (nome, pergunta/comentário, data/hora) | Público |
| `/credit` | Vouchers de crédito com nome do evento, QR code, URL de resgate e importação em lote de links | Protegido por senha |

A impressão ocorre inteiramente no navegador, via drivers Web da biblioteca [Point of Sale](https://github.com/NielsLeenheer/ReceiptPrinterEncoder) — sem servidor de impressão nativo.

### Funcionalidades

- **Tickets de perguntas** — Nome, pergunta/comentário, data/hora e logo Cursor em papel 57/58mm (~32 colunas).
- **Tickets de crédito** — Nome do evento, QR code e URL imprimível para resgate de crédito.
- **Importação em lote (`/credit`)** — Importar links de CSV, XLS ou XLSX; interface em duas colunas (lista + formulário); status de impressão persistido no navegador.
- **Cadastro de eventos (`/credit`)** — Nomes de evento salvos no `localStorage`; dropdown no formulário após a primeira impressão bem-sucedida.
- **Conexões** — USB, Bluetooth (BLE) e Serial (porta COM / Bluetooth Classic emparelhado).
- **Codificação ESC/POS** — `@point-of-sale/receipt-printer-encoder` com detecção automática de language/codepage do driver.
- **Ajuda de requisitos** — Diálogo in-app com pré-requisitos de navegador e hardware.

### Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.2.9 (App Router, Webpack) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Design system | `@gogogo/design-system` (pacote local no monorepo) |
| Impressão | `@point-of-sale/webusb-receipt-printer`, `webbluetooth-receipt-printer`, `webserial-receipt-printer`, `receipt-printer-encoder` |
| Importação de planilhas | `xlsx` (parsing CSV / XLS / XLSX no módulo de crédito) |
| Linguagem | TypeScript 5 |

### Requisitos

#### Navegador

- **Chrome** ou **Edge** (navegadores Chromium com Web USB / Web Bluetooth / Web Serial).
- O app deve rodar em **HTTPS** ou **`http://localhost`** — APIs de dispositivo são bloqueadas em HTTP simples em produção.

#### Impressora

- **Impressora térmica 57/58mm** com suporte **ESC/POS**.
- IDs USB padrão no código: **Netum 58mm** (`0x0416` / `0x5011`); outras ESC/POS costumam funcionar ao selecionar no picker do navegador.
- Largura do papel: **32 colunas de caracteres**.

#### Conexão por plataforma

| Conexão | Linux / macOS | Windows |
|---------|---------------|---------|
| USB | Suportado via Web USB | Use **Serial** com porta COM virtual |
| Bluetooth | BLE via Web Bluetooth | Emparelhe no sistema e conecte via **Serial** |
| Serial | COM / `/dev/tty*` | Porta COM virtual ou Bluetooth Classic emparelhado |

### Instalação

**Pré-requisitos:** Node.js 20+ e npm.

```bash
git clone <url-do-repositorio>
cd web-ticket-print
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (não versionado — ver `.gitignore`):

```env
# Obrigatório para habilitar o módulo /credit
CREDIT_MODULE_PASSWORD=sua-senha-segura
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `CREDIT_MODULE_PASSWORD` | Apenas para `/credit` | Senha do módulo de tickets de crédito. Sem ela, `/credit` exibe mensagem de módulo indisponível. |

**Observações:**

- Se a senha contiver `$`, escape no `.env`: `\$`
- Cookie de sessão válido por **8 horas** após login.
- API de auth: `POST /api/credit/auth` (entrar), `DELETE /api/credit/auth` (sair).

Não há `.env.example` no repositório; use o snippet acima.

### Scripts

```bash
npm run dev      # Servidor de desenvolvimento (Webpack) em http://localhost:3000
npm run build    # Build de produção
npm run start    # Servir build de produção
npm run lint     # ESLint
```

`dev` e `build` usam a flag `--webpack` (necessária para os aliases das libs de impressão em `next.config.ts`).

### Uso

1. Inicie o servidor: `npm run dev`
2. Abra [http://localhost:3000](http://localhost:3000)
3. Clique no ícone da impressora (canto superior direito) e escolha **USB**, **Bluetooth** ou **Serial**
4. Aprove o seletor de dispositivo do navegador e confirme a conexão
5. Preencha o formulário e clique em **Imprimir!**

Para tickets de crédito, acesse [http://localhost:3000/credit](http://localhost:3000/credit), informe a senha do módulo e siga o fluxo em lote abaixo.

#### Fluxo do módulo de crédito (`/credit`)

A tela de crédito usa **layout em duas colunas**:

| Coluna | Função |
|--------|--------|
| Esquerda — **Lista de tickets** | Importar links, filtrar e selecionar tickets (badges `pendente` / `impresso`) |
| Direita — **Formulário** | Nome do evento + link; preenchido ao clicar em um item da lista |

**Fluxo típico:**

1. Conecte a impressora (igual ao módulo de perguntas).
2. Clique em **Importar CSV/XLS** e selecione a planilha.
3. Clique em um link na lista — o formulário recebe a URL (e o nome do evento, se existir no arquivo).
4. Informe ou selecione o nome do evento e clique em **Imprimir**.
5. Após impressão bem-sucedida, o ticket é marcado como **impresso** e o nome do evento é salvo para uso futuro.

**Formato da planilha**

Caso principal: **uma coluna, sem cabeçalho** — uma URL `http://` ou `https://` por linha:

```text
https://credit.example.com/ticket/1
https://credit.example.com/ticket/2
https://credit.example.com/ticket/3
```

Também suportado (opcional):

- **Duas colunas com cabeçalho** — link + nome do evento (`link`, `url`, `evento`, `event`, etc.).
- **Duas colunas sem cabeçalho** — coluna 1 = URL, coluna 2 = nome do evento.

URLs inválidas ou duplicadas são ignoradas ou mescladas (duplicatas mantêm o status **impresso**).

**Armazenamento no navegador (`localStorage`)**

| Chave | Conteúdo |
|-------|----------|
| `web-ticket-print-credit-tickets` | Links importados: `{ id, url, eventName?, printed, importedAt }` |
| `web-ticket-print-credit-events` | Nomes de evento salvos após impressões: `{ id, name, createdAt }` |

Os dados ficam apenas no navegador — limpar dados do site remove a lista e os eventos. Não há persistência no servidor para importações.

### Produção

```bash
npm run build
npm run start
```

Faça deploy em qualquer host Node.js (ex.: Vercel). Garanta:

- HTTPS habilitado (obrigatório para Web USB / Bluetooth / Serial fora de localhost).
- `CREDIT_MODULE_PASSWORD` configurada no ambiente se usar `/credit`.

### Internacionalização (i18n)

A infraestrutura de locales fica em `src/lib/i18n/`:

| Locale | Status |
|--------|--------|
| `pt-BR` | Locale padrão |
| `en-US` | Disponível |
| `es-MX` | Disponível |
| `zh-CN` | Disponível |

A UI usa `LocaleProvider` (`src/contexts/LocaleContext.tsx`) e o hook `useCopy()`. O seletor de idioma fica na barra superior direita (antes do ícone da impressora, com divisor) em `/` e `/credit`. A preferência é salva no `localStorage` em `LOCALE_STORAGE_KEY` (`web-ticket-print-locale`). O módulo de crédito também persiste tickets importados e nomes de evento em `web-ticket-print-credit-tickets` e `web-ticket-print-credit-events` (ver [Fluxo do módulo de crédito](#fluxo-do-módulo-de-crédito-credit)). Metadados do servidor e fallbacks da API continuam no locale padrão (`pt-BR`) via `src/lib/copy.ts`.

### Estrutura do projeto

```
src/
├── app/                    # Rotas Next.js (/, /credit, API)
├── components/             # UI React (formulários, painel da impressora, auth, CreditTicketList)
├── hooks/                  # usePrinter, useCreditStorage
├── lib/
│   ├── format-ticket.ts    # Codificação ESC/POS do ticket de perguntas
│   ├── format-credit-ticket.ts
│   ├── import-ticket-links.ts  # Parser CSV/XLS/XLSX de links de crédito
│   ├── storage/credit-storage.ts  # CRUD localStorage (tickets + eventos)
│   ├── printer/            # Serviço de impressão e opções do encoder
│   ├── i18n/               # Types, provider e arquivos de copy por locale
│   └── copy.ts             # Copy do locale padrão para server/metadata
├── types/                  # credit-import, credit-ticket, payloads de ticket
packages/
└── design-system/          # Tokens e CSS do @gogogo/design-system
public/                     # Logos e assets de marca para tickets
```

### Licença

[MIT](LICENSE) — Copyright (c) 2026 Alê Lima
