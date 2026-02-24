import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense, ComponentType } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import FloatingReviewWidget from './components/FloatingReviewWidget';
import ChatbotWidget from './components/ChatbotWidget';
import ErrorBoundary from './components/ErrorBoundary';
import JsonLd from './components/JsonLd';
import { organizationSchema, personSchema, localBusinessSchema } from './lib/schema';
import { trackAITraffic, AdminRedirect } from '@drzach/website-toolkit';
import { SITE } from './data/site';

// ============================================
// DYNAMIC PAGE LOADING
// import.meta.glob gives us a map of all page/component files
// so we can load them by name from SITE.pages config
// ============================================
const pageModules = import.meta.glob('./pages/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

const componentModules = import.meta.glob('./components/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

function lazyPage(name: string) {
  const path = `./pages/${name}.tsx`;
  if (!pageModules[path]) {
    console.warn(`Page module not found: ${path}`);
    return lazy(() => import('./pages/NotFound'));
  }
  return lazy(pageModules[path]);
}

function lazyComponent(name: string) {
  const path = `./components/${name}.tsx`;
  if (!componentModules[path]) return null;
  return lazy(componentModules[path]);
}

// ============================================
// SHARED PAGES (identical across all sites)
// ============================================
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Pediatric = lazy(() => import('./pages/Pediatric'));
const Prenatal = lazy(() => import('./pages/Prenatal'));
const Family = lazy(() => import('./pages/Family'));
const NewPatientCenter = lazy(() => import('./pages/NewPatientCenter'));
const NewPatientForms = lazy(() => import('./pages/NewPatientForms'));
const ScheduleAppointment = lazy(() => import('./pages/ScheduleAppointment'));
const EventsWorkshops = lazy(() => import('./pages/EventsWorkshops'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Thanks = lazy(() => import('./pages/Thanks'));
const NotFound = lazy(() => import('./pages/NotFound'));
const RHKNGuide = lazy(() => import('./pages/RHKNGuide'));
const ThreeWaysToSleep = lazy(() => import('./pages/ThreeWaysToSleep'));
const ThreeWaysToPoop = lazy(() => import('./pages/ThreeWaysToPoop'));
const FreeGuidesForParents = lazy(() => import('./pages/FreeGuidesForParents'));
const TalskyTonal = lazy(() => import('./pages/TalskyTonal'));
const AnswerHub = lazy(() => import('./pages/AnswerHub'));
const ThankYouSubmission = lazy(() => import('./pages/ThankYouSubmission'));
const ConditionIndex = lazy(() => import('./pages/conditions/ConditionIndex'));
const ConditionPageWrapper = lazy(() => import('./pages/conditions/ConditionPageWrapper'));

// ============================================
// DYNAMIC PAGES (driven by SITE.pages config)
// ============================================
const DoctorPage = lazyPage(SITE.pages.doctor.component);

const techniquePages = SITE.pages.techniques.map((t) => ({
  slug: t.slug,
  Component: lazyPage(t.component),
}));

const siteSpecificPages = SITE.pages.siteSpecific.map((p) => ({
  slug: p.slug,
  Component: lazyPage(p.component),
}));

// Layout extras (components rendered in Layout, not routes)
const layoutExtras = SITE.pages.layoutExtras
  .map((name) => lazyComponent(name))
  .filter((c): c is NonNullable<typeof c> => c !== null);

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-primary-dark">
        <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to hash target after a brief delay to allow render
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
    // Move focus to main content for accessibility (SPA navigation)
    const mainContent = document.getElementById('main');
    if (mainContent) {
      mainContent.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return null;
}

function AITrafficTracker() {
  useEffect(() => {
    trackAITraffic();
  }, []);

  return null;
}

function GlobalSchema() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={personSchema()} />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main" className="flex-grow" tabIndex={-1} style={{ outline: 'none' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Shared routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/pediatric" element={<Pediatric />} />
            <Route path="/prenatal" element={<Prenatal />} />
            <Route path="/family" element={<Family />} />
            <Route path="/new-patient-center" element={<NewPatientCenter />} />
            <Route path="/new-patient-forms" element={<NewPatientForms />} />
            <Route path="/request-an-appointment" element={<ScheduleAppointment />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
            <Route path="/book-appointment" element={<ScheduleAppointment />} />
            <Route path="/events-workshops" element={<EventsWorkshops />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/thanks" element={<Thanks />} />
            <Route path="/3-ways-to-poop" element={<ThreeWaysToPoop />} />
            <Route path="/rhkn-guide" element={<RHKNGuide />} />
            <Route path="/3-ways-to-sleep" element={<ThreeWaysToSleep />} />
            <Route path="/free-guides-for-parents" element={<FreeGuidesForParents />} />
            <Route path="/talsky-tonal-chiropractic" element={<TalskyTonal />} />
            <Route path="/answers" element={<AnswerHub />} />
            <Route path="/thank-you-for-your-submission" element={<ThankYouSubmission />} />
            <Route path="/conditions" element={<ConditionIndex />} />
            <Route path="/conditions/:slug" element={<ConditionPageWrapper />} />

            {/* Dynamic: Doctor page */}
            <Route path={SITE.pages.doctor.slug} element={<DoctorPage />} />

            {/* Dynamic: Technique pages (excluding TalskyTonal which is shared) */}
            {techniquePages
              .filter((t) => t.slug !== '/talsky-tonal-chiropractic')
              .map((t) => (
                <Route key={t.slug} path={t.slug} element={<t.Component />} />
              ))}

            {/* Dynamic: Site-specific pages */}
            {siteSpecificPages.map((p) => (
              <Route key={p.slug} path={p.slug} element={<p.Component />} />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileCTA />
      <FloatingReviewWidget />
      {/* Dynamic: Layout extras (e.g., MergerNotification for Cultivate) */}
      {layoutExtras.map((Extra, i) => (
        <Suspense key={i} fallback={null}>
          <Extra />
        </Suspense>
      ))}
      <ChatbotWidget />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <GlobalSchema />
        <AITrafficTracker />
        <AdminRedirect adminProjectId={SITE.deployment.adminProjectId} />
        <Layout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
