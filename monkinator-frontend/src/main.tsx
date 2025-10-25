import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config, customTheme } from './lib/rainbowkit'
import './index.css'
import App from './App.tsx'
import '@rainbow-me/rainbowkit/styles.css'

// Suppress MetaMask extension errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('chrome.runtime.sendMessage') ||
    message.includes('Extension ID') ||
    message.includes('inpage.js')) {
    return; // Suppress these specific errors
  }
  originalConsoleError.apply(console, args);
};

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)