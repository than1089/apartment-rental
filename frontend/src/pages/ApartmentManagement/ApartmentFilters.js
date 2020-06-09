import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import { filterContants } from '../../redux/actionTypes'
import { ApartmentActions } from '../../redux/actions';


class ApartmentFilters extends React.Component {
  render() {
    const { ApartmentFilter } = this.props;
    return (
      <ButtonGroup size="sm" className="ml-2">
        <Button
          variant={ApartmentFilter === filterContants.ALL ? 'primary' : 'secondary'}
          onClick={() => this.props.setFilter(filterContants.ALL)}>All Apartments</Button>
        <Button
          variant={ApartmentFilter === filterContants.PAST ? 'primary' : 'secondary'}
          onClick={() => this.props.setFilter(filterContants.PAST)}>Past Apartments</Button>
        <Button
          variant={ApartmentFilter === filterContants.FUTURE ? 'primary' : 'secondary'}
          onClick={() => this.props.setFilter(filterContants.FUTURE)}>Future Apartments</Button>
      </ButtonGroup>
    )
  }
}

function mapState(state) {
  const { ApartmentFilter } = state;
  return { ApartmentFilter };
}

const actionCreators = {
  setFilter: ApartmentActions.setFilter,
}

const connectedApartmentFilters = connect(mapState, actionCreators)(ApartmentFilters);
export { connectedApartmentFilters as ApartmentFilters };