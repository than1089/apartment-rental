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
    this.editApartment = this.editApartment.bind(this);
  }
  componentDidMount() {
    const user = this.props.auth.user;
    if (user.role === 'Realtor') {
      this.props.setBasePath(`/api/apartments/?realtor=${user.id}`);
    } else {
      this.props.setBasePath(`/api/apartments/`);
    }
    this.props.fetchApartments();
  }

  componentWillUnmount() {
    this.props.setBasePath(`/api/apartments/`);
  }

  resetModal() {
    this.setState({
      modalShow: false,
    });
  }

  editApartment(apartment) {
    this.setState({
      editingApartment: apartment,
      modalShow: true,
    });
  }

  deleteApartment(apartment) {
    const ok = window.confirm('Are you sure you want to delete this Apartment?');
    if (ok) {
      this.props.deleteApartment(apartment);
    }
  }

  render() {
    const { apartments, auth } = this.props;
    const { modalShow, editingApartment } = this.state;
    const currentRole = auth.user.role;
    return (
      <div>
        <h2 className="mb-4">Apartment Management</h2>
        <div className="mb-3 clearfix">
          <Button variant="outline-primary" size="sm"
            onClick={() => this.setState({modalShow: true, editingApartment: null})}>
              Add Apartment <i className="fas fa-plus"></i>
          </Button>
        </div>
        <ApartmentModal
          show={modalShow}
          onHide={() => this.resetModal()}
          apartment={editingApartment}
          createApartment={this.props.createApartment}
          updateApartment={this.props.updateApartment}
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
              <th className="text-center">Status</th>
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
                  <td className="text-center">
                    <span className={'badge badge-' + (apartment.status === 'Available' ? 'success' : 'danger')}>
                      {apartment.status}
                    </span>
                  </td>
                  <td style={{whiteSpace: 'nowrap'}} className="text-center">
                    <Button size="sm" variant="outline-secondary mr-2" onClick={() => this.editApartment(apartment)}>
                      <i className="fa fa-pencil"></i></Button>
                    <Button size="sm" variant="outline-danger" onClick={() => this.deleteApartment(apartment)}>
                      <i className="fa fa-trash"></i></Button>
                </td>
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
  createApartment: apartmentActions.create,
  updateApartment: apartmentActions.update,
  deleteApartment: apartmentActions.delete,
  setBasePath: apartmentActions.setBasePath,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentManagement);
export { connectedComponent as ApartmentManagement };