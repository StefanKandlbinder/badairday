import React from 'react';

import Snackbar from '../UI/Snackbar/Snackbar'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Display fallback UI
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return <Snackbar header={this.state.error.toString()} cta="Reload"></Snackbar>;
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary