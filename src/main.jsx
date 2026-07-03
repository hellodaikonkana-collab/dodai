import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('React Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fff', fontFamily: 'monospace' }}>
          <h2 style={{ color: 'red' }}>エラーが発生しました</h2>
          <pre style={{ color: '#333', background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
            リトライ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

