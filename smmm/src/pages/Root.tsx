import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Toaster } from '../components/ui/sonner';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function Root() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}