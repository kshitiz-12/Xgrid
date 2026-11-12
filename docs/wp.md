# Aura Connect — Product Specification

**Product:** WhatsApp Business Engagement & Conversion Platform  
**Version:** 1.0 (Production)  
**Status:** Production Architecture  
**Scope:** Modules 1–4 and 6 (Workflow Automation Builder deferred)

---

## 1. Executive Summary

Aura Connect is a production WhatsApp business platform that turns inbound and outbound conversations into qualified, scored, and converted revenue. It combines official WhatsApp Business Cloud API messaging, an AI sales assistant, a full lead CRM, automated follow-ups, and compliant customer broadcasts — operated from a centralized inbox and admin workspace.

The platform is vertical-agnostic. Business personality, catalog knowledge, FAQs, and conversion goals are configured per tenant so the same core can serve jewellery, education, clinics, real estate, and other high-consideration sales motions.

**Primary conversion outcome (default):** booking deposit / appointment lock  
**Secondary outcomes:** qualified lead handoff, catalog enquiry closure, re-engagement

---

## 2. Product Goals

| Goal | Description |
|------|-------------|
| Official-channel compliance | Operate only on Meta WhatsApp Business Cloud API |
| Human-like conversion | AI handles full conversation; humans only for severe escalation |
| Single source of truth | Every chat creates/updates CRM leads with full activity history |
| Recoverable pipeline | Automated follow-ups for non-converters without spamming responders |
| Scale messaging | Segmented, template-based broadcasts to opted-in customers |
| Multi-number operations | Multiple WABA numbers under one organization |

**Out of scope (v1):** Visual drag-and-drop workflow builder (Module 5). Equivalent business logic is delivered via configured AI rules, CRM pipeline automation, follow-up sequences, and broadcast campaigns.

---

## 3. System Architecture

```
                    ┌─────────────────────────────┐
                    │     Meta Cloud API / WABA   │
                    │  (numbers, templates, media)│
                    └──────────────┬──────────────┘
                                   │ webhooks
                                   v
┌──────────────┐         ┌─────────────────────┐         ┌────────────────┐
│ Admin Web UI │ <-----> │   Aura Connect API  │ <-----> │  PostgreSQL    │
│ Inbox + CRM  │         │  Gateway + Workers  │         │  + Object Store │
└──────────────┘         └──────────┬──────────┘         └────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    v               v               v
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │ AI Engine  │  │ Follow-up  │  │ Broadcast   │
             │ (Gemini)   │  │ Scheduler  │  │ Dispatcher  │
             └────────────┘  └────────────┘  └─────────────┘
```

### Core services

| Service | Responsibility |
|---------|----------------|
| API Gateway | Auth, tenant isolation, REST/Graph endpoints |
| Webhook Ingest | Verify Meta signatures, enqueue inbound events |
| Message Worker | Send/receive, media handling, receipts sync |
| AI Engine | NLU, intent, context memory, reply generation |
| CRM Service | Leads, pipeline, scoring, assignment, notes |
| Follow-up Worker | Time/event triggers, sequence execution |
| Broadcast Worker | Segment fan-out, template sends, opt-out |
| Inbox Service | Real-time conversation sync for agents |
| Knowledge Service | FAQ + document/PDF retrieval for AI |

---

## 4. Module Specifications

### 4.1 WhatsApp Business Integration

**Official channel only:** WhatsApp Business Cloud API (Meta).

| Capability | Production behavior |
|------------|---------------------|
| Multi-number | Connect multiple phone numbers / WABA assets per organization |
| Centralized inbox | Unified thread view across numbers with agent presence |
| Send / receive | Text and structured messages in real time via webhooks |
| Media | Images, videos, documents, voice notes (store + preview) |
| Interactive | Reply buttons and list messages for guided flows |
| Templates | Approved message templates for outside-session outreach |
| Receipts | Delivery and read status mirrored into thread + CRM activity |
| Sync | Webhook-driven real-time message synchronization |
| Reliability | Signature verification, idempotent event processing, retries |

**Session rules**
- Within the customer service window: free-form AI/agent replies
- Outside the window: approved templates only
- Opt-in / opt-out honored globally across broadcasts and sequences

---

### 4.2 AI-Powered WhatsApp Chatbot

An always-on sales/support assistant that owns the conversation end-to-end.

| Capability | Production behavior |
|------------|---------------------|
| Automated replies | Instant responses with typing/ack patterns where supported |
| NLU | Understands natural language, typos, Hinglish/English mixes |
| Knowledge base | Business profile, catalog bands, policies, custom instructions |
| Document knowledge | PDF/DOC ingestion with retrieval for grounded answers |
| FAQ automation | Instant answers from curated FAQ set |
| Multilingual | Detects and replies in customer language (configurable set) |
| Intent detection | Browse, price, objection, visit, deposit, handoff, spam, etc. |
| Context memory | Multi-turn memory tied to lead profile and chat history |
| Lead qualification | Collects occasion, style, budget, timeline conversationally |
| Recommendations | Suggests relevant categories/pieces from business catalog |
| Human handover | Only severe cases (abuse, fraud, legal, hard manager demand) |
| Personality | Per-tenant tone, persona, and conversion goal configuration |

**Conversation principles (production defaults)**
- Sound like a skilled receptionist/consultant, not a payment bot
- One clear question at a time
- No early hard-sell of deposits/payments
- Soft close only after rapport + clear interest
- Jailbreak / prompt-injection attempts ignored; persona held

**Default jewellery vertical example**
- Persona: showroom consultant
- Success event: `deposit_booked` / appointment hold
- Knowledge: catalog bands, hallmark/purity FAQs, store locations

---

### 4.3 Lead Management CRM

Central system of record for every enquiry.

| Feature | Description |
|---------|-------------|
| Automatic lead creation | Inbound WhatsApp creates or merges a lead |
| Customer profiles | Name, phone, email, attributes, tags, source |
| Lead assignment | Round-robin, manual, or rule-based to employees |
| Lead scoring | Score from intent, engagement, budget signals, recency |
| Categorization | Hot / Warm / Cold derived from score + stage |
| Pipeline | Visual and API-tracked conversion stages |
| Follow-up reminders | Tasks/reminders for assigned agents |
| Internal notes | Private employee comments on the lead |
| Activity history | Full timeline: messages, stage changes, broadcasts |
| Duplicate detection | Phone-normalized merge; optional email match |
| Search & filters | By stage, owner, score, source, tags, dates |
| Data export | CSV/XLSX export with role-based field access |

#### Lead pipeline

```
New Lead → Contacted → Qualified → Interested → Negotiation → Converted
                                                              ↘ Lost
```

| Stage | Meaning |
|-------|---------|
| New Lead | First touch captured; not yet meaningfully engaged |
| Contacted | Outreach or first meaningful reply exchanged |
| Qualified | Core qualification fields known (e.g. occasion + style) |
| Interested | Strong buying signals / visit or product interest |
| Negotiation | Pricing, slot, deposit, or commercial discussion active |
| Converted | Success event completed (e.g. deposit booked / deal won) |
| Lost | Closed-unwon; eligible for long-cycle re-engagement rules |

---

### 4.4 Automated Follow-up System

Recovers silent or stalled leads without annoying active conversations.

| Capability | Production behavior |
|------------|---------------------|
| Welcome messages | Configurable first-touch templates/openers |
| Scheduled follow-ups | Day/hour based sequence steps |
| Personalized messages | Merge fields from lead profile + last intent |
| Time-based triggers | e.g. no reply in 24h / 72h / 7d |
| Event-based triggers | Stage change, score drop, missed appointment |
| Agent reminders | Internal reminders when human ownership required |
| Re-engagement | Win-back sequences for Cold / Lost cohorts |
| Conditional sequences | Branch by category (Hot/Warm/Cold) and stage |
| Stop on conversion | All sequences halt when lead reaches Converted |
| Stop/adjust on reply | Customer reply pauses or resets the active sequence |

**Guardrails**
- Respect WhatsApp template + session window rules
- Honor opt-out immediately
- Frequency caps per lead
- Quiet hours by timezone

---

### 4.5 Broadcast & Customer Messaging

Compliant messaging to existing customers and opted-in contacts (**not** cold advertising acquisition).

| Capability | Production behavior |
|------------|---------------------|
| Bulk messaging | Campaign fan-out via Cloud API |
| Segmentation | By tags, stage, score, store, last purchase, opt-in status |
| Personalization | Name and attribute merge into approved templates |
| Scheduling | Future send windows with timezone support |
| Use cases | Service announcements, updates, appointment reminders, follow-up notices |
| Templates | Only Meta-approved templates for campaign sends |
| Delivery tracking | Queued → sent → delivered → read → failed |
| Opt-out management | STOP/unsubscribe handling + suppression list |

---

## 5. Cross-Cutting Platform Capabilities

### 5.1 Multi-tenancy & access control
- Organization → users → roles (Owner, Admin, Agent, Viewer)
- Number-level and lead-level permissions
- Audit log for exports, broadcasts, and assignment changes

### 5.2 Real-time inbox
- Live thread updates
- Assignment lock / claiming
- AI draft suggestions for agents (optional)
- Seamless takeover when handoff triggers

### 5.3 Observability
- Message latency and webhook health
- AI token usage and cost per conversation
- Conversion funnel metrics by stage
- Broadcast and follow-up performance dashboards

### 5.4 Security & compliance
- Meta webhook signature verification
- Encrypted secrets (API tokens, WABA credentials)
- PII minimization and retention policies
- Role-based data export
- WhatsApp Commerce/Business Policy alignment (opt-in, templates, no spam)

---

## 6. End-to-End Production Flows

### 6.1 Inbound conversion flow

```
Customer WhatsApp message
        │
        v
Webhook verified + idempotent ingest
        │
        v
Create / merge CRM lead (New Lead)
        │
        v
AI chatbot responds (context + knowledge)
        │
        v
Qualify + score + update pipeline
        │
   ┌────┴────┐
   v         v
Hot/Warm   Cold
   │         │
   v         v
Continue AI / optional agent assign
             Automated follow-up sequence
   │         │
   └────┬────┘
        v
Negotiation → Converted (deposit/appointment) or Lost
```

### 6.2 Outbound nurture flow

```
Segment opted-in customers
        │
        v
Select approved template + schedule
        │
        v
Broadcast dispatch + receipt tracking
        │
        v
Customer replies → open service window
        │
        v
AI / agent continues → CRM activity updated
```

---

## 7. Data Model (Logical)

**Organization** — tenant, branding, AI personality, conversion goal  
**WhatsAppNumber** — Cloud API phone_number_id, display name, status  
**User** — employee identity + role  
**Lead** — profile, stage, score, category, owner, source  
**Conversation** — thread bound to lead + number  
**Message** — inbound/outbound, media refs, template id, receipt state  
**KnowledgeDoc** — uploaded PDFs/docs + indexed chunks  
**FollowUpSequence / Step** — rules, delays, templates  
**Campaign** — broadcast definition, segment, schedule  
**Activity** — immutable timeline events  
**OptOut** — suppression records  

---

## 8. Technology Baseline (Production)

| Layer | Choice |
|-------|--------|
| Channel | Meta WhatsApp Cloud API |
| Backend | Node.js (TypeScript) services |
| AI | Google Gemini (configurable model) |
| Database | PostgreSQL |
| Queue / jobs | Redis + worker processes |
| Files / media | Object storage (S3-compatible) |
| Frontend | Web app — Inbox, CRM, Campaigns, Settings |
| Auth | Session/JWT with RBAC |
| Hosting | Containerized services behind HTTPS |

*Prototype lineage:* current local WhatsApp Web + SQLite prototype validates conversation quality; production channel is Cloud API with the same AI conversion brain.

---

## 9. Success Metrics

| Metric | Definition |
|--------|------------|
| First response time | Median time to first AI/agent reply |
| Qualification rate | % leads reaching Qualified |
| Conversion rate | % leads reaching Converted |
| AI containment | % conversations resolved without human |
| Handoff quality | Severe-only handoffs; low false escalations |
| Follow-up recovery | Conversions attributed to sequences |
| Broadcast CTR / reply rate | Engagement on compliant campaigns |
| Cost per conversation | AI tokens + messaging fees |

---

## 10. Delivery Phases

### Phase A — Production foundation
- Cloud API + webhooks + multi-number
- Central inbox (send/receive, media, receipts)
- AI chatbot with business config + FAQ
- CRM auto-lead, pipeline, duplicate merge

### Phase B — Revenue operations
- Lead scoring + Hot/Warm/Cold
- Assignment + notes + export
- Follow-up sequences with stop rules
- Template library + appointment/deposit success events

### Phase C — Scale messaging
- Segments + broadcasts + scheduling
- Opt-out center + delivery analytics
- Document/PDF knowledge base
- Multilingual packs + richer interactive messages

### Deferred
- Module 5: Visual Workflow Automation Builder  
  *(Business logic covered by AI config, CRM rules, follow-up sequences, and campaigns until demand justifies a builder UI.)*

---

## 11. Acceptance Criteria (v1 Production)

1. Inbound WhatsApp message creates or merges a CRM lead within seconds.  
2. AI replies in-character using tenant knowledge without inventing prices outside catalog bands.  
3. Pipeline stages update from conversation signals through to Converted/Lost.  
4. Deposit/appointment success is recorded and stops follow-up sequences.  
5. Humans are notified only on severe handoff conditions.  
6. Broadcasts send only to opted-in contacts via approved templates.  
7. Delivery/read receipts appear in inbox and activity history.  
8. Multi-number organization can operate from one inbox with correct number attribution.  

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| WABA | WhatsApp Business Account |
| Service window | Meta customer care messaging window after user opt-in/reply |
| Template | Pre-approved message used outside the service window |
| Containment | Conversation fully handled by AI without human agent |
| Converted | Terminal success stage for the tenant’s defined goal |

---

*Aura Connect — Production Product Specification v1.0*  
*Modules in scope: WhatsApp Integration, AI Chatbot, Lead CRM, Follow-ups, Broadcasts*  
*Explicitly deferred: Visual Workflow Automation Builder*
