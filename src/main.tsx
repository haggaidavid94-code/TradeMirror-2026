import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { DisplayProvider } from './context/DisplayContext';
import { RiskProvider } from './context/RiskContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TradeProvider } from './context/TradeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TradeProvider>
        <ThemeProvider>
          <DisplayProvider>
            <RiskProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </RiskProvider>
          </DisplayProvider>
        </ThemeProvider>
      </TradeProvider>
    </AuthProvider>
  </StrictMode>,
);
