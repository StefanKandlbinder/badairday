import React, { Component } from 'react';

class Date extends Component {
    render() {
        let values = [];
        let date = null;
        
        values = this.props.values;

        /* if (values.length > 0) {
            date = new Date(values[values.length - 1].zeitpunkt);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            // date = moment.unix(values[values.length - 1].zeitpunkt);
            console.log(formattedTime);
        } */

        return date;
    }
}

export default Date;