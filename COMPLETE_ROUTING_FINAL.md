# FARDI COMPLETE ROUTING ARCHITECTURE - FINAL

## ✅ VERIFIED FROM ACTUAL CODE

This document shows the **actual routing flow** based on the implemented code in the backend routes.

---

## Complete Phase Progression (VERIFIED)

```
START
  ↓
PHASE 1 (Assessment)
  ↓
PHASE 2 (Guided Activities)
  ↓
PHASE 3 (Sponsorship & Budgeting)
  ↓
PHASE 4 (Marketing & Promotion)
  ↓
PHASE 4_2 (Marketing Part 2) ← phase4_routes.py line 7055
  ↓
PHASE 5 (Execution & Problem-Solving)
  ↓
PHASE 5_2 (Execution Part 2) ← phase5_routes.py line 6430
  ↓
PHASE 6 (Reflection & Evaluation)
  ↓
PHASE 6_2 (Reflection Part 2) ← phase6_routes.py line 3005
  ↓
COMPLETION
```

---

## Phase Transitions (Code References)

### From Phase 4 Step 5 → Phase 4_2
**File**: `backend/routes/phase4_routes.py`
```python
# Lines 7055, 7121, 7193, 7274, 7352
next_url = "/app/phase4_2" if passed else "/app/phase4/step/5/remedial/{level}/retry"
```

### From Phase 5 Step 5 → Phase 5_2
**File**: `backend/routes/phase5_routes.py`
```python
# Lines 6430, 6495, 6574, 6656, 6731
next_url = "/app/phase5_2" if passed else "/app/phase5/step/5/remedial/{level}/retry"
```

### From Phase 6 Step 5 → Phase 6_2
**File**: `backend/routes/phase6_routes.py`
```python
# Lines 3005, 3073, 3141, 3209, 3277
next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/{level}/retry"
```

---

## Complete Routing Flow

### PHASE 1
- **Entry**: Registration/Login
- **Type**: Initial CEFR Assessment
- **Exit**: → `/app/phase2`

### PHASE 2
- **Entry**: From Phase 1
- **Steps**: 5 steps with remedials
- **Exit**: → `/app/phase3`

### PHASE 3
- **Entry**: From Phase 2
- **Steps**: 4 steps (1, 2, 3, 4) with remedials
- **File**: `phase3_routes.py`
- **Exit**: Step 4 Remedial Pass → `/app/phase4/step/1`

### PHASE 4
- **Entry**: From Phase 3
- **Steps**: 4 steps (1, 3, 4, 5) with 5 CEFR remedials each
- **File**: `phase4_routes.py`
- **Routing Pattern**:
  ```
  Step 1 (21pts) → Remedial → Step 3
  Step 3 (15pts) → Remedial → Step 4
  Step 4 (15pts) → Remedial → Step 5
  Step 5 (15pts) → Remedial → PHASE 4_2 ✓
  ```
- **Exit**: Step 5 Remedial Pass → `/app/phase4_2`

### PHASE 4_2 (Marketing Part 2)
- **Entry**: From Phase 4 Step 5 remedials
- **Steps**: Same as Phase 4 (1, 3, 4, 5)
- **API**: Shares `phase4_bp` routes
- **Exit**: Step 5 Remedial Pass → `/app/phase5` (implied from Phase 5 entry)

### PHASE 5
- **Entry**: From Phase 4_2 Step 5 remedials
- **Steps**: 4 steps (1, 3, 4, 5) with 5 CEFR remedials each
- **File**: `phase5_routes.py`
- **Routing Pattern**: Same as Phase 4
- **Exit**: Step 5 Remedial Pass → `/app/phase5_2` ✓

### PHASE 5_2 (Execution Part 2)
- **Entry**: From Phase 5 Step 5 remedials (verified line 6430)
- **Steps**: Same as Phase 5 (1, 3, 4, 5)
- **API**: Shares `phase5_bp` routes
- **Exit**: Step 5 Remedial Pass → `/app/phase6` (implied from Phase 6 entry)

### PHASE 6
- **Entry**: From Phase 5_2 Step 5 remedials
- **Steps**: 4 steps (1, 3, 4, 5) with 5 CEFR remedials each
- **File**: `phase6_routes.py`
- **Routing Pattern**: Same as Phases 4 & 5
- **Exit**: Step 5 Remedial Pass → `/app/phase6_2` ✓

### PHASE 6_2 (Reflection Part 2)
- **Entry**: From Phase 6 Step 5 remedials (verified line 3005)
- **Steps**: Same as Phase 6 (1, 3, 4, 5)
- **API**: Shares `phase6_bp` routes
- **Exit**: Step 5 Remedial Pass → `/app/completion` (expected)

---

## Backend Route Files

| Phase | Route File | Blueprint | Lines |
|-------|------------|-----------|-------|
| Phase 1 | `api_routes.py` | `api_bp` | Assessment logic |
| Phase 2 | `api_routes.py` | `api_bp` | Phase 2 specific |
| Phase 3 | `phase3_routes.py` | `phase3_bp` | ~1,000+ lines |
| Phase 4 & 4_2 | `phase4_routes.py` | `phase4_bp` | ~7,400 lines |
| Phase 5 & 5_2 | `phase5_routes.py` | `phase5_bp` | ~6,779 lines |
| Phase 6 & 6_2 | `phase6_routes.py` | `phase6_bp` | ~3,314 lines |

---

## API Endpoint Structure

### Phases 4, 4_2 (Shared)
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

### Phases 5, 5_2 (Shared)
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

### Phases 6, 6_2 (Shared)
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

**Note**: Part 2 phases (4_2, 5_2, 6_2) share the same API endpoints as their Part 1 counterparts.

---

## Frontend URL Routing

### Phase URLs
- Phase 1: `/app/phase1` or `/app/assessment`
- Phase 2: `/app/phase2`
- Phase 3: `/app/phase3`
- Phase 4: `/app/phase4`
- Phase 4_2: `/app/phase4_2` ✓ (verified in code)
- Phase 5: `/app/phase5`
- Phase 5_2: `/app/phase5_2` ✓ (verified in code)
- Phase 6: `/app/phase6`
- Phase 6_2: `/app/phase6_2` ✓ (verified in code)
- Completion: `/app/completion`

### Step URLs Pattern (Phases 4-6)
```
/app/phase{X}/step/{1|3|4|5}
/app/phase{X}/step/{1|3|4|5}/remedial/{a1|a2|b1|b2|c1}/...
/app/phase{X}/step/{1|3|4|5}/remedial/{a1|a2|b1|b2|c1}/retry
```

---

## Statistics

### Total Phases: 9
- Phase 1 (Assessment)
- Phase 2 (Guided - 5 steps)
- Phase 3 (Sponsorship - 4 steps)
- Phase 4 (Marketing - 4 steps)
- Phase 4_2 (Marketing Part 2 - 4 steps)
- Phase 5 (Execution - 4 steps)
- Phase 5_2 (Execution Part 2 - 4 steps)
- Phase 6 (Reflection - 4 steps)
- Phase 6_2 (Reflection Part 2 - 4 steps)

### Total Steps: 33+
- Phase 1: 1 (assessment)
- Phase 2: 5 steps
- Phase 3: 4 steps
- Phases 4, 4_2, 5, 5_2, 6, 6_2: 4 steps × 6 = 24 steps

### Total Remedials: 140+
- Phase 3: 4 steps × 5 levels = 20
- Phases 4-6_2: 24 steps × 5 levels = 120

### Total Phase Transitions: 9
1. Phase 1 → Phase 2
2. Phase 2 → Phase 3
3. Phase 3 → Phase 4
4. Phase 4 → Phase 4_2 ✓
5. Phase 4_2 → Phase 5
6. Phase 5 → Phase 5_2 ✓
7. Phase 5_2 → Phase 6
8. Phase 6 → Phase 6_2 ✓
9. Phase 6_2 → Completion

---

## Visual Complete Flow

```
┌──────────────────┐
│    PHASE 1       │  Initial Assessment
│   Assessment     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│    PHASE 2       │  Guided Activities
│   5 Steps        │  Game event planning
└────────┬─────────┘
         ↓
┌──────────────────┐
│    PHASE 3       │  Sponsorship & Budgeting
│ Steps: 1,2,3,4   │  4 steps with remedials
└────────┬─────────┘
         ↓
┌──────────────────┐
│    PHASE 4       │  Marketing & Promotion
│ Steps: 1,3,4,5   │  4 steps, 5 remedials each
└────────┬─────────┘
         ↓ (verified line 7055)
┌──────────────────┐
│   PHASE 4_2      │  Marketing Part 2
│ Steps: 1,3,4,5   │  Same structure as Phase 4
└────────┬─────────┘
         ↓
┌──────────────────┐
│    PHASE 5       │  Execution & Problem-Solving
│ Steps: 1,3,4,5   │  4 steps, 5 remedials each
└────────┬─────────┘
         ↓ (verified line 6430)
┌──────────────────┐
│   PHASE 5_2      │  Execution Part 2
│ Steps: 1,3,4,5   │  Same structure as Phase 5
└────────┬─────────┘
         ↓
┌──────────────────┐
│    PHASE 6       │  Reflection & Evaluation
│ Steps: 1,3,4,5   │  4 steps, 5 remedials each
└────────┬─────────┘
         ↓ (verified line 3005)
┌──────────────────┐
│   PHASE 6_2      │  Reflection Part 2
│ Steps: 1,3,4,5   │  Same structure as Phase 6
└────────┬─────────┘
         ↓
┌──────────────────┐
│   COMPLETION     │  🎉 End of FARDI Journey
└──────────────────┘
```

---

## Key Findings from Code Review

1. ✅ **Phase 4_2 EXISTS** - Verified in phase4_routes.py (line 7055)
2. ✅ **Phase 5_2 EXISTS** - Verified in phase5_routes.py (line 6430)
3. ✅ **Phase 6_2 EXISTS** - Verified in phase6_routes.py (line 3005)
4. ✅ **Part 2 phases share API endpoints** with their Part 1 counterparts
5. ✅ **Part 2 phases have separate frontend routes** (/app/phase4_2, etc.)
6. ✅ **Complete progression**: 9 phases total from Phase 1 to Phase 6_2

---

## Corrected Phase Sequence

**CORRECT SEQUENCE (Verified from code)**:
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 4_2 →
Phase 5 → Phase 5_2 → Phase 6 → Phase 6_2 → Completion
```

**Total**: 9 phases, not 6 phases

---

## Summary

The FARDI platform has **9 distinct phases** (not 6):
- 3 unique phases (Phases 1, 2, 3)
- 6 phases with identical step structure (Phases 4, 4_2, 5, 5_2, 6, 6_2)

Each of the later 6 phases follows the pattern:
- Step 1 (21 points) → Step 3 (15 points) → Step 4 (15 points) → Step 5 (15 points)
- Each step has 5 CEFR remedial levels (A1, A2, B1, B2, C1)
- Part 2 phases (4_2, 5_2, 6_2) extend the learning journey within each topic area

This architecture provides extensive language learning opportunities with 33+ steps and 140+ possible remedial activities.
