# Phase 4 Step 3 - Routing & Scoring Summary

## Overview
Phase 4 Step 3 implements a **CEFR-based cumulative scoring system** with 5 remedial levels (A1-C1) determined by total performance across 3 interactions. ALL users must complete a remedial before proceeding.

---

## Step 3: Score Calculation & Routing

### Interactions
1. **Interaction 1**: Define "Persuasive" (Video: Advertising Characteristics 4:30)
   - CEFR Level (1-5): A1=1, A2=2, B1=3, B2=4, C1=5
   - Max Score: 5 points

2. **Interaction 2**: Explain "Dramatisation" (Videos: Film Drama + Ad Success)
   - CEFR Level (1-5): A1=1, A2=2, B1=3, B2=4, C1=5
   - Max Score: 5 points

3. **Interaction 3**: Game Connection - Sushi Spell
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

**Note**: ALL users must complete a remedial (no direct proceed to next step).

### API Endpoint
```
POST /api/phase4/step/3/calculate-score
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

Each remedial has specific tasks and pass thresholds. **All remedials implement retry logic and route to Step 4 on pass.**

### Remedial A1
- **Endpoint**: `POST /api/phase4/step3/remedial/a1/final-score`
- **Tasks**:
  - Task A: Term Treasure Hunt (max 8 points)
  - Task B: Fill Quest (max 8 points)
  - Task C: Sentence Builder (max 6 points)
- **Total Max**: 22 points
- **Pass Threshold**: ≥ 18/22 (~82%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 18) → `/app/phase4/step/4`
  - ✗ FAIL (score < 18) → `/app/phase4/step/3/remedial/a1/retry`

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
- **Endpoint**: `POST /api/phase4/step3/remedial/a2/final-score`
- **Tasks**:
  - Task A: Dialogue Adventure (max 8 points)
  - Task B: Expand Empire (max 8 points)
  - Task C: Connector Quest (max 6 points)
- **Total Max**: 22 points
- **Pass Threshold**: ≥ 18/22 (~82%)
- **Retry Logic**:
  - ✓ PASS (score ≥ 18) → `/app/phase4/step/4`
  - ✗ FAIL (score < 18) → `/app/phase4/step/3/remedial/a2/retry`

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
- **Endpoint**: `POST /api/phase4/step3/remedial/b1/final-score`
- **Required Tasks** (27 points max):
  - Task A: Negotiation Battle (max 5 points)
  - Task B: Definition Duel (max 8 points)
  - Task C: Wordshake Quiz (max 6 points)
  - Task D: Flashcard Game (max 8 points)
- **Bonus Tasks** (12 points max):
  - Task E: Tense Time Travel (max 6 points)
  - Task F: Grammar Kahoot (max 6 points)
- **Total Max**: 39 points (27 required + 12 bonus)
- **Pass Threshold**: ≥ 22/27 required points (~81%)
- **AI Evaluation Routes**:
  - `POST /api/phase4/step3/remedial/b1/evaluate-definitions`
- **Retry Logic**:
  - ✓ PASS (required ≥ 22) → `/app/phase4/step/4`
  - ✗ FAIL (required < 22) → `/app/phase4/step/3/remedial/b1/retry`

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
- **Endpoint**: `POST /api/phase4/step3/remedial/b2/final-score`
- **Tasks**:
  - Task A: Role-Play Saga (max 10 points)
  - Task B: Explain Expedition (max 8 points)
  - Task C: (max 8 points)
  - Task D: (max 6 points)
  - Task E: (max 6 points)
  - Task F: (max 6 points)
- **Total Max**: 44 points
- **Pass Threshold**: ≥ 35/44 (~80%)
- **AI Evaluation Routes**:
  - `POST /api/phase4/step3/remedial/b2/evaluate-explanations`
  - `POST /api/phase4/step3/remedial/b2/evaluate-spell-explanation`
- **Retry Logic**:
  - ✓ PASS (score ≥ 35) → `/app/phase4/step/4`
  - ✗ FAIL (score < 35) → `/app/phase4/step/3/remedial/b2/retry`

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
- **Endpoint**: `POST /api/phase4/step3/remedial/c1/final-score`
- **Tasks**:
  - Task A: (max 10 points)
  - Task B: (max 8 points)
  - Task C: (max 6 points)
  - Task D: (max 6 points)
  - Task E: (max 6 points)
  - Task F: (max 6 points)
  - Task G: (max 6 points)
  - Task H: (max 6 points)
- **Total Max**: 54 points
- **Pass Threshold**: ≥ 43/54 (~80%)
- **AI Evaluation Routes**:
  - `POST /api/phase4/step3/remedial/c1/evaluate-analyses`
  - `POST /api/phase4/step3/remedial/c1/evaluate-justification`
  - `POST /api/phase4/step3/remedial/c1/evaluate-critique`
  - `POST /api/phase4/step3/remedial/c1/evaluate-critiques-batch`
  - `POST /api/phase4/step3/remedial/c1/evaluate-clauses-batch`
- **Retry Logic**:
  - ✓ PASS (score ≥ 43) → `/app/phase4/step/4`
  - ✗ FAIL (score < 43) → `/app/phase4/step/3/remedial/c1/retry`

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

## Score Privacy

**CRITICAL RULE**: All scores are **NEVER shown to users**. Scores are only logged in the terminal with `(INTERNAL USE ONLY)` labels.

### Terminal Output Format

#### Step 3 Scoring
```
======================================================================
🎯 PHASE 4 STEP 3 - SCORE CALCULATION (INTERNAL USE ONLY)
======================================================================
User ID: <user_id>
Interaction 1 (Define 'Persuasive'): X/5 → Level: A1/A2/B1/B2/C1
Interaction 2 (Explain 'Dramatisation'): X/5 → Level: A1/A2/B1/B2/C1
Interaction 3 (Game Connection): X/5 → Level: A1/A2/B1/B2/C1
📊 Total Score: X/15
📍 Remedial Level: Remedial A1/A2/B1/B2/C1
Route: User must complete Remedial X
======================================================================
```

---

## User Flow Diagram

```
User completes Phase 4 Step 3
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
│ YES → Proceed to Next Step      │
│ NO  → RETRY same remedial       │
└─────────────────────────────────┘
```

---

## Example Scenarios

### Scenario 1: High Performance → Remedial C1
- Interaction 1 (Persuasive): 5/5 (C1)
- Interaction 2 (Dramatisation): 5/5 (C1)
- Interaction 3 (Game Connection): 4/5 (B2)
- **Total**: 14/15
- **Route**: Remedial C1 (14 ≥ 13)

### Scenario 2: Medium Performance → Remedial B1
- Interaction 1: 3/5 (B1)
- Interaction 2: 3/5 (B1)
- Interaction 3: 2/5 (A2)
- **Total**: 8/15
- **Route**: Remedial B1 (7 ≤ 8 < 10)

### Scenario 3: Low Performance → Remedial A1
- Interaction 1: 1/5 (A1)
- Interaction 2: 1/5 (A1)
- Interaction 3: 1/5 (A1)
- **Total**: 3/15
- **Route**: Remedial A1 (3 < 4)

### Scenario 4: Mixed Performance → Remedial A2
- Interaction 1: 2/5 (A2)
- Interaction 2: 2/5 (A2)
- Interaction 3: 2/5 (A2)
- **Total**: 6/15
- **Route**: Remedial A2 (4 ≤ 6 < 7)

### Scenario 5: Upper Mid Performance → Remedial B2
- Interaction 1: 4/5 (B2)
- Interaction 2: 4/5 (B2)
- Interaction 3: 3/5 (B1)
- **Total**: 11/15
- **Route**: Remedial B2 (10 ≤ 11 < 13)

---

## Testing Checklist

- [ ] Step 3 scoring calculates total correctly (sum of 3 CEFR scores)
- [ ] Routing to A1 when total < 4
- [ ] Routing to A2 when 4 ≤ total < 7
- [ ] Routing to B1 when 7 ≤ total < 10
- [ ] Routing to B2 when 10 ≤ total < 13
- [ ] Routing to C1 when total ≥ 13
- [ ] Interaction 1 evaluates "Persuasive" definition correctly
- [ ] Interaction 2 evaluates "Dramatisation" explanation correctly
- [ ] Interaction 3 evaluates game connection correctly
- [ ] All 3 scores are stored in sessionStorage
- [ ] Backend endpoint `/step/3/calculate-score` works correctly
- [ ] Remedials route to correct level based on total score
- [ ] Scores NOT shown in user-facing responses
- [ ] Terminal logs include "(INTERNAL USE ONLY)" labels
- [ ] Each interaction accepts CEFR scores 1-5
- [ ] Frontend displays correct remedial level assignment

---

## Implementation Files

- **Main Route File**: `backend/routes/phase4_routes.py`
  - Line 539-661: `calculate_step3_score()` - Step 3 scoring and routing
  - Line 688-742: `calculate_step3_a1_final_score()` - Remedial A1 evaluation
  - Line 744-798: `calculate_step3_a2_final_score()` - Remedial A2 evaluation
  - Line 1275-1356: `calculate_step3_b1_final_score()` - Remedial B1 evaluation
  - Line 1223-1273: `calculate_step3_b2_final_score()` - Remedial B2 evaluation
  - Line 2084+: Remedial C1 evaluation routes

- **Frontend Files**:
  - `frontend/src/pages/Phase4Step3/index.jsx` - Step 3 intro page
  - `frontend/src/pages/Phase4Step3/Interaction1.jsx` - Define "Persuasive"
  - `frontend/src/pages/Phase4Step3/Interaction2.jsx` - Explain "Dramatisation"
  - `frontend/src/pages/Phase4Step3/Interaction3.jsx` - Game Connection + Routing

---

## Key Differences from Step 1

1. **CEFR Scoring**: Step 3 uses direct CEFR scores (1-5) instead of point-based scoring
2. **Cumulative Assessment**: All 3 interactions contribute equally to the total score
3. **Lower Thresholds**: Different remedial thresholds reflecting CEFR-based scoring
4. **Content Focus**: Step 3 focuses on advertising terminology and concepts (persuasive, dramatisation)
5. **Video-Based Learning**: Multiple videos integrated into interactions

---

## Integration Points

### From Step 1
- After completing Step 1 Remedial (any level) and passing, users route to `/app/phase4/step/3`

### To Step 4
- After completing Step 3 Remedial (any level) and passing, users route to `/app/phase4/step/4`

---

## Next Steps

- Complete implementation of all Step 3 remedial levels
- Create frontend pages for each remedial level
- Add retry mechanism for failed remedials
- Testing all 5 remedial paths with various score combinations
