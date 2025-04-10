import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { app, analytics, auth } from './firebase'
import UserHome from './pages/user/UserHome'
import AdminDashboard from './pages/admin/AdminDashboard'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import { MobileSpinner, DesktopSpinner } from './components/LoadingSpinner'
import { 
  HomeIcon, 
  UserCircleIcon, 
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// 모바일 디바이스 체크 함수
const isMobile = () => {
  return window.innerWidth <= 768;
};

// 관리자 페이지 접근 제한 컴포넌트
const AdminAccessCheck = ({ children }) => {
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobileDevice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <h1 className="text-lg font-bold">접근 제한</h1>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            관리자 페이지는 모바일 기기에서 접근할 수 없습니다. 
            데스크톱이나 태블릿으로 접속해 주세요.
          </p>
          <Link 
            to="/" 
            className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

// 사용자 레이아웃 컴포넌트
const UserLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <>
      {/* 모바일 헤더 */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-6" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center">
              <HomeIcon className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">TANGO CITY</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">메뉴 열기</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-6">
            <Link to="/" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              홈
            </Link>
            <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              소개
            </Link>
            <Link to="/contact" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              문의
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`}
                    alt="프로필"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>

                {/* 드롭다운 메뉴 */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                    {/* 사용자 정보 섹션 */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`}
                          alt="프로필"
                          className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">{user.email}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {user.emailVerified ? (
                              <>
                                <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                <span className="text-xs text-green-600">이메일 인증됨</span>
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                <span className="text-xs text-red-600">이메일 미인증</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 메뉴 아이템들 */}
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span>프로필</span>
                      </Link>
                      <button 
                        onClick={() => auth.signOut()}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
                      >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                로그인 <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
        
        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5 flex items-center">
                  <HomeIcon className="w-6 h-6 text-blue-600" />
                  <span className="ml-2 text-lg font-semibold text-gray-900">TANGO CITY</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">메뉴 닫기</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Link
                      to="/"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      홈
                    </Link>
                    <Link
                      to="/about"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      소개
                    </Link>
                    <Link
                      to="/contact"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      문의
                    </Link>
                  </div>
                  <div className="py-6">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`}
                            alt="프로필"
                            className="w-10 h-10 rounded-full border border-gray-200"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {user.emailVerified ? (
                                <>
                                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                                  <span className="text-xs text-green-600">이메일 인증됨</span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="w-3.5 h-3.5 text-red-500" />
                                  <span className="text-xs text-red-600">이메일 미인증</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          프로필
                        </Link>
                        <button
                          onClick={() => {
                            auth.signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-600 hover:bg-red-50 text-left"
                        >
                          로그아웃
                        </button>
                      </div>
                    ) : (
                      <Link
                        to="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        로그인
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
};

// 관리자 레이아웃 컴포넌트
const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 모바일 사이드바 토글 버튼 */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">사이드바 열기</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* 모바일 사이드바 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-white" />
                <span className="ml-2 text-lg font-semibold text-white">관리자 대시보드</span>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">사이드바 닫기</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                <Link
                  to="/"
                  className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-white hover:bg-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <HomeIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-300 group-hover:text-white" />
                  사용자 홈
                </Link>
                <Link
                  to="/admin"
                  className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-white hover:bg-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Cog6ToothIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-300 group-hover:text-white" />
                  대시보드
                </Link>
              </div>
            </nav>
            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <UserCircleIcon className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="text-sm text-white">{user.email}</p>
                      <p className="text-xs text-gray-400">관리자</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      auth.signOut();
                      setSidebarOpen(false);
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white bg-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex h-16 items-center px-4">
            <ChartBarIcon className="h-8 w-8 text-white" />
            <span className="ml-2 text-lg font-semibold text-white">관리자 대시보드</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4">
              <div className="space-y-1">
                <Link
                  to="/"
                  className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <HomeIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-300 group-hover:text-white" />
                  사용자 홈
                </Link>
                <Link
                  to="/admin"
                  className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  <Cog6ToothIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-300 group-hover:text-white" />
                  대시보드
                </Link>
              </div>
            </nav>
          </div>
          {user && (
            <div className="flex-shrink-0 border-t border-gray-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-gray-400">관리자</p>
                </div>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="mt-3 flex w-full items-center justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };

    window.addEventListener('resize', handleResize);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return isMobileDevice ? <MobileSpinner /> : <DesktopSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 관리자 라우트 */}
          <Route path="/admin" element={
            <AdminAccessCheck>
              <PrivateRoute requireAuth={true} requireAdmin={true}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </PrivateRoute>
            </AdminAccessCheck>
          } />

          {/* 사용자 라우트 */}
          <Route path="/" element={
            <UserLayout>
              <UserHome />
            </UserLayout>
          } />
          <Route path="/login" element={
            user ? (
              <Navigate to="/" />
            ) : (
              <UserLayout>
                <Login />
              </UserLayout>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
