import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import MergerNotification from './components/MergerNotification';
import FloatingReviewWidget from './components/FloatingReviewWidget';
import JsonLd from './components/JsonLd';
import { organizationSchema, personSchema, localBusinessSchema } from './lib/schema';
import { trackAITraffic } from './lib/analytics';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const MeetDrZach = lazy(() => import('./pages/MeetDrZach'));
const Pediatric = lazy(() => import('./pages/Pediatric'));
const Prenatal = lazy(() => import('./pages/Prenatal'));
const Family = lazy(() => import('./pages/Family'));
const NewPatientCenter = lazy(() => import('./pages/NewPatientCenter'));
const NewPatientForms = lazy(() => import('./pages/NewPatientForms'));
const RequestAppointment = lazy(() => import('./pages/RequestAppointment'));
const ScheduleAppointment = lazy(() => import('./pages/ScheduleAppointment'));
const EventsWorkshops = lazy(() => import('./pages/EventsWorkshops'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Thanks = lazy(() => import('./pages/Thanks'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ThreeWaysToPoop = lazy(() => import('./pages/ThreeWaysToPoop'));
const ThreeStepsTransition = lazy(() => import('./pages/ThreeStepsTransition'));
const RHKNGuide = lazy(() => import('./pages/RHKNGuide'));
const ThreeWaysToSleep = lazy(() => import('./pages/ThreeWaysToSleep'));
const FreeGuidesForParents = lazy(() => import('./pages/FreeGuidesForParents'));
const TalskyTonal = lazy(() => import('./pages/TalskyTonal'));
const InsightScans = lazy(() => import('./pages/InsightScans'));
const AnswerHub = lazy(() => import('./pages/AnswerHub'));

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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalSchema />
      <AITrafficTracker />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main" className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/meet-dr-zach" element={<MeetDrZach />} />
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
              <Route path="/3-steps-transition" element={<ThreeStepsTransition />} />
              <Route path="/rhkn-guide" element={<RHKNGuide />} />
              <Route path="/3-ways-to-sleep" element={<ThreeWaysToSleep />} />
              <Route path="/free-guides-for-parents" element={<FreeGuidesForParents />} />
              <Route path="/talsky-tonal-chiropractic" element={<TalskyTonal />} />
              <Route path="/insight-scans" element={<InsightScans />} />
              <Route path="/answers" element={<AnswerHub />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <MobileCTA />
        <MergerNotification />
        <FloatingReviewWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
