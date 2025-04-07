export default function UserHome() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">사용자 서비스</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">내 정보</h2>
          <p className="text-gray-600">프로필 및 계정 정보를 관리하세요.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">서비스 이용</h2>
          <p className="text-gray-600">다양한 서비스를 이용해보세요.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">문의 및 지원</h2>
          <p className="text-gray-600">도움이 필요하신가요?</p>
        </div>
      </div>
    </div>
  )
} 