import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { MobileSpinner } from '../../components/LoadingSpinner';

const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }
      
      try {
        console.log('사용자 정보 가져오기 시도:', user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          console.log('사용자 정보 가져오기 성공:', userDoc.data());
          setUserData(userDoc.data());
        } else {
          console.log('사용자 문서가 존재하지 않습니다. 새로 생성합니다.');
          const newUserData = {
            email: user.email,
            name: user.displayName || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isAdmin: false,
            photoURL: user.photoURL || '',
            uid: user.uid
          };
          
          try {
            await setDoc(userRef, newUserData);
            console.log('새 사용자 정보가 생성되었습니다.');
            setUserData(newUserData);
          } catch (createError) {
            console.error('사용자 정보 생성 오류:', createError);
            setError('사용자 정보를 생성할 수 없습니다.');
          }
        }
      } catch (err) {
        console.error('사용자 정보 가져오기 오류:', err);
        setError('사용자 정보를 가져올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // user가 변경될 때마다 실행

  if (loading) {
    return <MobileSpinner />;
  }

  // 비로그인 사용자용 컨텐츠
  const GuestContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">탱고 시티에 오신 것을 환영합니다!</h2>
        <p className="text-gray-600 mb-4">
          로그인하시면 더 많은 기능을 이용하실 수 있습니다.
        </p>
        <Link 
          to="/login" 
          className="block w-full bg-blue-500 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-600 active:bg-blue-700"
        >
          로그인하기
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">주요 기능</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            개인화된 대시보드
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            실시간 데이터 동기화
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            모바일 최적화 인터페이스
          </li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">공지사항</h3>
        <div className="space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <p className="text-sm text-gray-600">새로운 기능이 추가되었습니다!</p>
            <p className="text-xs text-gray-400">2024.04.10</p>
          </div>
          <div className="border-b border-gray-100 pb-2">
            <p className="text-sm text-gray-600">시스템 업데이트 안내</p>
            <p className="text-xs text-gray-400">2024.04.08</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 로그인한 사용자용 컨텐츠
  const UserContent = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {userData && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              {userData.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt="프로필" 
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {userData.name ? userData.name[0].toUpperCase() : '?'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="font-semibold text-lg">{userData.name || '이름 없음'}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between py-2 border-b">
                <span className="text-gray-500">역할</span>
                <span>{userData.isAdmin ? '관리자' : '일반 사용자'}</span>
              </p>
              <p className="flex justify-between py-2 border-b">
                <span className="text-gray-500">가입일</span>
                <span>{userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : '알 수 없음'}</span>
              </p>
              <p className="flex justify-between py-2 border-b">
                <span className="text-gray-500">마지막 로그인</span>
                <span>{userData.lastLogin ? new Date(userData.lastLogin.toDate()).toLocaleDateString() : '알 수 없음'}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">나의 활동</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">아직 활동 내역이 없습니다.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py  -4">
      {user ? <UserContent /> : <GuestContent />}
      </div>
    </div>
  );
};

export default UserHome; 