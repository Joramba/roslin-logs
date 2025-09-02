import ServiceLogsPage from "@/pages/ServiceLogsPage";
import { ToastProvider } from "@/components/ui/Toaster";

export default function App() {
  return (
    <ToastProvider>
      <ServiceLogsPage />
    </ToastProvider>
  );
}
