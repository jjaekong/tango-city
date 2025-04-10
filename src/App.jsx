import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import { app, analytics, auth } from './firebase'
import UserHome from './pages/user/UserHome'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase가 제대로 초기화되었는지 콘솔에서 확인
    console.log('Firebase 앱이 초기화되었습니다:', app);
    console.log('Firebase Analytics가 초기화되었습니다:', analytics);
    
    // 사용자 인증 상태 변경 감지
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <Link to="/" className="text-blue-500 hover:text-blue-700">홈</Link>
              {user && (
                <Link to="/admin" className="text-blue-500 hover:text-blue-700">관리자</Link>
              )}
            </div>
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-blue-500 hover:text-blue-700">로그인</Link>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login />
            } />
            <Route path="/" element={<UserHome />} />
            <Route path="/admin" element={
              <PrivateRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
