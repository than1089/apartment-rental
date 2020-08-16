import React from 'react';
import { connect } from 'react-redux';
import { Badge, Card } from 'react-bootstrap';
import { apartmentActions } from '../../redux/actions';
import { ApartmentFilters } from './ApartmentFilters';
import { Pagination } from '../../components';
import { buildSearchURL } from '../../helpers/utils';
import { apartmentService } from '../../services';
import './ApartmentListView.css';

class ApartmentListView extends React.Component {
  apartmentUrl = apartmentService.apartmentUrl;

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }
  
  componentDidMount() {
    this.fetchData(this.props.filters);
  }

  fetchData(filters) {
    const url = buildSearchURL(apartmentService.apartmentUrl, filters);
    this.props.fetchApartments(url);
  }

  render() {
    const { list } = this.props;
    return (
      <div>
        <h2 className="mb-4">Apartments</h2>
        <ApartmentFilters onChange={this.fetchData}/>
        <hr/>
        <div className="row">
          {list.results.map((item, index) => 
            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4 d-flex" key={index}>
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
                  <small className="text-muted">Added on {(new Date(item.created_at)).toLocaleDateString()}</small>
                  <Badge variant={item.status === 'Available' ? 'success': 'danger'} className="float-right">{item.status}</Badge>
                </Card.Footer>
              </Card>
            </div>
          )}
          {!list.results.length &&
            <div className="col text-center">
              <h3><i className="far fa-sad-cry" aria-hidden="true"></i> No results found!</h3>
            </div>
          }
        </div>
        <Pagination
          count={list.count}
          next={list.next}
          previous={list.previous}
          fetch={this.props.fetchApartments}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    list: state.apartments.list,
    filters: state.apartments.filters
  };
}

const actionCreators = {
  fetchApartments: apartmentActions.fetchAll,
}

const connectedComponent = connect(mapState, actionCreators)(ApartmentListView);
export { connectedComponent as ApartmentListView };