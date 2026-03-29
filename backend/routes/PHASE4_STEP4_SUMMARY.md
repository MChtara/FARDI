# Phase 4 Step 4 - Routing & Scoring Summary

## Overview
Phase 4 Step 4 implements a **CEFR-based cumulative scoring system** with 5 remedial levels (A1-C1) determined by total performance across 3 interactions. ALL users must complete a remedial before proceeding to Step 5.

---

## Step 4: Score Calculation & Routing

### Interactions
1. **Interaction 1**: CEFR-scored activity
   - CEFR Level (1-5): A1=1, A2=2, B1=3, B2=4, C1=5
   - Max Score: 5 points

2. **Interaction 2**: CEFR-scored activity
   - CEFR Level (1-5): A1=1, A2=2, B1=3, B2=4, C1=5
   - Max Score: 5 points

3. **Interaction 3**: CEFR-scored activity
   - CEFR Level (1-5): A1=1, A2=2, B1=3, B2=4, C1=5
   - Max Score: 5 points

**Total Maximum Score**: 15 points (cumulative from all 3 interactions)

### Routing Thresholds (Based on Total Score)

| Total Score | Remedial Level |
|------------|----------------|
| < 4        | Remedial A1    |
| < 7        | Remedial A2    |
| < 10       | Remedial B1    |
| < 13       | Remedial B2    |
| ≥ 13       | Remedial C1    |

**Note**: ALL users must complete a remedial (no direct proceed to Step 5).

### API Endpoint
```
POST /api/phase4/step/4/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 1-5,
  "interaction2_score": 1-5,
  "interaction3_score": 1-5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interaction1": {
      "score": 1-5,
      "max_score": 5,
      "level": "A1/A2/B1/B2/C1"
    },
    "interaction2": {
      "score": 1-5,
      "max_score": 5,
      "level": "A1/A2/B1/B2/C1"
    },
    "interaction3": {
      "score": 1-5,
      "max_score": 5,
      "level": "A1/A2/B1/B2/C1"
    },
    "total": {
      "score": 3-15,
      "max_score": 15,
      "remedial_level": "Remedial A1/A2/B1/B2/C1",
      "should_proceed": false
    }
  }
}
```

---

## Remedial Evaluations

Each remedial has specific tasks and pass thresholds. **All remedials implement retry logic and route to Step 5 on pass.**

### Remedial A1
- **Endpoint**: `POST /api/phase4/step4/remedial/a1/final-score`
- **Tasks**:
  - Task A: Term Treasure Hunt (max 8 points)
  - Task B: Fill Quest (max 8 points)
  - Task C: Sentence Builder (max 6 points)
- **Total Max**: 22 points
- **Pass Threshold**: ≥ 18/22 (~82%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 18) → `/app/phase4/step/5`
  - ✗ FAIL (score < 18) → `/app/phase4/step/4/remedial/a1/retry`

**Request Body:**
```json
{
  "task_a_score": 0-8,
  "task_b_score": 0-8,
  "task_c_score": 0-6
}
```

---

### Remedial A2
- **Endpoint**: `POST /api/phase4/step4/remedial/a2/final-score`
- **Tasks**:
  - Task A: Dialogue Adventure (max 8 points)
  - Task B: Expand Empire (max 7 points)
  - Task C: Connector Quest (max 6 points)
- **Total Max**: 21 points
- **Pass Threshold**: ≥ 18/21 (~86%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 18) → `/app/phase4/step/5`
  - ✗ FAIL (score < 18) → `/app/phase4/step/4/remedial/a2/retry`

**Request Body:**
```json
{
  "task_a_score": 0-8,
  "task_b_score": 0-7,
  "task_c_score": 0-6
}
```

---

### Remedial B1
- **Endpoint**: `POST /api/phase4/step4/remedial/b1/final-score`
- **Tasks**:
  - Task A: Negotiation Battle (max 4 points)
  - Task B: Definition Duel (max 8 points)
  - Task C: Quiz Game (max 6 points)
  - Task D: Flashcard Game (max 8 points)
  - Task E: Tense Time Travel (max 6 points)
  - Task F: Grammar Kahoot (max 6 points)
- **Total Max**: 38 points
- **Pass Threshold**: ≥ 22/38 (~58%)
- **AI Evaluation Routes**:
  - `POST /api/phase4/step4/remedial/b1/evaluate-definitions`
- **Retry Logic**:
  - ✓ PASS (score ≥ 22) → `/app/phase4/step/5`
  - ✗ FAIL (score < 22) → `/app/phase4/step/4/remedial/b1/retry`

**Request Body:**
```json
{
  "task_a_score": 0-4,
  "task_b_score": 0-8,
  "task_c_score": 0-6,
  "task_d_score": 0-8,
  "task_e_score": 0-6,
  "task_f_score": 0-6
}
```

---

### Remedial B2
- **Endpoint**: `POST /api/phase4/step4/remedial/b2/final-score`
- **Tasks**:
  - Task A: (max 8 points)
  - Task B: (max 8 points)
  - Task C: (max 8 points)
  - Task D: (max 8 points)
- **Total Max**: 32 points
- **Pass Threshold**: ≥ 26/32 (~81%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 26) → `/app/phase4/step/5`
  - ✗ FAIL (score < 26) → `/app/phase4/step/4/remedial/b2/retry`

**Request Body:**
```json
{
  "task_a_score": 0-8,
  "task_b_score": 0-8,
  "task_c_score": 0-8,
  "task_d_score": 0-8
}
```

---

### Remedial C1
- **Endpoint**: `POST /api/phase4/step4/remedial/c1/final-score`
- **Tasks**:
  - Task A: (max 6 points)
  - Task B: (max 8 points)
  - Task C: (max 6 points)
  - Task D: (max 6 points)
- **Total Max**: 26 points
- **Pass Threshold**: ≥ 21/26 (~81%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 21) → `/app/phase4/step/5`
  - ✗ FAIL (score < 21) → `/app/phase4/step/4/remedial/c1/retry`

**Request Body:**
```json
{
  "task_a_score": 0-6,
  "task_b_score": 0-8,
  "task_c_score": 0-6,
  "task_d_score": 0-6
}
```

---

## Score Privacy

**CRITICAL RULE**: All scores are **NEVER shown to users**. Scores are only logged in the terminal with `(INTERNAL USE ONLY)` labels.

### Terminal Output Format

#### Step 4 Scoring
```
======================================================================
🎯 PHASE 4 STEP 4 - SCORE CALCULATION (INTERNAL USE ONLY)
======================================================================
User ID: <user_id>
Interaction 1: X/5 → Level: A1/A2/B1/B2/C1
Interaction 2: X/5 → Level: A1/A2/B1/B2/C1
Interaction 3: X/5 → Level: A1/A2/B1/B2/C1
📊 Total Score: X/15
📍 Remedial Level: Remedial A1/A2/B1/B2/C1
Route: User must complete Remedial X
======================================================================
```

---

## User Flow Diagram

```
User completes Phase 4 Step 4
    ↓
Complete 3 Interactions (each scored 1-5 CEFR)
    ↓
Calculate total_score (I1 + I2 + I3)
    ↓
Determine remedial level based on total_score
    ↓
total < 4   → Remedial A1
total < 7   → Remedial A2
total < 10  → Remedial B1
total < 13  → Remedial B2
total ≥ 13  → Remedial C1
    ↓
User completes remedial tasks
    ↓
Evaluate remedial score
    ↓
┌─────────────────────────────────┐
│ score >= threshold? (PASS)      │
├─────────────────────────────────┤
│ YES → Proceed to Step 5         │
│ NO  → RETRY same remedial       │
└─────────────────────────────────┘
```

---

## Remedial Summary Table

| Remedial | Tasks | Total Max | Pass Threshold | Pass % | Next Route |
|----------|-------|-----------|----------------|--------|------------|
| **A1** | 3 tasks | 22 pts | ≥ 18 | ~82% | Step 5 |
| **A2** | 3 tasks | 21 pts | ≥ 18 | ~86% | Step 5 |
| **B1** | 6 tasks | 38 pts | ≥ 22 | ~58% | Step 5 |
| **B2** | 4 tasks | 32 pts | ≥ 26 | ~81% | Step 5 |
| **C1** | 4 tasks | 26 pts | ≥ 21 | ~81% | Step 5 |

---

## Example Scenarios

### Scenario 1: High Performance → Remedial C1
- Interaction 1: 5/5 (C1)
- Interaction 2: 5/5 (C1)
- Interaction 3: 4/5 (B2)
- **Total**: 14/15
- **Route**: Remedial C1 (14 ≥ 13)
- **Remedial C1**: 22/26 (≥ 21) → **PASS** → Step 5

### Scenario 2: Medium Performance → Remedial B1
- Interaction 1: 3/5 (B1)
- Interaction 2: 3/5 (B1)
- Interaction 3: 2/5 (A2)
- **Total**: 8/15
- **Route**: Remedial B1 (7 ≤ 8 < 10)
- **Remedial B1**: 25/38 (≥ 22) → **PASS** → Step 5

### Scenario 3: Low Performance → Remedial A1
- Interaction 1: 1/5 (A1)
- Interaction 2: 1/5 (A1)
- Interaction 3: 1/5 (A1)
- **Total**: 3/15
- **Route**: Remedial A1 (3 < 4)
- **Remedial A1**: 19/22 (≥ 18) → **PASS** → Step 5

### Scenario 4: B2 FAIL & Retry
- Step 4 Total: 11/15 → Remedial B2
- Remedial B2: 24/32 (< 26) → **FAIL** → `/app/phase4/step/4/remedial/b2/retry`

---

## Testing Checklist

- [ ] Step 4 scoring calculates total correctly (sum of 3 CEFR scores)
- [ ] Routing to A1 when total < 4
- [ ] Routing to A2 when 4 ≤ total < 7
- [ ] Routing to B1 when 7 ≤ total < 10
- [ ] Routing to B2 when 10 ≤ total < 13
- [ ] Routing to C1 when total ≥ 13
- [ ] Remedial A1: PASS (≥18) → Step 5
- [ ] Remedial A1: FAIL (<18) → Retry
- [ ] Remedial A2: PASS (≥18) → Step 5
- [ ] Remedial A2: FAIL (<18) → Retry
- [ ] Remedial B1: PASS (≥22) → Step 5
- [ ] Remedial B1: FAIL (<22) → Retry
- [ ] Remedial B2: PASS (≥26) → Step 5
- [ ] Remedial B2: FAIL (<26) → Retry
- [ ] Remedial C1: PASS (≥21) → Step 5
- [ ] Remedial C1: FAIL (<21) → Retry
- [ ] Scores NOT shown in user-facing responses
- [ ] Terminal logs include "(INTERNAL USE ONLY)" labels

---

## Implementation Files

- **Main Route File**: `backend/routes/phase4_routes.py`
  - Line 3980-4102: `calculate_step4_score()` - Step 4 scoring and routing
  - Line 4150-4212: `calculate_step4_a1_final_score()` - Remedial A1
  - Line 4214-4276: `calculate_step4_a2_final_score()` - Remedial A2
  - Line 4474-4545: `calculate_step4_b1_final_score()` - Remedial B1
  - Line 4547-4612: `calculate_step4_b2_final_score()` - Remedial B2
  - Line 4614-4679: `calculate_step4_c1_final_score()` - Remedial C1

---

## Integration Points

### From Step 3
- After completing Step 3 Remedial (any level) and passing, users route to `/app/phase4/step/4`

### To Step 5
- After completing Step 4 Remedial (any level) and passing, users route to `/app/phase4/step/5`

---

## Key Differences from Step 3

1. **Different Thresholds**: Step 4 has different remedial pass requirements
2. **Task Variations**: A2 has 21 points (not 22), B1 has 38 points (not 39)
3. **Routes to Step 5**: All successful remedials proceed to final step

---

## Next Steps

- Complete Step 5 implementation
- Create frontend pages for Step 4 interactions
- Testing all 5 remedial paths
