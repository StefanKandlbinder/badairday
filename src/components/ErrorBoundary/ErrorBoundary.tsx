import React from 'react';
import Snackbar from '../UI/Snackbar/Snackbar';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return <Snackbar header={this.state.error?.toString() ?? 'Unknown error'} cta="Reload" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
