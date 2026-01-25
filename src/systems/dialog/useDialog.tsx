export default function useDialog() {
  const alert = (message: string, options?: { title: string }) => {
    const title = options?.title ? `[${options.title}]\n` : "";
    window.alert(`${title}${message}`);
  };

  return { alert };
}