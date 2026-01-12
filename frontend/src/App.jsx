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

// Phase 4 Step 2 imports - organized in folder
import Phase4Step2Intro from './pages/Phase4Step2/index.jsx'
import Phase4Step2VocabularyWarmup from './pages/Phase4Step2/VocabularyWarmup.jsx'
import Phase4Step2Interaction1 from './pages/Phase4Step2/Interaction1.jsx'
import Phase4Step2Interaction2 from './pages/Phase4Step2/Interaction2.jsx'
import Phase4Step2Interaction3 from './pages/Phase4Step2/Interaction3.jsx'

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

// Phase 4 Step 2 Remedial imports
import RemedialStep2A1TaskA from './pages/Phase4Step2/RemedialA1/TaskA.jsx'
import RemedialStep2A1TaskB from './pages/Phase4Step2/RemedialA1/TaskB.jsx'
import RemedialStep2A1TaskC from './pages/Phase4Step2/RemedialA1/TaskC.jsx'

import RemedialStep2A2TaskA from './pages/Phase4Step2/RemedialA2/TaskA.jsx'
import RemedialStep2A2TaskB from './pages/Phase4Step2/RemedialA2/TaskB.jsx'
import RemedialStep2A2TaskC from './pages/Phase4Step2/RemedialA2/TaskC.jsx'

import RemedialStep2B1TaskA from './pages/Phase4Step2/RemedialB1/TaskA.jsx'
import RemedialStep2B1TaskB from './pages/Phase4Step2/RemedialB1/TaskB.jsx'
import RemedialStep2B1TaskC from './pages/Phase4Step2/RemedialB1/TaskC.jsx'
import RemedialStep2B1TaskD from './pages/Phase4Step2/RemedialB1/TaskD.jsx'
import RemedialStep2B1TaskE from './pages/Phase4Step2/RemedialB1/TaskE.jsx'
import RemedialStep2B1TaskF from './pages/Phase4Step2/RemedialB1/TaskF.jsx'
import RemedialStep2B1Results from './pages/Phase4Step2/RemedialB1/Results.jsx'

import RemedialStep2B2TaskA from './pages/Phase4Step2/RemedialB2/TaskA.jsx'
import RemedialStep2B2TaskB from './pages/Phase4Step2/RemedialB2/TaskB.jsx'
import RemedialStep2B2TaskC from './pages/Phase4Step2/RemedialB2/TaskC.jsx'
import RemedialStep2B2TaskD from './pages/Phase4Step2/RemedialB2/TaskD.jsx'
import RemedialStep2B2TaskE from './pages/Phase4Step2/RemedialB2/TaskE.jsx'
import RemedialStep2B2TaskF from './pages/Phase4Step2/RemedialB2/TaskF.jsx'
import RemedialStep2B2Results from './pages/Phase4Step2/RemedialB2/Results.jsx'

import RemedialStep2C1TaskA from './pages/Phase4Step2/RemedialC1/TaskA.jsx'
import RemedialStep2C1TaskB from './pages/Phase4Step2/RemedialC1/TaskB.jsx'
import RemedialStep2C1TaskC from './pages/Phase4Step2/RemedialC1/TaskC.jsx'
import RemedialStep2C1TaskD from './pages/Phase4Step2/RemedialC1/TaskD.jsx'
import RemedialStep2C1TaskE from './pages/Phase4Step2/RemedialC1/TaskE.jsx'
import RemedialStep2C1TaskF from './pages/Phase4Step2/RemedialC1/TaskF.jsx'
import RemedialStep2C1TaskG from './pages/Phase4Step2/RemedialC1/TaskG.jsx'
import RemedialStep2C1TaskH from './pages/Phase4Step2/RemedialC1/TaskH.jsx'

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
          <Route path="/phase4/step/2" element={<Phase4Step2Intro />} />
          <Route path="/app/phase4/step/2" element={<Phase4Step2Intro />} />
          <Route path="/phase4/step/2/vocabulary" element={<Phase4Step2VocabularyWarmup />} />
          <Route path="/app/phase4/step/2/vocabulary" element={<Phase4Step2VocabularyWarmup />} />
          <Route path="/phase4/step/2/interaction/1" element={<Phase4Step2Interaction1 />} />
          <Route path="/app/phase4/step/2/interaction/1" element={<Phase4Step2Interaction1 />} />
          <Route path="/phase4/step/2/interaction/2" element={<Phase4Step2Interaction2 />} />
          <Route path="/app/phase4/step/2/interaction/2" element={<Phase4Step2Interaction2 />} />
          <Route path="/phase4/step/2/interaction/3" element={<Phase4Step2Interaction3 />} />
          <Route path="/app/phase4/step/2/interaction/3" element={<Phase4Step2Interaction3 />} />

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

          {/* Phase 4 Step 2 Remedial Routes */}
          <Route path="/phase4/step2/remedial/a1/taskA" element={<RemedialStep2A1TaskA />} />
          <Route path="/app/phase4/step2/remedial/a1/taskA" element={<RemedialStep2A1TaskA />} />
          <Route path="/phase4/step2/remedial/a1/taskB" element={<RemedialStep2A1TaskB />} />
          <Route path="/app/phase4/step2/remedial/a1/taskB" element={<RemedialStep2A1TaskB />} />
          <Route path="/phase4/step2/remedial/a1/taskC" element={<RemedialStep2A1TaskC />} />
          <Route path="/app/phase4/step2/remedial/a1/taskC" element={<RemedialStep2A1TaskC />} />

          <Route path="/phase4/step2/remedial/a2/taskA" element={<RemedialStep2A2TaskA />} />
          <Route path="/app/phase4/step2/remedial/a2/taskA" element={<RemedialStep2A2TaskA />} />
          <Route path="/phase4/step2/remedial/a2/taskB" element={<RemedialStep2A2TaskB />} />
          <Route path="/app/phase4/step2/remedial/a2/taskB" element={<RemedialStep2A2TaskB />} />
          <Route path="/phase4/step2/remedial/a2/taskC" element={<RemedialStep2A2TaskC />} />
          <Route path="/app/phase4/step2/remedial/a2/taskC" element={<RemedialStep2A2TaskC />} />

          <Route path="/phase4/step2/remedial/b1/taskA" element={<RemedialStep2B1TaskA />} />
          <Route path="/app/phase4/step2/remedial/b1/taskA" element={<RemedialStep2B1TaskA />} />
          <Route path="/phase4/step2/remedial/b1/taskB" element={<RemedialStep2B1TaskB />} />
          <Route path="/app/phase4/step2/remedial/b1/taskB" element={<RemedialStep2B1TaskB />} />
          <Route path="/phase4/step2/remedial/b1/taskC" element={<RemedialStep2B1TaskC />} />
          <Route path="/app/phase4/step2/remedial/b1/taskC" element={<RemedialStep2B1TaskC />} />
          <Route path="/phase4/step2/remedial/b1/taskD" element={<RemedialStep2B1TaskD />} />
          <Route path="/app/phase4/step2/remedial/b1/taskD" element={<RemedialStep2B1TaskD />} />
          <Route path="/phase4/step2/remedial/b1/taskE" element={<RemedialStep2B1TaskE />} />
          <Route path="/app/phase4/step2/remedial/b1/taskE" element={<RemedialStep2B1TaskE />} />
          <Route path="/phase4/step2/remedial/b1/taskF" element={<RemedialStep2B1TaskF />} />
          <Route path="/app/phase4/step2/remedial/b1/taskF" element={<RemedialStep2B1TaskF />} />
          <Route path="/phase4/step2/remedial/b1/results" element={<RemedialStep2B1Results />} />
          <Route path="/app/phase4/step2/remedial/b1/results" element={<RemedialStep2B1Results />} />

          <Route path="/phase4/step2/remedial/b2/taskA" element={<RemedialStep2B2TaskA />} />
          <Route path="/app/phase4/step2/remedial/b2/taskA" element={<RemedialStep2B2TaskA />} />
          <Route path="/phase4/step2/remedial/b2/taskB" element={<RemedialStep2B2TaskB />} />
          <Route path="/app/phase4/step2/remedial/b2/taskB" element={<RemedialStep2B2TaskB />} />
          <Route path="/phase4/step2/remedial/b2/taskC" element={<RemedialStep2B2TaskC />} />
          <Route path="/app/phase4/step2/remedial/b2/taskC" element={<RemedialStep2B2TaskC />} />
          <Route path="/phase4/step2/remedial/b2/taskD" element={<RemedialStep2B2TaskD />} />
          <Route path="/app/phase4/step2/remedial/b2/taskD" element={<RemedialStep2B2TaskD />} />
          <Route path="/phase4/step2/remedial/b2/taskE" element={<RemedialStep2B2TaskE />} />
          <Route path="/app/phase4/step2/remedial/b2/taskE" element={<RemedialStep2B2TaskE />} />
          <Route path="/phase4/step2/remedial/b2/taskF" element={<RemedialStep2B2TaskF />} />
          <Route path="/app/phase4/step2/remedial/b2/taskF" element={<RemedialStep2B2TaskF />} />
          <Route path="/phase4/step2/remedial/b2/results" element={<RemedialStep2B2Results />} />
          <Route path="/app/phase4/step2/remedial/b2/results" element={<RemedialStep2B2Results />} />

          <Route path="/phase4/step2/remedial/c1/taskA" element={<RemedialStep2C1TaskA />} />
          <Route path="/app/phase4/step2/remedial/c1/taskA" element={<RemedialStep2C1TaskA />} />
          <Route path="/phase4/step2/remedial/c1/taskB" element={<RemedialStep2C1TaskB />} />
          <Route path="/app/phase4/step2/remedial/c1/taskB" element={<RemedialStep2C1TaskB />} />
          <Route path="/phase4/step2/remedial/c1/taskC" element={<RemedialStep2C1TaskC />} />
          <Route path="/app/phase4/step2/remedial/c1/taskC" element={<RemedialStep2C1TaskC />} />
          <Route path="/phase4/step2/remedial/c1/taskD" element={<RemedialStep2C1TaskD />} />
          <Route path="/app/phase4/step2/remedial/c1/taskD" element={<RemedialStep2C1TaskD />} />
          <Route path="/phase4/step2/remedial/c1/taskE" element={<RemedialStep2C1TaskE />} />
          <Route path="/app/phase4/step2/remedial/c1/taskE" element={<RemedialStep2C1TaskE />} />
          <Route path="/phase4/step2/remedial/c1/taskF" element={<RemedialStep2C1TaskF />} />
          <Route path="/app/phase4/step2/remedial/c1/taskF" element={<RemedialStep2C1TaskF />} />
          <Route path="/phase4/step2/remedial/c1/taskG" element={<RemedialStep2C1TaskG />} />
          <Route path="/app/phase4/step2/remedial/c1/taskG" element={<RemedialStep2C1TaskG />} />
          <Route path="/phase4/step2/remedial/c1/taskH" element={<RemedialStep2C1TaskH />} />
          <Route path="/app/phase4/step2/remedial/c1/taskH" element={<RemedialStep2C1TaskH />} />

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
