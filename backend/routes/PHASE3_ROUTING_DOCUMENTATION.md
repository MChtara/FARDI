# Phase 3 - Routing Logic & Scoring Architecture

## 🎯 Global Rules
- **Scores are NOT shown to the user**
- **Scores are only displayed in the terminal/logs for monitoring purposes**

---

## 🔹 Phase 3 — Step 1: Main Assessment

### Scoring Breakdown

#### Interaction 1: Matching Exercise
- **Max Score:** 8 points
- **Scoring:** +1 per correct match
- **Description:** Each item matched correctly earns 1 point

#### Interaction 2: Word Finding Exercise
- **Max Score:** 8 points
- **Scoring:** +1 per word targeted found
- **Description:** Each target word found correctly earns 1 point

#### Interaction 3: CEFR Writing Assessment
- **Max Score:** 5 points
- **Scoring based on CEFR level:**
  - A1 = 1 point
  - A2 = 2 points
  - B1 = 3 points
  - B2 = 4 points
  - C1 = 5 points

### Total Score Calculation
```
total_score = interaction1_score + interaction2_score + interaction3_score
Maximum possible: 21 points (8 + 8 + 5)
```

---

## 🔹 Phase 3 — Step 2: Main Assessment

### Scoring Breakdown

#### Interaction 1: Matching Exercise
- **Max Score:** 10 points
- **Scoring:** +1 per correct match
- **Description:** Each item matched correctly earns 1 point

#### Interaction 2: Matching Exercise
- **Max Score:** 8 points
- **Scoring:** +1 per matched one correctly
- **Description:** Each match correctly earns 1 point

#### Interaction 3: Matching Exercise
- **Max Score:** 5 points
- **Scoring:** +1 per matched one correctly
- **Description:** Each match correctly earns 1 point

### Total Score Calculation
```
total_score = interaction1_score + interaction2_score + interaction3_score
Maximum possible: 23 points (10 + 8 + 5)
```

---

## 🔀 Routing Logic

### Based on Total Score from Step 1

| Total Score Range | Remedial Level | Route To |
|-------------------|----------------|----------|
| 0 - 11            | A1             | `/app/phase3/step/1/remedial/a1/task/a` |
| 12 - 17           | A2             | `/app/phase3/step/1/remedial/a2/task/a` |
| 18 - 21           | B1             | `/app/phase3/step/1/remedial/b1/task/a` |
| 22 - 25           | B2             | `/app/phase3/step/1/remedial/b2/task/a` |
| 26 - 30           | C1             | `/app/phase3/step/1/remedial/c1/task/a` |

**Note:** Maximum achievable is 21, so scores 22-30 are theoretical but included in the routing logic as specified.

### Based on Total Score from Step 2

| Total Score Range | Remedial Level | Route To |
|-------------------|----------------|----------|
| 0 - 7             | A1             | `/app/phase3/step/2/remedial/a1/task/a` |
| 8 - 12            | A2             | `/app/phase3/step/2/remedial/a2/task/a` |
| 13 - 17           | B1             | `/app/phase3/step/2/remedial/b1/task/a` |
| 18 - 20           | B2             | `/app/phase3/step/2/remedial/b2/task/a` |
| 21 - 23           | C1             | `/app/phase3/step/2/remedial/c1/task/a` |

## 🔹 Phase 3 — Step 3: Main Assessment

### Scoring Breakdown

#### Interaction 1: Guided Explanation (Text Selection)
- **Max Score:** 8 points
- **Scoring:** +1 per correct selection
- **Description:** Each correct selection earns 1 point

#### Interaction 2: Sentence Transformation (Grammar)
- **Max Score:** 5 points
- **Scoring:** +1 per correct combination
- **Description:** Each correct grammar combination earns 1 point

#### Interaction 3: Justification Practice (AI-Scored)
- **Max Score:** 5 points
- **Scoring based on CEFR level:**
  - A1 = 1 point
  - A2 = 2 points
  - B1 = 3 points
  - B2 = 4 points
  - C1 = 5 points

### Total Score Calculation
```
total_score = interaction1_score + interaction2_score + interaction3_score
Maximum possible: 18 points (8 + 5 + 5)
```

### Based on Total Score from Step 3

| Total Score Range | Remedial Level | Route To |
|-------------------|----------------|----------|
| 0 - 5             | A1             | `/app/phase3/step/3/remedial/a1/task/a` |
| 6 - 10            | A2             | `/app/phase3/step/3/remedial/a2/task/a` |
| 11 - 13           | B1             | `/app/phase3/step/3/remedial/b1/task/a` |
| 14 - 16           | B2             | `/app/phase3/step/3/remedial/b2/task/a` |
| 17 - 18           | C1             | `/app/phase3/step/3/remedial/c1/task/a` |

---

## 🔸 Remedial Level Requirements

### Step 1 Remedial Requirements

### Remedial A1
- **Task A:** Match (4 items) → +1 per correct (max 4)
- **Task B:** Gap-fill (4 items) → +1 per correct (max 4)
- **Total Max Score:** 8 points
- **Pass Condition:** `total_remedial_score >= 6` (75% threshold)
- **If Pass:** Proceed to Step 2
- **If Fail:** Retry remedial

### Remedial A2
- **Task A:** Correct sentence +1 (multiple sentences)
- **Pass Condition:** `total_remedial_score >= 80% of max_score`
- **If Pass:** Proceed to Step 2
- **If Fail:** Retry remedial

### Remedial B1
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 2` (A2 level or higher)
- **If Pass:** Proceed to Step 2
- **If Fail:** Retry remedial

### Remedial B2
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 3` (B1 level or higher)
- **If Pass:** Proceed to Step 2
- **If Fail:** Retry remedial

### Remedial C1
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 4` (B2 level or higher)
- **If Pass:** Proceed to Step 2
- **If Fail:** Retry remedial

### Step 2 Remedial Requirements

### Remedial A1 (Step 2)
- **Task A:** Placement exercise → +1 per correct placement (max 8)
- **Pass Condition:** `remedial_score >= 6` (75% threshold)
- **If Pass:** Proceed to Step 3
- **If Fail:** Retry remedial

### Remedial A2 (Step 2)
- **Task B:** Placement exercise → +1 per correct placement (max 10)
- **Pass Condition:** `remedial_score >= 8` (80% threshold)
- **If Pass:** Proceed to Step 3
- **If Fail:** Retry remedial

### Remedial B1 (Step 2)
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 2` (A2 level or higher)
- **If Pass:** Proceed to Step 3
- **If Fail:** Retry remedial

### Remedial B2 (Step 2)
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 3` (B1 level or higher)
- **If Pass:** Proceed to Step 3
- **If Fail:** Retry remedial

### Remedial C1 (Step 2)
- **Task A:** CEFR-scored writing (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `total_remedial_score >= 4` (B2 level or higher)
- **If Pass:** Proceed to Step 3
- **If Fail:** Retry remedial

### Step 3 Remedial Requirements

### Remedial A1 (Step 3)
- **Task:** Sentence Building (Word Reordering)
- **Max Score:** 5 points
- **Scoring:** +1 per correct reordering
- **Pass Condition:** `remedial_score >= 3` (60% threshold)
- **If Pass:** Proceed to Step 4
- **If Fail:** Retry remedial

### Remedial A2 (Step 3)
- **Task:** Gap Fill with "because"/"so" (10 blanks)
- **Max Score:** 10 points
- **Scoring:** +1 per correct blank
- **Pass Condition:** `remedial_score >= 8` (80% threshold)
- **If Pass:** Proceed to Step 4
- **If Fail:** Retry remedial

### Remedial B1 (Step 3)
- **Task:** Short Justification (5+ sentences, 50 char min)
- **Scoring:** AI evaluated CEFR (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `remedial_score >= 2` (A2 level or higher)
- **If Pass:** Proceed to Step 4
- **If Fail:** Retry remedial

### Remedial B2 (Step 3)
- **Task:** Structured Explanation - paragraph on 2 costs + comparison (100 char min)
- **Scoring:** AI evaluated CEFR (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `remedial_score >= 3` (B1 level or higher)
- **If Pass:** Proceed to Step 4
- **If Fail:** Retry remedial

### Remedial C1 (Step 3)
- **Task:** Financial Rationale - analysis + realism (150 char min)
- **Scoring:** AI evaluated CEFR (A1=1, A2=2, B1=3, B2=4, C1=5)
- **Pass Condition:** `remedial_score >= 4` (B2 level or higher)
- **If Pass:** Proceed to Step 4
- **If Fail:** Retry remedial

---

## 🔌 API Endpoints

### 1. Calculate Step 1 Score
```
POST /api/phase3/step/<step_id>/calculate-score
```

**Request Body:**
```json
{
  "interaction1_score": 6,
  "interaction2_score": 5,
  "interaction3_score": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "next_url": "/app/phase3/step/1/remedial/b1/task/a",
    "remedial_level": "B1"
  }
}
```

**Terminal Output (Internal Only):**
```
======================================================================
🎯 PHASE 3 STEP 1 - SCORING RESULTS (INTERNAL USE ONLY)
======================================================================
User ID: 12345
Interaction 1 (Matching): 6/8
Interaction 2 (Word Finding): 5/8
Interaction 3 (CEFR Writing): 3/5 (Level: B1)
TOTAL SCORE: 14/21
ROUTING TO: Remedial A2
======================================================================
```

---

### 2. Evaluate Remedial Completion
```
POST /api/phase3/remedial/evaluate
```

**Request Body:**
```json
{
  "level": "A1",
  "step_id": 1,
  "score": 7,
  "max_score": 8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "can_proceed": true,
    "next_url": "/app/phase3/step/2",
    "level": "A1"
  }
}
```

**Terminal Output (Internal Only):**
```
======================================================================
🔸 PHASE 3 REMEDIAL A1 - EVALUATION (INTERNAL USE ONLY)
======================================================================
User ID: 12345
Remedial Score: 7/8
Threshold: 6
CAN PROCEED: ✓ YES - Moving to Step 2
======================================================================
```

---

### 3. Log Interaction Activity
```
POST /api/phase3/interaction/log
```

**Request Body:**
```json
{
  "step": 1,
  "interaction": 1,
  "score": 6,
  "max_score": 8,
  "time_taken": 120,
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interaction logged successfully"
}
```

**Terminal Output (Internal Only):**
```
======================================================================
📊 PHASE 3 STEP 1 - INTERACTION 1 (INTERNAL USE ONLY)
======================================================================
User ID: 12345
Score: 6/8 points
Time Taken: 120 seconds
Completed: true
Success Rate: 75.0%
======================================================================
```

---

### 4. Log Remedial Task Activity
```
POST /api/phase3/remedial/log
```

**Request Body:**
```json
{
  "level": "A1",
  "task": "A",
  "score": 4,
  "max_score": 4,
  "time_taken": 90
}
```

**Response:**
```json
{
  "success": true,
  "message": "Remedial task logged successfully"
}
```

---

## 📊 Example Score Scenarios

### Step 1 Scenarios

#### Scenario 1: Strong Performance (Total: 19)
- Interaction 1: 7/8
- Interaction 2: 7/8
- Interaction 3: 5/5 (C1)
- **Result:** Routes to **Remedial B1**
- **Remedial Requirement:** Score >= 2 (A2 level) to proceed

#### Scenario 2: Weak Performance (Total: 8)
- Interaction 1: 3/8
- Interaction 2: 4/8
- Interaction 3: 1/5 (A1)
- **Result:** Routes to **Remedial A1**
- **Remedial Requirement:** Score >= 6/8 to proceed

#### Scenario 3: Mid-Level Performance (Total: 15)
- Interaction 1: 6/8
- Interaction 2: 6/8
- Interaction 3: 3/5 (B1)
- **Result:** Routes to **Remedial A2**
- **Remedial Requirement:** Score >= 80% to proceed

### Step 2 Scenarios

#### Scenario 1: Strong Performance (Total: 20)
- Interaction 1: 9/10
- Interaction 2: 7/8
- Interaction 3: 4/5
- **Result:** Routes to **Remedial B2**
- **Remedial Requirement:** CEFR score >= 3 (B1 level) to proceed to Step 3

#### Scenario 2: Weak Performance (Total: 6)
- Interaction 1: 3/10
- Interaction 2: 2/8
- Interaction 3: 1/5
- **Result:** Routes to **Remedial A1**
- **Remedial Requirement:** Score >= 6/8 to proceed to Step 3

#### Scenario 3: Mid-Level Performance (Total: 10)
- Interaction 1: 5/10
- Interaction 2: 3/8
- Interaction 3: 2/5
- **Result:** Routes to **Remedial A2**
- **Remedial Requirement:** Score >= 8/10 to proceed to Step 3

#### Scenario 4: Perfect Performance (Total: 23)
- Interaction 1: 10/10
- Interaction 2: 8/8
- Interaction 3: 5/5
- **Result:** Routes to **Remedial C1**
- **Remedial Requirement:** CEFR score >= 4 (B2 level) to proceed to Step 3

### Step 3 Scenarios

#### Scenario 1: High Performance (Total: 17)
- Interaction 1: 7/8 (Guided Explanation)
- Interaction 2: 5/5 (Sentence Transformation)
- Interaction 3: 5/5 (Justification - C1)
- **Result:** Routes to **Remedial C1**
- **Remedial Requirement:** CEFR score >= 4 (B2 level) to proceed to Step 4

#### Scenario 2: Low Performance (Total: 4)
- Interaction 1: 2/8
- Interaction 2: 1/5
- Interaction 3: 1/5 (A1)
- **Result:** Routes to **Remedial A1**
- **Remedial Requirement:** Score >= 3/5 (60%) to proceed to Step 4

#### Scenario 3: Mid-Level Performance (Total: 11)
- Interaction 1: 5/8
- Interaction 2: 3/5
- Interaction 3: 3/5 (B1)
- **Result:** Routes to **Remedial B1**
- **Remedial Requirement:** CEFR score >= 2 (A2 level) to proceed to Step 4

#### Scenario 4: Borderline A2/B1 (Total: 10)
- Interaction 1: 5/8
- Interaction 2: 3/5
- Interaction 3: 2/5 (A2)
- **Result:** Routes to **Remedial A2**
- **Remedial Requirement:** Score >= 8/10 (80%) to proceed to Step 4

---

## 🔐 Privacy & Security

### User-Facing Display
- ❌ **NO SCORES** shown to user
- ✅ Only **encouraging feedback** displayed
- ✅ Navigation happens **automatically** based on routing logic

### Internal Logging (Terminal/Logs Only)
- ✅ Full score breakdown
- ✅ CEFR levels
- ✅ Routing decisions
- ✅ Performance metrics
- ✅ Timestamps and user IDs

---

## 🧪 Testing the Routing Logic

### Test Case 1: A1 Routing
```bash
curl -X POST http://localhost:5010/api/phase3/step/1/calculate-score \
  -H "Content-Type: application/json" \
  -d '{"interaction1_score": 2, "interaction2_score": 3, "interaction3_score": 1}'
```
**Expected:** Routes to A1 (total: 6 < 12)

### Test Case 2: A2 Routing
```bash
curl -X POST http://localhost:5010/api/phase3/step/1/calculate-score \
  -H "Content-Type: application/json" \
  -d '{"interaction1_score": 5, "interaction2_score": 5, "interaction3_score": 2}'
```
**Expected:** Routes to A2 (total: 12 < 18)

### Test Case 3: B1 Routing
```bash
curl -X POST http://localhost:5010/api/phase3/step/1/calculate-score \
  -H "Content-Type: application/json" \
  -d '{"interaction1_score": 7, "interaction2_score": 7, "interaction3_score": 4}'
```
**Expected:** Routes to B1 (total: 18 < 22)

---

## 📝 Implementation Notes

1. **Score Privacy:** All scoring logic happens on the backend. Frontend never receives raw scores unless specifically needed for internal calculations.

2. **Terminal Logging:** All print statements use emojis (🎯, 🔸, 📊, 📝) to distinguish log types in terminal output.

3. **Remedial Retry:** If a student fails remedial, they are routed to a retry URL but the actual retry logic must be implemented in the frontend.

4. **Step 2 Transition:** Once remedial is passed, students automatically proceed to Phase 3 Step 2.

5. **Logger Integration:** All scoring events are logged to the Flask logger for persistent tracking and analytics.

---

## 🔄 Full User Flow

```
[Step 1 - Main Assessment]
         |
         v
[Calculate Score] → total_score computed
         |
         v
[Route to Step 1 Remedial Level]
    (A1/A2/B1/B2/C1)
         |
         v
[Complete Step 1 Remedial Tasks]
         |
         v
[Evaluate Remedial Score]
         |
    Pass? ----No----> [Retry Remedial]
         |
        Yes
         v
[Proceed to Step 2]
         |
         v
[Step 2 - Main Assessment]
         |
         v
[Calculate Score] → total_score computed
         |
         v
[Route to Step 2 Remedial Level]
    (A1/A2/B1/B2/C1)
         |
         v
[Complete Step 2 Remedial Tasks]
         |
         v
[Evaluate Remedial Score]
         |
    Pass? ----No----> [Retry Remedial]
         |
        Yes
         v
[Proceed to Step 3]
```

---

## ⚠️ Important Reminders

- **Never** return scores in user-facing API responses
- **Always** log scores to terminal with "(INTERNAL USE ONLY)" label
- **Ensure** remedial pass conditions match specifications exactly
- **Test** all score thresholds thoroughly before deployment
- **Document** any deviations from the routing logic in code comments
