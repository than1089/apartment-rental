import React from 'react';
import { connect } from 'react-redux';
import { Badge, Card, Button } from 'react-bootstrap';
import { apartmentActions } from '../../redux/actions';
import { ApartmentFilters } from './ApartmentFilters';
import './ApartmentListView.css';

class ApartmentListView extends React.Component {
  
  componentDidMount() {
    this.props.fetchApartments();
  }

  render() {
    const { apartments } = this.props;
    return (
      <div>
        <h2 className="mb-4">Apartments</h2>
        <ApartmentFilters/>
        <hr/>
        <div className="row">
          {apartments.results.map((item, index) => 
            <div className="col-lg-4 col-md-6 col-sm-12 card-deck mb-4" key={index}>
              <Card>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{item.name}</Card.Title>
                  <div className="d-flex flex-column flex-grow-1">
                    <div className="text-secondary flex-grow-1">
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <p><i className="fa fa-map-marker-alt"></i> {item.address}</p>
                      <div className="text-info">
                        <span className="text-nowrap mr-3"><i className="fas fa-money-bill-alt"></i> ${item.price_per_month}/month</span>
                        <span className="text-nowrap mr-3"><i className="fas fa-bed"></i> {item.number_of_rooms} room{item.number_of_rooms !== 1 ? 's' : ''}</span>
                        <span className="text-nowrap"><i className="fas fa-pencil-ruler"></i> {item.floor_area_size} m2</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Added on {item.created_at}</small>
                  <Badge variant={item.status === 'Available' ? 'success': 'danger'} className="float-right h-100">{item.status}</Badge>
                </Card.Footer>
              </Card>
            </div>
          )}
          {!apartments.results.length &&
            <div className="col text-center">
              <h3><i className="far fa-sad-cry" aria-hidden="true"></i> No results found!</h3>
            </div>
          }
        </div>
        <div className="pagination mb-3">
          {apartments.previous &&
            <Button variant="secondary"
              onClick={() => this.props.fetchApartments(apartments.previous)}
              size="sm" className="mr-2">« Previous</Button>
          }
          {apartments.next &&
            <Button variant="secondary"
              onClick={() => this.props.fetchApartments(apartments.next)}
              size="sm" className="mr-2">Next »</Button>
          }
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
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentListView);
export { connectedComponent as ApartmentListView };