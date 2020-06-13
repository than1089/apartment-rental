import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { apartmentActions } from '../../redux/actions';

const initState = {
  apartment: {
    id: -1,
    name: '',
    description: '',
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
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const apartment = Object.assign({}, this.state.apartment);

    if (apartment.name && apartment.floor_area_size && apartment.price_per_month && apartment.address &&
      apartment.status && apartment.lat && apartment.lng) {
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
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{ addingApartment ? 'Add Apartment' : 'Edit Apartment' }</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
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

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" isInvalid={submitted && !apartment.address}
                  placeholder="Address" name="address"
                  onChange={this.handleChange} value={apartment.address}/>
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

const actionCreators = {
  createApartment: apartmentActions.create,
  updateApartment: apartmentActions.update,
}

const connectedComponent = connect(null, actionCreators)(ApartmentModal);
export { connectedComponent as ApartmentModal };