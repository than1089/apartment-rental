import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { ApartmentModal, ApartmentFilters } from '.';
import { ApartmentActions } from '../../redux/actions';

class ApartmentManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      editingApartment: null,
    };

    this.resetModal = this.resetModal.bind(this);
    this.setEditingApartment = this.setEditingApartment.bind(this);
  }
  componentDidMount() {
    this.props.fetchApartments();
  }
  
  resetModal() {
    this.setState({
      modalShow: false,
      editingApartment: null,
    });
  }

  setEditingApartment(index) {
    this.setState({
      editingApartment: Object.assign({}, this.props.Apartments[index]),
      modalShow: true,
    });
  }

  deleteApartment(index) {
    const ok = window.confirm('Are you sure you want to delete this Apartment?');
    if (ok) {
      this.props.deleteApartment(this.props.Apartments[index]);
    }
  }

  getDaysToStart(startDate) {
    const differentTime = (new Date(startDate)).getTime() - (new Date()).getTime();
    if (differentTime > 0) {
      return Math.ceil(differentTime / (1000 * 3600 * 24)); 
    }
    return '-';
  }

  render() {
    const { apartments, auth } = this.props;
    const { modalShow, editingApartment } = this.state;
    const currentRole = auth.user.role;
    return (
      <div>
        <h2 className="mb-4">Apartments Management</h2>
        <div className="mb-3 clearfix">
          <Button variant="outline-primary" size="sm"
            onClick={() => this.setState({modalShow: true})}>
              Add Apartment <i className="fas fa-plus"></i>
          </Button>
          <ApartmentFilters />
        </div>
        <ApartmentModal
          show={modalShow}
          onHide={() => this.resetModal()}
          Apartment={editingApartment}
        />
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Floor Area Size</th>
              <th>Price Per Month</th>
              <th>Number of Rooms</th>
              {currentRole === 'Admin' &&
              <th>Realtor</th>
              }
              <th>Address</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.results.map((item, index) => 
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td></td>
                </tr>
              )
            }
            {!apartments.results.length && 
              <tr>
                <td colSpan="8" className="text-center">Opps! You have no Apartments yet.</td> 
              </tr>
            }
          </tbody>
        </Table>
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
  fetchApartments: ApartmentActions.fetchAll,
  deleteApartment: ApartmentActions.delete,
  setFilter: ApartmentActions.setFilter,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentManagement);
export { connectedComponent as ApartmentManagement };