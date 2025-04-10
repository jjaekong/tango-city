import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, signInWithGoogle, signInWithFacebook, signInWithApple } from '../firebase';
import { MobileSpinner, InlineSpinner } from '../components/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('이메일 로그인 시도...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('이메일 로그인 성공:', user.uid);
      
      await updateUserInfo(user);
      navigate('/');
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인에 실패했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (user) => {
    try {
      console.log('사용자 정보 업데이트 시작:', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('사용자 문서가 존재하지 않습니다. 새로 생성합니다.');
        const userData = {
          email: user.email,
          name: user.displayName || '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isAdmin: false,
          photoURL: user.photoURL || '',
          uid: user.uid
        };
        
        await setDoc(userRef, userData);
        console.log('새 사용자 정보가 생성되었습니다.');
      } else {
        console.log('기존 사용자 문서가 존재합니다. 마지막 로그인 시간을 업데이트합니다.');
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
          photoURL: user.photoURL || userDoc.data().photoURL
        }, { merge: true });
        console.log('사용자 정보가 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      if (error.code === 'permission-denied') {
        setError('사용자 정보에 접근할 권한이 없습니다. 관리자에게 문의하세요.');
      }
    }
  };

  const handleSocialLogin = async (loginFunction, providerName) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`${providerName} 로그인 시도...`);
      const user = await loginFunction();
      console.log(`${providerName} 로그인 성공:`, user.uid);
      
      await updateUserInfo(user);
      navigate('/');
    } catch (error) {
      console.error(`${providerName} 로그인 오류:`, error);
      setError(`${providerName} 로그인에 실패했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {loading && <MobileSpinner />}
      
      <div className="flex-1 p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
              placeholder="이메일 주소를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <InlineSpinner />
                <span className="ml-2">로그인 중...</span>
              </>
            ) : '이메일로 로그인'}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin(signInWithGoogle, 'Google')}
            className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700">Google로 계속하기</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin(signInWithFacebook, 'Facebook')}
            className="w-full flex items-center justify-center space-x-3 p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1874E8] focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2"
            disabled={loading}
          >
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
            <span>Facebook으로 계속하기</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin(signInWithApple, 'Apple')}
            className="w-full flex items-center justify-center space-x-3 p-3 bg-black text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            disabled={loading}
          >
            <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5" />
            <span>Apple로 계속하기</span>
          </button>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-sm text-gray-600">
          계정이 없으신가요? <button className="text-blue-500 hover:text-blue-600">회원가입</button>
        </p>
      </div>
    </div>
  );
};

export default Login; 