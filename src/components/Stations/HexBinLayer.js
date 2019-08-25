import { MapLayer } from 'react-leaflet';
import L from 'leaflet';
import './asymmetrik'
// import './hexbin.css';

export default class HexbinLayer extends MapLayer {
	createLeafletElement(props) {
		return L.hexbinLayer(props);
	}

	updateLeafletElement (fromProps, toProps) {
		if (toProps.timestamp > fromProps.timestamp) {
			this.leafletElement.data(toProps.data.features);
		}
		
		if (toProps.data !== fromProps.data && !toProps.updating) {
			this.leafletElement.data(toProps.data.features);
			this.leafletElement.updateBins();
        }
	}

	componentDidMount() {
		const { layerContainer } = this.props.leaflet || this.context;
		const { data } = this.props;
        this.leafletElement.addTo(layerContainer);
		this.leafletElement.data(data.features);
		this.leafletElement.dispatch()
			.on('click', (d, i, coords) => {
				this.props.onClick(d, i, coords)
			})
	}

	componentWillUnmount() {
		const { layerContainer, map } = this.props.leaflet || this.context;
		this.leafletElement.data(null);
		map.removeLayer(this.leafletElement);
		layerContainer.removeLayer(this.leafletElement);
	}
}