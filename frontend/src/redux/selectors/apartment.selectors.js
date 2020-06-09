import { createSelector } from 'reselect';
import { filterContants } from '../actionTypes/filter.constants';

const getApartmentFilter = (state) => state.ApartmentFilter;
const getApartments = (state) => state.Apartments.items || [];

export const getVisibleApartments = createSelector(
  [getApartmentFilter, getApartments],
  (ApartmentFilter, Apartments) => {
    switch (ApartmentFilter) {
      case filterContants.ALL:
      default:
        return Apartments
      case filterContants.PAST:
        return Apartments.filter(t => new Date(t.start_date).getTime() < (new Date()).getTime());
      case filterContants.FUTURE:
        return Apartments.filter(t => new Date(t.start_date).getTime() >= (new Date()).getTime());
    }
  }
)
