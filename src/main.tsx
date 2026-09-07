import React, { StrictMode, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Critical UI assets preloader to warm the browser image cache immediately
const CRITICAL_BUTTON_IMAGES = [
  '/ana.png',
  '/geri.png',
  '/ileri.png',
  '/ses.png',
  '/ist.png',
  '/1oy.png',
  '/2oy.png',
  '/3oy.png',
  '/icon_1.png',
  '/icon_2.png',
  '/icon_3.png',
  '/icon_4.png',
  '/icon_5.png',
  '/icon_6.png',
  '/kap.png',
  '/ejd.png',
  '/balta.png',
  '/kap1.png',
  '/ejd1.png',
  '/balta1.png',
  '/p1.png',
  '/p2.png',
  '/p3.png',
];

if (typeof window !== 'undefined') {
  CRITICAL_BUTTON_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('openedTopics_v1');
    } catch {}
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-4xl">🦁</div>
            <h2 className="text-xl font-black text-amber-300">Bir Hata Oluştu</h2>
            <p className="text-xs text-slate-300">
              Oyun yüklenirken beklenmeyen bir durum meydana geldi. Yeniden başlatarak devam edebilirsiniz.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg cursor-pointer transition-transform active:scale-95"
            >
              🔄 Yeniden Başlat
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
