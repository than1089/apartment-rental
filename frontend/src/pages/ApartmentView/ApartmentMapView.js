import React from 'react';
import { connect } from 'react-redux';
import { apartmentActions } from '../../redux/actions';
import { ApartmentFilters } from './ApartmentFilters';
import { GoogleApiWrapper } from 'google-maps-react';


const mapContainerStyle = {
  height: '400px',
  width: '768px',
  margin: 'auto'
};

class ApartmentMapView extends React.Component {
  map = null;
  infoWindow = null;
  markers = [];

  componentDidMount() {
    this.initMap();
  }
  
  componentDidUpdate() {
    this.clearMarkers();
    this.renderMarkers();
  }

  componentWillUnmount() {
    this.props.setBasePath(`/api/apartments/`);
  }

  renderMarkers() {
    const { results } = this.props.apartments;
    this.markers = [];
    for (let i = 0; i < results.length; i++) {
      const apartment = results[i];
      const marker = new window.google.maps.Marker({
        position: this.getApartmentPoint(apartment),
        title: apartment.name
      });
      marker.addListener('click', () => {
        this.infoWindow.setContent(this.getApartmentInfo(apartment));
        this.infoWindow.open(this.map, marker);
      });
      marker.setMap(this.map);
      this.markers.push(marker);
    }
  }

  clearMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
      this.markers[i] = null;
    }
  }

  initMap() {
    const google = this.props.google;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.76289, lng: 106.67311 },
      zoom: 12
    });
    this.infoWindow = new google.maps.InfoWindow();
    this.circle = new google.maps.Circle({
      strokeColor: '#ccc',
      strokeOpacity: 0.2,
      strokeWeight: 3,
      fillOpacity: 0.1,
      map: this.map,
      radius: 10000
    });
    this.map.addListener('idle', () => { 
      this.mapCenterChanged();
    });
    this.createSearchBox();
    this.getCurrentLocation();
  }

  createSearchBox() {
    const input = document.getElementById('pac-input');
    const google = this.props.google;
    const searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      this.map.setCenter(places[0].geometry.location);
    });
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const center = new this.props.google.maps.LatLng({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        this.map.setCenter(center);
      });
    }
  }

  mapCenterChanged() {
    const center = this.map.getCenter();

    if (center.equals(this.center)) {
      return;
    }
    this.center = center;

    this.circle.setCenter(center);
    this.props.setBasePath(`/api/apartments/?limit=100&lat=${center.lat()}&lng=${center.lng()}`);
    this.props.fetchApartments();
  }

  getApartmentPoint(apartment) {
    return new this.props.google.maps.LatLng({
      lat: Number(apartment.lat),
      lng: Number(apartment.lng)
    });
  }

  getApartmentInfo(apartment) {
    const badge = apartment.status === 'Available' ? 'success' : 'danger';
    return `
      <h6>${apartment.name}</h6>
      <p style="max-width: 280px">${apartment.address}</p>
      <strong>
      $${apartment.price_per_month}/month &nbsp;&nbsp;
      ${apartment.floor_area_size} m2 &nbsp;&nbsp;
      ${apartment.number_of_rooms} rooms
      <span class="badge badge-${badge} ml-1">${apartment.status}</span>
      </strong>`;
  }

  render() {
    return (
      <div className="mb-4">
        <h2 className="mb-4">Apartment Map</h2>
        <ApartmentFilters />
        <hr />
        <input id="pac-input" className="controls" type="text" placeholder="Search Box" style={{padding: '3px 5px'}} />
        <div className="row">
          <div id="map" style={mapContainerStyle}></div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    apartments: state.apartments,
    auth: state.authentication,
  };
}

const actionCreators = {
  fetchApartments: apartmentActions.fetchAll,
  setBasePath: apartmentActions.setBasePath,
};

const WrapperedMap = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GG_MAP_API_KEY
})(ApartmentMapView);

const connectedComponent = connect(mapState, actionCreators)(WrapperedMap);
export { connectedComponent as ApartmentMapView };