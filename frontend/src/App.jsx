import { Route, Routes } from 'react-router-dom'

import FloatingShap from './components/FloatingShap'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { EmailVerificationPage } from './pages/EmailVerificationPage'

import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>

      <FloatingShap
        color='bg-green-500'
        size='w-64 h-64'
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShap
        color='bg-emerald-500'
        size='w-48 h-48'
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShap
        color='bg-lime-500'
        size='w-32 h-32'
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route path="/" element={
          
            <DashboardPage/>
          
        } />
        <Route path="/login" element={
          
            <LoginPage />
          
        } />
        <Route path="/signup" element={
          
            <SignUpPage/>
         
        } />
        <Route path="/verify-email" element={<EmailVerificationPage/>} />
        <Route path="/forgot-password" element={
          
            <ForgotPasswordPage/>
          
        } />
        <Route
					path='/reset-password/:token'
					element={
						
							<ResetPasswordPage />
						
					}
				/>
        

        
      </Routes>
    </div>
  )
}
