import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { isAdmin } from '../utils/auth';

const PrivateRoute = ({ children, requireAuth = false, requireAdmin = false }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && requireAdmin) {
        const adminStatus = await isAdmin(user);
        setIsUserAdmin(adminStatus);
      }
      setLoading(false);
    };
    
    checkAdminStatus();
  }, [user, requireAdmin]);
  
  // 로딩 중일 때 표시할 내용
  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }
  
  // 인증이 필요한 경우, 사용자가 로그인하지 않은 경우
  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }
  
  // 관리자 권한이 필요한 경우, 사용자가 관리자가 아닌 경우
  if (requireAdmin && !isUserAdmin) {
    return <Navigate to="/" />;
  }
  
  // 조건을 모두 만족하는 경우
  return children;
};

export default PrivateRoute; 