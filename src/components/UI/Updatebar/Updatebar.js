import React, { Component } from 'react';

import "./Updatebar.scss";

export default class UpdateBar extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        // counter: 0,
        progress: 0
      }
    }
  
    componentDidMount() {
      this.animate();
    }
  
    componentWillUnmount() {
      cancelAnimationFrame(this.rafId);
    }
  
    animate() {
      // if (this.props.animate) {
        let start = null;
        let step = timestamp => {
          if (!start) start = timestamp;
          
          let progress = timestamp - start;
          this.setState({ progress });
  
          if (progress > this.props.interval) {
            this.props.update();
            start = null;
          }
  
          this.rafId = requestAnimationFrame(step);
        };
        this.rafId = requestAnimationFrame(step);
      // }
    }
  
    render() {
      let style = { transform: `scaleX(${(this.state.progress / this.props.interval)})` };
  
      return <div style={style} className="air__update-bar"></div>
    }
  }