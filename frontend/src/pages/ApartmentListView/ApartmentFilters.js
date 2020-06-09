import React from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { apartmentActions } from '../../redux/actions';


class ApartmentFilters extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      min_size: "",
      max_size: "",
      min_price: "",
      max_price: "",
      number_of_rooms: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.filterApartments(this.state);
  }

  render() {
    const { min_size, max_size, min_price, max_price, number_of_rooms } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Row>
          <Form.Group className="col-md-2 col-sm-6" controlId="min-size">
            <Form.Label>Min Size (m2)</Form.Label>
            <Form.Control
              as="select"
              name="min_size"
              value={min_size}
              onChange={this.handleChange}
            >
              <option value="">Any</option>
              <option value="10">10</option>
              <option value="20">30</option>
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="90">90</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="300">300</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6" controlId="max-size">
            <Form.Label>Max Size (m2)</Form.Label>
            <Form.Control
              as="select"
              name="max_size"
              value={max_size}
              onChange={this.handleChange}
            >
              <option value="">Any</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="80">80</option>
              <option value="120">120</option>
              <option value="160">160</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6" controlId="min-price">
            <Form.Label>Min Price ($)</Form.Label>
            <Form.Control
              as="select"
              name="min_price"
              value={min_price}
              onChange={this.handleChange}
            >
              <option value="">Any</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="1000">1000</option>
              <option value="1200">1200</option>
              <option value="1500">1500</option>
              <option value="2000">2000</option>
              <option value="2500">2500</option>
              <option value="3000">3000</option>
              <option value="3500">3500</option>
              <option value="4000">4000</option>
              <option value="4500">4500</option>
              <option value="5000">5000</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6" controlId="max-price">
            <Form.Label>Max Price ($)</Form.Label>
            <Form.Control
              as="select"
              name="max_price"
              value={max_price}
              onChange={this.handleChange}
            >
              <option value="">Any</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="1000">1000</option>
              <option value="1200">1200</option>
              <option value="1500">1500</option>
              <option value="2000">2000</option>
              <option value="2500">2500</option>
              <option value="3000">3000</option>
              <option value="3500">3500</option>
              <option value="4000">4000</option>
              <option value="4500">4500</option>
              <option value="5000">5000</option>
              <option value="6000">6000</option>
              <option value="7000">7000</option>
              <option value="8000">8000</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6" controlId="number-of-rooms">
            <Form.Label>Rooms</Form.Label>
            <Form.Control
              as="select"
              name="number_of_rooms"
              value={number_of_rooms}
              onChange={this.handleChange}
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6">
            <Form.Label className="d-sm-block">&nbsp;</Form.Label>
            <Button variant="primary" type="submit">Find Apartments</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    )
  }
}

function mapState(state) {
  const { apartmentFilter } = state;
  return { apartmentFilter };
}

const actionCreators = {
  filterApartments: apartmentActions.filterApartments,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentFilters);
export { connectedComponent as ApartmentFilters };