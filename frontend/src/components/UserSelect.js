import React from 'react';
import AsyncSelect from 'react-select/async';
import { userService } from '../services/user.service';
import { buildSearchURL } from '../helpers/utils'
import _ from "lodash";

export class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.loadOptions = this.loadOptions.bind(this);
    this.loadOptions = _.throttle(this.loadOptions, 500);
  }

  async loadOptions(inputValue) {
    let url = '/api/users/';
    let params = {q: encodeURIComponent(inputValue)};
    if (this.props.roles) {
      params.roles = this.props.roles;
    }
    const response = await userService.getAll(buildSearchURL(url, params));
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