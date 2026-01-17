import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Welcome from './pages/Welcome.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Game from './pages/Game.jsx'
import Results from './pages/Results.jsx'
import Phase2Intro from './pages/Phase2Intro.jsx'
import Phase2Step from './pages/Phase2Step.jsx'
import Phase2Complete from './pages/Phase2Complete.jsx'
import Phase2Remedial from './pages/Phase2Remedial.jsx'
import Phase2StepResults from './pages/Phase2StepResults.jsx'
// Phase 4 Step 1 imports - organized in folder
import Phase4Step1Intro from './pages/Phase4Step1/index.jsx'
import Phase4Step1Interaction1 from './pages/Phase4Step1/Interaction1.jsx'
import Phase4Step1Interaction2 from './pages/Phase4Step1/Interaction2.jsx'
import Phase4Step1Interaction3 from './pages/Phase4Step1/Interaction3.jsx'

// Phase 4 Step 3 imports - organized in folder
import Phase4Step3Intro from './pages/Phase4Step3/index.jsx'
import Phase4Step3VocabularyWarmup from './pages/Phase4Step3/VocabularyWarmup.jsx'
import Phase4Step3Interaction1 from './pages/Phase4Step3/Interaction1.jsx'
import Phase4Step3Interaction2 from './pages/Phase4Step3/Interaction2.jsx'
import Phase4Step3Interaction3 from './pages/Phase4Step3/Interaction3.jsx'

// Phase 4 Step 4 imports - organized in folder
import Phase4Step4Intro from './pages/Phase4Step4/index.jsx'
import Phase4Step4Interaction1 from './pages/Phase4Step4/Interaction1.jsx'
import Phase4Step4Interaction2 from './pages/Phase4Step4/Interaction2.jsx'
import Phase4Step4Interaction3 from './pages/Phase4Step4/Interaction3.jsx'

// Phase 4 Step 4 Remedial imports
import Phase4Step4RemedialA1TaskA from './pages/Phase4Step4/RemedialA1/TaskA.jsx'
import Phase4Step4RemedialA1TaskB from './pages/Phase4Step4/RemedialA1/TaskB.jsx'
import Phase4Step4RemedialA1TaskC from './pages/Phase4Step4/RemedialA1/TaskC.jsx'
import Phase4Step4RemedialA2TaskA from './pages/Phase4Step4/RemedialA2/TaskA.jsx'
import Phase4Step4RemedialA2TaskB from './pages/Phase4Step4/RemedialA2/TaskB.jsx'
import Phase4Step4RemedialA2TaskC from './pages/Phase4Step4/RemedialA2/TaskC.jsx'
import Phase4Step4RemedialB1TaskA from './pages/Phase4Step4/RemedialB1/TaskA.jsx'
import Phase4Step4RemedialB1TaskB from './pages/Phase4Step4/RemedialB1/TaskB.jsx'
import Phase4Step4RemedialB1TaskC from './pages/Phase4Step4/RemedialB1/TaskC.jsx'
import Phase4Step4RemedialB1TaskD from './pages/Phase4Step4/RemedialB1/TaskD.jsx'
import Phase4Step4RemedialB1TaskE from './pages/Phase4Step4/RemedialB1/TaskE.jsx'
import Phase4Step4RemedialB1TaskF from './pages/Phase4Step4/RemedialB1/TaskF.jsx'
import Phase4Step4RemedialB1Results from './pages/Phase4Step4/RemedialB1/Results.jsx'
import Phase4Step4RemedialB2TaskA from './pages/Phase4Step4/RemedialB2/TaskA.jsx'
import Phase4Step4RemedialB2TaskB from './pages/Phase4Step4/RemedialB2/TaskB.jsx'
import Phase4Step4RemedialB2TaskC from './pages/Phase4Step4/RemedialB2/TaskC.jsx'
import Phase4Step4RemedialB2TaskD from './pages/Phase4Step4/RemedialB2/TaskD.jsx'
import Phase4Step4RemedialB2Results from './pages/Phase4Step4/RemedialB2/Results.jsx'
import Phase4Step4RemedialC1TaskA from './pages/Phase4Step4/RemedialC1/TaskA.jsx'
import Phase4Step4RemedialC1TaskB from './pages/Phase4Step4/RemedialC1/TaskB.jsx'
import Phase4Step4RemedialC1TaskC from './pages/Phase4Step4/RemedialC1/TaskC.jsx'
import Phase4Step4RemedialC1TaskD from './pages/Phase4Step4/RemedialC1/TaskD.jsx'
import Phase4Step4RemedialC1Results from './pages/Phase4Step4/RemedialC1/Results.jsx'

// Phase 4 Step 1 Remedial imports - organized inside Phase4Step1 folder
import RemedialA1TaskA from './pages/Phase4Step1/RemedialA1/TaskA.jsx'
import RemedialA1TaskB from './pages/Phase4Step1/RemedialA1/TaskB.jsx'

import RemedialA2TaskA from './pages/Phase4Step1/RemedialA2/TaskA.jsx'
import RemedialA2TaskB from './pages/Phase4Step1/RemedialA2/TaskB.jsx'

import RemedialB1TaskA from './pages/Phase4Step1/RemedialB1/TaskA.jsx'
import RemedialB1TaskB from './pages/Phase4Step1/RemedialB1/TaskB.jsx'
import RemedialB1TaskC from './pages/Phase4Step1/RemedialB1/TaskC.jsx'
import RemedialB1TaskD from './pages/Phase4Step1/RemedialB1/TaskD.jsx'

import RemedialB2TaskA from './pages/Phase4Step1/RemedialB2/TaskA.jsx'
import RemedialB2TaskB from './pages/Phase4Step1/RemedialB2/TaskB.jsx'
import RemedialB2TaskC from './pages/Phase4Step1/RemedialB2/TaskC.jsx'
import RemedialB2TaskD from './pages/Phase4Step1/RemedialB2/TaskD.jsx'

import RemedialC1TaskA from './pages/Phase4Step1/RemedialC1/TaskA.jsx'
import RemedialC1TaskB from './pages/Phase4Step1/RemedialC1/TaskB.jsx'
import RemedialC1TaskC from './pages/Phase4Step1/RemedialC1/TaskC.jsx'
import RemedialC1TaskD from './pages/Phase4Step1/RemedialC1/TaskD.jsx'

// Phase 4 Step 3 Remedial imports
import RemedialStep3A1TaskA from './pages/Phase4Step3/RemedialA1/TaskA.jsx'
import RemedialStep3A1TaskB from './pages/Phase4Step3/RemedialA1/TaskB.jsx'
import RemedialStep3A1TaskC from './pages/Phase4Step3/RemedialA1/TaskC.jsx'

import RemedialStep3A2TaskA from './pages/Phase4Step3/RemedialA2/TaskA.jsx'
import RemedialStep3A2TaskB from './pages/Phase4Step3/RemedialA2/TaskB.jsx'
import RemedialStep3A2TaskC from './pages/Phase4Step3/RemedialA2/TaskC.jsx'

import RemedialStep3B1TaskA from './pages/Phase4Step3/RemedialB1/TaskA.jsx'
import RemedialStep3B1TaskB from './pages/Phase4Step3/RemedialB1/TaskB.jsx'
import RemedialStep3B1TaskC from './pages/Phase4Step3/RemedialB1/TaskC.jsx'
import RemedialStep3B1TaskD from './pages/Phase4Step3/RemedialB1/TaskD.jsx'
import RemedialStep3B1TaskE from './pages/Phase4Step3/RemedialB1/TaskE.jsx'
import RemedialStep3B1TaskF from './pages/Phase4Step3/RemedialB1/TaskF.jsx'
import RemedialStep3B1Results from './pages/Phase4Step3/RemedialB1/Results.jsx'

import RemedialStep3B2TaskA from './pages/Phase4Step3/RemedialB2/TaskA.jsx'
import RemedialStep3B2TaskB from './pages/Phase4Step3/RemedialB2/TaskB.jsx'
import RemedialStep3B2TaskC from './pages/Phase4Step3/RemedialB2/TaskC.jsx'
import RemedialStep3B2TaskD from './pages/Phase4Step3/RemedialB2/TaskD.jsx'
import RemedialStep3B2TaskE from './pages/Phase4Step3/RemedialB2/TaskE.jsx'
import RemedialStep3B2TaskF from './pages/Phase4Step3/RemedialB2/TaskF.jsx'
import RemedialStep3B2Results from './pages/Phase4Step3/RemedialB2/Results.jsx'

import RemedialStep3C1TaskA from './pages/Phase4Step3/RemedialC1/TaskA.jsx'
import RemedialStep3C1TaskB from './pages/Phase4Step3/RemedialC1/TaskB.jsx'
import RemedialStep3C1TaskC from './pages/Phase4Step3/RemedialC1/TaskC.jsx'
import RemedialStep3C1TaskD from './pages/Phase4Step3/RemedialC1/TaskD.jsx'
import RemedialStep3C1TaskE from './pages/Phase4Step3/RemedialC1/TaskE.jsx'
import RemedialStep3C1TaskF from './pages/Phase4Step3/RemedialC1/TaskF.jsx'
import RemedialStep3C1TaskG from './pages/Phase4Step3/RemedialC1/TaskG.jsx'
import RemedialStep3C1TaskH from './pages/Phase4Step3/RemedialC1/TaskH.jsx'

import Certificate from './pages/Certificate.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import DeleteAccount from './pages/DeleteAccount.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUserViewer from './pages/AdminUserViewer.jsx'
import AdminAnalytics from './pages/AdminAnalytics.jsx'
import AdminExerciseBuilder from './pages/AdminExerciseBuilder.jsx'
import AdminExerciseEditor from './pages/AdminExerciseEditor.jsx'
import AdminWorkflowEditor from './pages/AdminWorkflowEditor.jsx'
import NotFound from './pages/NotFound.jsx'
import { ApiProvider, useAuth } from './lib/api.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { ConfettiCannon } from './components/gamification'


function App() {
  return (
    <ApiProvider>
      <ConfettiCannon />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/certificate" element={<Certificate />} />

          {/* Phase 2 Routes */}
          <Route path="/phase2" element={<Phase2Intro />} />
          <Route path="/phase2/step/:stepId" element={<Phase2Step />} />
          <Route path="/phase2/step/:stepId/results" element={<Phase2StepResults />} />
          <Route path="/phase2/remedial/:stepId/:level" element={<Phase2Remedial />} />
          <Route path="/phase2/complete" element={<Phase2Complete />} />

          {/* Phase 4 Routes */}
          <Route path="/phase4/step/1" element={<Phase4Step1Intro />} />
          <Route path="/app/phase4/step/1" element={<Phase4Step1Intro />} />
          <Route path="/phase4/step/1/interaction/1" element={<Phase4Step1Interaction1 />} />
          <Route path="/app/phase4/step/1/interaction/1" element={<Phase4Step1Interaction1 />} />
          <Route path="/phase4/step/1/interaction/2" element={<Phase4Step1Interaction2 />} />
          <Route path="/app/phase4/step/1/interaction/2" element={<Phase4Step1Interaction2 />} />
          <Route path="/phase4/step/1/interaction/3" element={<Phase4Step1Interaction3 />} />
          <Route path="/app/phase4/step/1/interaction/3" element={<Phase4Step1Interaction3 />} />
          <Route path="/phase4/step/3" element={<Phase4Step3Intro />} />
          <Route path="/app/phase4/step/3" element={<Phase4Step3Intro />} />
          <Route path="/phase4/step/3/vocabulary" element={<Phase4Step3VocabularyWarmup />} />
          <Route path="/app/phase4/step/3/vocabulary" element={<Phase4Step3VocabularyWarmup />} />
          <Route path="/phase4/step/3/interaction/1" element={<Phase4Step3Interaction1 />} />
          <Route path="/app/phase4/step/3/interaction/1" element={<Phase4Step3Interaction1 />} />
          <Route path="/phase4/step/3/interaction/2" element={<Phase4Step3Interaction2 />} />
          <Route path="/app/phase4/step/3/interaction/2" element={<Phase4Step3Interaction2 />} />
          <Route path="/phase4/step/3/interaction/3" element={<Phase4Step3Interaction3 />} />
          <Route path="/app/phase4/step/3/interaction/3" element={<Phase4Step3Interaction3 />} />

          {/* Phase 4 Step 4 Routes */}
          <Route path="/phase4/step/4" element={<Phase4Step4Intro />} />
          <Route path="/app/phase4/step/4" element={<Phase4Step4Intro />} />
          <Route path="/phase4/step/4/interaction/1" element={<Phase4Step4Interaction1 />} />
          <Route path="/app/phase4/step/4/interaction/1" element={<Phase4Step4Interaction1 />} />
          <Route path="/phase4/step/4/interaction/2" element={<Phase4Step4Interaction2 />} />
          <Route path="/app/phase4/step/4/interaction/2" element={<Phase4Step4Interaction2 />} />
          <Route path="/phase4/step/4/interaction/3" element={<Phase4Step4Interaction3 />} />
          <Route path="/app/phase4/step/4/interaction/3" element={<Phase4Step4Interaction3 />} />

          {/* Phase 4 Step 4 Remedial A1 Routes */}
          <Route path="/phase4/step/4/remedial/a1/taskA" element={<Phase4Step4RemedialA1TaskA />} />
          <Route path="/app/phase4/step/4/remedial/a1/taskA" element={<Phase4Step4RemedialA1TaskA />} />
          <Route path="/phase4/step/4/remedial/a1/taskB" element={<Phase4Step4RemedialA1TaskB />} />
          <Route path="/app/phase4/step/4/remedial/a1/taskB" element={<Phase4Step4RemedialA1TaskB />} />
          <Route path="/phase4/step/4/remedial/a1/taskC" element={<Phase4Step4RemedialA1TaskC />} />
          <Route path="/app/phase4/step/4/remedial/a1/taskC" element={<Phase4Step4RemedialA1TaskC />} />

          {/* Phase 4 Step 4 Remedial A2 Routes */}
          <Route path="/phase4/step/4/remedial/a2/taskA" element={<Phase4Step4RemedialA2TaskA />} />
          <Route path="/app/phase4/step/4/remedial/a2/taskA" element={<Phase4Step4RemedialA2TaskA />} />
          <Route path="/phase4/step/4/remedial/a2/taskB" element={<Phase4Step4RemedialA2TaskB />} />
          <Route path="/app/phase4/step/4/remedial/a2/taskB" element={<Phase4Step4RemedialA2TaskB />} />
          <Route path="/phase4/step/4/remedial/a2/taskC" element={<Phase4Step4RemedialA2TaskC />} />
          <Route path="/app/phase4/step/4/remedial/a2/taskC" element={<Phase4Step4RemedialA2TaskC />} />

          {/* Phase 4 Step 4 Remedial B1 Routes */}
          <Route path="/phase4/step/4/remedial/b1/taskA" element={<Phase4Step4RemedialB1TaskA />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskA" element={<Phase4Step4RemedialB1TaskA />} />
          <Route path="/phase4/step/4/remedial/b1/taskB" element={<Phase4Step4RemedialB1TaskB />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskB" element={<Phase4Step4RemedialB1TaskB />} />
          <Route path="/phase4/step/4/remedial/b1/taskC" element={<Phase4Step4RemedialB1TaskC />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskC" element={<Phase4Step4RemedialB1TaskC />} />
          <Route path="/phase4/step/4/remedial/b1/taskD" element={<Phase4Step4RemedialB1TaskD />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskD" element={<Phase4Step4RemedialB1TaskD />} />
          <Route path="/phase4/step/4/remedial/b1/taskE" element={<Phase4Step4RemedialB1TaskE />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskE" element={<Phase4Step4RemedialB1TaskE />} />
          <Route path="/phase4/step/4/remedial/b1/taskF" element={<Phase4Step4RemedialB1TaskF />} />
          <Route path="/app/phase4/step/4/remedial/b1/taskF" element={<Phase4Step4RemedialB1TaskF />} />
          <Route path="/phase4/step/4/remedial/b1/results" element={<Phase4Step4RemedialB1Results />} />
          <Route path="/app/phase4/step/4/remedial/b1/results" element={<Phase4Step4RemedialB1Results />} />

          {/* Phase 4 Step 4 Remedial B2 Routes */}
          <Route path="/phase4/step/4/remedial/b2/taskA" element={<Phase4Step4RemedialB2TaskA />} />
          <Route path="/app/phase4/step/4/remedial/b2/taskA" element={<Phase4Step4RemedialB2TaskA />} />
          <Route path="/phase4/step/4/remedial/b2/taskB" element={<Phase4Step4RemedialB2TaskB />} />
          <Route path="/app/phase4/step/4/remedial/b2/taskB" element={<Phase4Step4RemedialB2TaskB />} />
          <Route path="/phase4/step/4/remedial/b2/taskC" element={<Phase4Step4RemedialB2TaskC />} />
          <Route path="/app/phase4/step/4/remedial/b2/taskC" element={<Phase4Step4RemedialB2TaskC />} />
          <Route path="/phase4/step/4/remedial/b2/taskD" element={<Phase4Step4RemedialB2TaskD />} />
          <Route path="/app/phase4/step/4/remedial/b2/taskD" element={<Phase4Step4RemedialB2TaskD />} />
          <Route path="/phase4/step/4/remedial/b2/results" element={<Phase4Step4RemedialB2Results />} />
          <Route path="/app/phase4/step/4/remedial/b2/results" element={<Phase4Step4RemedialB2Results />} />

          {/* Phase 4 Step 4 Remedial C1 Routes */}
          <Route path="/phase4/step/4/remedial/c1/taskA" element={<Phase4Step4RemedialC1TaskA />} />
          <Route path="/app/phase4/step/4/remedial/c1/taskA" element={<Phase4Step4RemedialC1TaskA />} />
          <Route path="/phase4/step/4/remedial/c1/taskB" element={<Phase4Step4RemedialC1TaskB />} />
          <Route path="/app/phase4/step/4/remedial/c1/taskB" element={<Phase4Step4RemedialC1TaskB />} />
          <Route path="/phase4/step/4/remedial/c1/taskC" element={<Phase4Step4RemedialC1TaskC />} />
          <Route path="/app/phase4/step/4/remedial/c1/taskC" element={<Phase4Step4RemedialC1TaskC />} />
          <Route path="/phase4/step/4/remedial/c1/taskD" element={<Phase4Step4RemedialC1TaskD />} />
          <Route path="/app/phase4/step/4/remedial/c1/taskD" element={<Phase4Step4RemedialC1TaskD />} />
          <Route path="/phase4/step/4/remedial/c1/results" element={<Phase4Step4RemedialC1Results />} />
          <Route path="/app/phase4/step/4/remedial/c1/results" element={<Phase4Step4RemedialC1Results />} />

          {/* Phase 4 Remedial Routes */}
          <Route path="/phase4/remedial/a1/taskA" element={<RemedialA1TaskA />} />
          <Route path="/app/phase4/remedial/a1/taskA" element={<RemedialA1TaskA />} />
          <Route path="/phase4/remedial/a1/taskB" element={<RemedialA1TaskB />} />
          <Route path="/app/phase4/remedial/a1/taskB" element={<RemedialA1TaskB />} />
          <Route path="/phase4/remedial/a2/taskA" element={<RemedialA2TaskA />} />
          <Route path="/app/phase4/remedial/a2/taskA" element={<RemedialA2TaskA />} />
          <Route path="/phase4/remedial/a2/taskB" element={<RemedialA2TaskB />} />
          <Route path="/app/phase4/remedial/a2/taskB" element={<RemedialA2TaskB />} />
          <Route path="/phase4/remedial/b1/taskA" element={<RemedialB1TaskA />} />
          <Route path="/app/phase4/remedial/b1/taskA" element={<RemedialB1TaskA />} />
          <Route path="/phase4/remedial/b1/taskB" element={<RemedialB1TaskB />} />
          <Route path="/app/phase4/remedial/b1/taskB" element={<RemedialB1TaskB />} />
          <Route path="/phase4/remedial/b1/taskC" element={<RemedialB1TaskC />} />
          <Route path="/app/phase4/remedial/b1/taskC" element={<RemedialB1TaskC />} />
          <Route path="/phase4/remedial/b1/taskD" element={<RemedialB1TaskD />} />
          <Route path="/app/phase4/remedial/b1/taskD" element={<RemedialB1TaskD />} />
          <Route path="/phase4/remedial/b2/taskA" element={<RemedialB2TaskA />} />
          <Route path="/app/phase4/remedial/b2/taskA" element={<RemedialB2TaskA />} />
          <Route path="/phase4/remedial/b2/taskB" element={<RemedialB2TaskB />} />
          <Route path="/app/phase4/remedial/b2/taskB" element={<RemedialB2TaskB />} />
          <Route path="/phase4/remedial/b2/taskC" element={<RemedialB2TaskC />} />
          <Route path="/app/phase4/remedial/b2/taskC" element={<RemedialB2TaskC />} />
          <Route path="/phase4/remedial/b2/taskD" element={<RemedialB2TaskD />} />
          <Route path="/app/phase4/remedial/b2/taskD" element={<RemedialB2TaskD />} />
          <Route path="/phase4/remedial/c1/taskA" element={<RemedialC1TaskA />} />
          <Route path="/app/phase4/remedial/c1/taskA" element={<RemedialC1TaskA />} />
          <Route path="/phase4/remedial/c1/taskB" element={<RemedialC1TaskB />} />
          <Route path="/app/phase4/remedial/c1/taskB" element={<RemedialC1TaskB />} />
          <Route path="/phase4/remedial/c1/taskC" element={<RemedialC1TaskC />} />
          <Route path="/app/phase4/remedial/c1/taskC" element={<RemedialC1TaskC />} />
          <Route path="/phase4/remedial/c1/taskD" element={<RemedialC1TaskD />} />
          <Route path="/app/phase4/remedial/c1/taskD" element={<RemedialC1TaskD />} />

          {/* Phase 4 Step 3 Remedial Routes */}
          <Route path="/phase4/step3/remedial/a1/taskA" element={<RemedialStep3A1TaskA />} />
          <Route path="/app/phase4/step3/remedial/a1/taskA" element={<RemedialStep3A1TaskA />} />
          <Route path="/phase4/step3/remedial/a1/taskB" element={<RemedialStep3A1TaskB />} />
          <Route path="/app/phase4/step3/remedial/a1/taskB" element={<RemedialStep3A1TaskB />} />
          <Route path="/phase4/step3/remedial/a1/taskC" element={<RemedialStep3A1TaskC />} />
          <Route path="/app/phase4/step3/remedial/a1/taskC" element={<RemedialStep3A1TaskC />} />

          <Route path="/phase4/step3/remedial/a2/taskA" element={<RemedialStep3A2TaskA />} />
          <Route path="/app/phase4/step3/remedial/a2/taskA" element={<RemedialStep3A2TaskA />} />
          <Route path="/phase4/step3/remedial/a2/taskB" element={<RemedialStep3A2TaskB />} />
          <Route path="/app/phase4/step3/remedial/a2/taskB" element={<RemedialStep3A2TaskB />} />
          <Route path="/phase4/step3/remedial/a2/taskC" element={<RemedialStep3A2TaskC />} />
          <Route path="/app/phase4/step3/remedial/a2/taskC" element={<RemedialStep3A2TaskC />} />

          <Route path="/phase4/step3/remedial/b1/taskA" element={<RemedialStep3B1TaskA />} />
          <Route path="/app/phase4/step3/remedial/b1/taskA" element={<RemedialStep3B1TaskA />} />
          <Route path="/phase4/step3/remedial/b1/taskB" element={<RemedialStep3B1TaskB />} />
          <Route path="/app/phase4/step3/remedial/b1/taskB" element={<RemedialStep3B1TaskB />} />
          <Route path="/phase4/step3/remedial/b1/taskC" element={<RemedialStep3B1TaskC />} />
          <Route path="/app/phase4/step3/remedial/b1/taskC" element={<RemedialStep3B1TaskC />} />
          <Route path="/phase4/step3/remedial/b1/taskD" element={<RemedialStep3B1TaskD />} />
          <Route path="/app/phase4/step3/remedial/b1/taskD" element={<RemedialStep3B1TaskD />} />
          <Route path="/phase4/step3/remedial/b1/taskE" element={<RemedialStep3B1TaskE />} />
          <Route path="/app/phase4/step3/remedial/b1/taskE" element={<RemedialStep3B1TaskE />} />
          <Route path="/phase4/step3/remedial/b1/taskF" element={<RemedialStep3B1TaskF />} />
          <Route path="/app/phase4/step3/remedial/b1/taskF" element={<RemedialStep3B1TaskF />} />
          <Route path="/phase4/step3/remedial/b1/results" element={<RemedialStep3B1Results />} />
          <Route path="/app/phase4/step3/remedial/b1/results" element={<RemedialStep3B1Results />} />

          <Route path="/phase4/step3/remedial/b2/taskA" element={<RemedialStep3B2TaskA />} />
          <Route path="/app/phase4/step3/remedial/b2/taskA" element={<RemedialStep3B2TaskA />} />
          <Route path="/phase4/step3/remedial/b2/taskB" element={<RemedialStep3B2TaskB />} />
          <Route path="/app/phase4/step3/remedial/b2/taskB" element={<RemedialStep3B2TaskB />} />
          <Route path="/phase4/step3/remedial/b2/taskC" element={<RemedialStep3B2TaskC />} />
          <Route path="/app/phase4/step3/remedial/b2/taskC" element={<RemedialStep3B2TaskC />} />
          <Route path="/phase4/step3/remedial/b2/taskD" element={<RemedialStep3B2TaskD />} />
          <Route path="/app/phase4/step3/remedial/b2/taskD" element={<RemedialStep3B2TaskD />} />
          <Route path="/phase4/step3/remedial/b2/taskE" element={<RemedialStep3B2TaskE />} />
          <Route path="/app/phase4/step3/remedial/b2/taskE" element={<RemedialStep3B2TaskE />} />
          <Route path="/phase4/step3/remedial/b2/taskF" element={<RemedialStep3B2TaskF />} />
          <Route path="/app/phase4/step3/remedial/b2/taskF" element={<RemedialStep3B2TaskF />} />
          <Route path="/phase4/step3/remedial/b2/results" element={<RemedialStep3B2Results />} />
          <Route path="/app/phase4/step3/remedial/b2/results" element={<RemedialStep3B2Results />} />

          <Route path="/phase4/step3/remedial/c1/taskA" element={<RemedialStep3C1TaskA />} />
          <Route path="/app/phase4/step3/remedial/c1/taskA" element={<RemedialStep3C1TaskA />} />
          <Route path="/phase4/step3/remedial/c1/taskB" element={<RemedialStep3C1TaskB />} />
          <Route path="/app/phase4/step3/remedial/c1/taskB" element={<RemedialStep3C1TaskB />} />
          <Route path="/phase4/step3/remedial/c1/taskC" element={<RemedialStep3C1TaskC />} />
          <Route path="/app/phase4/step3/remedial/c1/taskC" element={<RemedialStep3C1TaskC />} />
          <Route path="/phase4/step3/remedial/c1/taskD" element={<RemedialStep3C1TaskD />} />
          <Route path="/app/phase4/step3/remedial/c1/taskD" element={<RemedialStep3C1TaskD />} />
          <Route path="/phase4/step3/remedial/c1/taskE" element={<RemedialStep3C1TaskE />} />
          <Route path="/app/phase4/step3/remedial/c1/taskE" element={<RemedialStep3C1TaskE />} />
          <Route path="/phase4/step3/remedial/c1/taskF" element={<RemedialStep3C1TaskF />} />
          <Route path="/app/phase4/step3/remedial/c1/taskF" element={<RemedialStep3C1TaskF />} />
          <Route path="/phase4/step3/remedial/c1/taskG" element={<RemedialStep3C1TaskG />} />
          <Route path="/app/phase4/step3/remedial/c1/taskG" element={<RemedialStep3C1TaskG />} />
          <Route path="/phase4/step3/remedial/c1/taskH" element={<RemedialStep3C1TaskH />} />
          <Route path="/app/phase4/step3/remedial/c1/taskH" element={<RemedialStep3C1TaskH />} />

          {/* Profile Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/delete-account" element={<DeleteAccount />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users/:userId" element={<AdminUserViewer />} />
          <Route path="/admin/exercises" element={<AdminExerciseBuilder />} />
          <Route path="/admin/exercises/create" element={<AdminExerciseEditor />} />
          <Route path="/admin/exercises/edit/:exerciseId" element={<AdminExerciseEditor />} />
          <Route path="/admin/exercises/workflow/:workflowId/edit" element={<AdminWorkflowEditor />} />
          <Route path="/admin/exercises/workflow/:workflowId/preview" element={<AdminWorkflowEditor />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ApiProvider>
  )
}

export default App
