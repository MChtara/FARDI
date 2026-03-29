# COMPLETE FARDI ROUTING ARCHITECTURE - FULL JOURNEY

## Overview
This document provides the **complete routing architecture** for the entire FARDI language learning platform, showing how users progress from Phase 1 through Phase 6_2, including all steps and remedials.

---

## Complete Phase Progression Flow

```
START (Registration/Login)
  ↓
[PHASE 1] - Initial Assessment & Introduction
  ↓
[PHASE 2] - Guided Activities (Steps 1-5 with remedials)
  ↓
[PHASE 3] - Sponsorship & Budgeting (Steps 1-4 with remedials)
  ↓
[PHASE 4] - Marketing & Promotion (Steps 1, 3, 4, 5 with remedials)
  ↓
[PHASE 4_2] - Marketing Part 2 (Steps 1, 3, 4, 5 with remedials)
  ↓
[PHASE 5] - Execution & Problem-Solving (Steps 1, 3, 4, 5 with remedials)
  ↓
[PHASE 5_2] - Execution Part 2 (Steps 1, 3, 4, 5 with remedials)
  ↓
[PHASE 6] - Reflection & Evaluation (Steps 1, 3, 4, 5 with remedials)
  ↓
[PHASE 6_2] - Reflection Part 2 (Steps 1, 3, 4, 5 with remedials)
  ↓
COMPLETION 🎉
```

---

## PHASE 1 - Initial Assessment & Introduction

### Overview
- **Purpose**: Initial CEFR assessment and platform introduction
- **Entry Point**: `/app/phase1` or `/app/assessment`
- **Structure**: Dialogue-based assessment with NPCs
- **Outcome**: Determines initial CEFR level (A1-C1)

### Routing
- **Complete Phase 1 Assessment** → Routes to `/app/phase2`
- **No remedials** in Phase 1 (diagnostic only)

---

## PHASE 2 - Guided Activities

### Overview
- **Purpose**: Game event planning and vocabulary building
- **Entry Point**: `/app/phase2` (from Phase 1)
- **Structure**: 5 steps with remedial activities
- **API Endpoints**: Defined in `api_routes.py` and models/game_data.py

### Steps Structure
```
Phase 2 Step 1 → Remedial (if needed) → Pass → Step 2
Phase 2 Step 2 → Remedial (if needed) → Pass → Step 3
Phase 2 Step 3 → Remedial (if needed) → Pass → Step 4
Phase 2 Step 4 → Remedial (if needed) → Pass → Step 5
Phase 2 Step 5 → Remedial (if needed) → Pass → PHASE 3
```

### Phase 2 Characteristics
- Each step has specific point thresholds
- Remedial activities based on performance
- Pass thresholds defined in `PHASE_2_SUCCESS_THRESHOLD`
- Routes to Phase 3 after completing all steps

---

## PHASE 3 - Sponsorship & Budgeting

### Overview
- **Purpose**: Financial planning and sponsorship activities
- **Entry Point**: `/app/phase3` (from Phase 2)
- **Structure**: 4 steps (Steps 1, 2, 3, 4) with remedials
- **API Endpoints**: `POST /api/phase3/step/{step_id}/calculate-score`

### Phase 3 Step 1
**Entry Point**: `/app/phase3/step/1`

**Interactions**:
- Interaction 1: Matching (max 8 points)
- Interaction 2: Word Finding (max 8 points)
- Interaction 3: CEFR Writing (max 5 points)
- **Total**: 21 points max

**Routing Logic**:
```
if total_score < 12: → Remedial A1
if total_score < 18: → Remedial A2
if total_score < 22: → Remedial B1
if total_score < 26: → Remedial B2
if total_score >= 26: → Remedial C1
```

**Remedial Pass** → Routes to `/app/phase3/step/2`

---

### Phase 3 Step 2
**Entry Point**: `/app/phase3/step/2`

**Interactions**:
- Interaction 1: Matching (max 10 points)
- Interaction 2: Matching (max 8 points)
- Interaction 3: Matching (max 5 points)
- **Total**: 23 points max

**Routing Logic**:
```
if total_score < 8:  → Remedial A1
if total_score < 13: → Remedial A2
if total_score < 18: → Remedial B1
if total_score < 21: → Remedial B2
if total_score >= 21: → Remedial C1
```

**Remedial Pass** → Routes to `/app/phase3/step/3`

---

### Phase 3 Step 3
**Entry Point**: `/app/phase3/step/3`

**Interactions**:
- Interaction 1: Guided Explanation (max 8 points)
- Interaction 2: Sentence Transformation (max 5 points)
- Interaction 3: Justification (CEFR 1-5)
- **Total**: 18 points max

**Routing Logic**:
```
if total_score < 6:  → Remedial A1
if total_score < 11: → Remedial A2
if total_score < 14: → Remedial B1
if total_score < 17: → Remedial B2
if total_score >= 17: → Remedial C1
```

**Remedial Pass** → Routes to `/app/phase3/step/4`

---

### Phase 3 Step 4
**Entry Point**: `/app/phase3/step/4`

**Interactions**:
- Interaction 1: Budget Creation (CEFR 1-5)
- Interaction 2: Sponsor Pitch (CEFR 1-5)
- **Total**: 10 points max

**Routing Logic**:
```
if total_score < 2: → Remedial A1
if total_score < 4: → Remedial A2
if total_score < 6: → Remedial B1
if total_score < 8: → Remedial B2
if total_score >= 8: → Remedial C1
```

**Remedial Pass** → Routes to `/app/phase4/step/1` ⭐ **PHASE TRANSITION**

---

## PHASE 4 - Marketing & Promotion

### Phase 4 Step 1
**Entry Point**: `/app/phase4/step/1` (from Phase 3 Step 4 remedials)

**Interactions**: Multiple interactions totaling 21 points max

**Score Calculation**: `POST /api/phase4/step/1/calculate-score`

**Routing Logic**:
```
if total_score < 7:  → Remedial A1
if total_score < 12: → Remedial A2
if total_score < 16: → Remedial B1
if total_score < 19: → Remedial B2
if total_score >= 19: → Remedial C1
```

**Remedials**:
- A1: 22pts (≥18) → `/app/phase4/step/3`
- A2: 22pts (≥18) → `/app/phase4/step/3`
- B1: 39pts (≥22 required) → `/app/phase4/step/3`
- B2: 44pts (≥35) → `/app/phase4/step/3`
- C1: 54pts (≥43) → `/app/phase4/step/3`

---

### Phase 4 Step 3
**Entry Point**: `/app/phase4/step/3`

**Interactions**: 3 CEFR interactions (1-5 each), max 15 total

**Score Calculation**: `POST /api/phase4/step/3/calculate-score`

**Routing Logic**:
```
if total_score < 4:  → Remedial A1
if total_score < 7:  → Remedial A2
if total_score < 10: → Remedial B1
if total_score < 13: → Remedial B2
if total_score >= 13: → Remedial C1
```

**All Remedials** → Routes to `/app/phase4/step/4`

---

### Phase 4 Step 4
**Entry Point**: `/app/phase4/step/4`

**Interactions**: 3 CEFR interactions (1-5 each), max 15 total

**Routing Logic**: Same as Step 3

**Remedials**:
- A1: 22pts (≥18) → `/app/phase4/step/5`
- A2: 21pts (≥18) → `/app/phase4/step/5`
- B1: 38pts (≥22) → `/app/phase4/step/5`
- B2: 32pts (≥26) → `/app/phase4/step/5`
- C1: 26pts (≥21) → `/app/phase4/step/5`

---

### Phase 4 Step 5
**Entry Point**: `/app/phase4/step/5`

**Interactions**: 3 AI-scored CEFR (1-5 each), max 15 total

**Routing Logic**: Same as Steps 3 & 4

**Remedials** → **ALL ROUTE TO PHASE 4_2**:
- A1: 22pts (≥17) → `/app/phase4_2` ⭐
- A2: 22pts (≥18) → `/app/phase4_2` ⭐
- B1: 39pts (≥22) → `/app/phase4_2` ⭐
- B2: 44pts (≥35) → `/app/phase4_2` ⭐
- C1: 54pts (≥43) → `/app/phase4_2` ⭐

---

## PHASE 4_2 - Marketing Part 2

### Structure
Same as Phase 4 (Steps 1, 3, 4, 5 with remedials)

### Phase Transition
- **Phase 4_2 Step 5 Remedials** → Routes to `/app/phase5` ⭐

---

## PHASE 5 - Execution & Problem-Solving

### Structure
Same architecture as Phase 4 (Steps 1, 3, 4, 5 with remedials)

### API Endpoints
- `POST /api/phase5/step/1/calculate-score`
- `POST /api/phase5/step/3/calculate-score`
- `POST /api/phase5/step/4/calculate-score`
- `POST /api/phase5/step/5/calculate-score`

### Phase Transition
- **Phase 5 Step 5 Remedials** → Routes to `/app/phase5_2` ⭐

---

## PHASE 5_2 - Execution Part 2

### Structure
Same as Phase 5 (Steps 1, 3, 4, 5 with remedials)

### Phase Transition
- **Phase 5_2 Step 5 Remedials** → Routes to `/app/phase6` ⭐

---

## PHASE 6 - Reflection & Evaluation

### Structure
Same architecture as Phases 4 and 5 (Steps 1, 3, 4, 5 with remedials)

### API Endpoints
- `POST /api/phase6/step/1/calculate-score`
- `POST /api/phase6/step/3/calculate-score`
- `POST /api/phase6/step/4/calculate-score`
- `POST /api/phase6/step/5/calculate-score`

### Phase Transition
- **Phase 6 Step 5 Remedials** → Routes to `/app/phase6_2` ⭐

---

## PHASE 6_2 - Reflection Part 2

### Structure
Same as Phase 6 (Steps 1, 3, 4, 5 with remedials)

### Final Destination
- **Phase 6_2 Step 5 Remedials** → Routes to `/app/completion` 🎉

---

## Complete Phase Transition Summary

| From Phase | From Location | To Phase | Entry Point | Note |
|------------|---------------|----------|-------------|------|
| Phase 1 | Assessment Complete | Phase 2 | `/app/phase2` | Initial assessment |
| Phase 2 | Step 5 Complete | Phase 3 | `/app/phase3` | Guided activities done |
| Phase 3 | Step 4 Remedial Pass | Phase 4 | `/app/phase4/step/1` | Budgeting complete |
| Phase 4 | Step 5 Remedial Pass | Phase 4_2 | `/app/phase4_2` | Marketing Part 1 done |
| Phase 4_2 | Step 5 Remedial Pass | Phase 5 | `/app/phase5` | Marketing complete |
| Phase 5 | Step 5 Remedial Pass | Phase 5_2 | `/app/phase5_2` | Execution Part 1 done |
| Phase 5_2 | Step 5 Remedial Pass | Phase 6 | `/app/phase6` | Execution complete |
| Phase 6 | Step 5 Remedial Pass | Phase 6_2 | `/app/phase6_2` | Reflection Part 1 done |
| Phase 6_2 | Step 5 Remedial Pass | COMPLETION | `/app/completion` | 🎉 PROGRAM COMPLETE! |

---

## Visual Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 1                                 │
│                   Initial Assessment                            │
├─────────────────────────────────────────────────────────────────┤
│ Dialogue-based CEFR assessment with NPCs                       │
│ Determines initial level (A1-C1)                               │
│ No remedials (diagnostic only)                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 2                                 │
│                    Guided Activities                            │
├─────────────────────────────────────────────────────────────────┤
│ Step 1 → Remedial → Step 2 → Remedial → Step 3                │
│ → Remedial → Step 4 → Remedial → Step 5 → Remedial             │
│ Game event planning & vocabulary                                │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 3                                 │
│                Sponsorship & Budgeting                          │
├─────────────────────────────────────────────────────────────────┤
│ Step 1 → Remedial (A1-C1) → Step 2                            │
│ Step 2 → Remedial (A1-C1) → Step 3                            │
│ Step 3 → Remedial (A1-C1) → Step 4                            │
│ Step 4 → Remedial (A1-C1) → PHASE 4 ⭐                        │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 4                                 │
│                  Marketing & Promotion                          │
├─────────────────────────────────────────────────────────────────┤
│ Step 1 (21pts) → Remedial (A1-C1) → Step 3                    │
│ Step 3 (15pts) → Remedial (A1-C1) → Step 4                    │
│ Step 4 (15pts) → Remedial (A1-C1) → Step 5                    │
│ Step 5 (15pts) → Remedial (A1-C1) → PHASE 4_2 ⭐             │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 4_2                                │
│               Marketing & Promotion Part 2                      │
├─────────────────────────────────────────────────────────────────┤
│ Same structure as Phase 4                                       │
│ Step 1 → 3 → 4 → 5 (all with remedials)                       │
│ Step 5 Remedial → PHASE 5 ⭐                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 5                                 │
│              Execution & Problem-Solving                        │
├─────────────────────────────────────────────────────────────────┤
│ Same structure as Phase 4                                       │
│ Step 1 → 3 → 4 → 5 (all with remedials)                       │
│ Step 5 Remedial → PHASE 5_2 ⭐                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 5_2                                │
│           Execution & Problem-Solving Part 2                    │
├─────────────────────────────────────────────────────────────────┤
│ Same structure as Phase 5                                       │
│ Step 1 → 3 → 4 → 5 (all with remedials)                       │
│ Step 5 Remedial → PHASE 6 ⭐                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 6                                 │
│               Reflection & Evaluation                           │
├─────────────────────────────────────────────────────────────────┤
│ Same structure as Phases 4 & 5                                  │
│ Step 1 → 3 → 4 → 5 (all with remedials)                       │
│ Step 5 Remedial → PHASE 6_2 ⭐                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 6_2                                │
│            Reflection & Evaluation Part 2                       │
├─────────────────────────────────────────────────────────────────┤
│ Same structure as Phase 6                                       │
│ Step 1 → 3 → 4 → 5 (all with remedials)                       │
│ Step 5 Remedial → COMPLETION 🎉                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    🎉 COMPLETION 🎉
```

---

## Complete FARDI Journey Statistics

### Total Phases: 9
1. Phase 1 (Assessment)
2. Phase 2 (Guided Activities - 5 steps)
3. Phase 3 (Sponsorship - 4 steps)
4. Phase 4 (Marketing - 4 steps)
5. Phase 4_2 (Marketing Part 2 - 4 steps)
6. Phase 5 (Execution - 4 steps)
7. Phase 5_2 (Execution Part 2 - 4 steps)
8. Phase 6 (Reflection - 4 steps)
9. Phase 6_2 (Reflection Part 2 - 4 steps)

### Total Steps
- Phase 1: 1 assessment (no steps)
- Phase 2: 5 steps
- Phase 3: 4 steps (Steps 1, 2, 3, 4)
- Phases 4, 4_2, 5, 5_2, 6, 6_2: 4 steps each × 6 phases = 24 steps (Steps 1, 3, 4, 5)
- **Grand Total**: 33 steps

### Total Remedials
- Phase 2: Varies by step
- Phase 3: 4 steps × 5 levels = 20 possible remedials
- Phases 4-6_2: 24 steps × 5 levels = 120 possible remedials
- **Grand Total**: 140+ possible remedials

### Phase Transitions
1. Phase 1 → Phase 2
2. Phase 2 → Phase 3
3. Phase 3 → Phase 4
4. Phase 4 → Phase 4_2
5. Phase 4_2 → Phase 5
6. Phase 5 → Phase 5_2
7. Phase 5_2 → Phase 6
8. Phase 6 → Phase 6_2
9. Phase 6_2 → COMPLETION

**Total Transitions**: 9

---

## API Endpoints Summary

### Phase 1
- Assessment routes in `api_routes.py`
- No score calculation endpoints (diagnostic)

### Phase 2
- Defined in `api_routes.py` and `models/game_data.py`
- Uses `PHASE_2_STEPS`, `PHASE_2_REMEDIAL_ACTIVITIES`

### Phase 3
- `POST /api/phase3/step/{step_id}/calculate-score`
- `POST /api/phase3/remedial/evaluate`
- Endpoints for Steps 1, 2, 3, 4

### Phases 4, 4_2 (shared endpoints)
- `POST /api/phase4/step/1/calculate-score`
- `POST /api/phase4/step/3/calculate-score`
- `POST /api/phase4/step/4/calculate-score`
- `POST /api/phase4/step/5/calculate-score`
- 20 remedial endpoints (5 levels × 4 steps)

### Phases 5, 5_2 (shared endpoints)
- `POST /api/phase5/step/1/calculate-score`
- `POST /api/phase5/step/3/calculate-score`
- `POST /api/phase5/step/4/calculate-score`
- `POST /api/phase5/step/5/calculate-score`
- 20 remedial endpoints (5 levels × 4 steps)

### Phases 6, 6_2 (shared endpoints)
- `POST /api/phase6/step/1/calculate-score`
- `POST /api/phase6/step/3/calculate-score`
- `POST /api/phase6/step/4/calculate-score`
- `POST /api/phase6/step/5/calculate-score`
- 20 remedial endpoints (5 levels × 4 steps)

**Total Unique Endpoints**: 72+ (24 score calculations + 60+ remedial evaluations + Phase 1-3 endpoints)

---

## Key Architecture Principles

1. **Progressive Difficulty**: Phases increase in complexity from 1 to 6_2
2. **Consistent Structure**: Phases 4-6_2 use identical architecture (Steps 1, 3, 4, 5)
3. **CEFR-Based**: All routing based on Common European Framework of Reference
4. **Mandatory Remedials**: Users must complete remedials to progress
5. **80% Pass Threshold**: Remedials use ~80% threshold
6. **Score Privacy**: Scores internal only, never shown to users
7. **Linear Progression**: Must complete phases in order (1→2→3→4→4_2→5→5_2→6→6_2)
8. **No Backtracking**: Cannot return to previous phases
9. **Retry Logic**: Failed remedials allow retry before moving forward
10. **Completion Certificate**: Finish Phase 6_2 for full FARDI completion

---

## User Journey Example: Complete FARDI

**Phase 1** (Assessment):
- Takes initial CEFR assessment → Scores B1 level → Routes to Phase 2

**Phase 2** (Guided Activities):
- Completes Steps 1-5 with remedials → Routes to Phase 3

**Phase 3** (Sponsorship):
- Step 1: Scores 19/21 → Remedial A2 → Pass → Step 2
- Step 2: Scores 15/23 → Remedial B1 → Pass → Step 3
- Step 3: Scores 12/18 → Remedial A2 → Pass → Step 4
- Step 4: Scores 7/10 → Remedial B2 → Pass → **Routes to Phase 4**

**Phase 4** (Marketing):
- Completes all 4 steps with B2 level remedials
- Step 5 Remedial B2 Pass → **Routes to Phase 4_2**

**Phase 4_2** (Marketing Part 2):
- Improves to C1 level performance
- Step 5 Remedial C1 Pass → **Routes to Phase 5**

**Phase 5** (Execution):
- Maintains C1 level
- Step 5 Remedial C1 Pass → **Routes to Phase 5_2**

**Phase 5_2** (Execution Part 2):
- Consistent C1 performance
- Step 5 Remedial C1 Pass → **Routes to Phase 6**

**Phase 6** (Reflection):
- Excellent C1 mastery
- Step 5 Remedial C1 Pass → **Routes to Phase 6_2**

**Phase 6_2** (Reflection Part 2):
- Final C1 demonstration
- Step 5 Remedial C1 Pass → **COMPLETION!** 🎉

**Total Journey**:
- Completed 9 phases
- 33+ steps
- 30+ remedials
- Progressed from B1 to C1 level
- Achieved full CEFR language proficiency

---

## Summary

The FARDI platform provides a **complete, structured language learning journey** from initial assessment to final mastery:

- **Phase 1**: Diagnostic assessment
- **Phase 2**: Foundational guided activities
- **Phase 3**: Application through sponsorship & budgeting
- **Phases 4-6_2**: Advanced application with consistent architecture
- **Completion**: Full CEFR proficiency achievement

This comprehensive routing ensures systematic progression, thorough assessment, and measurable language development from A1 to C1 levels.
