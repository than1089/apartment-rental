import React from 'react';
import AsyncSelect from 'react-select/async';
import { userService } from '../services/user.service'
import _ from "lodash";

export class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.loadOptions = _.throttle(this.loadOptions, 500);
  }
  
  async loadOptions(inputValue) {
    const response = await userService.getAll(`/api/users/?q=${encodeURIComponent(inputValue)}`);
    return response.results.map(item => ({
      label: item.first_name + ' ' + item.last_name,
      value: item.id
    }));
  } 

  render() {
    return (
      <AsyncSelect
        {...this.props}
        cacheOptions
        loadOptions={this.loadOptions}
        defaultOptions
        isClearable
      />
    )
  }
}