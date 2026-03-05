# Phase 3–6 Progression Gate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Phases 3, 4, 5, and 6 use the same backend-driven pass/fail and remedial-routing logic that Phase 2 already has.

**Architecture:** Phase 2 is the gold standard — after completing all interactions in a step, the backend sums points, decides `should_proceed` and `remedial_level`, and returns `next_url`. The frontend just reads that response and navigates. Currently Phase 3 has no assessment logic, Phase 4 has frontend-only scoring, and Phases 5/6 have backend AI evaluation but the `should_proceed` flag from the backend is ignored — the frontend fallback logic takes over.

**Tech Stack:** Flask (backend), React + sessionStorage (frontend), phase5_routes.py and phase6_routes.py already have `_build_score_response()` helper.

---

## Key Reference: Phase 2 Model (DO NOT CHANGE)

### Backend Pattern (api_routes.py:494–645)
```python
# 1. Assess each response with AI → store in session
assessment = assessment_service.assess_phase2_response(...)
session['phase2_assessments'][session_key] = assessment

# 2. On last item: sum all points, decide
total_score = sum(PHASE_2_POINTS.get(level, 1) for each item)
needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD  # 20
user_level = determine_phase2_user_level(total_score)      # A1/A2/B1/B2
next_url = f"/app/phase2/remedial/{step_id}/{user_level}"  # or next step

# 3. Return to frontend
return jsonify({
    "progression": {
        "next_action": "remedial_activities" | "next_step" | "phase2_complete",
        "next_url": "/app/...",
        "needs_remedial": True/False,
        "user_level": "A1"
    }
})
```

### Frontend Pattern (Phase2Step.jsx)
```javascript
// Submit → check-step-completion → read backend response → navigate
const result = await fetch('/api/phase2/check-step-completion', ...)
if (result.needs_remedial) navigate(`/phase2/remedial/${stepId}/${result.user_level}`)
else navigate(result.next_url)
```

---

## What's Wrong Per Phase

### Phase 3
- `phase3_routes.py` submit endpoint is a TODO stub (lines 36–56)
- Frontend interaction files compute scores locally and only `log` them
- No `calculate-score` endpoint, no `should_proceed` logic
- No step completion check, no remedial routing from backend

### Phase 4
- Frontend calculates all 3 interaction scores and sends them to backend
- Backend only validates ranges — never assesses, never routes
- No pass/fail gate at all — always proceeds forward
- Fix: backend already receives scores via `/api/phase4/step/{n}/calculate-score`; just needs to return `should_proceed` and `next_url`

### Phase 5
- Backend AI assessment works ✅
- `calculate-score` endpoints exist and return `should_proceed` ✅
- **Bug:** `ScoreCalculation.jsx:66–67` uses fallback `determineRemedialLevel()` based on total score instead of I2 score
- **Bug:** `ScoreCalculation.jsx:95` fallback uses `totalScore >= 10` (wrong — should use `interaction2_score >= 3`)
- **Bug:** `handleContinue()` at line 147 always routes to remedial even when `shouldProceed = true`

### Phase 6
- Same structure as Phase 5, same bugs in ScoreCalculation pages
- Need to verify each step's ScoreCalculation uses backend `should_proceed`

---

## Tasks

---

### Task 1: Fix Phase 5 ScoreCalculation — respect backend `should_proceed`

**Files:**
- Modify: `frontend/src/pages/Phase5SubPhase1Step1/ScoreCalculation.jsx`

**What's broken:**
- Line 66: `const remedialLevel = data.remedial_level || determineRemedialLevel(totalScore)` — `data.remedial_level` doesn't exist, it's `data.total.remedial_level`
- Line 67: `const shouldProceed = data.should_proceed || false` — same, it's `data.total.should_proceed`
- Line 95 fallback: uses `totalScore >= 10` instead of `interaction2Score >= 3`
- `handleContinue()` always routes to remedial — should navigate to next step if `shouldProceed`

**Step 1: Read the backend response shape**

From `phase5_routes.py:627–660`, the backend returns:
```json
{
  "success": true,
  "data": {
    "interaction1": { "score": 1, "max_score": 1, "type": "completion" },
    "interaction2": { "score": 3, "max_score": 5, "level": "B1" },
    "interaction3": { "score": 1, "max_score": 1, "type": "completion" },
    "total": {
      "score": 5,
      "max_score": 7,
      "remedial_level": "B1",
      "should_proceed": true
    }
  }
}
```

**Step 2: Fix score extraction (lines 64–77)**

Replace:
```javascript
const remedialLevel = data.remedial_level || determineRemedialLevel(totalScore)
const shouldProceed = data.should_proceed || false
```
With:
```javascript
const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
```

**Step 3: Fix fallback (line 95)**

Replace:
```javascript
shouldProceed: totalScore >= 10, // B2 level average
```
With:
```javascript
shouldProceed: interaction2Score >= 3,
```

And same fix in the catch block at line 119.

**Step 4: Fix handleContinue to use shouldProceed**

Replace the entire `handleContinue` function (lines 140–148):
```javascript
const handleContinue = () => {
  if (!routing) return
  if (routing.shouldProceed) {
    navigate('/phase5/subphase/1/step/2')
  } else {
    const levelLower = routing.remedialLevel.toLowerCase()
    navigate(`/phase5/subphase/1/step/1/remedial/${levelLower}/task/a`)
  }
}
```

**Step 5: Verify in browser**
- Complete Step 1 with I2 score ≥ 3 → should go to Step 2
- Complete Step 1 with I2 score < 3 → should go to remedial

---

### Task 2: Apply same fixes to all Phase 5 ScoreCalculation files

**Files to modify** (same pattern, different step numbers and routes):
- `frontend/src/pages/Phase5SubPhase1Step2/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase1Step3/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase1Step4/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase1Step5/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase2Step1/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase2Step2/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase2Step3/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase2Step4/ScoreCalculation.jsx`
- `frontend/src/pages/Phase5SubPhase2Step5/ScoreCalculation.jsx`

**For each file, apply the same 4 fixes from Task 1:**
1. Fix `data.remedial_level` → `data.total?.remedial_level`
2. Fix `data.should_proceed` → `data.total?.should_proceed`
3. Fix fallback to use `interaction2Score >= 3`
4. Fix `handleContinue` to navigate to next step when `shouldProceed = true`

**Navigation targets per step (SubPhase 1):**
- Step 1 → Step 2: `/phase5/subphase/1/step/2`
- Step 2 → Step 3: `/phase5/subphase/1/step/3`
- Step 3 → Step 4: `/phase5/subphase/1/step/4`
- Step 4 → Step 5: `/phase5/subphase/1/step/5`
- Step 5 → SubPhase 2: `/phase5/subphase/2/step/1`

**Navigation targets per step (SubPhase 2):**
- Step 1 → Step 2: `/phase5/subphase/2/step/2`
- Step 2 → Step 3: `/phase5/subphase/2/step/3`
- Step 3 → Step 4: `/phase5/subphase/2/step/4`
- Step 4 → Step 5: `/phase5/subphase/2/step/5`
- Step 5 → Phase 5 Complete: `/phase5/complete`

---

### Task 3: Apply same fixes to all Phase 6 ScoreCalculation files

**First: check if Phase 6 ScoreCalculation files exist**
```bash
ls frontend/src/pages/Phase6SubPhase1Step1/
```

If they don't exist, they need to be created (same structure as Phase 5 equivalents, just with different routes and `phase6API` instead of `phase5API`).

**Files to check/fix:**
- `frontend/src/pages/Phase6SubPhase1Step{1-5}/ScoreCalculation.jsx`
- `frontend/src/pages/Phase6SubPhase2Step{1-5}/ScoreCalculation.jsx`

**Same 4 fixes as Task 1, with these navigation targets:**

SubPhase 1:
- Step 1 → 2: `/phase6/subphase/1/step/2`
- Step 2 → 3: `/phase6/subphase/1/step/3`
- Step 3 → 4: `/phase6/subphase/1/step/4`
- Step 4 → 5: `/phase6/subphase/1/step/5`
- Step 5 → SP2: `/phase6/subphase/2/step/1`

SubPhase 2:
- Step 1 → 2: `/phase6/subphase/2/step/2`
- Step 2 → 3: `/phase6/subphase/2/step/3`
- Step 3 → 4: `/phase6/subphase/2/step/4`
- Step 4 → 5: `/phase6/subphase/2/step/5`
- Step 5 → complete: `/phase6/complete`

---

### Task 4: Fix Phase 4 — add `should_proceed` and `next_url` to backend score endpoints

**Files:**
- Read: `backend/routes/phase4_routes.py` (find calculate-score endpoints)
- Modify: `backend/routes/phase4_routes.py`

**Current state:** Phase 4 backend validates score ranges and returns `remedial_level`, but never returns `should_proceed` or `next_url`.

**Fix — add to each `/step/{n}/calculate-score` response:**
```python
# Determine if should proceed (I2 score = interaction2_score, must be >= 3)
should_proceed = interaction2_score >= 3

return jsonify({
    'success': True,
    'data': {
        ...existing fields...,
        'total': {
            'score': total_score,
            'max_score': 7,
            'remedial_level': remedial_level,
            'should_proceed': should_proceed
        }
    }
})
```

**Also check Phase 4 ScoreCalculation frontend files** (same fixes as Task 1).

Phase 4 step navigation:
- Step 1 → Step 3: `/phase4/step/3`
- Step 3 → Step 4: `/phase4/step/4`
- Step 4 → Step 5: `/phase4/step/5`
- Step 5 → Phase 4 Complete: `/phase4/complete`

---

### Task 5: Implement Phase 3 backend score calculation

**Files:**
- Modify: `backend/routes/phase3_routes.py`

**What to add:**

Phase 3 has 4 steps. Each step has interaction scores stored in sessionStorage by the frontend (e.g., `phase3_step1_int1_score`, `phase3_step1_int2_score`, `phase3_step1_int3_score`).

Add a `calculate-score` endpoint for each step following the Phase 5/6 `_build_score_response` pattern:

```python
@phase3_bp.route('/step/<int:step_id>/calculate-score', methods=['POST'])
@login_required
def calculate_step_score(step_id):
    """Calculate Phase 3 step score and determine remedial routing"""
    try:
        user_id = session.get('user_id')
        data = request.json

        interaction1_score = data.get('interaction1_score', 0)  # 0-1 (game)
        interaction2_score = data.get('interaction2_score', 0)  # 1-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (game) [0 for Step 4 which has only 2 interactions]

        total_score = interaction1_score + interaction2_score + interaction3_score

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        remedial_level = level_map.get(interaction2_score, 'A1')
        should_proceed = interaction2_score >= 3

        next_step_map = {1: 2, 2: 3, 3: 4, 4: None}
        next_step = next_step_map.get(step_id)

        if not should_proceed:
            next_url = f"/app/phase3/step/{step_id}/remedial/{remedial_level.lower()}/task/a"
        elif next_step:
            next_url = f"/app/phase3/step/{next_step}"
        else:
            next_url = "/app/phase3/complete"

        logger.info(f"Phase 3 Step {step_id} - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")

        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 1},
                'interaction2': {'score': interaction2_score, 'max_score': 5, 'level': remedial_level},
                'interaction3': {'score': interaction3_score, 'max_score': 1},
                'total': {
                    'score': total_score,
                    'max_score': 7,
                    'remedial_level': remedial_level,
                    'should_proceed': should_proceed,
                    'next_url': next_url
                }
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 3 Step {step_id} score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
```

---

### Task 6: Add ScoreCalculation pages to Phase 3

**Files to create** (one per step):
- `frontend/src/pages/Phase3/Step1/ScoreCalculation.jsx`
- `frontend/src/pages/Phase3/Step2/ScoreCalculation.jsx`
- `frontend/src/pages/Phase3/Step3/ScoreCalculation.jsx`
- `frontend/src/pages/Phase3/Step4/ScoreCalculation.jsx`

**Also create a Phase 3 API helper:**
- `frontend/src/lib/phase3_api.jsx` — same structure as `phase5_api.jsx` but with `/api/phase3` prefix

**Template for ScoreCalculation.jsx** (adapt per step):
```jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material'

export default function Phase3Step1ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [routing, setRouting] = useState(null)

  useEffect(() => { calculateScore() }, [])

  const calculateScore = async () => {
    const i1 = parseInt(sessionStorage.getItem('phase3_step1_int1_score') || '0')
    const i2 = parseInt(sessionStorage.getItem('phase3_step1_int2_score') || '0')
    const i3 = parseInt(sessionStorage.getItem('phase3_step1_int3_score') || '0')

    try {
      const res = await fetch('/api/phase3/step/1/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 })
      })
      const result = await res.json()
      if (result.success) {
        setRouting(result.data.total)
      } else {
        // fallback
        setRouting({ should_proceed: i2 >= 3, remedial_level: ['A1','A2','B1','B2','C1'][i2-1] || 'A1', next_url: i2 >= 3 ? '/phase3/step/2' : `/phase3/step/1/remedial/a1/task/a` })
      }
    } catch {
      setRouting({ should_proceed: i2 >= 3, remedial_level: 'B1', next_url: '/phase3/step/2' })
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.should_proceed) {
      navigate(routing.next_url || '/phase3/step/2')
    } else {
      const level = (routing.remedial_level || 'a1').toLowerCase()
      navigate(`/phase3/step/1/remedial/${level}/task/a`)
    }
  }

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Phase 3 — Step 1 Results</Typography>
        <Typography sx={{ mt: 2 }}>
          {routing?.should_proceed ? 'Well done! Moving to the next step.' : `Let's practice at ${routing?.remedial_level} level first.`}
        </Typography>
        <Button variant="contained" onClick={handleContinue} sx={{ mt: 3 }} fullWidth>
          {routing?.should_proceed ? 'Continue to Step 2' : `Go to ${routing?.remedial_level} Remedial`}
        </Button>
      </Paper>
    </Box>
  )
}
```

---

### Task 7: Wire Phase 3 ScoreCalculation into Interaction 3 navigation

**Files to modify (one per step):**
- `frontend/src/pages/Phase3/Step1/Interaction3.jsx`
- `frontend/src/pages/Phase3/Step2/Interaction3.jsx`
- `frontend/src/pages/Phase3/Step3/Interaction3.jsx`
- `frontend/src/pages/Phase3/Step4/Interaction2.jsx` (Step 4 has only 2 interactions)

**Currently:** Each Interaction3 computes a score, stores it in sessionStorage, then navigates... check where it navigates to now.

**Fix:** After storing score in sessionStorage, navigate to the ScoreCalculation page:
```javascript
// At end of handleSubmit/handleComplete:
sessionStorage.setItem('phase3_step1_int3_score', score.toString())
navigate('/phase3/step/1/score')  // → Phase3Step1ScoreCalculation
```

---

### Task 8: Add Phase 3 ScoreCalculation routes to App.jsx

**File:** `frontend/src/App.jsx`

**Add imports and routes for all Phase 3 ScoreCalculation pages:**
```jsx
import Phase3Step1ScoreCalculation from './pages/Phase3/Step1/ScoreCalculation'
import Phase3Step2ScoreCalculation from './pages/Phase3/Step2/ScoreCalculation'
import Phase3Step3ScoreCalculation from './pages/Phase3/Step3/ScoreCalculation'
import Phase3Step4ScoreCalculation from './pages/Phase3/Step4/ScoreCalculation'

// In routes:
<Route path="/phase3/step/1/score" element={<Phase3Step1ScoreCalculation />} />
<Route path="/phase3/step/2/score" element={<Phase3Step2ScoreCalculation />} />
<Route path="/phase3/step/3/score" element={<Phase3Step3ScoreCalculation />} />
<Route path="/phase3/step/4/score" element={<Phase3Step4ScoreCalculation />} />
```

---

### Task 9: Build frontend and verify

```bash
cd frontend
npm run build
```

Expected: no errors, dist/ updated.

Then manually test:
1. Phase 3 Step 1 → complete interactions → ScoreCalculation → routes correctly
2. Phase 5 Step 1 → I2 score ≥ 3 → goes to Step 2 (not remedial)
3. Phase 5 Step 1 → I2 score < 3 → goes to remedial

---

## Order of Execution

1. Task 1 (Phase 5 Step 1 ScoreCalculation — single file, test the fix)
2. Task 2 (all other Phase 5 ScoreCalculation files)
3. Task 3 (all Phase 6 ScoreCalculation files)
4. Task 4 (Phase 4 backend + ScoreCalculation fixes)
5. Task 5 (Phase 3 backend calculate-score endpoint)
6. Task 6 (Phase 3 ScoreCalculation frontend pages)
7. Task 7 (Phase 3 Interaction3 navigation)
8. Task 8 (App.jsx routes)
9. Task 9 (build + verify)
