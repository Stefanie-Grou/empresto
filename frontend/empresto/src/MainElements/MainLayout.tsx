import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderElement from './HeaderElement';

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderElement />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}