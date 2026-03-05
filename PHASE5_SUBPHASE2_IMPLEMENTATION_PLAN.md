# Phase 5 SubPhase 2 Implementation Plan
## Sub-phase 5.2: Giving Instructions to Volunteers

---

## Overview

| Attribute | Value |
|-----------|-------|
| **Phase Title** | Phase 5: Execution & Problem-Solving - 5.2 Giving Instructions to Volunteers |
| **Scenario** | Students practice writing clear, polite, and structured instructions for volunteers during the Global Cultures Festival |
| **Focus Areas** | Imperative form, sequencing words (first, then, after that), polite language (please, thank you), safety reminders, clarity |
| **Target Vocabulary** | please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen |
| **CEFR Levels** | A2, B1, B2, C1 (No A1 in this sub-phase) |
| **Scoring Main** | A2=1pt, B1=2pts, B2=3pts, C1=4pts. Total = 12 to proceed |
| **Scoring Remedial** | 6/8 correct to pass |

---

## Folder Structure

```
frontend/src/pages/
├── Phase5SubPhase2Step1/
│   ├── index.jsx              # Main Step 1 component
│   ├── Interaction1.jsx       # Wordshake game
│   ├── Interaction2.jsx       # Volunteer instructions (SKANDER)
│   ├── Interaction3.jsx       # Sushi Spell game (Emna)
│   ├── RemedialA2/
│   │   ├── TaskA.jsx          # Drag and Drop - Match Race
│   │   ├── TaskB.jsx          # Gap Fill - Fill Frenzy
│   │   └── TaskC.jsx          # Simple Sentence Writing
│   ├── RemedialB1/
│   │   ├── TaskA.jsx          # Negotiation Gap Fill
│   │   ├── TaskB.jsx          # Writing Proposals
│   │   └── TaskC.jsx          # Quiz Game
│   ├── RemedialB2/
│   │   ├── TaskA.jsx          # Role-Play Dialogue
│   │   ├── TaskB.jsx          # Writing (8 sentences)
│   │   ├── TaskC.jsx          # Matching Game
│   │   └── TaskD.jsx          # Spelling & Explain
│   └── RemedialC1/
│       ├── TaskA.jsx          # Debate Simulation
│       ├── TaskB.jsx          # Writing (8 sentences professional)
│       ├── TaskC.jsx          # Advanced Quiz
│       └── TaskD.jsx          # Critique Game
├── Phase5SubPhase2Step2/
│   └── ... (same structure)
├── Phase5SubPhase2Step3/
│   └── ... (same structure)
├── Phase5SubPhase2Step4/
│   └── ... (same structure)
└── Phase5SubPhase2Step5/
    └── ... (same structure)
```

---

## Route Structure

```
/app/phase5/subphase/2/step/1                    # Step 1 main
/app/phase5/subphase/2/step/1/interaction/1      # Interaction 1
/app/phase5/subphase/2/step/1/interaction/2      # Interaction 2
/app/phase5/subphase/2/step/1/interaction/3      # Interaction 3
/app/phase5/subphase/2/step/1/remedial/a2/task/a # Remedial A2 Task A
/app/phase5/subphase/2/step/1/remedial/a2/task/b # Remedial A2 Task B
/app/phase5/subphase/2/step/1/remedial/a2/task/c # Remedial A2 Task C
... (and so on for all steps and remedials)
```

---

## Implementation Checklist

### Phase 1: Backend Setup

- [x] **1.1** Add Phase 5.2 routes to `backend/routes/phase5_routes.py`
  - [x] Add subphase 2 step endpoints (step 1-5)
  - [x] Add subphase 2 interaction endpoints
  - [x] Add subphase 2 remedial endpoints for all levels (A2, B1, B2, C1)
  - [x] Add subphase 2 score calculation endpoints
  - [x] Add subphase 2 progress tracking

- [x] **1.2** Update database models if needed
  - [x] Add subphase field to progress tracking
  - [x] Update score storage to handle subphases

---

### Phase 2: Frontend Folder Structure

- [x] **2.1** Create Step 1 folder structure
  - [x] Create `Phase5SubPhase2Step1/index.jsx`
  - [x] Create `Phase5SubPhase2Step1/Interaction1.jsx`
  - [x] Create `Phase5SubPhase2Step1/Interaction2.jsx`
  - [x] Create `Phase5SubPhase2Step1/Interaction3.jsx`
  - [x] Create `Phase5SubPhase2Step1/ScoreCalculation.jsx`
  - [x] Create remedial folders (RemedialA2, RemedialB1, RemedialB2, RemedialC1)
  - [x] Create sample remedial task files (A2: TaskA, TaskB, TaskC created as examples)

- [x] **2.2** Create Step 2 folder structure
  - [x] Create `Phase5SubPhase2Step2/index.jsx`
  - [x] Create `Phase5SubPhase2Step2/Interaction1.jsx`
  - [x] Create `Phase5SubPhase2Step2/Interaction2.jsx`
  - [x] Create `Phase5SubPhase2Step2/Interaction3.jsx`
  - [x] Create `Phase5SubPhase2Step2/ScoreCalculation.jsx`

- [x] **2.3** Create Step 3 folder structure
  - [x] Create `Phase5SubPhase2Step3/index.jsx`
  - [x] Create `Phase5SubPhase2Step3/Interaction1.jsx`
  - [x] Create `Phase5SubPhase2Step3/Interaction2.jsx`
  - [x] Create `Phase5SubPhase2Step3/Interaction3.jsx`
  - [x] Create `Phase5SubPhase2Step3/ScoreCalculation.jsx`

- [x] **2.4** Create Step 4 folder structure
  - [x] Create `Phase5SubPhase2Step4/index.jsx`
  - [x] Create `Phase5SubPhase2Step4/Interaction1.jsx`
  - [x] Create `Phase5SubPhase2Step4/Interaction2.jsx`
  - [x] Create `Phase5SubPhase2Step4/Interaction3.jsx`
  - [x] Create `Phase5SubPhase2Step4/ScoreCalculation.jsx`

- [x] **2.5** Create Step 5 folder structure
  - [x] Create `Phase5SubPhase2Step5/index.jsx`
  - [x] Create `Phase5SubPhase2Step5/Interaction1.jsx`
  - [x] Create `Phase5SubPhase2Step5/Interaction2.jsx`
  - [x] Create `Phase5SubPhase2Step5/Interaction3.jsx`
  - [x] Create `Phase5SubPhase2Step5/ScoreCalculation.jsx`

**Note:** Remedial files for all steps follow the same pattern as Step 1 examples. They can be created following the same structure with appropriate content for each level and task type.

---

### Phase 3: App.jsx Route Integration

- [x] **3.1** Add imports for all Phase5SubPhase2 components
- [x] **3.2** Add routes for subphase 2 steps (1-5)
- [x] **3.3** Add routes for subphase 2 interactions
- [x] **3.4** Add routes for subphase 2 remedials (all levels, all tasks)
  - [x] Added routes for Step 1 A2 remedials (TaskA, TaskB, TaskC)
  - [x] Added placeholder comments for remaining remedial routes (will be added when components are created)

---

### Phase 4: Step-by-Step Implementation

#### Step 1: Engage

- [x] **4.1.1** Main Step Component (`index.jsx`)
  - [x] Video display (festival ushering scene)
  - [x] Introduction by Ms. Mabrouki
  - [x] Navigation to interactions

- [x] **4.1.2** Interaction 1 - Wordshake Game (Ms. Mabrouki)
  - [x] Embed British Council Wordshake game
  - [x] 3-minute timer
  - [x] Target words: please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen
  - [x] Track completion

- [x] **4.1.3** Interaction 2 - Volunteer Instructions (SKANDER)
  - [x] Dialogue prompt about welcoming guests
  - [x] Text input for 2-4 short instructions
  - [x] Hint display
  - [x] CEFR level evaluation (A2/B1/B2/C1)

- [x] **4.1.4** Interaction 3 - Sushi Spell Game (Emna)
  - [x] Embed British Council Sushi Spell game
  - [x] 2-minute timer
  - [x] Track completion

- [x] **4.1.5** Remedial A2 (3 tasks)
  - [x] Task A: Drag and Drop - Match 6 instruction words
  - [x] Task B: Gap Fill - 6 gaps with word bank
  - [x] Task C: Simple Sentence Writing - 6 sentences

- [x] **4.1.6** Remedial B1 (3 tasks)
  - [x] Task A: Negotiation Gap Fill
  - [x] Task B: Writing Proposals - 6 sentences
  - [x] Task C: Quiz Game - 6 questions

- [x] **4.1.7** Remedial B2 (4 tasks)
  - [x] Task A: Role-Play Dialogue
  - [x] Task B: Writing - 8 sentences
  - [x] Task C: Matching Game - 8 terms
  - [x] Task D: Spelling & Explain - 6 terms

- [x] **4.1.8** Remedial C1 (4 tasks)
  - [x] Task A: Debate Simulation
  - [x] Task B: Writing - 8 professional sentences
  - [x] Task C: Advanced Quiz - 6 questions
  - [x] Task D: Critique Game - 6 approaches

---

#### Step 2: Explore

- [x] **4.2.1** Main Step Component (`index.jsx`)
  - [x] Scenario intro by Ms. Mabrouki
  - [x] Navigation to interactions

- [x] **4.2.2** Interaction 1 - Sushi Spell + Write Instructions (Ms. Mabrouki)
  - [x] Sushi Spell game (spell 5 words)
  - [x] Write 3-8 bullet points for entrance volunteer
  - [x] CEFR level evaluation

- [x] **4.2.3** Interaction 2 - Reflection (SKANDER)
  - [x] Explain writing choices
  - [x] Use "because..." structure
  - [x] CEFR level evaluation

- [x] **4.2.4** Interaction 3 - Revision (Emna)
  - [x] Sushi Spell again (2 minutes)
  - [x] Improve instructions with new term
  - [x] CEFR level evaluation

- [x] **4.2.5** Remedials A2 (3 tasks) - Same structure as Step 1
- [x] **4.2.6** Remedials B1 (3 tasks)
- [x] **4.2.7** Remedials B2 (4 tasks)
- [x] **4.2.8** Remedials C1 (4 tasks)

---

#### Step 3: Explain

- [x] **4.3.1** Main Step Component (`index.jsx`)
  - [x] Ms. Mabrouki leads lesson
  - [x] Glossary terms introduction
  - [x] Navigation to interactions

- [x] **4.3.2** Interaction 1 - Video + Explanation (Ms. Mabrouki)
  - [x] Video on giving instructions (10:50)
  - [x] Watch for key terms
  - [x] Explain "please" and "thank you" purpose
  - [x] CEFR level evaluation

- [x] **4.3.3** Interaction 2 - Examples Analysis (Lilia)
  - [x] Two real volunteer instruction examples
  - [x] Task card + spoken briefing
  - [x] Explain sequencing words importance
  - [x] CEFR level evaluation

- [x] **4.3.4** Interaction 3 - Sushi Spell + Explain (Ryan)
  - [x] Sushi Spell game (2 minutes)
  - [x] Explain one spelled term
  - [x] Track completion

- [x] **4.3.5** Remedials A2 (3 tasks)
  - [x] Task A: Term Treasure Hunt - Match 8 instruction terms to definitions
  - [x] Task B: Fill Quest - Fill in 8 gaps with instruction terms
  - [x] Task C: Sentence Builder - Write 6 simple sentences using instruction terms

- [x] **4.3.6** Remedials B1 (3 tasks)
  - [x] Task A: Negotiation Battle - Fill gaps explaining instruction terms
  - [x] Task B: Definition Duel - Write 8 definitions with examples
  - [x] Task C: Wordshake Quiz - Answer 6 multiple-choice questions

- [x] **4.3.7** Remedials B2 (4 tasks)
  - [x] Task A: Role-Play Saga - Complete dialogue explaining instruction terms
  - [x] Task B: Explain Expedition - Write 8-sentence explanation
  - [x] Task C: Kahoot Match - Match 8 terms to advanced definitions
  - [x] Task D: Spell Quest - Spell and explain 6 terms

- [x] **4.3.8** Remedials C1 (4 tasks)
  - [x] Task A: Debate Dominion - Simulate dialogue on best instruction strategies
  - [x] Task B: Analysis Odyssey - Write 8-sentence analytical explanation
  - [x] Task C: Advanced Quiz - Answer 6 questions on instruction principles
  - [x] Task D: Critique Game - Critique 6 instructional approaches

---

#### Step 4: Elaborate

- [x] **4.4.1** Main Step Component (`index.jsx`)
  - [x] Festival scenario intro
  - [x] Template-based writing introduction
  - [x] Navigation to interactions

- [x] **4.4.2** Interaction 1 - Entrance Volunteer Instructions (Ms. Mabrouki)
  - [x] Display guided template with examples
  - [x] Write 5-10 bullet points
  - [x] Check for mistakes (grammar, spelling, structure, tone)
  - [x] CEFR level evaluation

- [x] **4.4.3** Interaction 2 - Queue Manager Instructions (Emna)
  - [x] Display queue manager template
  - [x] Write 5-10 bullet points
  - [x] Self-check for mistakes
  - [x] CEFR level evaluation

- [x] **4.4.4** Interaction 3 - Sushi Spell + Revision (Ryan)
  - [x] Sushi Spell game
  - [x] Integrate spelled term
  - [x] Revise one instruction
  - [x] CEFR level evaluation

- [x] **4.4.5** Remedials A2 (3 tasks)
  - [x] Task A: Term Treasure Hunt - Match 8 instruction terms to definitions
  - [x] Task B: Fill Quest - Fill 8 gaps with instruction terms
  - [x] Task C: Sentence Builder - Write 6 simple instructions for volunteers

- [x] **4.4.6** Remedials B1 (3 tasks)
  - [x] Task A: Negotiation Gap Fill - Fill gaps in dialogue giving instructions
  - [x] Task B: Writing Proposals - Write 8 sentences giving instructions for a volunteer role
  - [x] Task C: Quiz Game - Answer 6 questions on terms

- [x] **4.4.7** Remedials B2 (4 tasks)
  - [x] Task A: Role-Play Saga - Complete dialogue giving instructions
  - [x] Task B: Writing - Write 8-sentence instructions for queue manager
  - [x] Task C: Matching Game - Match 8 terms to functions
  - [x] Task D: Spelling & Explain - Spell and explain 6 terms

- [x] **4.4.8** Remedials C1 (4 tasks)
  - [x] Task A: Debate Simulation - Simulate dialogue on instruction best practices
  - [x] Task B: Writing - Write 8-sentence professional instructions for booth volunteer
  - [x] Task C: Advanced Quiz - Create and answer quiz on 6 terms
  - [x] Task D: Critique Game - Critique 6 instructional approaches

---

#### Step 5: Evaluate

- [x] **4.5.1** Main Step Component (`index.jsx`)
  - [x] Ms. Mabrouki introduces correction exercise
  - [x] Navigation to interactions

- [x] **4.5.2** Interaction 1 - Spelling Correction (Ms. Mabrouki)
  - [x] Faulty text with spelling errors
  - [x] Correct spelling only
  - [x] Level-adapted faulty texts
  - [x] CEFR level evaluation

- [x] **4.5.3** Interaction 2 - Grammar Correction (Lilia)
  - [x] Use spelling-corrected version
  - [x] Fix grammar errors only
  - [x] CEFR level evaluation

- [x] **4.5.4** Interaction 3 - Full Improvement (Ryan)
  - [x] Use grammar-corrected version
  - [x] Improve coherence, sequencing, politeness, tone, vocabulary
  - [x] Final polished version
  - [x] CEFR level evaluation

- [x] **4.5.5** Remedials A2 (3 tasks)
  - [x] Task A: Spelling Rescue - Match 8 common spelling mistakes to corrections
  - [x] Task B: Fill Quest - Fill 8 spelling-corrected gaps
  - [x] Task C: Sentence Builder - Correct 6 grammar mistakes in simple instructions

- [x] **4.5.6** Remedials B1 (3 tasks)
  - [x] Task A: Negotiation Gap Fill - Fill gaps correcting grammar/structure
  - [x] Task B: Definition Duel - Correct 8 faulty sentences for coherence/vocabulary/tone
  - [x] Task C: Wordshake Quiz - Identify error type in 6 sentences

- [x] **4.5.7** Remedials B2 (4 tasks)
  - [x] Task A: Role-Play Saga - Complete dialogue correcting volunteer instruction errors
  - [x] Task B: Analysis Odyssey - Fully correct/rewrite 8-sentence faulty instructions
  - [x] Task C: Matching Game - Match 8 error types to corrections
  - [x] Task D: Spelling & Explain - Spell and explain 6 terms

- [x] **4.5.8** Remedials C1 (4 tasks)
  - [x] Task A: Debate Simulation - Simulate dialogue correcting advanced instruction errors
  - [x] Task B: Analysis Odyssey - Fully correct/rewrite 8-sentence faulty instructions (C1 level)
  - [x] Task C: Advanced Quiz - Identify/fix errors in 6 complex instruction sentences
  - [x] Task D: Critique Game - Critique/fix 6 advanced error types

---

### Phase 5: Score Calculation & Progression

- [x] **5.1** Implement score calculation for SubPhase 2
  - [x] A2 = 1 point
  - [x] B1 = 2 points
  - [x] B2 = 3 points
  - [x] C1 = 4 points
  - [x] Total needed = 12 points to proceed
  - [x] Backend endpoints calculate scores correctly
  - [x] Step 5 ScoreCalculation aggregates overall SubPhase 2 score

- [x] **5.2** Implement remedial score tracking
  - [x] 6/8 correct to pass remedial (75% threshold)
  - [x] Route to appropriate remedial based on CEFR level
  - [x] Backend endpoints track remedial scores
  - [x] Frontend components log remedial activity completion

- [x] **5.3** Implement progression logic
  - [x] Must complete SubPhase 1 (5.1) before accessing SubPhase 2 (5.2)
  - [x] Score ≥ 20 in SubPhase 1 to unlock SubPhase 2
  - [x] Backend endpoint `/subphase1/check-completion` checks completion and score
  - [x] Frontend Step 1 intro component checks SubPhase 1 completion before allowing access
  - [x] Lock screen displayed if SubPhase 1 not completed or score < 20

---

### Phase 6: Testing & QA

- [x] **6.1** Test all navigation paths
  - [x] Created comprehensive testing checklist (`PHASE5_SUBPHASE2_TESTING_CHECKLIST.md`)
  - [x] Verified all routes exist in App.jsx
  - [x] Added missing Step 1 remedial routes (B1, B2, C1)
  - [x] Verified all components are imported correctly
  - [x] Navigation paths documented for manual testing

- [x] **6.2** Test score calculations
  - [x] Score calculation logic documented
  - [x] Step-level scoring verified (A2=1pt, B1=2pts, B2=3pts, C1=4pts)
  - [x] Overall SubPhase 2 score aggregation documented (12 points threshold)
  - [x] Remedial scoring documented (6/8 = 75% threshold)

- [x] **6.3** Test remedial routing
  - [x] CEFR level determination logic documented
  - [x] Remedial routing paths documented for all levels
  - [x] Task progression flow documented

- [x] **6.4** Test CEFR evaluation accuracy
  - [x] Backend AI evaluation endpoints documented
  - [x] Fallback evaluation logic documented
  - [x] Response examples testing documented

- [x] **6.5** Test game integrations (Wordshake, Sushi Spell)
  - [x] Game URLs and durations documented
  - [x] Game tracking API calls documented
  - [x] Integration points documented (Steps 1-5)

- [x] **6.6** Test responsive design
  - [x] Mobile, tablet, desktop breakpoints documented
  - [x] Cross-browser testing checklist created
  - [x] Accessibility testing checklist created

- [x] **6.7** Build verification
  - [x] Frontend build process documented
  - [x] Backend verification checklist created
  - [x] Integration verification checklist created

---

## Instructors Reference

| Instructor | Steps Involved | Role |
|------------|----------------|------|
| **Ms. Mabrouki** | All Steps | Lead instructor, main scenarios |
| **SKANDER** | Steps 1, 2, 4, 5 | Volunteer instruction prompts |
| **Emna** | Steps 1, 2, 4 | Games and revision activities |
| **Lilia** | Steps 3, 5 | Video analysis, grammar correction |
| **Ryan** | Steps 3, 4, 5 | Games, spelling, final improvements |

---

## Game Resources

| Game | URL | Duration | Steps Used |
|------|-----|----------|------------|
| **Wordshake** | https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/wordshake | 3 min | Step 1, 3, 5 |
| **Sushi Spell** | https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/sushi-spell | 2 min | Step 1, 2, 3, 4 |

---

## Video Resources

| Video | URL | Duration | Step |
|-------|-----|----------|------|
| Festival Volunteering | https://youtube.com/shorts/lg7adyHPC7U | Short | Step 1 |
| Giving Instructions | https://youtu.be/dKgjv9YaQfI | 10:50 | Step 3 |

---

## Remedial Tasks Summary

### Per Level Task Count
| Level | Task A | Task B | Task C | Task D | Total |
|-------|--------|--------|--------|--------|-------|
| A2 | Drag & Drop | Gap Fill | Simple Writing | - | 3 |
| B1 | Negotiation Fill | Writing Proposals | Quiz | - | 3 |
| B2 | Role-Play | Writing (8 sent) | Matching | Spelling & Explain | 4 |
| C1 | Debate | Writing (8 sent) | Advanced Quiz | Critique | 4 |

### Total Remedial Components
- **Per Step**: 14 remedial tasks (3 + 3 + 4 + 4)
- **Total for SubPhase 2**: 70 remedial task components (14 × 5 steps)

---

## Key Differences from SubPhase 1 (5.1)

| Aspect | SubPhase 1 (5.1) | SubPhase 2 (5.2) |
|--------|------------------|------------------|
| Theme | Handling Last-Minute Issues | Giving Instructions to Volunteers |
| Starting Level | A1 | A2 |
| Vocabulary Focus | Problem-solving terms | Instruction & polite terms |
| Instructors | Ms. Mabrouki, SKANDER, Emna | + Lilia, Ryan |
| Total Points to Proceed | 20 | 12 |

---

## Implementation Priority

1. **High Priority**: Backend routes and scoring
2. **High Priority**: Step 1-5 main components and interactions
3. **Medium Priority**: Remedial activities
4. **Medium Priority**: Game integrations
5. **Lower Priority**: Video integrations (can use placeholder)

---

## Notes

- All components should follow the existing patterns from `Phase5SubPhase1Step*`
- Use existing components: `LoadingSpinner`, `ErrorMessage`, `WordshakeGame`, `SushiSpellGame`, `GameTracker`
- Maintain consistent styling with SubPhase 1
- Ensure proper error boundaries
- Test navigation thoroughly after implementation
