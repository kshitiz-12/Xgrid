import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const XJewelERP = lazy(() => import('./pages/XJewelERP'));
const XCuraHMS = lazy(() => import('./pages/XCuraHMS'));
const XRetailERP = lazy(() => import('./pages/XRetailERP'));
const Services = lazy(() => import('./pages/Services'));
const Blogs = lazy(() => import('./pages/Blogs'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Careers = lazy(() => import('./pages/Careers'));
const FAQ = lazy(() => import('./pages/FAQ'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminBlogEditor = lazy(() => import('./admin/AdminBlogEditor'));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0C69B6]/25 border-t-[#0C69B6]" />
    </div>
  );
}

function MainSite() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow safe-pb-fab md:pb-0">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about-us/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/jewelbiz/" element={<XJewelERP />} />
            <Route path="/curabiz/" element={<XCuraHMS />} />
            <Route path="/retailbiz/" element={<XRetailERP />} />
            <Route path="/blogs/" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/:slug/" element={<BlogPost />} />
            <Route path="/blogs/:brand/:slug" element={<BlogPost />} />
            <Route path="/blogs/:brand/:slug/" element={<BlogPost />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <a
        href="https://wa.me/919257373668"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex items-center justify-center group transition-transform hover:scale-105 duration-300"
        aria-label="Contact on WhatsApp"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <img
          src="/wa.webp"
          alt=""
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-xl"
        />
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-[12px] font-medium rounded-lg opacity-0 group-hover:opacity-100 hidden sm:block transition-all duration-300 whitespace-nowrap translate-y-1 group-hover:translate-y-0">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blogs/new" element={<AdminBlogEditor />} />
            <Route path="blogs/:id" element={<AdminBlogEditor />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return <MainSite />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
