# Rawaj SaaS: Dashboard Design Brief

## 1. What Is Rawaj?

Rawaj is an AI-powered SaaS platform for Gulf e-commerce merchants (Shopify, Salla, Zid). It is a single dashboard that replaces multiple tools: a copywriter, a customer inbox, a CRM, an order tracker, a content scheduler, and an ad intelligence tool — all built around Arabic-first AI.

**The six core modules:**
1. **AI Product Generator** — Writes product titles, descriptions, and SEO metadata in Arabic and English.
2. **Social Inbox** — Unifies WhatsApp, Instagram, Facebook, and TikTok messages in one place with AI-drafted replies.
3. **Lead Pipeline** — Visual Kanban board tracking customers from first message to paid order.
4. **Order Hub** — Syncs orders from Shopify, tracks revenue by source, recovers abandoned carts via WhatsApp.
5. **Content Assistant** — Generates social media captions, ad copy, and WhatsApp broadcast messages.
6. **Post Scheduler** — Schedules posts across social platforms and sends bulk WhatsApp broadcasts.

---

## 2. Global Layout & Navigation

### The Shell
Every authenticated page is wrapped in a two-column layout:
- **Left column**: Fixed sidebar (always visible)
- **Right column**: Scrollable page content area

### Sidebar
The sidebar has three zones stacked vertically:

**Top zone — Logo:**
- Small square icon (the Rawaj "R" mark) + the text "Rawaj" beside it
- Clicking this navigates to the Dashboard home

**Middle zone — Navigation groups:**
The nav is organized into labeled groups. Each group has a small uppercase label above its items. Each nav item has an icon and a text label. The active item is visually distinguished (highlighted background + accent left border).

| Group Label | Item | Page |
|---|---|---|
| Core | Dashboard | /dashboard |
| Core | Generate | /dashboard/generate |
| Core | Embed | /dashboard/embed |
| Inbox & CRM | Inbox | /inbox |
| Inbox & CRM | Pipeline | /pipeline |
| Commerce | Orders | /orders |
| Intelligence | Analytics | /analytics |
| Intelligence | Ads | /ads |
| Content | Content | /content |
| Content | Scheduler | /scheduler |
| Account | API Keys | /dashboard/api-keys |
| Account | Upgrade | /dashboard/upgrade |
| Account | Settings | /dashboard/settings |
| Account | Channels | /settings/channels |

**Bottom zone — User avatar:**
- Circular user avatar (from Clerk auth)
- "My Account" label beside it

---

## 3. Page-by-Page Content

---

### Page 1: Dashboard Home
**Route**: `/dashboard`
**Purpose**: Command center. First thing the merchant sees after logging in. Shows their usage at a glance and lets them jump to any core action.

#### Section 1: Page Header
- Title: **"Dashboard"**
- Subtitle: `[Plan Name] Plan — Resets on [Date]` (e.g., "Pro Plan — Resets on May 1, 2026")

#### Section 2: Onboarding Checklist *(shown only for new users until all steps are done)*
- Title: **"Get Started"**
- Progress counter: "X of 3 complete"
- Thin horizontal progress bar showing completion percentage
- 3 checklist steps, each as a clickable row with icon + text:
  1. "Generate your first product" → links to /dashboard/generate
  2. "Copy your embed code" → links to /dashboard/embed
  3. "Install on your store" → links to /dashboard/embed
- Each step shows a filled check icon when done, an empty circle when pending
- Completed steps are struck through and grayed out

#### Section 3: Stats Cards *(4 cards in a row)*
The four cards sit in a grid (2 columns on mobile, 4 on desktop):

**Card 1 — Usage Ring (spans wider on some breakpoints)**
- A circular progress ring (donut chart) showing "generations used / total limit"
- Numbers displayed inside the ring

**Card 2 — Generations Used**
- Small icon (sparkles/stars)
- Label: "Generations Used"
- Large number: e.g., "847"
- Subtext: "of 2,000 limit" (or "Unlimited" for enterprise)

**Card 3 — API Key**
- Small icon (key)
- Label: "API Key"
- Value: truncated public key string (e.g., `pk_live_demo_xxxx…`)
- Subtext: "Active" or "Rotate to generate"

**Card 4 — Current Plan**
- Small icon (code/sparkle)
- Label: "Current Plan"
- Large text: plan name (e.g., "Pro")
- Subtext: "$12.45 spent this month"

#### Section 4: Quick Action Cards *(3 cards in a row, or 4 if upgrade is available)*
Each card is a large clickable tile with icon + title + one-line description:

- **"AI Generator"** → Generate product descriptions
- **"Embed Widget"** → Install on your store
- **"API Keys"** → Manage your keys · pk_live_xxx
- **"Upgrade to [Next Plan]"** *(conditional — only shown if user is not on top plan)* → Shows the next plan price in QAR

---

### Page 2: AI Generator
**Route**: `/dashboard/generate`
**Purpose**: The original core feature. Merchant inputs a product, gets back AI-generated copy.

#### Section 1: Page Header
- Title: **"AI Generator"**
- Subtitle: "Generate product descriptions powered by AI"

#### Section 2: Generator Form *(3 states: Input → Generating → Result)*

**State A — Input Form** (a single card)
Fields in this order:
1. **Product Name** *(required)* — text input, placeholder: "e.g., Silk Abaya"
2. **Category** + **Price** — side by side
   - Category dropdown: Fashion, Food, Electronics, Beauty, Home, Other
   - Price field: optional number input, placeholder "e.g., 199.99"
3. **Target Audience** — optional text input, placeholder "e.g., Young professional women in Qatar"
4. **Tone** + **Language** — side by side
   - Tone dropdown: Professional, Casual, Luxury
   - Language dropdown: Arabic, English, Bilingual
5. **"Generate" button** — full width, primary action

*Error states:*
- Yellow warning card: "Monthly limit exceeded — You've reached your monthly generation limit. [Upgrade your plan]"
- Red error card: generic error message text

**State B — Generating**
- The result card appears with a loading spinner + "Generating…" text
- Live streaming text appears in a shaded box as tokens arrive

**State C — Result** (same card, now complete)
- Streamed/final text displayed in a shaded content box
- Below the box, labeled fields: **Title** (with copy button), **Short Description**
- Token usage row at the bottom: "Tokens in: X · Tokens out: X · Cost: $X.XXXX"
- Two action buttons: **"Copy All"** · **"Regenerate"**

---

### Page 3: Embed Widget
**Route**: `/dashboard/embed`
**Purpose**: Lets the merchant install the AI generation widget on their store.

#### Section 1: Page Header
- Title: **"Embed Widget"**
- Subtitle: "Add the AI product description widget to your store"

#### Section 2: Code Snippets *(card)*
- The merchant's public API key is shown at the top: `pk_live_xxxx`
- Two code snippet blocks with copy buttons:
  - **HTML snippet** (for Shopify/Salla/Zid themes)
  - **JavaScript snippet** (for headless setups)

#### Section 3: Platform Installation Guide *(card)*
- Step-by-step instructions, one section per platform:
  - **Shopify**: 3 numbered steps to paste the snippet in the theme
  - **Salla**: 3 numbered steps
  - **Zid**: 3 numbered steps

#### Section 4: Live Preview *(card)*
- Title: "Live Preview"
- The actual widget embedded in an iframe at full card width
- Subtext: "This is a live preview of how the widget will appear on your store."

---

### Page 4: Inbox (Conversation List)
**Route**: `/inbox`
**Purpose**: Central hub for all incoming customer messages across all connected channels.

#### Section 1: Page Header
- Title: **"Inbox"**
- Subtitle: "All customer conversations across connected channels."

#### Section 2: Filter Bar *(horizontal row of controls)*
Three filter controls in a row:
1. **Platform dropdown**: All Platforms / Instagram / WhatsApp / Facebook
2. **Intent dropdown**: All Intents / Ready to Buy / Price Inquiry / Info Request / Complaint / Browsing
3. **"Unread only" checkbox** with label

#### Section 3: Conversation List
A scrollable list of conversation rows. Each row represents one contact/conversation and contains:
- **Platform icon** (Instagram camera icon, WhatsApp bubble, Facebook "f", TikTok note)
- **Contact name** (bold)
- **Last message preview** (truncated, one line, lighter text)
- **AI Intent badge** — pill label showing the detected buyer intent (e.g., "Ready to Buy", "Price Inquiry")
- **AI Score** — a numeric score (0–100) showing buyer likelihood
- **Unread indicator** — a small dot or bold text when there are unread messages
- **Timestamp** — relative time (e.g., "2 min ago")

Clicking any row navigates to the conversation thread page.

---

### Page 5: Inbox Thread (Conversation)
**Route**: `/inbox/[contactId]`
**Purpose**: Full conversation history with one customer + reply interface.

#### Section 1: Contact Header *(replaces page header)*
- Back arrow button ← (returns to inbox list)
- Platform icon (Instagram / WhatsApp / Facebook / TikTok)
- **Contact name** (e.g., "Ahmed Al-Rashidi")
- Subtext: `[Platform] · Score: [number]` (e.g., "INSTAGRAM · Score: 87")

#### Section 2: Message Thread *(fills most of the page, scrollable)*
A chat-style thread of messages in chronological order. Each message bubble shows:
- Message text content
- Direction: inbound messages on the left, outbound (sent by merchant) on the right
- Timestamp below each message
- For inbound messages: AI-detected intent label (e.g., "READY_TO_BUY")

#### Section 3: Reply Composer *(pinned to the bottom of the page)*
A compose area for sending replies. Contains:
- **AI Draft (English)** — AI-suggested reply text, editable
- **AI Draft (Arabic)** — Same AI draft in Gulf Arabic dialect, editable
- Language toggle to switch between drafts
- **"Send Reply" button** — primary action

---

### Page 6: Pipeline (CRM Kanban)
**Route**: `/pipeline`
**Purpose**: Visual deal tracking from first contact to closed sale.

#### Section 1: Page Header
- Title: **"Pipeline"**
- Subtitle: "Total: [X] QAR" (sum of all deal values currently in the pipeline)
- Right action: **"New Deal" button** (opens a creation dialog)

#### Section 2: Filter Bar
Horizontal filter row with:
- **Platform filter**: dropdown (All / Instagram / WhatsApp / Facebook / TikTok)
- **Assignee filter**: text input or dropdown
- **Score range**: Min Score + Max Score inputs
- **Date range**: From date + To date pickers
- **"Clear filters" button**

#### Section 3: Kanban Board *(the main content, scrolls horizontally)*
A horizontal board with 6 columns, each representing a deal stage:

| Column | Stage Name |
|---|---|
| 1 | New |
| 2 | Contacted |
| 3 | Qualified |
| 4 | Proposal |
| 5 | Paid |
| 6 | Lost |

Each column has:
- Column **title** (stage name) + **count** of deals + **total value** in QAR
- A stack of **Deal Cards** (vertically scrollable within column)
- Deals can be dragged between columns (drag-and-drop)

**Deal Card** (each card in the board):
- Contact name (bold)
- Deal title
- AI score badge (e.g., "Score: 85")
- Value in QAR (e.g., "1,200 QAR")
- Priority label: High / Medium / Low
- Platform icon (tiny)
- Assigned team member avatar/initials
- Due date (if set)
- Clicking the card opens the **Deal Detail Sheet**

#### Section 4: Deal Detail Sheet *(slides in from the right as a drawer)*
A side panel that slides in when a deal card is clicked. Contains:

**Header:**
- Deal title + stage badge + priority badge
- AI Score (large number)

**Contact info block:**
- Contact name, platform, platform ID, AI score, total historical spend

**Details block:**
- Notes (text)
- Value (QAR)
- Due date
- Assigned to (name)
- Closed at (if applicable)

**Message history tab:**
- List of recent messages between merchant and contact
- Each message shows direction, content preview, intent label, timestamp

**Tasks tab:**
- List of to-do tasks linked to this deal
- Each task: title, description, due date, assigned to, completion status
- "Complete" action per task

**Notifications/Alerts tab:**
- AI-generated alerts for this deal (e.g., "Deal has been idle for 3 days")
- Each alert: title, body text (English + Arabic), priority badge
- AI reply draft in English + Arabic for quick response

---

### Page 7: Orders
**Route**: `/orders`
**Purpose**: View and manage all orders across Shopify, WhatsApp, and manual entry.

#### Section 1: Page Header
- Title: **"Orders"**
- Right actions (horizontal row):
  - Currency switcher pills: **QAR** · **SAR** · **USD** (only one active at a time)
  - **"Export CSV" button** with download icon
  - **"Add Order" button** (opens a manual order creation form)

#### Section 2: Revenue Summary Cards *(4 stat cards in a row)*
- **Total Revenue** — large number + currency + current month label (e.g., "April 2026")
- **Shopify Revenue** — revenue + order count from Shopify
- **WhatsApp Revenue** — revenue + order count from WhatsApp
- **Manual Revenue** — revenue + order count from manual entries

#### Section 3: Filter Bar
Horizontal filter controls:
- **Source** dropdown: All / Shopify / WhatsApp / Manual
- **Status** dropdown: All / Pending / Confirmed / Shipped / Delivered / Cancelled
- **Date From** + **Date To** date pickers

#### Section 4: Order Pipeline Board
Orders displayed as a horizontal Kanban board with status columns:
- **Pending** · **Confirmed** · **Shipped** · **Delivered** · **Cancelled**

Each order card shows:
- Order reference number
- Customer name
- Source (Shopify / WhatsApp / Manual) with icon
- Order value in selected currency
- Date/time
- Status badge

---

### Page 8: Content Assistant
**Route**: `/content`
**Purpose**: AI-powered content generation for social media posts, ads, and broadcast messages.

#### Section 1: Page Header
- Title: **"Content Assistant"**

#### Section 2: Tab Navigation *(3 tabs)*
Tabs switch between the three generation tools:
1. **Captions**
2. **Ad Copy**
3. **Broadcast**

---

#### Tab 1: Captions
Generates social media captions for products.

**Input area:**
- Language toggle: **AR** / **EN** (pill toggle, Arabic selected by default)
- Tone selector: pills for **Casual** · **Professional** · **Exciting** · **Informative**
- Large text area: "Describe your product…" placeholder
- **"Generate Caption" button**

**Result area** *(appears after generation):*
- Generated caption text (in the selected language) in a shaded box with a copy button
- Hashtags displayed as individual pill badges below the caption, each copyable
- "Copy all" button

#### Tab 2: Ad Copy
Generates short-form advertising copy.

**Input area:**
- Language toggle: AR / EN
- Product/offer description text area
- Target platform dropdown (Instagram, Facebook, TikTok, Snapchat)
- Tone selector
- **"Generate Ad Copy" button**

**Result area:**
- Generated headline text
- Generated body copy
- Call-to-action suggestion
- Copy buttons for each section

#### Tab 3: Broadcast
Composes a WhatsApp broadcast message.

**Input area:**
- Template name field
- Language toggle: AR / EN
- Message body text area (with character/word count)
- **"Save & Schedule" button**

---

#### Seasonal Templates *(collapsible section below the tabs)*
- Expandable section labeled "Seasonal Templates"
- A gallery of pre-built template cards for occasions: Ramadan, Eid Al-Fitr, Eid Al-Adha, National Day, etc.
- Clicking a template pre-fills the caption generator

---

### Page 9: Post Scheduler
**Route**: `/scheduler`
**Purpose**: Schedule social media posts and manage WhatsApp broadcast campaigns.

#### Section 1: Page Header
- Title: **"Post Scheduler"**
- Description: "Schedule posts and send WhatsApp broadcasts."

#### Section 2: Tab Navigation *(2 tabs)*
1. **Posts**
2. **Broadcasts**

---

#### Tab 1: Posts — Calendar View
A monthly/weekly calendar grid. Each day cell can contain scheduled post items.

**Calendar controls:**
- Previous / Next month navigation arrows
- Current month + year label
- View toggle: Month / Week

**Scheduled post item** (appears on calendar day):
- Platform icon
- Post title or content preview (truncated)
- Status indicator (Scheduled / Published / Failed)

**Adding a new post:**
- Click any day → opens "New Scheduled Post" dialog
- Fields: Platform, Content text area, Scheduled date + time, Attachment (optional)
- "Schedule" button

#### Tab 2: Broadcasts — Table View
A list of all WhatsApp broadcast campaigns.

**Table header row:** Name · Status · Sent / Failed · Date

**Each broadcast row:**
- **Template name** (text)
- **Status badge**: Draft (gray) · Sending (blue) · Sent (green) · Failed (red)
- **Sent / Failed counts**: e.g., "248 / 3"
- **Date**: formatted date

**"New Broadcast" button** (top-right of the tab) → opens a dialog:
- Template name field
- Message body text area (Arabic/English)
- Recipient count (auto-calculated from contacts)
- "Send Now" or "Schedule" action buttons

---

### Page 10: Analytics
**Route**: `/analytics`
**Status**: Coming soon (placeholder page)

**Content:**
- Title: **"Analytics"**
- Placeholder state with icon (bar chart), title, and description:
  *"Revenue analytics, customer insights, and AI performance tracking."*
- Phase label: "Phase 8"

*This page will eventually contain charts and data. The designer should plan for a data-rich layout with line charts, bar charts, and stat cards.*

---

### Page 11: Ads Intelligence
**Route**: `/ads`
**Status**: Coming soon (placeholder page)

**Content:**
- Title: **"Ads"**
- Placeholder state with icon (megaphone), title, and description:
  *"Smart ad campaign management powered by AI targeting."*
- Phase label: "Phase 8"

---

### Page 12: API Keys
**Route**: `/dashboard/api-keys`
**Purpose**: Manage the public/secret key pair used for widget embed authentication.

#### Section 1: Page Header
- Title: **"API Keys"**
- Subtitle: "Manage your API keys for widget embeds"

#### Section 2: Key Display Card
- **Public Key** row:
  - Label: "Public Key (pk_live_xxx)"
  - The full key string displayed in a monospace font
  - "Copy" button beside it
- **Secret Key** row:
  - Label: "Secret Key"
  - Value: masked (shown as `sk_live_••••••••••••`) — never shown in full
  - Note: "Shown once at time of rotation only"
- **"Rotate Keys" button** — generates a new key pair (requires confirmation):
  - Warning: "Rotating keys will immediately invalidate your existing keys. Any stores using the old key will stop working."
  - Confirmation dialog before proceeding
  - After rotation: the new secret key is shown once in full — copy prompt

---

### Page 13: Upgrade / Pricing
**Route**: `/dashboard/upgrade`
**Purpose**: Plan comparison and checkout. The merchant upgrades here via Stripe.

#### Section 1: Page Header *(inline, no separate component)*
- Title: **"Upgrade Your Plan"**
- Subtitle: "You are currently on the [Current Plan] plan."

#### Section 2: Pricing Cards *(3–4 cards)*
Each plan is a vertical card with:

**Plan: Free**
- Name: "Free"
- Price: "0 QAR / month"
- Feature list (3–4 items): 20 AI Generations/month, 1 channel, basic support
- Button: "Current Plan" (disabled, if active)

**Plan: Starter**
- Name: "Starter"
- Price: "49 QAR / month" + "14 USD / month"
- Feature list: 200 AI Generations, 3 channels, Shopify integration, chat support
- Button: "Upgrade to Starter" (Stripe checkout)

**Plan: Pro** *(visually highlighted as recommended)*
- Name: "Pro"
- Badge: "Most Popular"
- Price: "149 QAR / month" + "41 USD / month"
- Feature list: 2,000 AI Generations, unlimited channels, full inbox, pipeline CRM, content scheduler
- Button: "Upgrade to Pro"

**Plan: Enterprise**
- Name: "Enterprise"
- Price: "Custom"
- Feature list: Unlimited generations, custom integrations, dedicated support
- Button: "Contact Us"

---

### Page 14: Settings
**Route**: `/dashboard/settings`
**Purpose**: Organization settings (name, etc.)

#### Section 1: Page Header
- Title: **"Settings"**

#### Section 2: Organization Settings Card
- **Organization Name** field: editable text input with current name pre-filled
- **"Save Changes" button**

---

### Page 15: Channels
**Route**: `/settings/channels`
**Purpose**: Connect and manage social media channels for the inbox.

#### Section 1: Page Header
- Title: **"Channels"**
- Subtitle: "Connect your social media accounts to receive messages in the unified inbox."

#### Section 2: Success Toast *(temporary, shown after connecting a channel)*
- Green info bar: "[Platform] connected successfully!"
- Auto-dismisses after 4 seconds

#### Section 3: Channel Cards Grid *(2–3 columns)*
One card per platform. Platforms shown: **Instagram**, **WhatsApp**, **Facebook**, **TikTok** *(TikTok only if enabled)*.

**Each Channel Card — Connected state:**
- Platform logo/icon
- Platform name (e.g., "Instagram")
- Connected account name or page name
- Status: "Connected" (green badge)
- "Disconnect" button (destructive action)

**Each Channel Card — Not connected state:**
- Platform logo/icon (grayed or full color)
- Platform name
- Status: "Not connected" (gray badge)
- "Connect [Platform]" button → triggers OAuth flow

---

## 4. Common UI Patterns Used Throughout

### Page Header Component
Every page starts with a consistent header:
- Large **title** (H1 equivalent)
- Optional smaller **subtitle** below it
- Optional **action button** aligned to the right (e.g., "New Deal", "Export CSV")

### Placeholder / Coming Soon State
Pages not yet enabled show a centered placeholder:
- Icon (large, centered)
- Feature name
- One-sentence description
- "Phase X" label (which development phase it ships in)

### Empty State
When a list has no data:
- Centered text message (e.g., "No broadcasts yet.")
- Optional CTA button

### Loading State
- Skeleton shimmer cards or a centered text "Loading…"
- Animated pulse on placeholder elements

### Status Badges
Reused across inbox, pipeline, and orders:
- **Gray** = Draft / Pending / Unread
- **Blue** = In Progress / Sending
- **Green** = Active / Connected / Sent / Paid
- **Red** = Failed / Disconnected / Lost
- **Yellow/Amber** = Warning / Stale / Inquiry

### Priority Badges (Pipeline)
- High / Medium / Low — shown as small colored text labels on deal cards

### Intent Badges (Inbox)
- Ready to Buy / Price Inquiry / Info Request / Complaint / Browsing

---

## 5. Current Project Status

| Module | Status | Notes |
|---|---|---|
| AI Product Generator | ✅ Live | Core feature, streaming responses |
| Embed Widget | ✅ Live | Public key auth, iframe preview |
| Social Inbox | ✅ Live | Instagram, WhatsApp, Facebook, TikTok |
| Lead Pipeline (CRM) | ✅ Live | Kanban + deal detail sheet |
| Order Hub | ✅ Live | Shopify sync + revenue summary |
| Content Assistant | ✅ Live | Captions, ad copy, broadcast |
| Post Scheduler | ✅ Live | Calendar + broadcast table |
| Analytics | 🔜 Coming soon | Phase 8 |
| Ads Intelligence | 🔜 Coming soon | Phase 8 |
| Arabic RTL Dashboard | ⚠️ Planned | Currently English LTR (tracked exception) |

---

## 6. Key Design Considerations for the Designer

1. **Arabic-first product** — the primary users are Gulf Arabic merchants. Text in the product (AI outputs, reply drafts) is primarily Arabic. The dashboard itself is currently English but is planned to go Arabic RTL. Design with both orientations in mind.

2. **Dense information screens** — the Inbox thread, Pipeline board, and Orders page are data-heavy. Prioritize readability at small sizes.

3. **Kanban boards need horizontal scroll** — both Pipeline and Orders use horizontal column layouts. On mobile, these scroll horizontally.

4. **The sidebar is fixed at 256px wide** — page content fills the remaining width with a comfortable max-width on most pages.

5. **Streaming text** — the AI Generator shows live-streamed text as it generates. The output area should feel dynamic (not a static text box).

6. **Three-state forms** — the Generator and Caption tools have Input → Generating → Result states. Each state needs a distinct visual treatment.

7. **Real-time updates** — the Inbox thread uses SSE (Server-Sent Events) to push new messages in real time without page refresh.

8. **Bilingual AI drafts** — the reply composer and deal notifications always show both an English draft and an Arabic Gulf dialect draft side by side (or toggleable).
