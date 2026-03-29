# Phase 4 Step 1 - Routing & Scoring Summary

## Overview
Phase 4 Step 1 implements a **total score-based routing system** with 5 remedial levels (A1-C1) and mandatory retry logic for failed remedials.

---

## Step 1: Score Calculation & Routing

### Interactions
1. **Matching Game**: Each correct match = +1 point (max 8)
2. **Wordshake Game**: Each correct word = +1 point (max 8)
3. **Sentence Production**: CEFR AI evaluation = 1-5 points (A1=1, A2=2, B1=3, B2=4, C1=5)

**Total Maximum Score**: 21 points

### Routing Thresholds (Based on Total Score)

| Total Score | Remedial Level |
|------------|----------------|
| < 7        | Remedial A1    |
| < 12       | Remedial A2    |
| < 16       | Remedial B1    |
| < 19       | Remedial B2    |
| ≥ 19       | Remedial C1    |

**Note**: ALL users must complete a remedial (no direct proceed to Step 2).

### API Endpoint
```
POST /api/phase4/step/1/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 0-8,
  "interaction2_score": 0-8,
  "interaction3_score": 1-5
}
```

**Response:**
```json
{
  "success": true,
  "remedial_level": "Remedial A1/A2/B1/B2/C1",
  "remedial_url": "/app/phase4/step/1/remedial/{level}"
}
```

---

## Remedial Evaluations

Each remedial has specific tasks and pass thresholds. **All remedials implement retry logic.**

### Remedial A1
- **Tasks**:
  - Task A: Drag-Drop Matching (max 8)
  - Task B: Wordle Game (max 8)
- **Total Max**: 16 points
- **Pass Threshold**: ≥ 13/16
- **Retry Logic**:
  - ✓ PASS (score ≥ 13) → `/app/phase4/step/3`
  - ✗ FAIL (score < 13) → `/app/phase4/step/1/remedial/a1/retry`

**Endpoint**: `POST /api/phase4/remedial/a1/final-score`

---

### Remedial A2
- **Tasks**:
  - Task A: Chat Challenge (max 8)
  - Task B: Expand Quest (max 8)
- **Total Max**: 16 points
- **Pass Threshold**: ≥ 13/16
- **Retry Logic**:
  - ✓ PASS (score ≥ 13) → `/app/phase4/step/3`
  - ✗ FAIL (score < 13) → `/app/phase4/step/1/remedial/a2/retry`

**Endpoint**: `POST /api/phase4/remedial/a2/final-score`

---

### Remedial B1
- **Tasks**:
  - Task A: Dialogue (max 5)
  - Task B: Proposals (max 8)
  - Task C: Quiz (max 6)
  - Task D: Matching (max 8)
- **Total Max**: 27 points
- **Pass Threshold**: ≥ 22/27
- **Retry Logic**:
  - ✓ PASS (score ≥ 22) → `/app/phase4/step/3`
  - ✗ FAIL (score < 22) → `/app/phase4/step/1/remedial/b1/retry`

**Endpoint**: `POST /api/phase4/remedial/b1/final-score`

---

### Remedial B2
- **Tasks**:
  - Task A: Role-Play RPG (max 8)
  - Task B: Compare Quest (max 8)
  - Task C: Sushi Spell (max 8)
  - Task D: Kahoot Quiz (max 6)
- **Total Max**: 30 points
- **Pass Threshold**: ≥ 24/30
- **Retry Logic**:
  - ✓ PASS (score ≥ 24) → `/app/phase4/step/3`
  - ✗ FAIL (score < 24) → `/app/phase4/step/1/remedial/b2/retry`

**Endpoint**: `POST /api/phase4/remedial/b2/final-score`

---

### Remedial C1
- **Tasks**:
  - Task A: Debate Duel (max 4)
  - Task B: Critique Challenge (max 8)
  - Task C: Wordshake (max 6)
  - Task D: Live Debate (max 1)
- **Total Max**: 19 points
- **Pass Threshold**: ≥ 16/19
- **Retry Logic**:
  - ✓ PASS (score ≥ 16) → `/app/phase4/step/3`
  - ✗ FAIL (score < 16) → `/app/phase4/step/1/remedial/c1/retry`

**Endpoint**: `POST /api/phase4/remedial/c1/final-score`

---

## Remedial Endpoint Request/Response

### Request Body (All Remedials)
```json
{
  "task_a_score": <number>,
  "task_b_score": <number>,
  "task_c_score": <number>,  // B1, B2, C1 only
  "task_d_score": <number>   // B1, B2, C1 only
}
```

### Response (All Remedials)
```json
{
  "success": true,
  "can_proceed": true/false,
  "next_url": "/app/phase4/step/3" or "/app/phase4/step/1/remedial/{level}/retry",
  "message": "Evaluation complete" or "Additional practice needed"
}
```

---

## Score Privacy

**CRITICAL RULE**: All scores are **NEVER shown to users**. Scores are only logged in the terminal with `(INTERNAL USE ONLY)` labels.

### Terminal Output Format

#### Step 1 Scoring
```
======================================================================
🎯 PHASE 4 STEP 1 - SCORE CALCULATION (INTERNAL USE ONLY)
======================================================================
User ID: <user_id>
Interaction 1 (Matching): X/8 → Level: A1/A2/B1/B2/C1
Interaction 2 (Wordshake): X/8 → Level: A1/A2/B1/B2/C1
Interaction 3 (Sentence): X/5 → Level: A1/A2/B1/B2/C1
📊 Total Score: X/21
📍 Remedial Level: Remedial A1/A2/B1/B2/C1
Route: User must complete Remedial X
======================================================================
```

#### Remedial Evaluation
```
======================================================================
🔸 PHASE 4 STEP 1 REMEDIAL A1 - EVALUATION (INTERNAL USE ONLY)
======================================================================
User ID: <user_id>
Task A (Drag-Drop Matching): X/8
Task B (Wordle Game): X/8
📊 Remedial Score: X/16
Threshold: 13
CAN PROCEED: ✓ YES - Moving to Step 2 / ✗ NO - Remedial required
Next URL: /app/phase4/step/2 or /app/phase4/step/1/remedial/a1/retry
======================================================================
```

---

## User Flow Diagram

```
User completes Phase 4 Step 1
    ↓
Calculate total_score (Matching + Wordshake + Sentence)
    ↓
Determine remedial level based on total_score
    ↓
total < 7   → Remedial A1
total < 12  → Remedial A2
total < 16  → Remedial B1
total < 19  → Remedial B2
total ≥ 19  → Remedial C1
    ↓
User completes remedial tasks
    ↓
Evaluate remedial score
    ↓
┌─────────────────────────────────┐
│ score >= threshold? (PASS)      │
├─────────────────────────────────┤
│ YES → Proceed to Step 3         │
│ NO  → RETRY same remedial       │
└─────────────────────────────────┘
```

---

## Example Scenarios

### Scenario 1: High Performance → Remedial C1
- Matching: 8/8
- Wordshake: 8/8
- Sentence: 5/5 (C1)
- **Total**: 21/21
- **Route**: Remedial C1 (21 ≥ 19)

### Scenario 2: Medium Performance → Remedial B1
- Matching: 5/8
- Wordshake: 6/8
- Sentence: 3/5 (B1)
- **Total**: 14/21
- **Route**: Remedial B1 (12 ≤ 14 < 16)

### Scenario 3: Low Performance → Remedial A1
- Matching: 2/8
- Wordshake: 2/8
- Sentence: 1/5 (A1)
- **Total**: 5/21
- **Route**: Remedial A1 (5 < 7)

### Scenario 4: Remedial A1 FAIL → Retry
- Remedial A1 score: 11/16
- Threshold: 13
- **Result**: FAIL (11 < 13)
- **Next URL**: `/app/phase4/step/1/remedial/a1/retry`

### Scenario 5: Remedial B1 PASS → Step 3
- Remedial B1 score: 24/27
- Threshold: 22
- **Result**: PASS (24 ≥ 22)
- **Next URL**: `/app/phase4/step/3`

---

## Testing Checklist

- [ ] Step 1 scoring calculates total correctly
- [ ] Routing to A1 when total < 7
- [ ] Routing to A2 when 7 ≤ total < 12
- [ ] Routing to B1 when 12 ≤ total < 16
- [ ] Routing to B2 when 16 ≤ total < 19
- [ ] Routing to C1 when total ≥ 19
- [ ] Remedial A1: PASS (≥13) → Step 3
- [ ] Remedial A1: FAIL (<13) → Retry
- [ ] Remedial A2: PASS (≥13) → Step 3
- [ ] Remedial A2: FAIL (<13) → Retry
- [ ] Remedial B1: PASS (≥22) → Step 3
- [ ] Remedial B1: FAIL (<22) → Retry
- [ ] Remedial B2: PASS (≥24) → Step 3
- [ ] Remedial B2: FAIL (<24) → Retry
- [ ] Remedial C1: PASS (≥16) → Step 3
- [ ] Remedial C1: FAIL (<16) → Retry
- [ ] Scores NOT shown in user-facing responses
- [ ] Terminal logs include "(INTERNAL USE ONLY)" labels

---

## Implementation Files

- **Main Route File**: `backend/routes/phase4_routes.py`
  - Line 106-238: `calculate_step1_score()` - Step 1 scoring and routing
  - Line 240-295: `calculate_a1_final_score()` - Remedial A1 evaluation
  - Line 297-352: `calculate_a2_final_score()` - Remedial A2 evaluation
  - Line 354-413: `calculate_b1_final_score()` - Remedial B1 evaluation
  - Line 415-474: `calculate_b2_final_score()` - Remedial B2 evaluation
  - Line 476-535: `calculate_c1_final_score()` - Remedial C1 evaluation

---

## Key Differences from Phase 3

1. **No unified `/remedial/evaluate` endpoint** - Phase 4 uses specific endpoints per remedial level (`/remedial/{level}/final-score`)
2. **Different remedial structures** - Each remedial has unique task combinations (A1/A2 have 2 tasks, B1/B2/C1 have 4 tasks)
3. **Different thresholds** - Each remedial level has custom pass thresholds based on content difficulty

---

## Next Steps

- Phase 4 Step 2 implementation (awaiting specifications)
- Frontend integration for retry mechanism
- Testing all 5 remedial paths with various score combinations
