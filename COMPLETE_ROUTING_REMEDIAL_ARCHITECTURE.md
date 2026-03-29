# FARDI Complete Routing & Remedial Architecture

## 📊 Complete Phase Progression Flow

```
START (Registration/Login)
       ↓
    PHASE 1
 (Initial CEFR Assessment)
       ↓
    PHASE 2
 (Guided Activities - 5 Steps)
       ↓
    PHASE 3
 (Sponsorship & Budgeting - 4 Steps)
       ↓
    PHASE 4
 (Marketing & Promotion - Steps 1, 3, 4, 5)
       ↓
    PHASE 4_2
 (Marketing Part 2 - Steps 1, 3, 4, 5)
       ↓
    PHASE 5
 (Execution & Problem-Solving - Steps 1, 3, 4, 5)
       ↓
    PHASE 5_2
 (Execution Part 2 - Steps 1, 3, 4, 5)
       ↓
    PHASE 6
 (Reflection & Evaluation - Steps 1, 3, 4, 5)
       ↓
    PHASE 6_2
 (Reflection Part 2 - Steps 1, 3, 4, 5)
       ↓
   COMPLETION 🎉
```

---

## 🎯 Detailed Routing Architecture by Phase

### PHASE 1: Initial Assessment
- **Entry**: `/app/phase1` or `/app/assessment`
- **Purpose**: Determine initial CEFR level
- **Structure**: Dialogue-based assessment with NPCs
- **Exit**: After completion → `/app/phase2`
- **Note**: No remedials in Phase 1 (diagnostic only)

---

### PHASE 2: Guided Activities

**Structure**: 5 sequential steps with remedials

```
Phase 2: Step 1 → Remedial (if needed) → Pass → Step 2
         Step 2 → Remedial (if needed) → Pass → Step 3
         Step 3 → Remedial (if needed) → Pass → Step 4
         Step 4 → Remedial (if needed) → Pass → Step 5
         Step 5 → Remedial (if needed) → Pass → PHASE 3 ✓
```

**API Endpoint**: `POST /api/phase2/{step_id}/calculate-score`
**Success Threshold**: `PHASE_2_SUCCESS_THRESHOLD` (defined in config)

---

### PHASE 3: Sponsorship & Budgeting

**Structure**: 4 steps (Steps 1, 2, 3, 4)

#### Step 1 Layout
- **Interactions**: 3 interactions
  - Interaction 1: Matching → max 8 points
  - Interaction 2: Word Finding → max 8 points
  - Interaction 3: CEFR Writing → max 5 points
- **Total**: 21 points max

**Scoring**: 
- Interaction 1 & 2: +1 per correct match/answer
- Interaction 3: CEFR-based (A1=1, A2=2, B1=3, B2=4, C1=5)

**Remedial Routing** (based on total score):
```
Total Score < 12    → Remedial A1  → max 8 pts (≥6 to pass)
Total Score < 18    → Remedial A2  → max 8 pts (≥6 to pass)
Total Score < 22    → Remedial B1  → max 5 pts (≥2 to pass)
Total Score < 26    → Remedial B2  → max 5 pts (≥3 to pass)
Total Score ≥ 26    → Remedial C1  → max 5 pts (≥4 to pass)
```

#### Step 2 Layout
- **Interactions**: 3 matching interactions
  - Int 1: Matching → max 10 points
  - Int 2: Matching → max 8 points
  - Int 3: Matching → max 5 points
- **Total**: 23 points max

**Remedial Routing** (based on total score):
```
Total Score < 8     → Remedial A1
Total Score < 13    → Remedial A2
Total Score < 18    → Remedial B1
Total Score < 21    → Remedial B2
Total Score ≥ 21    → Remedial C1
```

#### Step 3 Layout
- **Interactions**: 3 interactions
  - Int 1: Guided Explanation → max 8 points
  - Int 2: Sentence Transformation → max 5 points
  - Int 3: Justification (CEFR) → max 5 points
- **Total**: 18 points max

**Remedial Routing** (based on total score):
```
Total Score < 6     → Remedial A1
Total Score < 11    → Remedial A2
Total Score < 14    → Remedial B1
Total Score < 17    → Remedial B2
Total Score ≥ 17    → Remedial C1
```

#### Step 4 Layout
- **Interactions**: 2 CEFR-based interactions
  - Int 1: Budget Creation (CEFR) → max 5 points
  - Int 2: Sponsor Pitch (CEFR) → max 5 points
- **Total**: 10 points max

**Remedial Routing** (based on total score):
```
Total Score < 2     → Remedial A1
Total Score < 4     → Remedial A2
Total Score < 6     → Remedial B1
Total Score < 8     → Remedial B2
Total Score ≥ 8     → Remedial C1
```

**Phase 3 → Phase 4**: After Step 4 remedial pass → `/app/phase4/step/1`

---

### PHASE 4, 4_2, 5, 5_2, 6, 6_2: Standard Structure

**Pattern**: Steps 1, 3, 4, 5 (4 steps total per phase)

#### Step 1
- **Interactions**: Multiple interactions
- **Total**: 21 points max

**Scoring Pattern**:
- Mix of completion points (+1) and CEFR-based (1-5)
- Exact breakdown depends on interactions

**Remedial Routing** (based on total score):
```
Total Score < 7     → Remedial A1  → 22 pts (≥18 to advance)
Total Score < 12    → Remedial A2  → 22 pts (≥18 to advance)
Total Score < 16    → Remedial B1  → 39 pts (≥22 to advance)
Total Score < 19    → Remedial B2  → 44 pts (≥35 to advance)
Total Score ≥ 19    → Remedial C1  → 54 pts (≥43 to advance)
```

**Advance**: All remedials → `/app/phase[X]/step/3`

#### Steps 3, 4, 5
- **Interactions**: 3 CEFR-based interactions (1-5 each)
- **Total**: 15 points max

**Scoring**: Each interaction is CEFR-level scored
- A1 = 1 point
- A2 = 2 points
- B1 = 3 points
- B2 = 4 points
- C1 = 5 points

**Remedial Routing** (based on total score):
```
Total Score < 4     → Remedial A1
Total Score < 7     → Remedial A2
Total Score < 10    → Remedial B1
Total Score < 13    → Remedial B2
Total Score ≥ 13    → Remedial C1
```

**Step 3 & 4**: All remedials → Next step
**Step 5**: All remedials → Next phase (4_2, 5_2, 6_2, or completion)

---

## 🏆 Remedial Scoring Details

### How Points are Awarded

#### Type 1: Binary Correct/Incorrect Tasks
```
Matching Tasks:     +1 per correct match (max varies)
Gap-fill Tasks:     +1 per correct fill (max varies)
Multiple Choice:    +1 per correct answer (max varies)

Example: 
- Match 4 items correctly = 4 points
- Gap-fill 8 blanks correctly = 8 points
```

#### Type 2: CEFR-Level Based Tasks
```
A1 Level Answer  = 1 point
A2 Level Answer  = 2 points
B1 Level Answer  = 3 points
B2 Level Answer  = 4 points
C1 Level Answer  = 5 points

Example:
- Writing task graded as B1 quality = 3 points
- Conversation graded as C1 quality = 5 points
```

#### Type 3: Hybrid Tasks
```
Main score (CEFR-based) + supporting scores (+1 each)

Example:
- Writing (CEFR-based): 1-5 points
- Grammar correction: +1 point per correct
- Total: 1-5 + 0-X points
```

### Pass Thresholds by Remedial Level

| Remedial Level | Typical Max | Pass Threshold | Pass % |
|---|---|---|---|
| A1 | 3-8 | 60-75% | Varies |
| A2 | 4-10 | 75-80% | Varies |
| B1 | 5-12 | 2-3 points | ~40-50% |
| B2 | 5-12 | 3-4 points | ~50-60% |
| C1 | 8-12 | 4+ points | ~50%+ |

---

## 📍 Step-by-Step Remedial Flow Example

### Phase 4 Step 1 Complete Journey

**User takes Step 1 assessment**
```
Scores: Int1: 5 points, Int2: 4 points, Int3: 3 points
Total: 12 points
```

**Total Score < 12** → Routes to **Remedial A1**

**Remedial A1 Structure**:
- Multiple tasks (varies by phase)
- Each correct answer or match = +1 point
- Max possible: 22 points
- Pass condition: ≥18 points needed

**User completes Remedial A1**:
```
Scores:
- Task A: 6 correct (6 points)
- Task B: 5 correct (5 points)
- Task C: 4 correct (4 points)
- Task D: 3 correct (3 points)
Total: 18 points ✓ PASS
```

**Routes to**: `/app/phase4/step/3` (next step)

---

### Failure & Retry Example

**User completes Remedial A1 but scores 15 points** (< 18 needed)

**Routes to**: Retry the same remedial A1

**On next attempt**:
```
Scores:
- Task A: 7 correct (7 points)
- Task B: 6 correct (6 points)
- Task C: 4 correct (4 points)
- Task D: 4 correct (4 points)
Total: 21 points ✓ PASS
```

**Routes to**: `/app/phase4/step/3`

---

## 📋 Key Remedial Patterns by Phase

### Phase 3 Remedials
- **A1 & A2**: Simple matching/placement
  - Structure: 2-3 tasks, +1 per correct
  - Max: 8 points, Pass: 6+ points (75%)
  
- **B1, B2, C1**: CEFR-scored writing
  - Structure: Single writing task
  - Max: 5 points (A1-C1 scores)
  - Pass: 2+, 3+, 4+ respectively

### Phase 4, 4_2, 5, 5_2, 6, 6_2 Remedials
- **Step 1 Remedials**: Large task set
  - A1: 22 points, Pass: 18+
  - A2: 22 points, Pass: 18+
  - B1: 39 points, Pass: 22+
  - B2: 44 points, Pass: 35+
  - C1: 54 points, Pass: 43+

- **Steps 3, 4, 5 Remedials**: Variable task set
  - A1: 3-4 tasks
  - A2: 3-4 tasks
  - B1: 6 tasks
  - B2: 6-8 tasks
  - C1: 8+ tasks
  - Pass threshold: 75% typically

---

## 🔄 Phase Transition Points

| From | Condition | To |
|---|---|---|
| Phase 1 | Complete assessment | Phase 2 |
| Phase 2 Step 5 | Pass remedial | Phase 3 |
| Phase 3 Step 4 | Pass remedial | Phase 4 Step 1 |
| Phase 4 Step 5 | Pass remedial | Phase 4_2 Step 1 |
| Phase 4_2 Step 5 | Pass remedial | Phase 5 Step 1 |
| Phase 5 Step 5 | Pass remedial | Phase 5_2 Step 1 |
| Phase 5_2 Step 5 | Pass remedial | Phase 6 Step 1 |
| Phase 6 Step 5 | Pass remedial | Phase 6_2 Step 1 |
| Phase 6_2 Step 5 | Pass remedial | COMPLETION ✓ |

---

## 💯 Scoring Summary

### Main Step Scoring (Phase 3-6)
```
Type: Multiple interactions per step
Interaction scoring: 
  - CEFR-based: 1-5 points per interaction
  - Task-based: +1 per correct answer/match

Total per step: 10-21 points (varies)
```

### Remedial Scoring
```
Type: Task-based remedial activities
Scoring:
  - Each correct answer/match: +1 point
  - Each CEFR-level submission: 1-5 points

Total per remedial: 3-54 points (depends on level)
Pass: 60-80% threshold (varies by level/phase)
```

### On Each Correct Answer
- **Matching/Multiple Choice**: +1 point immediately
- **Written Response**: 1-5 points based on CEFR assessment
- **Game-based Task**: +1 on completion/achievement
- **Cumulative**: Points add up across all tasks in remedial

---

## 📊 Example: Complete Phase 5 Step 1 Journey

### Main Assessment
```
User attempts Phase 5 Step 1
- Int 1 (Wordshake): 1 point (completion)
- Int 2 (Solution): 3 points (B1 level)
- Int 3 (Sushi Spell): 1 point (completion)
+ Other interactions: 5 points
Total: ~10 points
```

### Routing Decision
```
Total: 10 points
10 >= 19? NO
10 >= 16? NO
10 >= 12? NO
10 >= 7? YES
→ Routed to Remedial A1
```

### Remedial A1 Activity
```
Task A: Verb matching (8 items, +1 each)
- User gets 6 correct = 6 points

Task B: Sentence building (8 items, +1 each)
- User gets 5 correct = 5 points

Task C: Multiple choice (8 items, +1 each)
- User gets 4 correct = 4 points

Total Remedial Score: 15 points
Required to Pass: 18 points
Status: Need to retry ✗
```

### Retry Attempt
```
User retakes Remedial A1
Task A: 7 correct = 7 points
Task B: 6 correct = 6 points
Task C: 5 correct = 5 points
+ Other tasks: 3 points
Total: 21 points
Required: 18 points
Status: PASS ✓

Routes to: Phase 5 Step 3
```

---

## 🎓 Key Points to Remember

1. **Phase Progression**: 9 phases total (1, 2, 3, 4, 4_2, 5, 5_2, 6, 6_2)

2. **Scoring Types**:
   - Direct: +1 per correct answer/match
   - CEFR-based: 1-5 points per response
   - Hybrid: Combination of both

3. **Remedial System**:
   - Triggered when main step score below threshold
   - Task count increases by difficulty (A1: fewer, C1: more)
   - Pass thresholds: 60-80% depending on level
   - Unlimited retries allowed

4. **Maximum Possible**:
   - Phase 3 Step 1: 21 points
   - Phase 4+ Step 1: 21 points
   - Phase 4+ Steps 3,4,5: 15 points each
   - Remedial A1 (Step 1): 22 points
   - Remedial C1 (Step 1): 54 points

5. **Success Factors**:
   - Early levels (A1/A2) require correct matching/selection
   - Higher levels (B2/C1) require quality writing assessment
   - Each correct task = +1
   - CEFR assessments provide flexibility (1-5 scale)
