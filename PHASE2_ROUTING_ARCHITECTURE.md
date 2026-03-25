# Phase 2 - Routing Architecture Documentation

## Overview
This document describes the complete routing architecture for Phase 2, including scoring systems, thresholds, and progression logic.

## Quick Reference: All Steps Comparison

| Step | Theme | Interactions | Scoring Type | Next on Pass | Remedial Levels |
|------|-------|--------------|--------------|--------------|-----------------|
| **Step 1** | Assigning Roles | 5 (Storytelling, Roles, Negotiation, Confirmation, Reflection) | Fixed (A1=1, A2=2, B1=3, B2=4) | → Step 2 | A1 (21pts), A2 (21pts), B1 (21pts) |
| **Step 2** | Scheduling Meetings | 5 (Proposal, Purpose, Negotiation, Agenda, Confirmation) | Fixed (A1=1, A2=2, B1=3, B2=4) | → Step 3 | A1 (21pts), A2 (21pts), B1 (21pts) |
| **Step 3** | Planning Tasks | 5 (Proposal, Purpose, Negotiation, Assignment, Listening) | Fixed (A1=1, A2=2, B1=3, B2=4) | → Step 4 | A1 (222pts hybrid), A2 (400pts AI), B1 (400pts AI) |
| **Step 4** | Final Writing | 5 (Role Summary, Schedule, Tasks, Listening, Draft) | Fixed (A1=1, A2=2, B1=3, B2=4) | → **Phase 3** | A1 (216pts hybrid), A2 (400pts AI), B1 (400pts AI) |

### Remedial Scoring Patterns

| Steps | A1 Max | A2 Max | B1 Max | Scoring Method |
|-------|--------|--------|--------|----------------|
| **1 & 2** | 21 | 21 | 21 | Fixed gap-fill & matching |
| **3 & 4** | 222/216 | 400 | 400 | Hybrid (fixed + AI) / All AI |

---

## Step 1: Assigning Roles

### Main Interactions (5 total)

Each interaction is assessed and scored based on CEFR level:

| Interaction | Description | Scoring |
|------------|-------------|---------|
| 1. Storytelling Introduction | Share Phase 1 experience | A1=1, A2=2, B1=3, B2=4 |
| 2. Role Suggestion | Suggest team member for decoration | A1=1, A2=2, B1=3, B2=4 |
| 3. Peer Negotiation | Negotiate role assignment | A1=1, A2=2, B1=3, B2=4 |
| 4. Role Confirmation | Confirm final roles | A1=1, A2=2, B1=3, B2=4 |
| 5. Team Reflection | Reflect on role assignments | A1=1, A2=2, B1=3, B2=4 |

**Maximum Score:** 5 interactions × 4 points = **20 points**

### Routing Logic After Step 1

```
Total Score < 10  → Remedial A1
Total Score < 15  → Remedial A2
Total Score < 20  → Remedial B1
Total Score = 20  → Direct to Step 2 (no remedial needed)
```

**Implementation:** See `determine_phase2_user_level()` in `/backend/routes/api_routes.py:1581`

---

## Remedial Activities

Each remedial level contains 4 activities (A, B, C, D). Students must pass each activity with **50% or higher** to proceed.

### Remedial A1 - Basic Support

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | drag_and_drop | 6 | 3 | Match 6 event roles to descriptions |
| B | gap_fill | 6 | 3 | Fill in 6 gaps about roles |
| C | dialogue_completion | 3 | 2 | Fill in 3 dialogue gaps |
| D | writing | 6 | 3 | Write 6 short sentences |

**Total A1 Max Score:** 6 + 6 + 3 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 A1 activities → Advance to A2

---

### Remedial A2 - Elementary Support

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | dialogue_completion | 3 | 2 | Practice suggesting roles (3 gaps) |
| B | sentence_expansion | 6 | 3 | Rewrite 6 sentences with details |
| C | gap_fill_story | 6 | 3 | Fill 6 gaps in action plan story |
| D | writing | 6 | 3 | Write 6 sentences about assignments |

**Total A2 Max Score:** 3 + 6 + 6 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 A2 activities → Advance to B1

---

### Remedial B1 - Intermediate Support

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | negotiation_gap_fill | 3 | 2 | Negotiate roles (3 gaps) |
| B | writing | 6 | 3 | Write 6 sentences confirming roles |
| C | reflection_gap_fill | 6 | 3 | Explain why roles matter (6 gaps) |
| D | writing | 6 | 3 | Describe action plan & cultural impact |

**Total B1 Max Score:** 3 + 6 + 6 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 B1 activities → Advance to Step 2

---

## Remedial Progression System

### Sequential Level Advancement

The system uses **sequential progression** through remedial levels:

```
A1 (all 4 activities) → A2 (all 4 activities) → B1 (all 4 activities) → Next Step
```

### Activity Passing Criteria

For each activity:
- **Pass:** Score ≥ 50% of max_score → Mark as completed, proceed to next activity
- **Fail:** Score < 50% → Must retry same activity

### Level Completion Criteria

After completing all 4 activities in a level:
1. Calculate overall score across all 4 activities
2. Calculate overall percentage: `(total_score / total_max_score) × 100`
3. Check overall performance:
   - **≥ 50%:** Advance to next remedial level (or next step if B1 complete)
   - **< 50% (first time):** Show warning, allow revisiting activities
   - **< 50% (already warned):** Force progression to next level

**Implementation:** See `submit_remedial_activity()` in `/backend/routes/api_routes.py:882`

---

## Important Note: Dynamic vs Fixed Thresholds

⚠️ **The system uses DYNAMIC 50% thresholds, NOT fixed score values!**

The current implementation calculates passing thresholds as **50% of the maximum possible score** for each level. This means:

- **Each activity:** Must score ≥ 50% of its max_score to pass
- **Each level (overall):** Must score ≥ 50% of total max_score across all 4 activities to advance

### Example for Step 1 Remedial A1:
- Total max score: 21 points
- Pass threshold: 50% × 21 = **10.5 points** (rounded to 11)
- This is **flexible** and automatically adjusts if activities change

### Why This Matters:

#### For Steps 1 & 2 (Fixed Scoring):
If you specified fixed thresholds (e.g., "≥19 for A1", "≥21 for A2", "≥29 for B1"), those would be **different** from the current 50% system:

| Step | Level | Total Max | Current (50%) | Your Spec | Difference |
|------|-------|-----------|---------------|-----------|------------|
| 1 & 2 | A1 | 21 | 11 (52%) | 19 (90%) | Much harder! |
| 1 & 2 | A2 | 21 | 11 (52%) | 21 (100%) | Perfect score required! |
| 1 & 2 | B1 | 21 | 11 (52%) | 29 (138%!) | **Impossible!** |

#### For Step 3 (Hybrid Scoring):

Step 3 uses a **different scoring system** with AI evaluation:

| Level | Total Max | Current (50%) | Your Spec | Match? |
|-------|-----------|---------------|-----------|--------|
| A1 | 222 | 111 (50%) | 19 (??) | ⚠️ **Unclear - different scales!** |
| A2 | 400 | 200 (50%) | 320 (80%) | Higher threshold! |
| B1 | 400 | 200 (50%) | Same as A2 | Same as A2 |

**Step 3 Clarification Needed:**
- Your spec says "≥19" for A1, but Step 3 A1 max is 222 points (not 21)
- Your spec says "≥320/400" for A2 and B1, which is **80%** (not 50%)
- This suggests you want **higher thresholds** for Step 3

**Recommendation:**
1. **Steps 1 & 2:** Keep current 50% system (or adjust if needed)
2. **Step 3:** Consider whether 50% or 80% threshold is appropriate for AI-evaluated writing tasks
3. Update backend if you want stricter thresholds

---

## Step 4: Final Writing Activity (Action Plan)

### Main Interactions (5 total)

Each interaction is assessed and scored based on CEFR level:

| Interaction | Description | Scoring |
|------------|-------------|---------|
| 1. Role Summary | Summarize team roles from Step 1 | A1=1, A2=2, B1=3, B2=4 |
| 2. Schedule Summary | Summarize meeting schedule from Step 2 | A1=1, A2=2, B1=3, B2=4 |
| 3. Task Summary | Summarize tasks from Step 3 | A1=1, A2=2, B1=3, B2=4 |
| 4. Plan Listening Comprehension | Comprehend audio action plan summary | A1=1, A2=2, B1=3, B2=4 |
| 5. Action Plan Draft | Write comprehensive action plan (4-5 sentences) | A1=1, A2=2, B1=3, B2=4 |

**Maximum Score:** 5 interactions × 4 points = **20 points**

### Routing Logic After Step 4

```
Total Score < 10  → Remedial A1
Total Score < 15  → Remedial A2
Total Score < 20  → Remedial B1
Total Score = 20  → Complete Phase 2, advance to Phase 3 Step 1
```

### Step 4 Remedial Activities

⚠️ **Note:** Step 4 uses a **HYBRID scoring system** similar to Step 3.

#### Remedial A1

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_drag_drop | 8 points | 4 (50%) | Match 8 action plan items (audio) |
| B | listening_dialogue_gap_fill | ~8 gaps | 4 (50%) | Complete dialogue about plan (audio) |
| C | listening_story_writing | 100 (AI) | 50 (50%) | Write 8-sentence story about plan (AI) |
| D | listening_proposal_writing | 100 (AI) | 50 (50%) | Write 8-sentence proposal (AI) |

**Total A1 Max Score:** 8 + 8 + 100 + 100 = **216 points**
**Overall Pass Threshold:** 50% of 216 = **108 points minimum**

**Note:** Activities C and D use LLM-based evaluation, similar to Step 3.

**Progression:** Complete all 4 A1 activities → Advance to A2

---

#### Remedial A2

⚠️ **All activities use AI/LLM evaluation (0-100 scale)**

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_role_play | 100 (AI) | 50 (50%) | Complete 10-line dialogue (AI evaluated) |
| B | listening_expansion | 100 (AI) | 50 (50%) | Rewrite 8 sentences with details (AI) |
| C | listening_research | 100 (AI) | 50 (50%) | Research & write about cultural element (AI) |
| D | listening_reflection | 100 (AI) | 50 (50%) | Write reflection on action plan (AI) |

**Total A2 Max Score:** 100 + 100 + 100 + 100 = **400 points**
**Overall Pass Threshold:** 50% of 400 = **200 points minimum**

**Your Specification:** ≥320/400 (80%) - **Higher than current 50%!**

**Progression:** Complete all 4 A2 activities → Advance to B1

---

#### Remedial B1

⚠️ **All activities use AI/LLM evaluation (0-100 scale) - Same as A2**

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_role_play | 100 (AI) | 50 (50%) | Complete advanced dialogue (AI evaluated) |
| B | listening_expansion | 100 (AI) | 50 (50%) | Rewrite sentences with expansion (AI) |
| C | listening_research | 100 (AI) | 50 (50%) | Research cultural elements (AI) |
| D | listening_reflection | 100 (AI) | 50 (50%) | Write detailed reflection (AI) |

**Total B1 Max Score:** 100 + 100 + 100 + 100 = **400 points**
**Overall Pass Threshold:** 50% of 400 = **200 points minimum**

**Your Specification:** ≥320/400 (80%) - **Higher than current 50%!**

**Progression:** Complete all 4 B1 activities → Advance to Phase 3 Step 1

---

## AI/LLM Evaluation System

### Overview

Steps 3 and 4 remedial activities use **AI-based evaluation** for writing tasks. This differs from the fixed scoring in Steps 1 and 2.

### How AI Evaluation Works

1. **Student submits** a written response (e.g., 8-sentence story)
2. **Backend sends** the response to an AI service (likely Groq LLM)
3. **AI evaluates** based on:
   - Coverage of guided questions
   - Grammar and vocabulary at target CEFR level (A1, A2, or B1)
   - Coherence and clarity
   - Relevance to context
   - Holistic quality (not literal word matching)

4. **AI returns** a JSON response:
   ```json
   {
     "score": 75,  // 0-100 scale
     "level_alignment": "meets",  // "below" | "meets" | "above"
     "strengths": ["Good vocabulary", "Clear structure"],
     "improvements": ["Work on verb tenses"],
     "feedback": "Your response shows good understanding..."
   }
   ```

### Scoring Scale

- **0-100 points** per activity
- **Pass threshold:** 50 points minimum (50%)
- **Higher thresholds possible:** You specified 80% (≥320/400) for Step 3 A2/B1

### Activities Using AI Evaluation

| Step | Level | Activities Using AI |
|------|-------|-------------------|
| Step 3 | A1 | C, D (story, proposal) = 2/4 |
| Step 3 | A2 | A, B, C, D (all) = 4/4 |
| Step 3 | B1 | A, B, C, D (all) = 4/4 |
| Step 4 | A1 | C, D (story, proposal) = 2/4 |
| Step 4 | A2 | A, B, C, D (all) = 4/4 |
| Step 4 | B1 | A, B, C, D (all) = 4/4 |

### Backend Implementation

The AI evaluation prompt is defined in the `ai_evaluation` field of each activity in `phase2.json`. The backend uses template substitution:

```
{{TASK_INSTRUCTION}} → Replaced with activity instruction
{{GUIDED_QUESTIONS}} → Replaced with guided questions
{{EXAMPLE_ANSWERS}} → Replaced with example answers
{{LEARNER_RESPONSE}} → Replaced with student's actual response
```

**Service:** See `assessment_service.assess_phase2_response()` for AI evaluation logic

---

## Monitoring & Logging

### Console Output Format

When Step 1 is completed, the backend logs:

```
============================================================
[Phase2 Step step_1] Calculating total score...
============================================================
  Interaction 1: Let's start by sharing how our orientati...
    → Level: B1 | Points: 3
  Interaction 2: Let's shape our action plan! Who would b...
    → Level: A2 | Points: 2
  Interaction 3: I think Ryan would be perfect for decora...
    → Level: B2 | Points: 4
  Interaction 4: Confirm the final roles for two team mem...
    → Level: B1 | Points: 3
  Interaction 5: How do these roles help our cultural eve...
    → Level: A1 | Points: 1

  TOTAL SCORE: 13/20
  Completed: 5/5 interactions

[Phase2 Routing Decision]
  Needs Remedial: True
  → Routing to: Remedial A2
  → URL: /app/phase2/remedial/step_1/A2
============================================================
```

### Level Determination Logging

```
[Phase2 Routing] Determining level for score: 13/20
[Phase2 Routing] Score 13 → Level A2
```

---

## Step 2: Scheduling Meetings

### Main Interactions (5 total)

Each interaction is assessed and scored based on CEFR level:

| Interaction | Description | Scoring |
|------------|-------------|---------|
| 1. Meeting Proposal | Suggest meeting time and reason | A1=1, A2=2, B1=3, B2=4 |
| 2. Purpose Explanation | Explain meeting importance | A1=1, A2=2, B1=3, B2=4 |
| 3. Schedule Negotiation | Negotiate meeting time | A1=1, A2=2, B1=3, B2=4 |
| 4. Agenda Setting | Suggest meeting topics | A1=1, A2=2, B1=3, B2=4 |
| 5. Meeting Confirmation | Confirm meeting details | A1=1, A2=2, B1=3, B2=4 |

**Maximum Score:** 5 interactions × 4 points = **20 points**

### Routing Logic After Step 2

```
Total Score < 10  → Remedial A1
Total Score < 15  → Remedial A2
Total Score < 20  → Remedial B1
Total Score = 20  → Direct to Step 3 (no remedial needed)
```

### Step 2 Remedial Activities

#### Remedial A1

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | drag_and_drop | 6 | 3 | Match 6 meeting items to definitions |
| B | gap_fill | 6 | 3 | Fill in 6 gaps about room choice |
| C | dialogue_completion | 3 | 2 | Complete dialogue about duration (3 gaps) |
| D | writing | 6 | 3 | Write 6 sentences about meeting preparation |

**Total A1 Max Score:** 6 + 6 + 3 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 A1 activities → Advance to A2

---

#### Remedial A2

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | dialogue_completion | 3 | 2 | Practice rescheduling (3 gaps) |
| B | sentence_expansion | 6 | 3 | Rewrite 6 sentences explaining breaks |
| C | gap_fill_story | 6 | 3 | Fill 6 gaps about meeting conflict |
| D | writing | 6 | 3 | Write 6 sentences about meeting location |

**Total A2 Max Score:** 3 + 6 + 6 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 A2 activities → Advance to B1

---

#### Remedial B1

| Activity | Type | Max Score | Pass Threshold (50%) | Description |
|----------|------|-----------|---------------------|-------------|
| A | negotiation_gap_fill | 3 | 2 | Negotiate budget meeting (3 gaps) |
| B | writing | 6 | 3 | Write 6 sentences about online meeting |
| C | reflection_gap_fill | 6 | 3 | Reflect on meeting rules (6 gaps) |
| D | writing | 6 | 3 | Write 6 sentences summarizing minutes |

**Total B1 Max Score:** 3 + 6 + 6 + 6 = **21 points**
**Overall Pass Threshold:** 50% of 21 = **11 points minimum**

**Progression:** Complete all 4 B1 activities → Advance to Step 3

---

## Step 3: Planning Tasks

### Main Interactions (5 total)

Each interaction is assessed and scored based on CEFR level:

| Interaction | Description | Scoring |
|------------|-------------|---------|
| 1. Task Proposal | Suggest tasks for event | A1=1, A2=2, B1=3, B2=4 |
| 2. Task Purpose Explanation | Explain task importance | A1=1, A2=2, B1=3, B2=4 |
| 3. Task Negotiation | Negotiate task priorities | A1=1, A2=2, B1=3, B2=4 |
| 4. Task Assignment | Assign tasks to team members | A1=1, A2=2, B1=3, B2=4 |
| 5. Task Listening Comprehension | Comprehend audio task suggestions | A1=1, A2=2, B1=3, B2=4 |

**Maximum Score:** 5 interactions × 4 points = **20 points**

### Routing Logic After Step 3

```
Total Score < 10  → Remedial A1
Total Score < 15  → Remedial A2
Total Score < 20  → Remedial B1
Total Score = 20  → Direct to Step 4 / Final Writing (no remedial needed)
```

### Step 3 Remedial Activities

⚠️ **Note:** Step 3 uses a **HYBRID scoring system** combining fixed scores and AI evaluation.

#### Remedial A1

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_drag_drop | 8 points | 4 (50%) | Match 8 task items to descriptions (audio) |
| B | listening_dialogue_gap_fill | 14 gaps | 7 (50%) | Complete dialogue with 14 blanks (audio) |
| C | listening_story_writing | 100 (AI) | 50 (50%) | Write 8-sentence story (AI evaluated) |
| D | listening_proposal_writing | 100 (AI) | 50 (50%) | Write 8-sentence proposal (AI evaluated) |

**Total A1 Max Score:** 8 + 14 + 100 + 100 = **222 points**
**Overall Pass Threshold:** 50% of 222 = **111 points minimum**

**Note:** Activities C and D use LLM-based evaluation (score 0-100) based on CEFR A1 criteria including coverage, grammar, vocabulary, coherence, and relevance.

**Progression:** Complete all 4 A1 activities → Advance to A2

---

#### Remedial A2

⚠️ **All activities use AI/LLM evaluation (0-100 scale)**

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_role_play | 100 (AI) | 50 (50%) | Complete 10-line dialogue (AI evaluated) |
| B | listening_expansion | 100 (AI) | 50 (50%) | Rewrite 8 sentences with expansion (AI) |
| C | listening_research | 100 (AI) | 50 (50%) | Research & write about Tunisian culture (AI) |
| D | listening_reflection | 100 (AI) | 50 (50%) | Write reflection on cultural tasks (AI) |

**Total A2 Max Score:** 100 + 100 + 100 + 100 = **400 points**
**Overall Pass Threshold:** 50% of 400 = **200 points minimum**

**AI Evaluation Criteria (CEFR A2):**
- Coverage of guided questions
- Grammar and vocabulary at A2 level
- Coherence and clarity
- Relevance to context
- Holistic assessment (not literal word matching)

**Progression:** Complete all 4 A2 activities → Advance to B1

---

#### Remedial B1

⚠️ **All activities use AI/LLM evaluation (0-100 scale) - Same as A2**

| Activity | Type | Max Score | Pass Threshold | Description |
|----------|------|-----------|----------------|-------------|
| A | listening_role_play | 100 (AI) | 50 (50%) | Complete advanced dialogue (AI evaluated) |
| B | listening_expansion | 100 (AI) | 50 (50%) | Rewrite sentences with complex expansion (AI) |
| C | listening_research | 100 (AI) | 50 (50%) | Research & write about cultural elements (AI) |
| D | listening_reflection | 100 (AI) | 50 (50%) | Write detailed cultural reflection (AI) |

**Total B1 Max Score:** 100 + 100 + 100 + 100 = **400 points**
**Overall Pass Threshold:** 50% of 400 = **200 points minimum**

**AI Evaluation Criteria (CEFR B1):**
- Coverage of guided questions
- Grammar and vocabulary at B1 level
- Coherence and clarity
- Relevance and cultural depth
- Holistic assessment with higher expectations than A2

**Progression:** Complete all 4 B1 activities → Advance to Step 4 / Final Writing

---

## Data Source

- **File:** `/phase2.json`
- **Loader:** `/backend/models/phase2_loader.py`
- **Routes:** `/backend/routes/api_routes.py`

---

## Frontend Routes

| URL Pattern | Description |
|------------|-------------|
| `/app/phase2/step/{step_id}` | Main step interface |
| `/app/phase2/remedial/{step_id}/{level}` | Remedial activities interface |
| `/app/phase2/remedial/{step_id}/{level}?activity={index}` | Specific remedial activity |
| `/app/phase2/step/{step_id}/results` | Step results page |
| `/app/phase2/complete` | Phase 2 completion page |

---

## Testing Checklist

### Step 1 Testing
- [ ] Test score calculation for all 5 Step 1 interactions
- [ ] Test routing with score < 10 (should go to A1)
- [ ] Test routing with score 10-14 (should go to A2)
- [ ] Test routing with score 15-19 (should go to B1)
- [ ] Test routing with score = 20 (should skip remedial, go to Step 2)
- [ ] Test Step 1 A1 remedial activity scoring (max 21 points)
- [ ] Test Step 1 A1 → A2 progression
- [ ] Test Step 1 A2 → B1 progression
- [ ] Test Step 1 B1 → Step 2 progression
- [ ] Verify Step 1 console logs appear correctly in terminal

### Step 2 Testing
- [ ] Test score calculation for all 5 Step 2 interactions
- [ ] Test routing with score < 10 (should go to A1)
- [ ] Test routing with score 10-14 (should go to A2)
- [ ] Test routing with score 15-19 (should go to B1)
- [ ] Test routing with score = 20 (should skip remedial, go to Step 3)
- [ ] Test Step 2 A1 remedial activity scoring (max 21 points)
- [ ] Test Step 2 A1 → A2 progression
- [ ] Test Step 2 A2 → B1 progression
- [ ] Test Step 2 B1 → Step 3 progression
- [ ] Verify Step 2 console logs appear correctly in terminal

### Step 3 Testing
- [ ] Test score calculation for all 5 Step 3 interactions
- [ ] Test routing with score < 10 (should go to A1)
- [ ] Test routing with score 10-14 (should go to A2)
- [ ] Test routing with score 15-19 (should go to B1)
- [ ] Test routing with score = 20 (should skip remedial, go to Step 4)
- [ ] Test Step 3 A1 remedial Activity A (8 points - drag/drop)
- [ ] Test Step 3 A1 remedial Activity B (14 points - gap fill)
- [ ] Test Step 3 A1 remedial Activity C (AI eval /100 - story)
- [ ] Test Step 3 A1 remedial Activity D (AI eval /100 - proposal)
- [ ] Test Step 3 A2 remedial (all AI eval - 4 activities)
- [ ] Test Step 3 B1 remedial (all AI eval - 4 activities)
- [ ] Verify AI evaluation returns valid scores (0-100)
- [ ] Verify AI evaluation feedback is appropriate for CEFR level
- [ ] Test Step 3 A1 → A2 progression (max 222 points)
- [ ] Test Step 3 A2 → B1 progression (max 400 points)
- [ ] Test Step 3 B1 → Step 4 progression
- [ ] Verify Step 3 console logs appear correctly in terminal

### Step 4 Testing
- [ ] Test score calculation for all 5 Step 4 interactions
- [ ] Test routing with score < 10 (should go to A1)
- [ ] Test routing with score 10-14 (should go to A2)
- [ ] Test routing with score 15-19 (should go to B1)
- [ ] Test routing with score = 20 (should complete Phase 2, go to Phase 3)
- [ ] Test Step 4 A1 remedial Activity A (8 points - drag/drop)
- [ ] Test Step 4 A1 remedial Activity B (~8 points - gap fill)
- [ ] Test Step 4 A1 remedial Activity C (AI eval /100 - story)
- [ ] Test Step 4 A1 remedial Activity D (AI eval /100 - proposal)
- [ ] Test Step 4 A2 remedial (all AI eval - 4 activities)
- [ ] Test Step 4 B1 remedial (all AI eval - 4 activities)
- [ ] Verify Step 4 completion routes to Phase 3 Step 1
- [ ] Test Phase 2 completion celebration/transition

### General Remedial Testing
- [ ] Test overall performance < 50% warning system (all steps)
- [ ] Test retry mechanism for failed activities (score < 50%)
- [ ] Test force progression after second warning
- [ ] Verify XP awards for remedial completion
- [ ] Test session persistence across activities
- [ ] Test hybrid scoring (fixed + AI) in Steps 3 & 4 A1
- [ ] Verify AI evaluation timeout and error handling
- [ ] Test 80% threshold for Steps 3 & 4 A2/B1 (if implemented)

---

## Notes

- **User Privacy:** CEFR levels and scores are **never shown to users** in the UI
- **Monitoring Only:** All scores and levels are logged to terminal/console for admin monitoring
- **Feedback Style:** Users receive thematic, encouraging feedback via character avatars
- **AI Detection:** Responses are checked for AI-generated content; flagged responses may be rejected

---

*Last Updated: 2026-03-25*
*Implemented By: Claude Agent*
