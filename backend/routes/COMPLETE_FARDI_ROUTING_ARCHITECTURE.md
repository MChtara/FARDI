# COMPLETE FARDI ROUTING ARCHITECTURE

## Overview
This document provides the **complete routing architecture** for the entire FARDI language learning platform, showing how users progress from one phase to another, through all steps and remedials.

---

## Complete Phase Progression Flow

```
START
  ↓
[PHASE 4]
  ↓
[PHASE 4_2]
  ↓
[PHASE 5]
  ↓
[PHASE 5_2]
  ↓
[PHASE 6]
  ↓
[PHASE 6_2]
  ↓
COMPLETION
```

---

## PHASE 4 - Detailed Routing

### Phase 4 Step 1
**Entry Point**: `/app/phase4/step/1`

**Interactions**: Multiple interactions totaling 21 points max

**Score Calculation Endpoint**: `POST /api/phase4/step/1/calculate-score`

**Routing Logic**:
```
if total_score < 7:  → Remedial A1
if total_score < 12: → Remedial A2
if total_score < 16: → Remedial B1
if total_score < 19: → Remedial B2
if total_score >= 19: → Remedial C1
```

**Remedial Routes**:
- Remedial A1: `/app/phase4/step/1/remedial/a1/...`
  - Tasks: 22 points total (8+8+6)
  - Pass: ≥18 → `/app/phase4/step/3`
  - Fail: → `/app/phase4/step/1/remedial/a1/retry`

- Remedial A2: `/app/phase4/step/1/remedial/a2/...`
  - Tasks: 22 points total (8+8+6)
  - Pass: ≥18 → `/app/phase4/step/3`
  - Fail: → `/app/phase4/step/1/remedial/a2/retry`

- Remedial B1: `/app/phase4/step/1/remedial/b1/...`
  - Tasks: 39 points total (27 required + 12 bonus)
  - Pass: ≥22 required → `/app/phase4/step/3`
  - Fail: → `/app/phase4/step/1/remedial/b1/retry`

- Remedial B2: `/app/phase4/step/1/remedial/b2/...`
  - Tasks: 44 points total
  - Pass: ≥35 → `/app/phase4/step/3`
  - Fail: → `/app/phase4/step/1/remedial/b2/retry`

- Remedial C1: `/app/phase4/step/1/remedial/c1/...`
  - Tasks: 54 points total (8 tasks)
  - Pass: ≥43 → `/app/phase4/step/3`
  - Fail: → `/app/phase4/step/1/remedial/c1/retry`

---

### Phase 4 Step 3
**Entry Point**: `/app/phase4/step/3` (from Step 1 remedials)

**Interactions**: 3 CEFR interactions (1-5 points each), max 15 total

**Score Calculation Endpoint**: `POST /api/phase4/step/3/calculate-score`

**Routing Logic**:
```
if total_score < 4:  → Remedial A1
if total_score < 7:  → Remedial A2
if total_score < 10: → Remedial B1
if total_score < 13: → Remedial B2
if total_score >= 13: → Remedial C1
```

**Remedial Routes**:
- Remedial A1: Pass ≥18/22 → `/app/phase4/step/4`
- Remedial A2: Pass ≥18/22 → `/app/phase4/step/4`
- Remedial B1: Pass ≥22/39 → `/app/phase4/step/4`
- Remedial B2: Pass ≥35/44 → `/app/phase4/step/4`
- Remedial C1: Pass ≥43/54 → `/app/phase4/step/4`

---

### Phase 4 Step 4
**Entry Point**: `/app/phase4/step/4` (from Step 3 remedials)

**Interactions**: 3 CEFR interactions (1-5 points each), max 15 total

**Score Calculation Endpoint**: `POST /api/phase4/step/4/calculate-score`

**Routing Logic**: Same as Step 3 (<4, <7, <10, <13, ≥13)

**Remedial Routes**:
- Remedial A1: Pass ≥18/22 → `/app/phase4/step/5`
- Remedial A2: Pass ≥18/21 → `/app/phase4/step/5`
- Remedial B1: Pass ≥22/38 → `/app/phase4/step/5`
- Remedial B2: Pass ≥26/32 → `/app/phase4/step/5`
- Remedial C1: Pass ≥21/26 → `/app/phase4/step/5`

---

### Phase 4 Step 5
**Entry Point**: `/app/phase4/step/5` (from Step 4 remedials)

**Interactions**: 3 AI-scored CEFR interactions (1-5 points each), max 15 total

**Score Calculation Endpoint**: `POST /api/phase4/step/5/calculate-score`

**Routing Logic**: Same as Steps 3 & 4 (<4, <7, <10, <13, ≥13)

**Remedial Routes** → **ALL ROUTE TO PHASE 4_2**:
- Remedial A1: Pass ≥17/22 → `/app/phase4_2`
- Remedial A2: Pass ≥18/22 → `/app/phase4_2`
- Remedial B1: Pass ≥22/39 → `/app/phase4_2`
- Remedial B2: Pass ≥35/44 → `/app/phase4_2`
- Remedial C1: Pass ≥43/54 → `/app/phase4_2`

---

## PHASE 4_2 - Detailed Routing

### Phase 4_2 Step 1
**Entry Point**: `/app/phase4_2/step/1` (from Phase 4 Step 5 remedials)

**Architecture**: Same as Phase 4 Step 1
- 21 points max
- Routing: <7, <12, <16, <19, ≥19
- Remedials: A1(22), A2(22), B1(39), B2(44), C1(54)
- **All remedials route to**: `/app/phase4_2/step/3`

---

### Phase 4_2 Step 3
**Entry Point**: `/app/phase4_2/step/3`

**Architecture**: Same as Phase 4 Step 3
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase4_2/step/4`

---

### Phase 4_2 Step 4
**Entry Point**: `/app/phase4_2/step/4`

**Architecture**: Same as Phase 4 Step 4
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase4_2/step/5`

---

### Phase 4_2 Step 5
**Entry Point**: `/app/phase4_2/step/5`

**Architecture**: Same as Phase 4 Step 5
- 15 AI-scored CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase5` ← **PHASE TRANSITION**

---

## PHASE 5 - Detailed Routing

### Phase 5 Step 1
**Entry Point**: `/app/phase5/step/1` (from Phase 4_2 Step 5 remedials)

**Interactions**: Multiple interactions totaling 21 points max

**Score Calculation Endpoint**: `POST /api/phase5/step/1/calculate-score`

**Routing Logic**: <7, <12, <16, <19, ≥19 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase5/step/3`

---

### Phase 5 Step 3
**Entry Point**: `/app/phase5/step/3`

**Interactions**: 3 CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase5/step/3/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase5/step/4`

---

### Phase 5 Step 4
**Entry Point**: `/app/phase5/step/4`

**Interactions**: 3 CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase5/step/4/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase5/step/5`

---

### Phase 5 Step 5
**Entry Point**: `/app/phase5/step/5`

**Interactions**: 3 AI-scored CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase5/step/5/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes** → **ALL ROUTE TO PHASE 5_2**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase5_2` ← **PHASE TRANSITION**

---

## PHASE 5_2 - Detailed Routing

### Phase 5_2 Step 1
**Entry Point**: `/app/phase5_2/step/1` (from Phase 5 Step 5 remedials)

**Architecture**: Same as Phase 5 Step 1
- 21 points max
- Routing: <7, <12, <16, <19, ≥19
- **All remedials route to**: `/app/phase5_2/step/3`

---

### Phase 5_2 Step 3
**Entry Point**: `/app/phase5_2/step/3`

**Architecture**: Same as Phase 5 Step 3
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase5_2/step/4`

---

### Phase 5_2 Step 4
**Entry Point**: `/app/phase5_2/step/4`

**Architecture**: Same as Phase 5 Step 4
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase5_2/step/5`

---

### Phase 5_2 Step 5
**Entry Point**: `/app/phase5_2/step/5`

**Architecture**: Same as Phase 5 Step 5
- 15 AI-scored CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase6` ← **PHASE TRANSITION**

---

## PHASE 6 - Detailed Routing

### Phase 6 Step 1
**Entry Point**: `/app/phase6/step/1` (from Phase 5_2 Step 5 remedials)

**Interactions**: Multiple interactions totaling 21 points max

**Score Calculation Endpoint**: `POST /api/phase6/step/1/calculate-score`

**Routing Logic**: <7, <12, <16, <19, ≥19 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase6/step/3`

---

### Phase 6 Step 3
**Entry Point**: `/app/phase6/step/3`

**Interactions**: 3 CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase6/step/3/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase6/step/4`

---

### Phase 6 Step 4
**Entry Point**: `/app/phase6/step/4`

**Interactions**: 3 CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase6/step/4/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase6/step/5`

---

### Phase 6 Step 5
**Entry Point**: `/app/phase6/step/5`

**Interactions**: 3 AI-scored CEFR interactions, max 15 total

**Score Calculation Endpoint**: `POST /api/phase6/step/5/calculate-score`

**Routing Logic**: <4, <7, <10, <13, ≥13 → A1/A2/B1/B2/C1

**Remedial Routes** → **ALL ROUTE TO PHASE 6_2**:
- All 5 remedials (A1, A2, B1, B2, C1)
- **All remedials route to**: `/app/phase6_2` ← **PHASE TRANSITION**

---

## PHASE 6_2 - Detailed Routing

### Phase 6_2 Step 1
**Entry Point**: `/app/phase6_2/step/1` (from Phase 6 Step 5 remedials)

**Architecture**: Same as Phase 6 Step 1
- 21 points max
- Routing: <7, <12, <16, <19, ≥19
- **All remedials route to**: `/app/phase6_2/step/3`

---

### Phase 6_2 Step 3
**Entry Point**: `/app/phase6_2/step/3`

**Architecture**: Same as Phase 6 Step 3
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase6_2/step/4`

---

### Phase 6_2 Step 4
**Entry Point**: `/app/phase6_2/step/4`

**Architecture**: Same as Phase 6 Step 4
- 15 CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/phase6_2/step/5`

---

### Phase 6_2 Step 5
**Entry Point**: `/app/phase6_2/step/5`

**Architecture**: Same as Phase 6 Step 5
- 15 AI-scored CEFR points max
- Routing: <4, <7, <10, <13, ≥13
- **All remedials route to**: `/app/completion` ← **PROGRAM COMPLETE!**

---

## Complete Routing Table

| Phase | Step | Entry URL | Score Endpoint | Routing Thresholds | Remedial Pass Routes |
|-------|------|-----------|----------------|-------------------|---------------------|
| **Phase 4** | 1 | `/app/phase4/step/1` | `POST /api/phase4/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase4/step/3` |
| **Phase 4** | 3 | `/app/phase4/step/3` | `POST /api/phase4/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase4/step/4` |
| **Phase 4** | 4 | `/app/phase4/step/4` | `POST /api/phase4/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase4/step/5` |
| **Phase 4** | 5 | `/app/phase4/step/5` | `POST /api/phase4/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase4_2` ⭐ |
| **Phase 4_2** | 1 | `/app/phase4_2/step/1` | `POST /api/phase4/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase4_2/step/3` |
| **Phase 4_2** | 3 | `/app/phase4_2/step/3` | `POST /api/phase4/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase4_2/step/4` |
| **Phase 4_2** | 4 | `/app/phase4_2/step/4` | `POST /api/phase4/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase4_2/step/5` |
| **Phase 4_2** | 5 | `/app/phase4_2/step/5` | `POST /api/phase4/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5` ⭐ |
| **Phase 5** | 1 | `/app/phase5/step/1` | `POST /api/phase5/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase5/step/3` |
| **Phase 5** | 3 | `/app/phase5/step/3` | `POST /api/phase5/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5/step/4` |
| **Phase 5** | 4 | `/app/phase5/step/4` | `POST /api/phase5/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5/step/5` |
| **Phase 5** | 5 | `/app/phase5/step/5` | `POST /api/phase5/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5_2` ⭐ |
| **Phase 5_2** | 1 | `/app/phase5_2/step/1` | `POST /api/phase5/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase5_2/step/3` |
| **Phase 5_2** | 3 | `/app/phase5_2/step/3` | `POST /api/phase5/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5_2/step/4` |
| **Phase 5_2** | 4 | `/app/phase5_2/step/4` | `POST /api/phase5/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase5_2/step/5` |
| **Phase 5_2** | 5 | `/app/phase5_2/step/5` | `POST /api/phase5/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6` ⭐ |
| **Phase 6** | 1 | `/app/phase6/step/1` | `POST /api/phase6/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase6/step/3` |
| **Phase 6** | 3 | `/app/phase6/step/3` | `POST /api/phase6/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6/step/4` |
| **Phase 6** | 4 | `/app/phase6/step/4` | `POST /api/phase6/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6/step/5` |
| **Phase 6** | 5 | `/app/phase6/step/5` | `POST /api/phase6/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6_2` ⭐ |
| **Phase 6_2** | 1 | `/app/phase6_2/step/1` | `POST /api/phase6/step/1/calculate-score` | <7, <12, <16, <19, ≥19 | → `/app/phase6_2/step/3` |
| **Phase 6_2** | 3 | `/app/phase6_2/step/3` | `POST /api/phase6/step/3/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6_2/step/4` |
| **Phase 6_2** | 4 | `/app/phase6_2/step/4` | `POST /api/phase6/step/4/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/phase6_2/step/5` |
| **Phase 6_2** | 5 | `/app/phase6_2/step/5` | `POST /api/phase6/step/5/calculate-score` | <4, <7, <10, <13, ≥13 | → `/app/completion` 🎉 |

⭐ = Phase transition point

---

## Visual Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         PHASE 4                                │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → PHASE 4_2 ⭐     │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                        PHASE 4_2                               │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → PHASE 5 ⭐       │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                         PHASE 5                                │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → PHASE 5_2 ⭐     │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                        PHASE 5_2                               │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → PHASE 6 ⭐       │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                         PHASE 6                                │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → PHASE 6_2 ⭐     │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                        PHASE 6_2                               │
├────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1/A2/B1/B2/C1) → Step 3           │
│ Step 3 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 4           │
│ Step 4 (15pts) → Remedial (A1/A2/B1/B2/C1) → Step 5           │
│ Step 5 (15pts) → Remedial (A1/A2/B1/B2/C1) → COMPLETION 🎉    │
└────────────────────────────────────────────────────────────────┘
```

---

## Phase Transition Points Summary

| From Phase | From Step | To Phase | Entry Point |
|------------|-----------|----------|-------------|
| Phase 4 | Step 5 Remedial (Pass) | Phase 4_2 | `/app/phase4_2` |
| Phase 4_2 | Step 5 Remedial (Pass) | Phase 5 | `/app/phase5` |
| Phase 5 | Step 5 Remedial (Pass) | Phase 5_2 | `/app/phase5_2` |
| Phase 5_2 | Step 5 Remedial (Pass) | Phase 6 | `/app/phase6` |
| Phase 6 | Step 5 Remedial (Pass) | Phase 6_2 | `/app/phase6_2` |
| Phase 6_2 | Step 5 Remedial (Pass) | COMPLETION | `/app/completion` |

---

## Remedial Routing Pattern

Each step has the same remedial pattern:

```
User completes interactions
    ↓
Backend calculates total score
    ↓
Backend determines remedial level (A1/A2/B1/B2/C1)
    ↓
Frontend routes to remedial tasks
    ↓
User completes remedial tasks
    ↓
Backend evaluates remedial score
    ↓
┌─────────────────────────────────────┐
│ Pass (≥ threshold)?                 │
├─────────────────────────────────────┤
│ YES → Route to next_url (next step) │
│ NO  → Route to retry_url (retry)    │
└─────────────────────────────────────┘
```

### Remedial Pass URLs by Step Type:

**Step 1 Remedials**:
- Pass → Next Step 3 of same phase

**Step 3 Remedials**:
- Pass → Next Step 4 of same phase

**Step 4 Remedials**:
- Pass → Next Step 5 of same phase

**Step 5 Remedials**:
- Pass → Next Phase (or completion for Phase 6_2)

---

## Complete API Endpoints

### Phase 4 Endpoints
```
POST /api/phase4/step/1/calculate-score
POST /api/phase4/step1/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase4/step/3/calculate-score
POST /api/phase4/step3/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase4/step/4/calculate-score
POST /api/phase4/step4/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase4/step/5/calculate-score
POST /api/phase4/step5/remedial/{a1|a2|b1|b2|c1}/final-score
```

### Phase 5 Endpoints
```
POST /api/phase5/step/1/calculate-score
POST /api/phase5/step1/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase5/step/3/calculate-score
POST /api/phase5/step3/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase5/step/4/calculate-score
POST /api/phase5/step4/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase5/step/5/calculate-score
POST /api/phase5/step5/remedial/{a1|a2|b1|b2|c1}/final-score
```

### Phase 6 Endpoints
```
POST /api/phase6/step/1/calculate-score
POST /api/phase6/step1/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase6/step/3/calculate-score
POST /api/phase6/step3/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase6/step/4/calculate-score
POST /api/phase6/step4/remedial/{a1|a2|b1|b2|c1}/final-score

POST /api/phase6/step/5/calculate-score
POST /api/phase6/step5/remedial/{a1|a2|b1|b2|c1}/final-score
```

**Total Endpoints**: 72 (24 score calculations + 120 remedial evaluations - shared across Part 1 and Part 2 of each phase)

---

## Complete Statistics

### Total Journey:
- **Total Phases**: 6 (Phase 4, 4_2, 5, 5_2, 6, 6_2)
- **Total Steps per Phase**: 4 (Step 1, 3, 4, 5)
- **Total Steps Overall**: 24 (6 phases × 4 steps)
- **Total Remedial Levels per Step**: 5 (A1, A2, B1, B2, C1)
- **Total Possible Remedials**: 120 (24 steps × 5 levels)
- **Total Phase Transitions**: 5 (4→4_2, 4_2→5, 5→5_2, 5_2→6, 6→6_2)
- **Total Score Calculation Endpoints**: 24
- **Total Remedial Evaluation Endpoints**: 120

### Scoring Summary:
- **Step 1**: 21 points max, routes at <7, <12, <16, <19, ≥19
- **Step 3**: 15 points max (CEFR), routes at <4, <7, <10, <13, ≥13
- **Step 4**: 15 points max (CEFR), routes at <4, <7, <10, <13, ≥13
- **Step 5**: 15 points max (AI-CEFR), routes at <4, <7, <10, <13, ≥13

### Remedial Points Summary:
- **A1**: 22 points (8+8+6), pass ≥18 (~82%) except Step 5 (≥17, ~77%)
- **A2**: 22 points (8+8+6), pass ≥18 (~82%) except Step 4 (21pts, ≥18, ~86%)
- **B1**: 39 points (27 required + 12 bonus), pass ≥22 required (~81%) except Step 4 (38pts)
- **B2**: 44 points, pass ≥35 (~80%) except Step 4 (32pts, ≥26, ~81%)
- **C1**: 54 points (8 tasks), pass ≥43 (~80%) except Step 4 (26pts, ≥21, ~81%)

---

## User Journey Example

### Example: Student "Alex" completes entire FARDI

**Phase 4 - Step 1**:
- Scores 18/21 → Routes to Remedial B2
- Completes B2: 38/44 → Pass → Routes to Phase 4 Step 3

**Phase 4 - Step 3**:
- Scores 11/15 → Routes to Remedial B2
- Completes B2: 37/44 → Pass → Routes to Phase 4 Step 4

**Phase 4 - Step 4**:
- Scores 10/15 → Routes to Remedial B1
- Completes B1: 24/38 required → Pass → Routes to Phase 4 Step 5

**Phase 4 - Step 5**:
- Scores 12/15 → Routes to Remedial B2
- Completes B2: 36/44 → Pass → **Routes to Phase 4_2** ⭐

**Phase 4_2 - Steps 1, 3, 4, 5**:
- Completes all steps with similar B1/B2 performance
- After Step 5 Remedial B2 Pass → **Routes to Phase 5** ⭐

**Phase 5 - Steps 1, 3, 4, 5**:
- Completes all steps with improving B2/C1 performance
- After Step 5 Remedial C1 Pass → **Routes to Phase 5_2** ⭐

**Phase 5_2 - Steps 1, 3, 4, 5**:
- Maintains C1 level performance
- After Step 5 Remedial C1 Pass → **Routes to Phase 6** ⭐

**Phase 6 - Steps 1, 3, 4, 5**:
- Excellent C1 performance throughout
- After Step 5 Remedial C1 Pass → **Routes to Phase 6_2** ⭐

**Phase 6_2 - Steps 1, 3, 4, 5**:
- Final excellent C1 performance
- After Step 5 Remedial C1 Pass → **COMPLETION!** 🎉

**Alex's Journey**:
- Started at B2 level in Phase 4
- Gradually improved to consistent C1 by Phase 6
- Completed 24 main steps + 24 remedials = 48 total learning activities
- Achieved full CEFR language proficiency from A1 exposure to C1 mastery

---

## Key Routing Rules

1. **Mandatory Remedials**: ALL users MUST complete a remedial after each step (no skip)
2. **Score Privacy**: All scores are internal only, never shown to users
3. **80% Pass Rate**: All remedials use ~80% pass threshold
4. **Retry on Fail**: Failed remedials route to retry URL (same remedial, same level)
5. **Progressive Steps**: Must complete Step 1→3→4→5 in order (Step 2 skipped)
6. **Phase Transitions**: Only Step 5 remedials transition to next phase
7. **B1 Bonus Tasks**: Bonus tasks contribute to total but don't affect pass/fail
8. **CEFR Consistency**: Same CEFR scoring (1-5) across all Steps 3, 4, 5
9. **No Backtracking**: Cannot go back to previous steps/phases
10. **Linear Progression**: Must complete phases in order: 4→4_2→5→5_2→6→6_2

---

## Frontend Integration Points

For each step, the frontend should:

1. **Display interactions** (content varies by phase/step)
2. **Collect user responses** (text, multiple choice, etc.)
3. **Submit to score calculation endpoint** when all interactions complete
4. **Receive remedial level** from backend response
5. **Route to appropriate remedial** based on backend response
6. **Display remedial tasks** for user's level
7. **Submit remedial responses** to remedial evaluation endpoint
8. **Receive pass/fail status** and next_url from backend
9. **Route to next_url** (next step or retry)

---

## Backend Responsibilities

For each step, the backend should:

1. **Accept interaction scores** from frontend
2. **Calculate total score** (sum or weighted average)
3. **Determine remedial level** based on thresholds
4. **Log scores to terminal** with "(INTERNAL USE ONLY)" label
5. **Return remedial level** to frontend
6. **Accept remedial task responses** from frontend
7. **Calculate remedial total score**
8. **Determine pass/fail** based on threshold
9. **Determine next_url** (next step or retry)
10. **Log remedial results** to terminal
11. **Return pass/fail and next_url** to frontend

---

## Summary

The FARDI platform uses a **consistent, repeatable architecture** across all 6 phase parts:
- Each phase part has 4 steps (1, 3, 4, 5)
- Each step has 5 remedial levels (A1, A2, B1, B2, C1)
- All remedials use ~80% pass threshold
- Step 5 remedials transition to next phase
- Complete journey: 24 steps, up to 120 remedials, 6 phase transitions
- Final destination: COMPLETION after Phase 6_2 Step 5

This architecture ensures:
- **Consistency**: Same pattern across all phases
- **Scalability**: Easy to add new phases/steps
- **Flexibility**: Each phase can have unique content while maintaining structure
- **Progression**: Clear path from beginner (A1) to advanced (C1)
- **Assessment**: Multiple checkpoints ensure mastery before progression
