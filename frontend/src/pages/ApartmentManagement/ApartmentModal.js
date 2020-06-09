import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { ApartmentActions } from '../../redux/actions';

const initState = {
  Apartment: {
    id: -1,
    destination: '',
    start_date: '',
    end_date: '',
    comment: '',
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
    const Apartment = props.Apartment;

    if (Apartment && Apartment.id !== state.Apartment.id) {
      return {
        Apartment,
        submitted: false,
        addingApartment: false,
      }
    }
    if (!Apartment && state.Apartment.id !== -1) {
      return initState;
    }
    return null;
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { Apartment } = this.state;
    this.setState({
      Apartment: {
        ...Apartment,
        [name]: value
      }
    });
  }

  isValidEndDate() {
    const Apartment = this.state.Apartment;
    const startTime = new Date(Apartment.start_date).getTime();
    const endTime = new Date(Apartment.end_date).getTime();
    return endTime >= startTime;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const Apartment = Object.assign({}, this.state.Apartment);
    console.log(Apartment)
    if (Apartment.destination && Apartment.start_date && Apartment.end_date && this.isValidEndDate()) {
      if (Apartment.id !== -1) {
        this.props.updateApartment(Apartment);
      } else {
        delete Apartment.id;
        this.props.createApartment(Apartment);
      }
      this.setState({...initState});
      this.props.onHide();
    }
  }
  render() {
    const { Apartment, submitted, addingApartment } = this.state;
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
              <Form.Group controlId="destination">
                <Form.Label>Destination</Form.Label>
                <Form.Control type="text" isInvalid={submitted && !Apartment.destination}
                  placeholder="Apartment Destination" name="destination"
                  onChange={this.handleChange} value={Apartment.destination}/>
                {submitted && !Apartment.destination &&
                  <Form.Control.Feedback type="invalid">Destination is required</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" isInvalid={submitted && !Apartment.start_date}
                  placeholder="Start Date" name="start_date"
                  onChange={this.handleChange} value={Apartment.start_date}/>
                {submitted && !Apartment.start_date &&
                  <Form.Control.Feedback type="invalid">Start Date is required</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" isInvalid={submitted && (!Apartment.end_date || !this.isValidEndDate())}
                  placeholder="Start Date" name="end_date"
                  onChange={this.handleChange} value={Apartment.end_date}/>
                {submitted && !Apartment.end_date &&
                  <Form.Control.Feedback type="invalid">End Date is required</Form.Control.Feedback>
                }
                {submitted && !this.isValidEndDate() &&
                  <Form.Control.Feedback type="invalid">End Date must be greater or equal to Start Date</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="comment">
                <Form.Label>Comment</Form.Label>
                <Form.Control  as="textarea" rows="3"
                  placeholder="Comment" name="comment"
                  onChange={this.handleChange} value={Apartment.comment}/>
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
  createApartment: ApartmentActions.create,
  updateApartment: ApartmentActions.update,
}

const connectedApartmentModal = connect(null, actionCreators)(ApartmentModal);
export { connectedApartmentModal as ApartmentModal };