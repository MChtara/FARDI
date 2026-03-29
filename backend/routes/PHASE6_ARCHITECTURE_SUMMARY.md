# Phase 6 - Complete Architecture Summary

## Overview
Phase 6 implements the same **CEFR-based step routing architecture** as Phases 4 and 5, with 4 main steps (Step 1, 3, 4, 5) each followed by mandatory remedial activities. This is the **Reflection & Evaluation** phase, which is the final phase in the FARDI language learning sequence.

---

## Phase 6 Complete Architecture

```
┌─────────────────────────┐
│   PHASE 6 - STEP 1      │
│   (21 points)           │
└────────┬────────────────┘
         │
    Score Routing:
    < 7  → A1 (22pts, ≥18)
    < 12 → A2 (22pts, ≥18)
    < 16 → B1 (39pts, ≥22)
    < 19 → B2 (44pts, ≥35)
    ≥ 19 → C1 (54pts, ≥43)
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 6 - STEP 3      │
│   (15 CEFR points)      │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1 (22pts, ≥18)
    < 7  → A2 (22pts, ≥18)
    < 10 → B1 (39pts, ≥22)
    < 13 → B2 (44pts, ≥35)
    ≥ 13 → C1 (54pts, ≥43)
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 6 - STEP 4      │
│   (15 CEFR points)      │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1 (22pts, ≥18)
    < 7  → A2 (21pts, ≥18)
    < 10 → B1 (38pts, ≥22)
    < 13 → B2 (32pts, ≥26)
    ≥ 13 → C1 (26pts, ≥21)
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 6 - STEP 5      │
│   (15 AI-scored CEFR)   │
└────────┬────────────────┘
         │
    Score Routing:
    < 4  → A1 (22pts, ≥17)
    < 7  → A2 (22pts, ≥18)
    < 10 → B1 (39pts, ≥22)
    < 13 → B2 (44pts, ≥35)
    ≥ 13 → C1 (54pts, ≥43)
         │
         ↓
┌─────────────────────────┐
│   Remedial (Pass)       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   PHASE 6_2 (Part 2)    │
│   (Same architecture)   │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│   COMPLETION!           │
│   (End of FARDI)        │
└─────────────────────────┘
```

---

## Step 1: Score Calculation & Routing

### Interactions
- **Multiple interactions** (structure varies by Phase 6 content)
- **Total Maximum Score**: 21 points

### Routing Thresholds

| Total Score | Remedial Level |
|------------|----------------|
| < 7        | Remedial A1    |
| < 12       | Remedial A2    |
| < 16       | Remedial B1    |
| < 19       | Remedial B2    |
| ≥ 19       | Remedial C1    |

### API Endpoint
```
POST /api/phase6/step/1/calculate-score
```

**Request Body:**
```json
{
  "interaction_scores": [array of scores]
}
```

---

## Step 1: Remedial Endpoints

### Summary Table

| Level | Endpoint | Max Points | Pass Threshold | Next Route |
|-------|----------|-----------|----------------|------------|
| A1    | `/step1/remedial/a1/final-score` | 22 (8+8+6) | ≥18 (~82%) | Step 3 |
| A2    | `/step1/remedial/a2/final-score` | 22 (8+8+6) | ≥18 (~82%) | Step 3 |
| B1    | `/step1/remedial/b1/final-score` | 39 (27+12 bonus) | ≥22 required (~81%) | Step 3 |
| B2    | `/step1/remedial/b2/final-score` | 44 (10+8+8+6+6+6) | ≥35 (~80%) | Step 3 |
| C1    | `/step1/remedial/c1/final-score` | 54 (10+8+6+6+6+6+6+6) | ≥43 (~80%) | Step 3 |

---

## Step 3: Score Calculation & Routing

### Interactions (CEFR-Scored)
1. **Interaction 1**: CEFR-scored (1-5 points)
2. **Interaction 2**: CEFR-scored (1-5 points)
3. **Interaction 3**: CEFR-scored (1-5 points)

**Total Maximum Score**: 15 points

### Routing Thresholds

| Total Score | Remedial Level |
|------------|----------------|
| < 4        | Remedial A1    |
| < 7        | Remedial A2    |
| < 10       | Remedial B1    |
| < 13       | Remedial B2    |
| ≥ 13       | Remedial C1    |

### API Endpoint
```
POST /api/phase6/step/3/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 1-5,
  "interaction2_score": 1-5,
  "interaction3_score": 1-5
}
```

---

## Step 3: Remedial Endpoints

### Summary Table

| Level | Endpoint | Max Points | Pass Threshold | Next Route |
|-------|----------|-----------|----------------|------------|
| A1    | `/step3/remedial/a1/final-score` | 22 (8+8+6) | ≥18 (~82%) | Step 4 |
| A2    | `/step3/remedial/a2/final-score` | 22 (8+8+6) | ≥18 (~82%) | Step 4 |
| B1    | `/step3/remedial/b1/final-score` | 39 (27+12 bonus) | ≥22 required (~81%) | Step 4 |
| B2    | `/step3/remedial/b2/final-score` | 44 (10+8+8+6+6+6) | ≥35 (~80%) | Step 4 |
| C1    | `/step3/remedial/c1/final-score` | 54 (10+8+6+6+6+6+6+6) | ≥43 (~80%) | Step 4 |

---

## Step 4: Score Calculation & Routing

### Interactions (CEFR-Scored)
1. **Interaction 1**: CEFR-scored (1-5 points)
2. **Interaction 2**: CEFR-scored (1-5 points)
3. **Interaction 3**: CEFR-scored (1-5 points)

**Total Maximum Score**: 15 points

### Routing Thresholds

| Total Score | Remedial Level |
|------------|----------------|
| < 4        | Remedial A1    |
| < 7        | Remedial A2    |
| < 10       | Remedial B1    |
| < 13       | Remedial B2    |
| ≥ 13       | Remedial C1    |

### API Endpoint
```
POST /api/phase6/step/4/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 1-5,
  "interaction2_score": 1-5,
  "interaction3_score": 1-5
}
```

---

## Step 4: Remedial Endpoints

### Summary Table

| Level | Endpoint | Max Points | Pass Threshold | Next Route |
|-------|----------|-----------|----------------|------------|
| A1    | `/step4/remedial/a1/final-score` | 22 (8+8+6) | ≥18 (~82%) | Step 5 |
| A2    | `/step4/remedial/a2/final-score` | 21 (8+7+6) | ≥18 (~86%) | Step 5 |
| B1    | `/step4/remedial/b1/final-score` | 38 (26+12 bonus) | ≥22 required (~85%) | Step 5 |
| B2    | `/step4/remedial/b2/final-score` | 32 (8+8+6+5+5) | ≥26 (~81%) | Step 5 |
| C1    | `/step4/remedial/c1/final-score` | 26 (8+6+6+6) | ≥21 (~81%) | Step 5 |

---

## Step 5: Score Calculation & Routing

### Interactions (AI-Scored CEFR)
1. **Interaction 1**: AI-scored CEFR (1-5 points)
2. **Interaction 2**: AI-scored CEFR (1-5 points)
3. **Interaction 3**: AI-scored CEFR (1-5 points)

**Total Maximum Score**: 15 points

### Routing Thresholds

| Total Score | Remedial Level |
|------------|----------------|
| < 4        | Remedial A1    |
| < 7        | Remedial A2    |
| < 10       | Remedial B1    |
| < 13       | Remedial B2    |
| ≥ 13       | Remedial C1    |

### API Endpoint
```
POST /api/phase6/step/5/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 1-5,
  "interaction2_score": 1-5,
  "interaction3_score": 1-5
}
```

---

## Step 5: Remedial Endpoints

### Summary Table

| Level | Endpoint | Max Points | Pass Threshold | Next Route |
|-------|----------|-----------|----------------|------------|
| A1    | `/step5/remedial/a1/final-score` | 22 (8+8+6) | ≥17 (~77%) | Phase 6_2 |
| A2    | `/step5/remedial/a2/final-score` | 22 (8+8+6) | ≥18 (~82%) | Phase 6_2 |
| B1    | `/step5/remedial/b1/final-score` | 39 (27+12 bonus) | ≥22 required (~81%) | Phase 6_2 |
| B2    | `/step5/remedial/b2/final-score` | 44 (10+8+8+6+6+6) | ≥35 (~80%) | Phase 6_2 |
| C1    | `/step5/remedial/c1/final-score` | 54 (10+8+6+6+6+6+6+6) | ≥43 (~80%) | Phase 6_2 |

---

## Complete Remedial Summary (All Steps)

### Step 1 Remedials

| Level | Tasks | Total | Pass | Route |
|-------|-------|-------|------|-------|
| A1 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Step 3 |
| A2 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Step 3 |
| B1 | Required: A(5) + B(8) + C(6) + D(8)<br>Bonus: E(6) + F(6) | 39 | ≥22 req | Step 3 |
| B2 | Task A (10) + Task B (8) + Task C (8) + Task D (6) + Task E (6) + Task F (6) | 44 | ≥35 | Step 3 |
| C1 | 8 tasks: A(10) + B(8) + C(6) + D(6) + E(6) + F(6) + G(6) + H(6) | 54 | ≥43 | Step 3 |

### Step 3 Remedials

| Level | Tasks | Total | Pass | Route |
|-------|-------|-------|------|-------|
| A1 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Step 4 |
| A2 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Step 4 |
| B1 | Required: A(5) + B(8) + C(6) + D(8)<br>Bonus: E(6) + F(6) | 39 | ≥22 req | Step 4 |
| B2 | Task A (10) + Task B (8) + Task C (8) + Task D (6) + Task E (6) + Task F (6) | 44 | ≥35 | Step 4 |
| C1 | 8 tasks: A(10) + B(8) + C(6) + D(6) + E(6) + F(6) + G(6) + H(6) | 54 | ≥43 | Step 4 |

### Step 4 Remedials

| Level | Tasks | Total | Pass | Route |
|-------|-------|-------|------|-------|
| A1 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Step 5 |
| A2 | Task A (8) + Task B (7) + Task C (6) | 21 | ≥18 | Step 5 |
| B1 | Required: A(5) + B(7) + C(6) + D(8)<br>Bonus: E(6) + F(6) | 38 | ≥22 req | Step 5 |
| B2 | Task A (8) + Task B (8) + Task C (6) + Task D (5) + Task E (5) | 32 | ≥26 | Step 5 |
| C1 | Task A (8) + Task B (6) + Task C (6) + Task D (6) | 26 | ≥21 | Step 5 |

### Step 5 Remedials

| Level | Tasks | Total | Pass | Route |
|-------|-------|-------|------|-------|
| A1 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥17 | Phase 6_2 |
| A2 | Task A (8) + Task B (8) + Task C (6) | 22 | ≥18 | Phase 6_2 |
| B1 | Required: A(5) + B(8) + C(6) + D(8)<br>Bonus: E(6) + F(6) | 39 | ≥22 req | Phase 6_2 |
| B2 | Task A (10) + Task B (8) + Task C (8) + Task D (6) + Task E (6) + Task F (6) | 44 | ≥35 | Phase 6_2 |
| C1 | 8 tasks: A(10) + B(8) + C(6) + D(6) + E(6) + F(6) + G(6) + H(6) | 54 | ≥43 | Phase 6_2 |

---

## Score Privacy

**CRITICAL RULE**: All scores are **NEVER shown to users**. Scores are only logged in the terminal with `(INTERNAL USE ONLY)` labels.

### Terminal Output Format Examples

#### Step Scoring
```
================================================================================
PHASE 6 STEP 3 - SCORE CALCULATION & ROUTING (INTERNAL USE ONLY)
================================================================================
User ID: <user_id>

Interaction Scores (CEFR 1-5):
  Interaction 1: X/5
  Interaction 2: X/5
  Interaction 3: X/5
--------------------------------------------------------------------------------
TOTAL SCORE: X/15
--------------------------------------------------------------------------------
ROUTING DECISION: Remedial A1/A2/B1/B2/C1
  (Based on thresholds: <4=A1, <7=A2, <10=B1, <13=B2, ≥13=C1)
================================================================================
```

#### Remedial Scoring (with Bonus Tasks)
```
================================================================================
PHASE 6 STEP 3 - REMEDIAL B1 FINAL SCORE (INTERNAL USE ONLY)
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
ROUTING: /app/phase6/step/4
================================================================================
```

---

## Implementation Files

### Main Route File
**`backend/routes/phase6_routes.py`** (3,314 lines total)

#### Step 1 (Lines 1641-2078)
- `calculate_step1_score()` - Line 1641
- `calculate_step1_a1_final_score()` - Line 1712
- `calculate_step1_a2_final_score()` - Line 1778
- `calculate_step1_b1_final_score()` - Line 1844
- `calculate_step1_b2_final_score()` - Line 1927
- `calculate_step1_c1_final_score()` - Line 2003

#### Step 3 (Lines 2083-2570)
- `calculate_step3_score()` - Line 2083
- `calculate_step3_a1_final_score()` - Line 2200
- `calculate_step3_a2_final_score()` - Line 2265
- `calculate_step3_b1_final_score()` - Line 2330
- `calculate_step3_b2_final_score()` - Line 2421
- `calculate_step3_c1_final_score()` - Line 2494

#### Step 4 (Lines 2575-3047)
- `calculate_step4_score()` - Line 2575
- `calculate_step4_a1_final_score()` - Line 2692
- `calculate_step4_a2_final_score()` - Line 2757
- `calculate_step4_b1_final_score()` - Line 2822
- `calculate_step4_b2_final_score()` - Line 2913
- `calculate_step4_c1_final_score()` - Line 2982

#### Step 5 (Lines 3052-3539)
- `calculate_step5_score()` - Line 3052
- `calculate_step5_a1_final_score()` - Line 3169
- `calculate_step5_a2_final_score()` - Line 3234
- `calculate_step5_b1_final_score()` - Line 3299
- `calculate_step5_b2_final_score()` - Line 3390
- `calculate_step5_c1_final_score()` - Line 3463

---

## Key Implementation Features

1. ✅ **CEFR-Based Routing**: All steps use CEFR scoring (1-5 per interaction)
2. ✅ **80% Pass Threshold**: All remedials target ~80% pass rate
3. ✅ **Mandatory Remedials**: ALL users must complete a remedial before proceeding
4. ✅ **Retry Logic**: Failed remedials route to retry URL
5. ✅ **Bonus Task System**: B1 levels include bonus tasks
6. ✅ **Score Privacy**: Scores only in terminal, never shown to users
7. ✅ **Consistent Architecture**: Follows exact same pattern as Phases 4 and 5
8. ✅ **Progressive Difficulty**: Steps increase in complexity
9. ✅ **Detailed Logging**: Complete terminal output for professor monitoring
10. ✅ **Error Handling**: Comprehensive try-catch with logging

---

## User Flow Example

### Scenario: Student Completes Phase 6

**Step 1:**
- Completes multiple interactions → Total: 18/21
- Routes to Remedial B2 (16 ≤ 18 < 19)
- Completes B2 tasks: 37/44
- Passes (37 ≥ 35) → Routes to Step 3

**Step 3:**
- Completes 3 CEFR interactions → Total: 11/15
- Routes to Remedial B2 (10 ≤ 11 < 13)
- Completes B2 tasks: 38/44
- Passes (38 ≥ 35) → Routes to Step 4

**Step 4:**
- Completes 3 CEFR interactions → Total: 12/15
- Routes to Remedial B2 (10 ≤ 12 < 13)
- Completes B2 tasks: 28/32
- Passes (28 ≥ 26) → Routes to Step 5

**Step 5:**
- Completes 3 AI-scored CEFR interactions → Total: 11/15
- Routes to Remedial B2 (10 ≤ 11 < 13)
- Completes B2 tasks: 36/44
- Passes (36 ≥ 35) → Routes to Phase 6_2

**Phase 6_2:**
- Completes all Phase 6_2 steps and remedials
- **Routes to COMPLETION!**

---

## Testing Checklist

### Step 1
- [ ] Step 1 scoring endpoint calculates total correctly
- [ ] All 5 routing thresholds work correctly (<7, <12, <16, <19, ≥19)
- [ ] All 5 remedial endpoints accept correct task scores
- [ ] All remedials apply correct pass thresholds
- [ ] All remedials route to Step 3 on pass
- [ ] All remedials route to retry on fail
- [ ] B1 bonus tasks don't affect pass/fail

### Step 3
- [ ] Step 3 scoring endpoint calculates CEFR total correctly
- [ ] All 5 routing thresholds work correctly (<4, <7, <10, <13, ≥13)
- [ ] All 5 remedial endpoints accept correct task scores
- [ ] All remedials apply correct pass thresholds
- [ ] All remedials route to Step 4 on pass
- [ ] All remedials route to retry on fail
- [ ] B1 bonus tasks don't affect pass/fail

### Step 4
- [ ] Step 4 scoring endpoint calculates CEFR total correctly
- [ ] All 5 routing thresholds work correctly (<4, <7, <10, <13, ≥13)
- [ ] All 5 remedial endpoints accept correct task scores
- [ ] All remedials apply correct pass thresholds
- [ ] All remedials route to Step 5 on pass
- [ ] All remedials route to retry on fail
- [ ] B1 bonus tasks don't affect pass/fail

### Step 5
- [ ] Step 5 scoring endpoint calculates AI-scored CEFR total correctly
- [ ] All 5 routing thresholds work correctly (<4, <7, <10, <13, ≥13)
- [ ] All 5 remedial endpoints accept correct task scores
- [ ] All remedials apply correct pass thresholds
- [ ] All remedials route to Phase 6_2 on pass
- [ ] All remedials route to retry on fail
- [ ] B1 bonus tasks don't affect pass/fail

### General
- [ ] Scores NOT shown in user-facing responses
- [ ] Terminal logs include "(INTERNAL USE ONLY)" labels
- [ ] All endpoints require authentication (@login_required)
- [ ] Error handling works for invalid input
- [ ] JSON responses follow consistent format

---

## Integration Points

### From Phase 5_2
- After completing all Phase 5_2 steps and remedials, users route to `/app/phase6/step/1`

### To Phase 6_2
- After completing Phase 6 Step 5 Remedial (any level) and passing, users route to `/app/phase6_2`
- Phase 6_2 follows the same architectural pattern (Steps 1-5 with remedials)

### To Completion
- After completing all Phase 6_2 steps and remedials, users reach **COMPLETION**
- This marks the end of the entire FARDI language learning journey

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

### Pass Threshold Calculation
- **Standard**: ≥80% of total points
- **Exceptions**:
  - Step 5 A1: 17/22 = ~77% (rounded down from 17.6)
  - Step 4 A2: 18/21 = ~86% (due to 21 total points)
- **B1 Levels**: Pass based on required tasks only (bonus excluded from threshold)

---

## Complete Phase Progression

```
Phase 4 → Phase 4_2 → Phase 5 → Phase 5_2 → Phase 6 → Phase 6_2 → COMPLETION
  ↓         ↓           ↓          ↓          ↓          ↓
Steps     Steps       Steps      Steps      Steps      Steps
1→3→4→5   1→3→4→5    1→3→4→5   1→3→4→5   1→3→4→5   1→3→4→5
```

Each step within each phase follows the same pattern:
1. Complete interactions
2. Calculate score
3. Route to remedial based on score
4. Complete remedial tasks
5. Pass (≥80%) → Next step OR Fail → Retry

---

## Phase 6 Significance

Phase 6 is the **final phase** in the FARDI language learning platform. It focuses on:
- **Reflection**: Students reflect on their learning journey
- **Evaluation**: Students evaluate their own work and others' work
- **Meta-learning**: Students think about how they learn
- **Self-assessment**: Students assess their own progress

After completing Phase 6 and Phase 6_2, students have:
- Completed all 6 phases of FARDI
- Demonstrated proficiency across all CEFR levels
- Developed autonomous language learning skills
- Achieved comprehensive language competency

---

## Next Steps

1. Implement Phase 6_2 with same architecture (Steps 1-5)
2. Create frontend pages for all Phase 6 steps and remedials
3. Add AI evaluation endpoints for writing tasks
4. Testing all routing paths with various score combinations
5. Ensure proper routing to Phase 6_2 after Step 5 completion
6. After Phase 6_2 completion, display completion certificate/dashboard
7. Collect final assessments and generate comprehensive reports

---

## Completion Criteria

To complete the FARDI program, a student must:
1. ✓ Complete Phase 4 (Steps 1, 3, 4, 5 with remedials)
2. ✓ Complete Phase 4_2 (Steps 1, 3, 4, 5 with remedials)
3. ✓ Complete Phase 5 (Steps 1, 3, 4, 5 with remedials)
4. ✓ Complete Phase 5_2 (Steps 1, 3, 4, 5 with remedials)
5. ✓ Complete Phase 6 (Steps 1, 3, 4, 5 with remedials)
6. ✓ Complete Phase 6_2 (Steps 1, 3, 4, 5 with remedials)

**Total Steps**: 24 main steps across 6 sub-phases
**Total Possible Remedials**: 120 (24 steps × 5 levels each)
**Achievement**: Complete CEFR language proficiency journey from A1 to C1
