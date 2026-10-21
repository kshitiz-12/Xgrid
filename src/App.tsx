import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isProductionHost, PRODUCT_DOMAINS, productSite, type ProductSite } from './lib/site';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RouteSeo from './components/RouteSeo';
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

function SiteHome() {
  if (productSite === 'jewelbiz') return <XJewelERP />;
  if (productSite === 'curabiz') return <XCuraHMS />;
  return <Home />;
}

/**
 * On the public domains each product lives at the root of its own domain:
 * /jewelbiz/ on slatebiz.com goes to jewelbiz.in, and /jewelbiz/ on jewelbiz.in goes to /.
 * Localhost and Vercel previews keep rendering the page in place.
 */
function ProductRoute({ product, children }: Readonly<{ product: ProductSite; children: ReactNode }>) {
  const offDomain = isProductionHost && productSite !== product;

  useEffect(() => {
    if (offDomain) window.location.replace(`${PRODUCT_DOMAINS[product]}/`);
  }, [offDomain, product]);

  if (productSite === product) return <Navigate to="/" replace />;
  if (offDomain) return <PageFallback />;
  return <>{children}</>;
}

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
      <RouteSeo />
      <Header />
      <main className="flex-grow safe-pb-fab md:pb-0">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<SiteHome />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about-us/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/jewelbiz/" element={<ProductRoute product="jewelbiz"><XJewelERP /></ProductRoute>} />
            <Route path="/curabiz/" element={<ProductRoute product="curabiz"><XCuraHMS /></ProductRoute>} />
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
        className="group fixed bottom-4 right-4 z-[60] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.4)] ring-4 ring-white/70 transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5A] hover:shadow-[0_10px_28px_rgba(37,211,102,0.5)] focus-visible:outline-none focus-visible:ring-[#25D366]/40 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        aria-label="Contact on WhatsApp"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-[30px] sm:w-[30px]" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
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

/** Everything inside the router; the browser and the prerender script supply their own router. */
export function AppShell() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AppRoutes />
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
