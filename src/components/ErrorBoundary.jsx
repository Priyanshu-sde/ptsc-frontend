import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong.</h2>
            <p className="text-gray-400">Please try refreshing the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
