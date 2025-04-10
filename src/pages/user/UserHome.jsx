import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('사용자 정보를 찾을 수 없습니다.');
        }
        setLoading(false);
      } catch (err) {
        console.error('사용자 정보 가져오기 오류:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 홈페이지</h1>
      <p className="mb-4">이 페이지는 모든 사용자가 접근할 수 있습니다.</p>
      
      {/* 공개 정보 섹션 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">공개 정보</h2>
        <p className="mb-4">이 섹션은 로그인하지 않은 사용자도 볼 수 있습니다.</p>
        <div className="space-y-2">
          <p>이 웹사이트는 사용자와 관리자 기능을 제공합니다.</p>
          <p>로그인하면 더 많은 기능을 사용할 수 있습니다.</p>
        </div>
      </div>
      
      {/* 로그인하지 않은 경우 로그인 버튼 표시 */}
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">로그인</h2>
          <p className="mb-4">로그인하여 더 많은 기능을 사용하세요.</p>
          <Link 
            to="/login" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            로그인하기
          </Link>
        </div>
      )}
      
      {/* 로그인한 경우 사용자 정보 표시 */}
      {user && userData && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">내 정보</h2>
          <div className="space-y-2">
            <p><span className="font-medium">이메일:</span> {userData.email}</p>
            <p><span className="font-medium">이름:</span> {userData.name || '이름 없음'}</p>
            <p><span className="font-medium">역할:</span> {userData.isAdmin ? '관리자' : '일반 사용자'}</p>
            <p><span className="font-medium">가입일:</span> {userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleString() : '알 수 없음'}</p>
            <p><span className="font-medium">마지막 로그인:</span> {userData.lastLogin ? new Date(userData.lastLogin.toDate()).toLocaleString() : '알 수 없음'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome; 