import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Seo } from '../components/Seo'

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found — TejasFinserv" description="The page you are looking for does not exist." noindex />
      <section className="flex min-h-[70vh] items-center bg-ivory section-padding">
        <div className="container-main text-center">
          <p className="font-display text-6xl font-semibold text-brass">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-navy">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            The page you are looking for may have been moved or does not exist.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/">Go Home</Button>
            <Link to="/calculators" className="text-brass link-underline font-semibold">Browse Calculators</Link>
          </div>
        </div>
      </section>
    </>
  )
}
