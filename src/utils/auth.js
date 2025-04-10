import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

// 관리자 UID 목록 (실제로는 Firestore에서 관리하는 것이 좋습니다)
const ADMIN_UIDS = [
  '관리자_UID_1',
  '관리자_UID_2'
];

// 사용자가 관리자인지 확인하는 함수
export const isAdmin = async (user) => {
  if (!user) return false;
  
  // 하드코딩된 관리자 목록에서 확인
  if (ADMIN_UIDS.includes(user.uid)) return true;
  
  // Firestore에서 관리자 여부 확인 (선택적)
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data().isAdmin) {
      return true;
    }
  } catch (error) {
    console.error('관리자 확인 중 오류 발생:', error);
  }
  
  return false;
}; 