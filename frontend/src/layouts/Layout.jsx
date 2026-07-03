import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-50 via-unwind-bg to-unwind-blue-light/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
