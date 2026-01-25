export const ErrorMessage = ({ children }: { children?: React.ReactNode }) => {
    if (!children) return null;
    return <p className="text-sm font-medium text-red-500 mt-1">{children}</p>;
  };