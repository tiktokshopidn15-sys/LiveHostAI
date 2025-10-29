# TikTok Live AI Host - Design Guidelines

## Design Approach: Material Design System

**Rationale:** This is a utility-focused, real-time dashboard requiring clarity, efficiency, and information density. Material Design provides robust patterns for data visualization, real-time updates, and complex control interfaces while maintaining visual hierarchy in information-dense environments.

---

## Typography System

**Font Family:**
- Primary: Inter (Google Fonts) - excellent readability for data-dense interfaces
- Monospace: JetBrains Mono (Google Fonts) - for usernames, technical data

**Hierarchy:**
- Page Title: text-2xl font-bold (Dashboard header)
- Section Headers: text-lg font-semibold (Panel titles: "TikTok Live Control", "Chat Log", "Voice Settings")
- Subsection Labels: text-sm font-medium uppercase tracking-wide (Status labels, input labels)
- Body Text: text-base font-normal (Chat messages, AI responses)
- Secondary Text: text-sm text-gray-600 (Timestamps, metadata)
- Usernames: font-mono text-sm font-semibold (Chat attribution)
- Button Text: text-sm font-medium (All CTAs)

---

## Layout System

**Grid Structure:** Three-column dashboard layout with bottom panel
- Left Column: 320px fixed width (Live Controls)
- Center Column: Flexible flex-1 (Chat Log - primary focus)
- Right Column: 280px fixed width (Voice Settings)
- Bottom Panel: Full-width collapsible sections (Product Showcase, Subscription)

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-6
- Section gaps: gap-6
- Inner element spacing: space-y-4
- Tight spacing: gap-2 (for related items like status indicators)
- Card padding: p-4

**Responsive Breakpoints:**
- Mobile (<768px): Stack all panels vertically, full-width
- Tablet (768px-1024px): Two-column (Left+Right / Center stacked)
- Desktop (>1024px): Full three-column layout

---

## Component Library

### 1. Control Panel (Left Column)

**Username Input Field:**
- Full-width text input with label above
- Placeholder: "@username or username"
- Height: h-10
- Border radius: rounded-md
- Focus state with ring treatment

**Start Live Button:**
- Full-width primary action button
- Height: h-12
- Border radius: rounded-lg
- Icons from Heroicons: play-circle (start), stop-circle (stop)

**Status Indicators:**
- Three states displayed as chips/badges
- Layout: Inline with icon + text
- Icons: check-circle (Online), arrow-path (Reconnecting), moon (Idle)
- Padding: px-3 py-1.5
- Border radius: rounded-full

### 2. Chat Log (Center Column)

**Container:**
- Full height with auto-scroll
- Background with subtle contrast from main background
- Border radius: rounded-lg
- Padding: p-4
- Max height with overflow-y-auto

**Chat Message Cards:**
- Each message in distinct card
- Padding: p-3
- Margin between messages: space-y-2
- User messages vs AI responses visually differentiated with subtle background variations

**Message Structure:**
- Username in monospace font, bold
- Timestamp in small gray text, right-aligned
- Message text below with comfortable line-height (leading-relaxed)

**Auto-scroll Indicator:**
- Small floating button at bottom-right of chat container
- Icon: arrow-down
- Size: h-8 w-8
- Shows when not at bottom

### 3. Voice Settings (Right Column)

**Voice Selector:**
- Vertical list of 6 radio button options
- Each option as clickable card: p-3, rounded-md
- Voice names: Nova, Alloy, Echo, Coral, Verse, Flow
- Active state clearly indicated with border treatment

**Test Voice Button:**
- Full-width secondary button
- Height: h-10
- Icon: speaker-wave
- Positioned below voice list with mt-4

### 4. Product Showcase (Bottom Panel)

**Tab Navigation:**
- Two tabs: "Product Showcase" and "Subscription Plans"
- Horizontal tabs with underline active indicator
- Tab height: h-12

**Product Grid (Tab 1):**
- 10 input rows in scrollable container
- Each row contains:
  - Number badge (1-10): w-6 h-6 rounded-full
  - URL input field: flex-1
  - Product preview card (when filled): Border treatment, shows image thumbnail, name, price, short description
- Grid layout on desktop: grid-cols-2 gap-4
- Mobile: grid-cols-1

**Product Card Display:**
- Compact horizontal layout
- Thumbnail: 60px square, rounded
- Text hierarchy: Product name (font-medium), Price (font-bold), Description (text-sm)

### 5. Subscription Panel (Tab 2)

**Plan Cards:**
- Three cards side-by-side on desktop: grid-cols-3 gap-6
- Each card structure:
  - Plan name header: text-lg font-bold
  - Token amount: text-3xl font-bold
  - Price: text-xl
  - Feature list with checkmarks (Heroicons check icon)
  - CTA button at bottom
- Recommended plan highlighted with subtle border treatment
- Card padding: p-6
- Border radius: rounded-xl

**Developer Mode Banner:**
- Full-width alert-style component
- Icon: code-bracket
- Text: "Developer Mode Active - Unlimited Tokens"
- Padding: p-4
- Dismissible

---

## Navigation & Status

**Top Bar:**
- Full-width header with app branding
- Height: h-16
- Contains: Logo/title left, token count indicator center, settings icon right
- Sticky positioning: sticky top-0

**Token Counter:**
- Circular progress indicator showing remaining tokens
- Text display: "X tokens remaining"
- Updates in real-time

---

## Real-time Updates & Animations

**Minimal Animation Strategy:**
- Chat messages: Gentle fade-in (no slide)
- Status changes: Color transition only
- Audio playback: Simple pulsing dot indicator
- NO complex scroll animations or parallax effects

**Loading States:**
- Skeleton screens for product previews
- Spinner for connection states (Heroicons: arrow-path with animate-spin)
- Progress bar for audio generation

---

## Icons

**Library:** Heroicons (CDN)

**Icon Usage:**
- Navigation: home, cog-6-tooth, information-circle
- Actions: play, pause, stop, microphone, speaker-wave
- Status: check-circle, x-circle, exclamation-triangle, arrow-path
- Content: chat-bubble-left-right, shopping-bag, user-group
- Size consistency: Most icons w-5 h-5, larger for primary actions w-6 h-6

---

## Forms & Inputs

**Text Inputs:**
- Height: h-10 (standard), h-12 (prominent)
- Padding: px-3
- Border radius: rounded-md
- Focus ring: ring-2

**Buttons:**
- Primary: Solid fill, h-10 or h-12
- Secondary: Border treatment with transparent background
- Padding: px-4 py-2 (small), px-6 py-3 (large)
- Border radius: rounded-lg
- Icons positioned left of text with mr-2

**Radio Buttons (Voice Selection):**
- Custom styled as clickable cards rather than default radio inputs
- Clear selected state with check icon

---

## Data Display

**Log Formatting:**
- Monospace font for technical details
- Timestamp format: HH:MM:SS
- Color-coded log types (info, success, error) using text utilities only (not background colors)

**Product Information:**
- Price always in bold
- Product names truncated with ellipsis if too long (truncate)
- Descriptions max 2 lines with line-clamp-2

---

## Accessibility

- All interactive elements keyboard accessible
- Focus indicators clearly visible on all inputs and buttons
- Status updates announced via aria-live regions for screen readers
- Sufficient contrast ratios for all text
- Form labels properly associated with inputs

---

## Images

**Product Images:**
- Thumbnail size: 60px × 60px square
- Object-fit: cover
- Rounded corners: rounded-md
- Placeholder when missing: Gray box with shopping-bag icon centered

**No hero image required** - This is a functional dashboard, not a marketing page.