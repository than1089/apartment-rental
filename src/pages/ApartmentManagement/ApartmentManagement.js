import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { ApartmentModal } from '.';
import { apartmentActions } from '../../redux/actions';
import { Pagination, UserSelect } from '../../components';
import { apartmentService } from '../../services';

class ApartmentManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      editingApartment: null,
    };
    this.url = apartmentService.apartmentUrl;
    this.resetModal = this.resetModal.bind(this);
    this.editApartment = this.editApartment.bind(this);
    this.realtorChange = this.realtorChange.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    if (user.role === 'Realtor') {
      this.url = `${apartmentService.apartmentUrl}?realtor=${user.id}`;
      this.props.setManagementUrl(this.url);
    }
    this.props.fetchApartments(this.url, 'management');
  }

  resetModal() {
    this.setState({
      modalShow: false,
      editingApartment: null
    });
  }

  realtorChange(option) {
    if (option) {
      this.url = `${apartmentService.apartmentUrl}?realtor=${option.value}`;
      this.props.setManagementUrl(this.url);
    } else {
      this.url = apartmentService.apartmentUrl;
      this.props.setManagementUrl(this.url);
    }
    this.props.fetchApartments(this.url, 'management');
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
    const { apartments, user } = this.props;
    const { modalShow, editingApartment } = this.state;
    const currentRole = user.role;
    return (
      <div>
        <h2 className="mb-4">Apartment Management</h2>
        <div className="mb-3 clearfix">
          <Button variant="outline-primary" size="sm"
            onClick={() => this.setState({modalShow: true, editingApartment: null})}>
              Add Apartment <i className="fas fa-plus"></i>
          </Button>
          {user.role === 'Admin' &&
            <div style={{width: 200}} className="float-right">
              <UserSelect placeholder="Select a user" onChange={this.realtorChange} roles={['Admin', 'Realtor']}/>
            </div>
          }
        </div>
        <ApartmentModal
          show={modalShow}
          onHide={() => this.resetModal()}
          apartment={editingApartment}
          createApartment={this.props.createApartment}
          updateApartment={this.props.updateApartment}
        />
        <div className="table-responsive">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th width="15%">Description</th>
                <th>Price ($)</th>
                <th className="text-center">Rooms</th>
                <th>Size (m2)</th>
                {currentRole === 'Admin' &&
                <th width="12%">Owner</th>
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
                  <td colSpan={user.role === 'Admin' ? 9 : 8} className="text-center">
                    No reuslts!
                  </td> 
                </tr>
              }
            </tbody>
          </Table>
        </div>
        <Pagination
          count={apartments.count}
          next={apartments.next}
          previous={apartments.previous}
          fetch={url => this.props.fetchApartments(url, 'management')}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    apartments: state.apartments.management,
    user: state.authentication.user,
  };
}

const actionCreators = {
  fetchApartments: apartmentActions.fetchAll,
  createApartment: apartmentActions.create,
  updateApartment: apartmentActions.update,
  deleteApartment: apartmentActions.delete,
  setManagementUrl: apartmentActions.setManagementUrl,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentManagement);
export { connectedComponent as ApartmentManagement };