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
      zoom: 10
    });
    this.infoWindow = new google.maps.InfoWindow();

    this.getCurrentLocation();
    this.props.fetchApartments();
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

  getApartmentPoint(apartment) {
    return new this.props.google.maps.LatLng({
      lat: Number(apartment.lat),
      lng: Number(apartment.lng)
    });
  }

  getApartmentInfo(apartment) {
    return `
      <h6>${apartment.name}</h6>
      <p>${apartment.address}</p>
      <strong>
      $${apartment.price_per_month}/month &nbsp;&nbsp;
      ${apartment.floor_area_size} m2 &nbsp;&nbsp;
      ${apartment.number_of_rooms} rooms
      </strong>`;
  }

  render() {
    return (
      <div className="mb-4">
        <h2 className="mb-4">Apartment Map</h2>
        <ApartmentFilters />
        <hr />
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
};

const WrapperedMap = GoogleApiWrapper({
  apiKey: 'AIzaSyAcx8hA2LcYGHRkLFVrQ7Xdzw7L3EQA5go'
})(ApartmentMapView);

const connectedComponent = connect(mapState, actionCreators)(WrapperedMap);
export { connectedComponent as ApartmentMapView };