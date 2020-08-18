import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { apartmentActions } from '../../redux/actions';


class ApartmentDetail extends React.Component {
  
  componentDidMount() {
    const apartmentId = this.props.match.params.apartmentId;
    this.props.get(apartmentId);
  }

  render() {
    const {loading, apartment} = this.props;
    return (
      <div className="row">
        <div className="container">
          {loading &&
            <div className="text-center">
              <img src={process.env.PUBLIC_URL + '/loading.gif'} width="100" alt="Loading..."/>
            </div>
          }
          {!loading && apartment &&
            <div className="row">
              <div className="col-md-6 col-sm-12 mb-4">
                <h1>{apartment.name}</h1>
                <img src={ apartment.image || (process.env.PUBLIC_URL + '/apartment-placeholder.png')} alt="Apartment Thumbnail" />
                <p><i className="fa fa-map-marker-alt"></i> {apartment.address}</p>
                <div className="text-info">
                  <span className="text-nowrap mr-3"><i className="fas fa-money-bill-alt"></i> ${apartment.price_per_month}/month</span>
                  <span className="text-nowrap mr-3"><i className="fas fa-bed"></i> {apartment.number_of_rooms} room{apartment.number_of_rooms !== 1 ? 's' : ''}</span>
                  <span className="text-nowrap"><i className="fas fa-pencil-ruler"></i> {apartment.floor_area_size} m2</span>
                </div>
                <div className="mt-3">
                  <Button href={`mailto:${apartment.realtor_email}`}>Contact</Button>
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <h2>Description</h2>
                <p>
                  {apartment.description}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    apartment: state.apartments.single,
    loading: state.apartments.loading,
  };
}

const actionCreators = {
  get: apartmentActions.get,
};

const connectedComponent = connect(mapState, actionCreators)(ApartmentDetail);
export { connectedComponent as ApartmentDetail };