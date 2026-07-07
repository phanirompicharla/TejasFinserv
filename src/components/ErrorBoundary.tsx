import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Auto-reload on chunk load failure (common in dynamic updates)
    const errorMsg = error.message || ''
    const isChunkLoadFailed =
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('ChunkLoadError') ||
      errorMsg.includes('Loading chunk') ||
      error.name === 'ChunkLoadError'

    if (isChunkLoadFailed) {
      const lastReload = sessionStorage.getItem('last-chunk-reload')
      const now = Date.now()
      // Limit automatic reloads to prevent infinite reload loops (e.g. once every 10s)
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('last-chunk-reload', now.toString())
        window.location.reload()
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ivory p-8 text-center pt-24">
          <div className="max-w-md rounded-2xl border border-brass/20 bg-cream p-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brass/10 text-3xl">
              ⚠️
            </div>
            <h1 className="font-display text-2xl font-bold text-navy">Application Error</h1>
            <p className="mt-3 text-sm text-muted">
              We encountered an issue loading this section of the website. This might be due to a temporary network issue or a recent update.
            </p>
            {this.state.error && (
              <div className="mt-4 text-left border-t border-line pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-navy block mb-1">Error Diagnostics:</span>
                <pre className="max-h-32 overflow-auto rounded-lg bg-navy/5 p-2.5 font-mono text-[10px] text-red-600 whitespace-pre-wrap select-all border border-line">
                  {this.state.error.message || String(this.state.error)}
                  {this.state.error.stack && `\n\nStack:\n${this.state.error.stack}`}
                </pre>
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-brass px-5 py-2.5 text-sm font-bold text-navy shadow-md hover:bg-brass-soft transition-all active:scale-95"
              >
                Retry Loading
              </button>
              <button
                onClick={this.handleReset}
                className="rounded-xl border border-line bg-transparent px-5 py-2.5 text-sm font-semibold text-navy hover:bg-cream transition-all active:scale-95"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
