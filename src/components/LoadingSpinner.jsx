import React from 'react';

// 모바일용 로딩 스피너
export const MobileSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
    <div className="w-12 h-12 border-4 border-gray-200 rounded-full relative">
      <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

// 데스크톱용 로딩 스피너
export const DesktopSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[200px] bg-white/60 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-gray-200 rounded-full relative">
      <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

// 인라인 로딩 스피너 (작은 크기)
export const InlineSpinner = () => (
  <div className="inline-block">
    <div className="w-4 h-4 border-2 border-gray-200 rounded-full relative">
      <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

export default {
  Mobile: MobileSpinner,
  Desktop: DesktopSpinner,
  Inline: InlineSpinner
}; 