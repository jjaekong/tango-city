import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setLoading(false);
      } catch (err) {
        console.error('사용자 정보 가져오기 오류:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      <p className="mb-4">이 페이지는 관리자만 접근할 수 있습니다.</p>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">사용자 목록</h2>
        {users.length === 0 ? (
          <p>사용자가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">이름</th>
                  <th className="py-2 px-4 border-b text-left">이메일</th>
                  <th className="py-2 px-4 border-b text-left">역할</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.name || '이름 없음'}</td>
                    <td className="py-2 px-4 border-b">{user.email || '이메일 없음'}</td>
                    <td className="py-2 px-4 border-b">{user.isAdmin ? '관리자' : '일반 사용자'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 