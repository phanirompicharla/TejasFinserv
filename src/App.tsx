import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { ErrorBoundary } from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const FinancialPlanning = lazy(() => import('./pages/FinancialPlanning').then((m) => ({ default: m.FinancialPlanning })))
const MutualFunds = lazy(() => import('./pages/MutualFunds').then((m) => ({ default: m.MutualFunds })))
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })))
const Insurance = lazy(() => import('./pages/Insurance').then((m) => ({ default: m.Insurance })))
const TermInsurance = lazy(() => import('./pages/TermInsurance').then((m) => ({ default: m.TermInsurance })))
const HealthInsurance = lazy(() => import('./pages/HealthInsurance').then((m) => ({ default: m.HealthInsurance })))
const CalculatorsHub = lazy(() => import('./pages/calculators/CalculatorsHub').then((m) => ({ default: m.CalculatorsHub })))
const CalculatorPage = lazy(() => import('./pages/calculators/CalculatorPage').then((m) => ({ default: m.CalculatorPage })))
const Insights = lazy(() => import('./pages/Insights').then((m) => ({ default: m.Insights })))
const InsightPost = lazy(() => import('./pages/InsightPost').then((m) => ({ default: m.InsightPost })))
const FAQ = lazy(() => import('./pages/FAQ').then((m) => ({ default: m.FAQ })))
const GoalPage = lazy(() => import('./pages/goals/GoalPage').then((m) => ({ default: m.GoalPage })))
const LegalPage = lazy(() => import('./pages/legal/LegalPage').then((m) => ({ default: m.LegalPage })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))
const Sitemap = lazy(() => import('./pages/Sitemap').then((m) => ({ default: m.Sitemap })))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-ivory">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="financial-planning" element={<FinancialPlanning />} />
              <Route path="mutual-funds" element={<MutualFunds />} />
              <Route path="insurance" element={<Insurance />} />
              <Route path="term-insurance" element={<TermInsurance />} />
              <Route path="health-insurance" element={<HealthInsurance />} />
              <Route path="savings-plans" element={<FinancialPlanning />} />
              <Route path="calculators" element={<CalculatorsHub />} />
              <Route path="calculators/:slug" element={<CalculatorPage />} />
              <Route path="insights" element={<Insights />} />
              <Route path="insights/:slug" element={<InsightPost />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="goals/:slug" element={<GoalPage />} />
              <Route path="privacy" element={<LegalPage type="privacy" />} />
              <Route path="terms" element={<LegalPage type="terms" />} />
              <Route path="disclaimer" element={<LegalPage type="disclaimer" />} />
              <Route path="contact" element={<Contact />} />
              <Route path="sitemap" element={<Sitemap />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
