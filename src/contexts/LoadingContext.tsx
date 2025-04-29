import { Spinner } from "@heroui/react";
import { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {/* 로딩 중일 때, 로딩레이어를 표시하고 그 위에 로딩스피너가 표현됨 */}
      {!loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-[9999]">
          <Spinner
            color="default"
            classNames={{ label: "mt-4" }}
            label="Loading.."
            variant="simple"
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
