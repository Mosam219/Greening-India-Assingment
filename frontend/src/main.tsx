import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/app";
import { initializeTheme } from "@/features/theme/theme-storage";
import { enableMocking } from "@/mocks";
import "./index.css";

async function bootstrap() {
  initializeTheme();
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
