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
import Certificate from './pages/Certificate.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import DeleteAccount from './pages/DeleteAccount.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminStudentProgress from './pages/AdminStudentProgress.jsx'
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

          {/* Profile Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/delete-account" element={<DeleteAccount />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/student/:userId" element={<AdminStudentProgress />} />
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
