# Implementation Plan - Noventra Messaging Platform V2 (Flagship Feature Expansion)

We will transform Noventra's messaging platform into the premium communication hub for the entire startup ecosystem. The interface will maintain Noventra's clean white design language with rounded corners, subtle borders, soft shadows, and smooth Framer Motion animations (no glassmorphism or flashy gradients).

---

## Proposed Changes

### 1. Database & Server Architecture (Express + Socket.io)

#### [MODIFY] [schema.prisma](file:///c:/Users/nayud/OneDrive/HACKATHON/Noventra/server/prisma/schema.prisma)
We will extend the `Message` and `Meeting` related schemas to support rich message payloads, CRM timeline states, tasks, notes, files, and reactions.
- Add fields/relations to `Message`:
  - `type`: String (TEXT, IMAGE, VIDEO, AUDIO, VOICENOTE, PITCHDECK, CODE, POLL, EVENT, OPPORTUNITY_CARD, COMMIT, CRM_UPDATE)
  - `metadata`: Json? (Stores data for polls, cards, code snippets, git commits, CRM timeline checkpoints)
  - `reactions`: Json? (Stores emoji reactions maps `user_id -> emoji`)
  - `replyToId`: String? (Self-relation for message replies/threads)
  - `readBy`: Json? (List of user IDs who have seen the message for read receipts)
  - `pinned`: Boolean @default(false)
- Ensure DB relations support shared workspaces, documents, roadmaps, and custom tasks associated with individual conversations or startups.

#### [NEW] [messageHandler.ts](file:///c:/Users/nayud/OneDrive/HACKATHON/Noventra/server/socket/messageHandler.ts)
A socket controller module to manage V2 real-time triggers:
- **Typing Status**: `typing-start` and `typing-stop` with target conversation.
- **Voice / Uploading Status**: `recording-start`/`stop` and `uploading-start`/`stop` to render indicators in the header or message preview.
- **Watching FounderTV**: `watching-start` and `watching-stop` events for future watch party features.
- **Active Call Sync**: `call-invite`, `call-accept`, `call-decline`, and real-time transcription feed.
- **Reactions**: `reaction-toggle` to broadcast message emoji reactions.
- **Online Presence**: `presence-register` mapping socket IDs to active user roles (e.g. Founder, Investor) and emitting user status updates (`ONLINE`, `AWAY`, `IDLE`, `DND`).

#### [MODIFY] [messages.ts](file:///c:/Users/nayud/OneDrive/HACKATHON/Noventra/server/routes/messages.ts)
We will rewrite the messages endpoints to:
1. Handle message pagination and infinite scroll markers.
2. Fetch and persist reactions, edits, deletes, and replies.
3. Parse tags and text for automatic **AI Conversation Copilot** extractions (Tasks, Deadlines, Meeting proposals).
4. Introduce a `/api/messages/mock-setup` route to seed realistic startup-investor matching contexts, FounderTV watches, and application logs if the database lacks active mutual connections.

---

### 2. Frontend Layout & Core Engines (Next.js)

#### [MODIFY] [page.tsx](file:///c:/Users/nayud/OneDrive/HACKATHON/Noventra/client/src/app/messages/page.tsx)
We will build a high-performance, virtualized three-panel workspace structure.

#### Panel 1: Left Navigation & Conversation Feed
- **Gmail-style Search Box**: Support filters like `from:Jason`, `has:file`, `tag:Funding`, `tag:Hiring`, `before:`, `after:`.
- **Filters Bar**: Quick tabs for *All*, *Unread*, *Founders*, *Investors*, *Startups*, *Teams*.
- **Conversation Cards**:
  - Live avatars with online indicators (green, orange, red, gray).
  - Verification badges, roles (e.g., "Partner at Sequoia", "Founder of MedQuick"), active startup label.
  - Sub-badges: "Typing...", "Recording audio...", "Watching FounderTV...".
  - Unread count badge and pinned indicator.

#### Panel 2: Interactive Center Chat View
- **Universal Context Banner (Pinned)**: Renders context details explaining WHY they are connected (e.g., "Senior Frontend Engineer Applied 3 days ago" or "Investor Match: Seed Round, Healthcare AI").
- **Startup CRM Timeline (Foldable Header Section)**: Shows status timeline progression:
  `Applied ➔ Profile Viewed ➔ Connected ➔ Meeting Booked ➔ Deck Shared ➔ Demo Done ➔ Term Sheet ➔ Closed`
- **Rich Message Types**:
  - *Standard Media & Previews*: Inline video player, PDF slides deck preview, ZIP download card, audio player.
  - *Opportunity Cards*:
    - **Job Card**: Title, location, salary range, CTA buttons (Apply, Save, Share).
    - **Investor Card**: Fund name, sectors (AI, FinTech), "View Profile" button.
    - **Startup Card**: Name, seed stage, open positions list, "Visit Startup" CTA.
    - **FounderTV Card**: Pitch video thumbnail, duration, view count, direct inline watch window.
  - *Markdown & Code Blocks*: Full markdown parsing with code block copying, line numbers, syntax highlighting.
  - *Interactive Polls*: Live options where users click to vote, showing real-time percentages.
- **Message Controls & Reactions**:
  - Long-press (mobile) or hover toolbar: Reply, Thread, Forward, Quote, Copy, Bookmark, Translate, AI Rewrite, Edit, Delete.
  - Reactions panel: Emoji picker for quick overlays (`👍`, `❤️`, `🔥`, `🚀`, `👏`, `😂`, `💡`).
- **State-of-the-Art Composer**:
  - Attachment preview tray with progress bars.
  - Voice recording waveform animation and swipe-to-cancel gestures.
  - Mentions popup (`@`) and command auto-complete (`/poll`, `/meet`, `/code`).
  - AI Assistant copilot button.
  - Scheduled messages configuration picker.

#### Panel 3: Right Sidebar Workspace & Info Panel (Toggleable)
The right panel contains two toggle modes: **Professional Information** and **Startup Collaboration Workspace**.

- **Mode A: Professional Profile Details**:
  - **Founder Mode**: Displays startup KPIs, funding progress (progress bar), recent investors, hiring status, Founder Score graph, latest uploads.
  - **Investor Mode**: Portfolio size, investment thesis, average ticket size, recent investments list, Open Office Hours availability, "Book Meeting" button, mutual startups.
  - **Shared Workspace Grid**: Categorized files, links, media gallery, pinned messages, notes, and meeting history.
  - **Activity Feed**: Shows live notifications (e.g., "Investor viewed your deck", "Job application updated") and recent community posts.

- **Mode B: Startup Collaboration Spaces** (Unlocked if chatting with startup members):
  - **Workspace Tabs**:
    1. *Chat*: Core conversation history.
    2. *Tasks*: Interactive Kanban/Todo Board (add, drag, checklist, complete).
    3. *Docs*: Shared Markdown notes and collaborative documents.
    4. *Roadmap*: Gantt-like timeline of milestones (e.g., MVP release, Seed Pitching).
    5. *Hiring*: Open positions dashboard with applicant counts.
    6. *Investors*: CRM table of target VCs, ticket size, status.
    7. *Files*: Revision history, versions, uploaders.
    8. *Notes*: Local-first text notes synced dynamically.
    9. *Meetings*: Past call transcripts, next events.
    10. *FounderTV*: Media clip playlists, watch together history.

---

### 3. Integrated Calls & Scheduling Engines

#### **AI Meeting Assistant & Scheduling Portal**
- **Meetings Scheduler**: In-chat panel supporting timezone selectors, suggestion chips (e.g., "Suggest 3:00 PM Tomorrow"), and click-to-book functionality.
- **Built-in Call Overlay**: Mocks a fully-featured live video/audio conference.
  - Video stream grids, mute/camera/screen-share buttons.
  - **AI Meeting Panel (Sidebar)**:
    - *Meeting Agenda*: Clear bullet points.
    - *Live Notes*: Dynamic logs.
    - *Live Transcript*: Streaming text lines.
    - *Action Items*: Extracting checkboxes on the fly.
    - *Follow-up Draft*: Post-meeting email draft ready to send.

#### **AI Conversation Copilot Drawer**
- **Action Drawer**: Clicking the AI button triggers actions:
  - *Summarize Conversation*: Condenses the last 200 messages instantly into structural highlights.
  - *AI Rewrite*: Transform input text (Professional, Friendly, Recruiter, Founder, Investor tones).
  - *Suggest Questions*: Provides 3 relevant questions to ask next based on chat context.
  - *Pitch Reply Generator*: Write context-aware responses to pitch deck reviews.

---

### 4. Performance & Mobile Architecture

- **Infinite Virtual Scrolling**: Employs React virtual list rendering to maintain 60 FPS under massive message histories.
- **Optimistic UI state**: Instantly insert sent messages and reactions, reverting on failure.
- **Offline Sync & Socket Resilience**: Queues messages locally when internet is lost and flushes them on reconnect.
- **Responsive Adaptability**:
  - Bottom sheet panels for composer actions and details on mobile view.
  - Gesture swipe-actions on conversation lists (Swipe left to archive, Swipe right to pin).
  - Sidebar toggling into full-viewport screen overlays.

---

## Verification Plan

### Manual Verification
1. Open active conversations representing **Founder-to-Investor** and **Founder-to-Applicant**. Verify the Context Banner and CRM Timeline update dynamically.
2. Schedule a meeting from the picker and verify the invitation card shows inline in the chat.
3. Start a Call, view the live video mockup, and click through the AI Meeting Assistant tabs to confirm the transcript, agenda, and action items render properly.
4. Interact with the Startup Workspace Kanban board, adding a task and dragging it across columns.
5. Search for messages using Gmail filter formats (`from:`, `has:file`).
6. Trigger the AI Copilot to summarize the conversation and test the translation picker.
