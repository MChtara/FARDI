# Phase 5 SubPhase 2: Testing & QA Checklist

## Overview
This document provides a comprehensive testing checklist for Phase 5 SubPhase 2: "Giving Instructions to Volunteers".

---

## 6.1 Navigation Paths Testing

### Main Step Navigation
- [ ] **Step 1 Intro** → `/app/phase5/subphase/2/step/1`
  - [ ] Progression check: Blocks access if SubPhase 1 not completed or score < 20
  - [ ] Displays lock screen with correct message
  - [ ] "Go to SubPhase 1" button navigates correctly
  - [ ] "Start Instruction Activities" button appears when unlocked
  - [ ] Navigates to Interaction 1 when clicked

- [ ] **Step 2 Intro** → `/app/phase5/subphase/2/step/2`
  - [ ] Displays template-based writing introduction
  - [ ] Navigation buttons work correctly

- [ ] **Step 3 Intro** → `/app/phase5/subphase/2/step/3`
  - [ ] Displays glossary terms introduction
  - [ ] Navigation buttons work correctly

- [ ] **Step 4 Intro** → `/app/phase5/subphase/2/step/4`
  - [ ] Displays template-based writing guide
  - [ ] Navigation buttons work correctly

- [ ] **Step 5 Intro** → `/app/phase5/subphase/2/step/5`
  - [ ] Displays correction exercise introduction
  - [ ] Navigation buttons work correctly

### Interaction Navigation (All Steps)
- [ ] **Interaction 1** → `/app/phase5/subphase/2/step/X/interaction/1`
  - [ ] Loads correctly
  - [ ] "Next" button navigates to Interaction 2
  - [ ] Scores stored in sessionStorage

- [ ] **Interaction 2** → `/app/phase5/subphase/2/step/X/interaction/2`
  - [ ] Loads correctly
  - [ ] "Next" button navigates to Interaction 3
  - [ ] Scores stored in sessionStorage

- [ ] **Interaction 3** → `/app/phase5/subphase/2/step/X/interaction/3`
  - [ ] Loads correctly
  - [ ] "Next" button navigates to Score Calculation
  - [ ] Scores stored in sessionStorage

### Score Calculation Navigation
- [ ] **Score Calculation** → `/app/phase5/subphase/2/step/X/score`
  - [ ] Calculates scores correctly from sessionStorage
  - [ ] Displays interaction scores
  - [ ] Routes to appropriate remedial level (A2/B1/B2/C1)
  - [ ] "Continue" button navigates to remedial Task A

### Remedial Navigation (All Steps, All Levels)
- [ ] **A2 Remedial Tasks** (3 tasks per step)
  - [ ] Task A → `/app/phase5/subphase/2/step/X/remedial/a2/task/a`
  - [ ] Task B → `/app/phase5/subphase/2/step/X/remedial/a2/task/b`
  - [ ] Task C → `/app/phase5/subphase/2/step/X/remedial/a2/task/c`
  - [ ] Each task navigates to next task or next step correctly

- [ ] **B1 Remedial Tasks** (3 tasks per step)
  - [ ] Task A → `/app/phase5/subphase/2/step/X/remedial/b1/task/a`
  - [ ] Task B → `/app/phase5/subphase/2/step/X/remedial/b1/task/b`
  - [ ] Task C → `/app/phase5/subphase/2/step/X/remedial/b1/task/c`
  - [ ] Each task navigates to next task or next step correctly

- [ ] **B2 Remedial Tasks** (4 tasks per step)
  - [ ] Task A → `/app/phase5/subphase/2/step/X/remedial/b2/task/a`
  - [ ] Task B → `/app/phase5/subphase/2/step/X/remedial/b2/task/b`
  - [ ] Task C → `/app/phase5/subphase/2/step/X/remedial/b2/task/c`
  - [ ] Task D → `/app/phase5/subphase/2/step/X/remedial/b2/task/d`
  - [ ] Each task navigates to next task or next step correctly

- [ ] **C1 Remedial Tasks** (4 tasks per step)
  - [ ] Task A → `/app/phase5/subphase/2/step/X/remedial/c1/task/a`
  - [ ] Task B → `/app/phase5/subphase/2/step/X/remedial/c1/task/b`
  - [ ] Task C → `/app/phase5/subphase/2/step/X/remedial/c1/task/c`
  - [ ] Task D → `/app/phase5/subphase/2/step/X/remedial/c1/task/d`
  - [ ] Each task navigates to next task or next step correctly

### Complete Flow Testing
- [ ] **Full Step Flow**: Intro → Interaction 1 → Interaction 2 → Interaction 3 → Score → Remedial → Next Step
- [ ] **Step 1 → Step 2**: Complete Step 1, verify Step 2 unlocks
- [ ] **Step 2 → Step 3**: Complete Step 2, verify Step 3 unlocks
- [ ] **Step 3 → Step 4**: Complete Step 3, verify Step 4 unlocks
- [ ] **Step 4 → Step 5**: Complete Step 4, verify Step 5 unlocks
- [ ] **Step 5 Completion**: Verify overall SubPhase 2 score calculation (≥12 points)

---

## 6.2 Score Calculations Testing

### Step-Level Score Calculation
- [ ] **Step 1 Scores**
  - [ ] Interaction 1 (Wordshake): 0-1 point
  - [ ] Interaction 2 (Instructions): 1-4 points (A2=1, B1=2, B2=3, C1=4)
  - [ ] Interaction 3 (Sushi Spell): 0-1 point
  - [ ] Total: 0-6 points

- [ ] **Step 2 Scores**
  - [ ] Interaction 1: 1-4 points
  - [ ] Interaction 2: 1-4 points
  - [ ] Interaction 3: 1-4 points
  - [ ] Total: 3-12 points

- [ ] **Step 3 Scores**
  - [ ] Interaction 1: 1-4 points
  - [ ] Interaction 2: 1-4 points
  - [ ] Interaction 3: 0-1 point
  - [ ] Total: 2-9 points

- [ ] **Step 4 Scores**
  - [ ] Interaction 1: 1-4 points
  - [ ] Interaction 2: 1-4 points
  - [ ] Interaction 3: 1-4 points
  - [ ] Total: 3-12 points

- [ ] **Step 5 Scores**
  - [ ] Interaction 1: 1-4 points
  - [ ] Interaction 2: 1-4 points
  - [ ] Interaction 3: 1-4 points
  - [ ] Total: 3-12 points

### Overall SubPhase 2 Score
- [ ] **Aggregation**: Sum of all 5 step scores
- [ ] **Threshold**: 12 points required to proceed
- [ ] **Display**: Step 5 ScoreCalculation shows overall total
- [ ] **Progression**: `should_proceed` flag set correctly (≥12)

### Remedial Score Calculation
- [ ] **Pass Threshold**: 6/8 correct (75%)
- [ ] **Scoring**: Each remedial task logs score correctly
- [ ] **Final Score**: Backend calculates final remedial score
- [ ] **Pass/Fail**: Correctly determines if remedial passed

---

## 6.3 Remedial Routing Testing

### CEFR Level Determination
- [ ] **A2 Level**: Assigned when interaction score = 1
- [ ] **B1 Level**: Assigned when interaction score = 2
- [ ] **B2 Level**: Assigned when interaction score = 3
- [ ] **C1 Level**: Assigned when interaction score = 4

### Remedial Routing Logic
- [ ] **Step 1**: Routes based on Interaction 2 score
- [ ] **Step 2**: Routes based on average of 3 interactions
- [ ] **Step 3**: Routes based on average of Interactions 1 & 2
- [ ] **Step 4**: Routes based on average of 3 interactions
- [ ] **Step 5**: Routes based on average of 3 interactions

### Remedial Task Progression
- [ ] **A2**: Task A → Task B → Task C → Next Step
- [ ] **B1**: Task A → Task B → Task C → Next Step
- [ ] **B2**: Task A → Task B → Task C → Task D → Next Step
- [ ] **C1**: Task A → Task B → Task C → Task D → Next Step

---

## 6.4 CEFR Evaluation Accuracy Testing

### Backend AI Evaluation
- [ ] **Step 1 Interaction 2**: Evaluates volunteer instructions correctly
  - [ ] A2 responses scored as 1 point
  - [ ] B1 responses scored as 2 points
  - [ ] B2 responses scored as 3 points
  - [ ] C1 responses scored as 4 points

- [ ] **Step 2 Interactions**: Evaluates writing and reflection correctly
- [ ] **Step 3 Interactions**: Evaluates explanations correctly
- [ ] **Step 4 Interactions**: Evaluates instruction writing correctly
- [ ] **Step 5 Interactions**: Evaluates corrections correctly

### Fallback Evaluation
- [ ] **Fallback Logic**: Activates when AI service fails
- [ ] **Scoring**: Fallback provides reasonable scores
- [ ] **Level Assignment**: Fallback assigns appropriate CEFR levels

### Response Examples Testing
- [ ] **A2 Examples**: Score correctly as 1 point
- [ ] **B1 Examples**: Score correctly as 2 points
- [ ] **B2 Examples**: Score correctly as 3 points
- [ ] **C1 Examples**: Score correctly as 4 points

---

## 6.5 Game Integrations Testing

### Wordshake Game (Steps 1, 3, 5)
- [ ] **Embedding**: Game loads correctly in iframe
- [ ] **URL**: `https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/wordshake`
- [ ] **Timer**: 3-minute timer works correctly
- [ ] **Tracking**: Completion tracked via `trackGame` API
- [ ] **Score Storage**: Score stored in sessionStorage
- [ ] **Navigation**: "Continue" button works after game

### Sushi Spell Game (Steps 1, 2, 3, 4)
- [ ] **Embedding**: Game loads correctly in iframe
- [ ] **URL**: `https://learnenglishteens.britishcouncil.org/vocabulary/vocabulary-games/sushi-spell`
- [ ] **Timer**: 2-minute timer works correctly
- [ ] **Tracking**: Completion tracked via `trackGame` API
- [ ] **Score Storage**: Score stored in sessionStorage
- [ ] **Integration**: Spelled terms integrated into writing tasks (Steps 2, 3, 4)

### Game Tracker Component
- [ ] **Display**: Shows game completion status
- [ ] **Time Tracking**: Tracks time played correctly
- [ ] **Completion**: Marks game as complete when finished

---

## 6.6 Responsive Design Testing

### Mobile Devices (< 768px)
- [ ] **Layout**: Components stack vertically
- [ ] **Text**: Readable font sizes
- [ ] **Buttons**: Touch-friendly sizes (min 44x44px)
- [ ] **Forms**: Input fields sized appropriately
- [ ] **Navigation**: Mobile-friendly navigation
- [ ] **Games**: Games display correctly on mobile

### Tablets (768px - 1024px)
- [ ] **Layout**: Responsive grid layouts
- [ ] **Text**: Appropriate font sizes
- [ ] **Buttons**: Touch-friendly sizes
- [ ] **Forms**: Comfortable input sizes
- [ ] **Navigation**: Tablet-optimized navigation

### Desktop (> 1024px)
- [ ] **Layout**: Full-width layouts utilized
- [ ] **Text**: Optimal font sizes
- [ ] **Buttons**: Standard sizes
- [ ] **Forms**: Comfortable input sizes
- [ ] **Navigation**: Desktop navigation works

### Cross-Browser Testing
- [ ] **Chrome**: All features work correctly
- [ ] **Firefox**: All features work correctly
- [ ] **Safari**: All features work correctly
- [ ] **Edge**: All features work correctly

---

## 6.7 Build Verification

### Frontend Build
- [ ] **Build Command**: `npm run build` completes without errors
- [ ] **Build Output**: Files generated in `dist/` directory
- [ ] **No Console Errors**: Build produces no errors
- [ ] **No Warnings**: Build produces no warnings (or acceptable warnings)
- [ ] **Bundle Size**: Bundle size is reasonable

### Backend Verification
- [ ] **Routes**: All routes registered correctly
- [ ] **Database**: Database schema supports SubPhase 2
- [ ] **API Endpoints**: All endpoints respond correctly
- [ ] **Error Handling**: Error handling works correctly

### Integration Verification
- [ ] **API Calls**: Frontend API calls work correctly
- [ ] **Session Management**: Sessions persist correctly
- [ ] **Score Storage**: Scores stored in database correctly
- [ ] **Progress Tracking**: Progress tracked correctly

---

## Additional Testing Notes

### Error Handling
- [ ] **Network Errors**: Handled gracefully
- [ ] **API Timeouts**: Handled with retry logic
- [ ] **Invalid Input**: Validated correctly
- [ ] **Missing Data**: Handled with fallbacks

### Performance
- [ ] **Page Load**: Pages load within 3 seconds
- [ ] **API Response**: API responses within 2 seconds
- [ ] **Large Text**: Handles large text inputs efficiently
- [ ] **Memory**: No memory leaks during long sessions

### Accessibility
- [ ] **Keyboard Navigation**: All interactive elements keyboard accessible
- [ ] **Screen Readers**: ARIA labels present
- [ ] **Color Contrast**: Meets WCAG AA standards
- [ ] **Focus Indicators**: Visible focus indicators

---

## Test Results Summary

**Date**: _______________
**Tester**: _______________
**Environment**: _______________

### Overall Status
- [ ] All tests passed
- [ ] Some tests failed (see notes below)
- [ ] Critical issues found

### Issues Found
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Notes
_________________________________________________
_________________________________________________
_________________________________________________

---

**Status**: Ready for Production ✅ / Needs Fixes ⚠️ / Not Ready ❌
