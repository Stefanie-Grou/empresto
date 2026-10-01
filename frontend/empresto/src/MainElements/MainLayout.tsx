import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderElement from './HeaderElement';

export function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderElement />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}