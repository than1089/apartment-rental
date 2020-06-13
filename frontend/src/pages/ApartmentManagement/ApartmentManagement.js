import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { ApartmentModal } from '.';
import { apartmentActions } from '../../redux/actions';
import { Pagination } from '../../components';

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
        </div>
        <ApartmentModal
          show={modalShow}
          onHide={() => this.resetModal()}
          Apartment={editingApartment}
        />
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th width="15%">Description</th>
              <th>Price ($)</th>
              <th className="text-center">Rooms</th>
              <th>Size (m2)</th>
              {currentRole === 'Admin' &&
              <th width="12%">Realtor</th>
              }
              <th width="15%">Address</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.results.map((apartment, index) => 
                <tr key={index}>
                  <td>{apartment.name}</td>
                  <td>{apartment.description}</td>
                  <td>{apartment.price_per_month}</td>
                  <td className="text-center">{apartment.number_of_rooms}</td>
                  <td>{apartment.floor_area_size}</td>
                  {currentRole === 'Admin' &&
                    <td>{apartment.realtor}</td>
                  }
                  <td>{apartment.address}</td>
                  <td>{apartment.status}</td>
                  <td></td>
                </tr>
              )
            }
            {!apartments.results.length && 
              <tr>
                <td colSpan={auth.user.role === 'Admin' ? 9 : 8} className="text-center">
                  Opps! You have no apartments yet.
                </td> 
              </tr>
            }
          </tbody>
        </Table>
        <Pagination
          count={apartments.count}
          next={apartments.next}
          previous={apartments.previous}
          fetch={this.props.fetchApartments}
        />
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
  deleteApartment: apartmentActions.delete,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentManagement);
export { connectedComponent as ApartmentManagement };