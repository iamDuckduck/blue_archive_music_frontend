import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioPlayerProvider } from "./context/audio-player-context.tsx";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <AudioPlayerProvider>
        <App />
      </AudioPlayerProvider>
    </StrictMode>
  </QueryClientProvider>
);
