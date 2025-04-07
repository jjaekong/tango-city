export default function AdminHome() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">관리자 서비스</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">사용자 관리</h2>
          <p className="text-gray-600">사용자 계정 및 권한을 관리하세요.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">콘텐츠 관리</h2>
          <p className="text-gray-600">서비스 콘텐츠를 관리하세요.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">통계 및 분석</h2>
          <p className="text-gray-600">서비스 사용 통계를 확인하세요.</p>
        </div>
      </div>
    </div>
  )
} 