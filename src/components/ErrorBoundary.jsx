import React from 'react'

import ANTDButton from '../shared/antd/ANTDButton'
import ANTDCard from '../shared/antd/ANTDCard'
import { ANTDParagraph, ANTDTitle } from '../shared/antd/ANTDTypography'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: 0,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: prev.resetKey + 1,
    }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <ANTDCard className="error-boundary-card" bordered={false}>
            <ANTDTitle level={3} className="error-title">
              Oops! Something went wrong.
            </ANTDTitle>
            <ANTDParagraph className="error-description">
              An unexpected error occurred. You can try restoring the app to its
              previous state.
            </ANTDParagraph>
            <ANTDButton
              type="primary"
              onClick={this.handleReset}
              className="restore-button"
            >
              Restore App
            </ANTDButton>
            {this.state.errorInfo && (
              <details className="error-details">
                <summary>View error details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </ANTDCard>
        </div>
      )
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default ErrorBoundary
