import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { GoogleApiWrapper } from 'google-maps-react';


const initState = {
  apartment: {
    id: -1,
    name: '',
    description: '',
    image: null,
    price_per_month: '',
    number_of_rooms: '',
    floor_area_size: '',
    address: '',
    status: 'Available',
    lat: '',
    lng: '',
  },
  submitted: false,
  addingApartment: true,
};

class ApartmentModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {...initState};

    this.handleChange = this.handleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handlgeAddressChange = this.handlgeAddressChange.bind(this);
  }
  
  static getDerivedStateFromProps(props, state) {
    const apartment = props.apartment;
    if (apartment && apartment.id !== state.apartment.id) {
      return {
        apartment,
        submitted: false,
        addingApartment: false,
      }
    }
    if (!apartment && state.apartment.id !== -1) {
      return initState;
    }
    return null;
  }

  componentDidUpdate() {
   this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      return;
    }
    const google = this.props.google;
  
    // Place map back into the placeholder when the Modal hide and show.
    if (mapElement && this.map) {
      mapElement.parentNode.replaceChild(this.map.getDiv(), mapElement);
      // Place marker into apartment position
      this.setMarker();
      return;
    }
    this.geocoder = new google.maps.Geocoder();
    this.map = new google.maps.Map(mapElement, {
      center: { lat: 10.76289, lng: 106.67311 },
      zoom: 16
    });
    this.marker = new google.maps.Marker({map: this.map, draggable: true}); 
    this.setMarker();
    this.marker.addListener('dragend', (marker) => {
      this.setApartmentPosition(marker.latLng);
    });
  }

  setMarker() {
    const lat = Number(this.state.apartment.lat);
    const lng = Number(this.state.apartment.lng);
    if (this.marker && lat && lng) {
      const position = new this.props.google.maps.LatLng({lat, lng});
      this.marker.setPosition(position);
      this.map.setCenter(position);
    } else if (this.marker) {
      this.marker.setPosition(null);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { apartment } = this.state;
    this.setState({
      apartment: {
        ...apartment,
        [name]: value
      }
    });
  }

  handleImageChange(event) {
    const files = event.target.files;
    const { apartment } = this.state;
    if (files.length) {
      this.setState({
        apartment: {
          ...apartment,
          image: files[0]
        }
      });
    } else {
      this.setState({
        apartment: {
          ...apartment,
          image: null
        }
      });
    }
  }

  handleSwitch(e) {
    const status = e.target.checked ? 'Available' : 'Rented';
    this.setState({
      apartment: {
        ...this.state.apartment,
        status
      }
    });
  }

  handlgeAddressChange(event) {
    const address = event.target.value;
    this.setState({
      apartment: {
        ...this.state.apartment,
        address
      }
    });
    if (this.geocoder && this.map) {
      this.geocoder.geocode( { 'address': address}, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          this.setApartmentPosition(location);
          this.map.setCenter(location);
          this.marker.setPosition(location);
        }
      });
    }
  }

  setApartmentPosition(position) {
    this.setState({
      apartment: {
        ...this.state.apartment,
        lat: position.lat().toFixed(6),
        lng: position.lng().toFixed(6)
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const apartment = Object.assign({}, this.state.apartment);

    if (apartment.name && apartment.floor_area_size && apartment.price_per_month && apartment.address &&
      apartment.status && apartment.lat && apartment.lng) {
      delete apartment.realtor;
      if (typeof apartment.image == 'string') {
        delete apartment.image;
      }
      if (apartment.id !== -1) {
        this.props.updateApartment(apartment);
      } else {
        delete apartment.id;
        this.props.createApartment(apartment);
      }
      this.setState({...initState});
      this.props.onHide();
    }
  }
  render() {
    const { apartment, submitted, addingApartment } = this.state;
    return (
      <Modal
        {...this.props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{ addingApartment ? 'Add Apartment' : 'Edit Apartment' }</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" isInvalid={submitted && !apartment.name}
                    placeholder="Name" name="name"
                    onChange={this.handleChange} value={apartment.name}/>
                  {submitted && !apartment.name &&
                    <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
                  }
                </Form.Group>

                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" placeholder="Description" name="description"
                    onChange={this.handleChange} value={apartment.description}/>
                </Form.Group>

                <Form.Group controlId="description">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={this.handleImageChange}
                    name="profile_img"
                    accept="image/png, image/jpeg"
                  >
                  </Form.Control>
                  {!!apartment.image && typeof apartment.image == 'string' &&
                    <img src={apartment.image} width="80" className="mt-2" alt="Apartment"/>
                  }
                </Form.Group>

                <Form.Group controlId="price_per_month">
                  <Form.Label>Price per month ($)</Form.Label>
                  <Form.Control type="number" isInvalid={submitted && !apartment.price_per_month}
                    placeholder="Price per month" name="price_per_month"
                    onChange={this.handleChange} value={apartment.price_per_month}/>
                  {submitted && !apartment.price_per_month &&
                    <Form.Control.Feedback type="invalid">Price per month is required</Form.Control.Feedback>
                  }
                </Form.Group>

                <Form.Group controlId="number_of_rooms">
                  <Form.Label>Number of rooms</Form.Label>
                  <Form.Control type="number" isInvalid={submitted && !apartment.number_of_rooms}
                    placeholder="Number of rooms" name="number_of_rooms"
                    onChange={this.handleChange} value={apartment.number_of_rooms}/>
                  {submitted && !apartment.number_of_rooms &&
                    <Form.Control.Feedback type="invalid">Number of rooms is required</Form.Control.Feedback>
                  }
                </Form.Group>

                <Form.Group controlId="floor_area_size">
                  <Form.Label>Floor area size (m2)</Form.Label>
                  <Form.Control type="number" isInvalid={submitted && !apartment.floor_area_size}
                    placeholder="Floor area size" name="floor_area_size"
                    onChange={this.handleChange} value={apartment.floor_area_size}/>
                  {submitted && !apartment.floor_area_size &&
                    <Form.Control.Feedback type="invalid">Floor area size is required</Form.Control.Feedback>
                  }
                </Form.Group>
                <Form.Group controlId="available">
                  <Form.Check type="switch" label="Is Available" name="status" checked={apartment.status === 'Available'}
                    onChange={this.handleSwitch} />
                </Form.Group>
              </div>
              <div className="col-md-6 col-sm-12">
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" isInvalid={submitted && !apartment.address}
                    placeholder="Address" name="address"
                    onChange={this.handlgeAddressChange} value={apartment.address}/>
                  {submitted && !apartment.address &&
                    <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
                  }
                </Form.Group>
                <Form.Group controlId="lat">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control type="text" isInvalid={submitted && !apartment.lat}
                    placeholder="Latitude" name="lat"
                    onChange={this.handleChange} value={apartment.lat}/>
                  {submitted && !apartment.lat &&
                    <Form.Control.Feedback type="invalid">Latitude is required</Form.Control.Feedback>
                  }
                </Form.Group>

                <Form.Group controlId="lng">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control type="text" isInvalid={submitted && !apartment.lng}
                    placeholder="Longitude" name="lng"
                    onChange={this.handleChange} value={apartment.lng}/>
                  {submitted && !apartment.lng &&
                    <Form.Control.Feedback type="invalid">Longitude is required</Form.Control.Feedback>
                  }
                </Form.Group>

                <div id="map" style={{widht: '100%', height: 220}}></div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

const WrapperedMap = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GG_MAP_API_KEY
})(ApartmentModal);

export { WrapperedMap as ApartmentModal };