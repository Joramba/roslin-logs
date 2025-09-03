import ServiceLogsPage from "@/pages/ServiceLogsPage";
import { ToastProvider } from "@/shared/ui/Toaster";

export default function App() {
  return (
    <ToastProvider>
      <ServiceLogsPage />
    </ToastProvider>
  );
}
