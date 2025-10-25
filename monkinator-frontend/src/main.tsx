import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config, customTheme } from './lib/rainbowkit'
import ClientOnly from './components/ClientOnly'
import './index.css'
import App from './App.tsx'
import '@rainbow-me/rainbowkit/styles.css'

// Suppress MetaMask extension errors and hydration warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('chrome.runtime.sendMessage') ||
    message.includes('Extension ID') ||
    message.includes('inpage.js') ||
    message.includes('hydration') ||
    message.includes('redacted') ||
    message.includes('hydration.js')) {
    return; // Suppress these specific errors
  }
  originalConsoleError.apply(console, args);
};

// Suppress console.warn for hydration issues
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  if (message.includes('hydration') || message.includes('redacted')) {
    return; // Suppress hydration warnings
  }
  originalConsoleWarn.apply(console, args);
};

const queryClient = new QueryClient()

// Global error handler for hydration issues
window.addEventListener('error', (event) => {
  if (event.message?.includes('hydration') ||
    event.message?.includes('redacted') ||
    event.filename?.includes('hydration.js') ||
    event.error?.message?.includes('hydration')) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('hydration') ||
    event.reason?.message?.includes('redacted') ||
    event.reason?.stack?.includes('hydration.js')) {
    event.preventDefault();
    return false;
  }
});

// Additional error suppression for React hydration
const originalAddEventListener = window.addEventListener;
window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
  if (type === 'error' && typeof listener === 'function') {
    const wrappedListener = function (this: Window, event: Event) {
      const errorEvent = event as ErrorEvent;
      if (errorEvent.message?.includes('hydration') ||
        errorEvent.message?.includes('redacted') ||
        errorEvent.filename?.includes('hydration.js')) {
        return;
      }
      return (listener as EventListener).call(this, event);
    };
    return originalAddEventListener.call(this, type, wrappedListener, options);
  }
  return originalAddEventListener.call(this, type, listener!, options);
};

// Loading component for hydration
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
      <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading Monkinator...</div>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientOnly fallback={<LoadingScreen />}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customTheme}>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientOnly>
  </StrictMode>,
)