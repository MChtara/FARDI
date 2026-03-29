# Phase 4 Step 5 - Routing & Scoring Summary

## Overview
Phase 4 Step 5 implements a **CEFR-based AI-scored cumulative system** with 5 remedial levels (A1-C1) determined by total performance across 3 AI-evaluated interactions. ALL users must complete a remedial before proceeding to Phase 4_2.

---

## Step 5: Score Calculation & Routing

### Interactions (AI-Scored)
1. **Interaction 1**: Poster Description (AI-Scored)
   - CEFR Level (1-5): A1=1 (basic), C1=5 (60+ words sophisticated)
   - Max Score: 5 points

2. **Interaction 2**: Video Script (AI-Scored)
   - CEFR Level (1-5): A1=1 (attempt), C1=5 (60+ words autonomous)
   - Max Score: 5 points

3. **Interaction 3**: Vocabulary Integration - Sushi Spell (AI-Scored)
   - CEFR Level (1-5): A1=1 (minimal), C1=5 (15+ words masterful)
   - Max Score: 5 points

**Total Maximum Score**: 15 points (cumulative from all 3 AI-scored interactions)

### Routing Thresholds (Based on Total Score)

| Total Score | Remedial Level |
|------------|----------------|
| < 4        | Remedial A1    |
| < 7        | Remedial A2    |
| < 10       | Remedial B1    |
| < 13       | Remedial B2    |
| ≥ 13       | Remedial C1    |

**Note**: ALL users must complete a remedial (no direct proceed to next step).

### API Endpoint
```
POST /api/phase4/step/5/calculate-score
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
      "max": 5
    },
    "interaction2": {
      "score": 1-5,
      "max": 5
    },
    "interaction3": {
      "score": 1-5,
      "max": 5
    },
    "total": {
      "score": 3-15,
      "max": 15,
      "remedial_level": "Remedial A1/A2/B1/B2/C1"
    }
  }
}
```

---

## Remedial Evaluations

Each remedial has specific tasks and pass thresholds (≥80% methodology). **All remedials implement retry logic and route to Phase 4_2 on pass.**

### Remedial A1
- **Endpoint**: `POST /api/phase4/step5/remedial/a1/final-score`
- **Tasks**:
  - Task A: 8 points (+1 per correct)
  - Task B: 8 points (+1 per correct)
  - Task C: 6 points (+1 per correct)
- **Total Max**: 22 points
- **Pass Threshold**: ≥ 17/22 (~77%, rounded down from 80%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 17) → `/app/phase4_2`
  - ✗ FAIL (score < 17) → `/app/phase4/step/5/remedial/a1/retry`

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
- **Endpoint**: `POST /api/phase4/step5/remedial/a2/final-score`
- **Tasks**:
  - Task A: 8 points (+1 per correct)
  - Task B: 8 points (+1 per correct)
  - Task C: 6 points (+1 per correct)
- **Total Max**: 22 points
- **Pass Threshold**: ≥ 18/22 (~82%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 18) → `/app/phase4_2`
  - ✗ FAIL (score < 18) → `/app/phase4/step/5/remedial/a2/retry`

**Request Body:**
```json
{
  "task_a_score": 0-8,
  "task_b_score": 0-8,
  "task_c_score": 0-6
}
```

---

### Remedial B1
- **Endpoint**: `POST /api/phase4/step5/remedial/b1/final-score`
- **Required Tasks** (27 points max):
  - Task A: 5 points
  - Task B: 8 points
  - Task C: 6 points
  - Task D: 8 points
- **Bonus Tasks** (12 points max):
  - Task E: 6 points (bonus)
  - Task F: 6 points (bonus)
- **Total Max**: 39 points (27 required + 12 bonus)
- **Pass Threshold**: ≥ 22/27 required points (~81%)
- **Retry Logic**:
  - ✓ PASS (required ≥ 22) → `/app/phase4_2`
  - ✗ FAIL (required < 22) → `/app/phase4/step/5/remedial/b1/retry`

**Request Body:**
```json
{
  "task_a_score": 0-5,
  "task_b_score": 0-8,
  "task_c_score": 0-6,
  "task_d_score": 0-8,
  "task_e_score": 0-6,
  "task_f_score": 0-6
}
```

**Note**: Pass/fail is determined by required tasks only (A-D), but bonus tasks (E-F) are included in total score.

---

### Remedial B2
- **Endpoint**: `POST /api/phase4/step5/remedial/b2/final-score`
- **Tasks**:
  - Task A: 10 points
  - Task B: 8 points
  - Task C: 8 points
  - Task D: 6 points
  - Task E: 6 points
  - Task F: 6 points
- **Total Max**: 44 points
- **Pass Threshold**: ≥ 35/44 (~80%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 35) → `/app/phase4_2`
  - ✗ FAIL (score < 35) → `/app/phase4/step/5/remedial/b2/retry`

**Request Body:**
```json
{
  "task_a_score": 0-10,
  "task_b_score": 0-8,
  "task_c_score": 0-8,
  "task_d_score": 0-6,
  "task_e_score": 0-6,
  "task_f_score": 0-6
}
```

---

### Remedial C1
- **Endpoint**: `POST /api/phase4/step5/remedial/c1/final-score`
- **Tasks**:
  - Task A: 10 points
  - Task B: 8 points
  - Task C: 6 points
  - Task D: 6 points
  - Task E: 6 points
  - Task F: 6 points
  - Task G: 6 points
  - Task H: 6 points
- **Total Max**: 54 points
- **Pass Threshold**: ≥ 43/54 (~80%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 43) → `/app/phase4_2`
  - ✗ FAIL (score < 43) → `/app/phase4/step/5/remedial/c1/retry`

**Request Body:**
```json
{
  "task_a_score": 0-10,
  "task_b_score": 0-8,
  "task_c_score": 0-6,
  "task_d_score": 0-6,
  "task_e_score": 0-6,
  "task_f_score": 0-6,
  "task_g_score": 0-6,
  "task_h_score": 0-6
}
```

---

## Remedial Summary Table

| Level | Total Points | Pass Threshold | Pass % | Tasks | Next on Pass |
|-------|--------------|----------------|--------|-------|--------------|
| A1    | 22           | ≥ 17           | ~77%   | 3     | Phase 4_2    |
| A2    | 22           | ≥ 18           | ~82%   | 3     | Phase 4_2    |
| B1    | 39 (27+12)   | ≥ 22 (required)| ~81%   | 4+2   | Phase 4_2    |
| B2    | 44           | ≥ 35           | ~80%   | 6     | Phase 4_2    |
| C1    | 54           | ≥ 43           | ~80%   | 8     | Phase 4_2    |

---

## Score Privacy

**CRITICAL RULE**: All scores are **NEVER shown to users**. Scores are only logged in the terminal with `(INTERNAL USE ONLY)` labels.

### Terminal Output Format

#### Step 5 Scoring
```
================================================================================
PHASE 4 STEP 5 - SCORE CALCULATION & ROUTING (INTERNAL USE ONLY)
================================================================================
User ID: <user_id>

Interaction Scores (AI-Scored CEFR 1-5):
  Interaction 1 (Poster Description):           X/5
  Interaction 2 (Video Script):                 X/5
  Interaction 3 (Vocabulary - Sushi Spell):     X/5
--------------------------------------------------------------------------------
TOTAL SCORE: X/15
--------------------------------------------------------------------------------
ROUTING DECISION: Remedial A1/A2/B1/B2/C1
  (Based on thresholds: <4=A1, <7=A2, <10=B1, <13=B2, ≥13=C1)
================================================================================
```

#### Remedial A1 Example
```
================================================================================
PHASE 4 STEP 5 - REMEDIAL A1 FINAL SCORE (INTERNAL USE ONLY)
================================================================================
User ID: <user_id>

Task Breakdown:
  Task A: 6/8
  Task B: 7/8
  Task C: 5/6
--------------------------------------------------------------------------------
TOTAL SCORE: 18/22
PASS THRESHOLD: 17/22 (~77%)
STATUS: PASSED ✓
--------------------------------------------------------------------------------
ROUTING: /app/phase4_2
================================================================================
```

#### Remedial B1 Example (with Bonus Tasks)
```
================================================================================
PHASE 4 STEP 5 - REMEDIAL B1 FINAL SCORE (INTERNAL USE ONLY)
================================================================================
User ID: <user_id>

Required Tasks:
  Task A: 4/5
  Task B: 7/8
  Task C: 5/6
  Task D: 7/8
  Required Subtotal: 23/27

Bonus Tasks:
  Task E (Bonus): 5/6
  Task F (Bonus): 4/6
  Bonus Subtotal: 9/12
--------------------------------------------------------------------------------
TOTAL SCORE: 32/39 (required: 23/27, bonus: 9/12)
PASS THRESHOLD: 22/27 required (~81%)
STATUS: PASSED ✓ (based on required tasks only)
--------------------------------------------------------------------------------
ROUTING: /app/phase4_2
================================================================================
```

---

## User Flow Diagram

```
User completes Phase 4 Step 5
    ↓
Complete 3 AI-Scored Interactions (each scored 1-5 CEFR)
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
│ score >= threshold? (≥80%)      │
├─────────────────────────────────┤
│ YES → Proceed to Phase 4_2      │
│ NO  → RETRY same remedial       │
└─────────────────────────────────┘
```

---

## Complete Phase 4 Architecture

```
┌─────────────────────────┐
│   PHASE 4 - STEP 1      │
│   (21 points)           │
└────────┬────────────────┘
         │
    Score Routing:
    < 7  → A1
    < 12 → A2
    < 16 → B1
    < 19 → B2
    ≥ 19 → C1
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 4 - STEP 3      │
│   (15 CEFR points)      │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1
    < 7  → A2
    < 10 → B1
    < 13 → B2
    ≥ 13 → C1
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 4 - STEP 4      │
│   (15 CEFR points)      │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1
    < 7  → A2
    < 10 → B1
    < 13 → B2
    ≥ 13 → C1
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 4 - STEP 5      │
│   (15 AI-scored CEFR)   │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1
    < 7  → A2
    < 10 → B1
    < 13 → B2
    ≥ 13 → C1
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 4_2 (Part 2)    │
│   (Same architecture)   │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 5               │
└─────────────────────────┘
```

---

## Example Scenarios

### Scenario 1: High Performance → Remedial C1 → Phase 4_2
- **Step 5 Interactions**:
  - Interaction 1 (Poster): 5/5 (C1)
  - Interaction 2 (Video Script): 5/5 (C1)
  - Interaction 3 (Vocabulary): 4/5 (B2)
  - **Total**: 14/15
  - **Route**: Remedial C1 (14 ≥ 13)

- **Remedial C1 Tasks**:
  - Task A: 9/10, Task B: 7/8, Task C: 5/6, Task D: 5/6
  - Task E: 5/6, Task F: 5/6, Task G: 5/6, Task H: 5/6
  - **Total**: 46/54
  - **Status**: PASSED (46 ≥ 43)
  - **Next**: Phase 4_2

### Scenario 2: Medium Performance → Remedial B1 → Phase 4_2
- **Step 5 Interactions**:
  - Interaction 1: 3/5 (B1)
  - Interaction 2: 3/5 (B1)
  - Interaction 3: 2/5 (A2)
  - **Total**: 8/15
  - **Route**: Remedial B1 (7 ≤ 8 < 10)

- **Remedial B1 Tasks**:
  - Required: Task A: 4/5, Task B: 7/8, Task C: 5/6, Task D: 7/8
  - Required Subtotal: 23/27
  - Bonus: Task E: 5/6, Task F: 4/6
  - Bonus Subtotal: 9/12
  - **Total**: 32/39
  - **Status**: PASSED (23 ≥ 22)
  - **Next**: Phase 4_2

### Scenario 3: Low Performance → Remedial A1 → Retry
- **Step 5 Interactions**:
  - Interaction 1: 1/5 (A1)
  - Interaction 2: 1/5 (A1)
  - Interaction 3: 1/5 (A1)
  - **Total**: 3/15
  - **Route**: Remedial A1 (3 < 4)

- **Remedial A1 Tasks (First Attempt)**:
  - Task A: 5/8, Task B: 6/8, Task C: 4/6
  - **Total**: 15/22
  - **Status**: FAILED (15 < 17)
  - **Next**: Retry Remedial A1

### Scenario 4: Mixed Performance → Remedial A2 → Phase 4_2
- **Step 5 Interactions**:
  - Interaction 1: 2/5 (A2)
  - Interaction 2: 2/5 (A2)
  - Interaction 3: 2/5 (A2)
  - **Total**: 6/15
  - **Route**: Remedial A2 (4 ≤ 6 < 7)

- **Remedial A2 Tasks**:
  - Task A: 7/8, Task B: 7/8, Task C: 5/6
  - **Total**: 19/22
  - **Status**: PASSED (19 ≥ 18)
  - **Next**: Phase 4_2

### Scenario 5: Upper Mid Performance → Remedial B2 → Phase 4_2
- **Step 5 Interactions**:
  - Interaction 1: 4/5 (B2)
  - Interaction 2: 4/5 (B2)
  - Interaction 3: 3/5 (B1)
  - **Total**: 11/15
  - **Route**: Remedial B2 (10 ≤ 11 < 13)

- **Remedial B2 Tasks**:
  - Task A: 9/10, Task B: 7/8, Task C: 7/8
  - Task D: 5/6, Task E: 5/6, Task F: 5/6
  - **Total**: 38/44
  - **Status**: PASSED (38 ≥ 35)
  - **Next**: Phase 4_2

---

## Testing Checklist

### Step 5 Scoring
- [ ] Step 5 scoring calculates total correctly (sum of 3 AI-scored CEFR scores)
- [ ] Routing to A1 when total < 4
- [ ] Routing to A2 when 4 ≤ total < 7
- [ ] Routing to B1 when 7 ≤ total < 10
- [ ] Routing to B2 when 10 ≤ total < 13
- [ ] Routing to C1 when total ≥ 13
- [ ] Interaction 1 evaluates poster description correctly (AI-scored)
- [ ] Interaction 2 evaluates video script correctly (AI-scored)
- [ ] Interaction 3 evaluates vocabulary integration correctly (AI-scored)
- [ ] All 3 scores are stored in sessionStorage
- [ ] Backend endpoint `/step/5/calculate-score` works correctly
- [ ] Remedials route to correct level based on total score

### Remedial A1
- [ ] A1 accepts 3 task scores (8+8+6)
- [ ] A1 passes at 17/22 threshold (~77%)
- [ ] A1 routes to Phase 4_2 on pass
- [ ] A1 routes to retry on fail

### Remedial A2
- [ ] A2 accepts 3 task scores (8+8+6)
- [ ] A2 passes at 18/22 threshold (~82%)
- [ ] A2 routes to Phase 4_2 on pass
- [ ] A2 routes to retry on fail

### Remedial B1
- [ ] B1 accepts 6 task scores (5+8+6+8 required, 6+6 bonus)
- [ ] B1 calculates required and bonus separately
- [ ] B1 passes at 22/27 required threshold (~81%)
- [ ] B1 pass/fail based on required tasks only
- [ ] B1 routes to Phase 4_2 on pass
- [ ] B1 routes to retry on fail

### Remedial B2
- [ ] B2 accepts 6 task scores (10+8+8+6+6+6)
- [ ] B2 passes at 35/44 threshold (~80%)
- [ ] B2 routes to Phase 4_2 on pass
- [ ] B2 routes to retry on fail

### Remedial C1
- [ ] C1 accepts 8 task scores (10+8+6+6+6+6+6+6)
- [ ] C1 passes at 43/54 threshold (~80%)
- [ ] C1 routes to Phase 4_2 on pass
- [ ] C1 routes to retry on fail

### General
- [ ] Scores NOT shown in user-facing responses
- [ ] Terminal logs include "(INTERNAL USE ONLY)" labels
- [ ] Each interaction accepts CEFR scores 1-5
- [ ] All remedials route to Phase 4_2 on pass
- [ ] Frontend displays correct remedial level assignment

---

## Implementation Files

- **Main Route File**: `backend/routes/phase4_routes.py`
  - Lines 6934-7026: `calculate_step5_score()` - Step 5 scoring and routing
  - Lines 7033-7092: `calculate_step5_a1_final_score()` - Remedial A1 evaluation
  - Lines 7099-7158: `calculate_step5_a2_final_score()` - Remedial A2 evaluation
  - Lines 7165-7241: `calculate_step5_b1_final_score()` - Remedial B1 evaluation
  - Lines 7248-7317: `calculate_step5_b2_final_score()` - Remedial B2 evaluation
  - Lines 7324-7399: `calculate_step5_c1_final_score()` - Remedial C1 evaluation

- **Frontend Files**:
  - `frontend/src/pages/Phase4Step5/index.jsx` - Step 5 intro page
  - `frontend/src/pages/Phase4Step5/Interaction1.jsx` - Poster Description (AI-scored)
  - `frontend/src/pages/Phase4Step5/Interaction2.jsx` - Video Script (AI-scored)
  - `frontend/src/pages/Phase4Step5/Interaction3.jsx` - Vocabulary Integration + Routing

---

## Key Differences from Previous Steps

1. **AI-Scored Interactions**: Step 5 uses AI evaluation for all 3 interactions (poster, script, vocabulary)
2. **Qualitative Assessment**: Focuses on writing quality, sophistication, and vocabulary mastery
3. **Word Count Requirements**: Different word count thresholds for different CEFR levels
4. **80% Pass Threshold**: All remedials use ≥80% methodology (A1 is ~77% due to rounding)
5. **Routes to Phase 4_2**: All remedials route to Phase 4 Part 2 (not Step 6)
6. **Final Phase 4 Step**: Step 5 is the last step before Phase 4_2

---

## Integration Points

### From Step 4
- After completing Step 4 Remedial (any level) and passing, users route to `/app/phase4/step/5`

### To Phase 4_2
- After completing Step 5 Remedial (any level) and passing, users route to `/app/phase4_2`
- Phase 4_2 follows the same architectural pattern (Steps 1-5 with remedials)

### To Phase 5
- After completing all Phase 4_2 steps and remedials, users route to `/app/phase5`

---

## Scoring Methodology

### Task Scoring
- **Multiple Choice / Matching**: +1 per correct answer
- **Writing Tasks (AI-Scored)**: CEFR Level 1-5
  - A1 = 1 point (basic attempt)
  - A2 = 2 points (elementary)
  - B1 = 3 points (intermediate)
  - B2 = 4 points (upper-intermediate)
  - C1 = 5 points (advanced/sophisticated)

### Pass Threshold
- **Standard**: ≥80% of total points
- **A1 Exception**: 17/22 = ~77% (rounded down from 17.6)
- **A2**: 18/22 = ~82%
- **B1**: 22/27 = ~81% (based on required tasks only)
- **B2**: 35/44 = ~80%
- **C1**: 43/54 = ~80%

### Bonus Tasks (B1 only)
- Bonus tasks contribute to total score for reporting
- Pass/fail determined by **required tasks only**
- Provides additional challenge for high performers

---

## Next Steps

- Implement Phase 4_2 with same architecture (Steps 1-5)
- Ensure all Step 5 remedials properly route to Phase 4_2
- Create frontend pages for each Step 5 remedial level
- Add AI evaluation endpoints for writing tasks
- Testing all 5 remedial paths with various score combinations
- After Phase 4_2 completion, route to Phase 5
