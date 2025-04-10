import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { DesktopSpinner } from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    admins: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const userData = [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let newUsersToday = 0;
        let activeUsers = 0;
        let admins = 0;

        querySnapshot.forEach((doc) => {
          const user = { id: doc.id, ...doc.data() };
          userData.push(user);

          // 통계 계산
          if (user.createdAt && new Date(user.createdAt.toDate()) >= today) {
            newUsersToday++;
          }
          if (user.lastLogin && new Date(user.lastLogin.toDate()) >= today) {
            activeUsers++;
          }
          if (user.isAdmin) {
            admins++;
          }
        });

        setUsers(userData);
        setStats({
          totalUsers: userData.length,
          activeUsers,
          newUsersToday,
          admins
        });
        setLoading(false);
      } catch (err) {
        console.error('사용자 목록 가져오기 오류:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <DesktopSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">전체 사용자</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          <div className="mt-2 text-sm text-gray-600">
            관리자 {stats.admins}명 포함
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">오늘 활성 사용자</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeUsers}</p>
          <div className="mt-2 text-sm text-gray-600">
            전체의 {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">오늘 새로운 사용자</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.newUsersToday}</p>
          <div className="mt-2 text-sm text-gray-600">
            전체의 {Math.round((stats.newUsersToday / stats.totalUsers) * 100)}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">관리자</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">{stats.admins}</p>
          <div className="mt-2 text-sm text-gray-600">
            전체의 {Math.round((stats.admins / stats.totalUsers) * 100)}%
          </div>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">사용자 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="" 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl text-gray-500">
                            {user.name ? user.name[0].toUpperCase() : '?'}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || '이름 없음'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.lastLogin && new Date(user.lastLogin.toDate()) >= new Date(new Date().setHours(0,0,0,0))
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.lastLogin && new Date(user.lastLogin.toDate()) >= new Date(new Date().setHours(0,0,0,0))
                        ? '활성'
                        : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : '알 수 없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin.toDate()).toLocaleDateString() : '없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.isAdmin ? '관리자' : '일반 사용자'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 