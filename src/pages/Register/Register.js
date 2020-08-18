import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { isValidEmail } from '../../helpers/utils';

import { userActions } from '../../redux/actions';

const registerCardStyle = {
  maxWidth: 450,
  margin: 'auto',
  marginTop: 20,
};

class Register extends React.Component {
  constructor(props) {
    super(props);

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const email = params.get('email') || '';
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        email,
        role: 'Client',
        password: '',
        confirm_password: '',
      },
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.body.classList.add('bg-blue-gradient');
  }
  componentWillUnmount() {
    document.body.classList.remove('bg-blue-gradient');
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });

    const { user } = this.state;
    if (this.validateForm(user)) {
      this.props.register(user);
    }
  }

  validateForm(user) {
    return user.email && isValidEmail(user.email)
      && user.password && user.password === user.confirm_password && user.password.length >= 6
  }

  render() {
    const { registering } = this.props;
    const { user, submitted } = this.state;
    return (
      <div style={registerCardStyle}>
        <div class="text-center mb-4">
          <img src={process.env.PUBLIC_URL + '/logo.png'} width="200" alt="Logo"/>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center">Register</h2>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="first_name">
                <Form.Control type="text" placeholder="First Name" name="first_name" autoComplete="off"
                  onChange={this.handleChange} value={user.first_name}/>
              </Form.Group>

              <Form.Group controlId="last_name">
                <Form.Control type="text" placeholder="Last Name" name="last_name" autoComplete="off"
                  onChange={this.handleChange} value={user.last_name}/>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Control type="text"
                  isInvalid={submitted && (!user.email || !isValidEmail(user.email))}
                  placeholder="Email" name="email" autoComplete="off"
                  onChange={this.handleChange} value={user.email}/>
                {submitted && !user.email &&
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                }
                {submitted && user.email && !isValidEmail(user.email) &&
                  <Form.Control.Feedback type="invalid">Email is invalid</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="role">
                <Form.Control as="select" custom value={user.role} name="role" onChange={this.handleChange}>
                  <option value="Client">Register As Client</option>
                  <option value="Realtor">Register As Realtor</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Control type="password"
                  isInvalid={submitted && (!user.password || user.password.length < 6)}
                  placeholder="Password" name="password" autoComplete="off"
                  onChange={this.handleChange} value={user.password}/>
                {submitted && !user.password &&
                  <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                }
                {submitted && user.password && user.password.length < 6 &&
                  <Form.Control.Feedback type="invalid">Password must be at least 6 characters</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="confirm_password">
                <Form.Control type="password"
                  isInvalid={submitted && (!user.confirm_password || user.password !== user.confirm_password)}
                  placeholder="Confirm Password" name="confirm_password" autoComplete="off"
                  onChange={this.handleChange} value={user.confirm_password}/>
                {submitted && !user.confirm_password &&
                  <Form.Control.Feedback type="invalid">Confirm Password is required</Form.Control.Feedback>
                }
                {submitted && user.confirm_password && user.password !== user.confirm_password &&
                  <Form.Control.Feedback type="invalid">Confirm Password is not matched</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit" className="mr-2">Regisger</Button>
                {registering &&
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" alt="loading"/>
                }
                <Link to="/login" className="btn btn-link">Login</Link>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register
}

const connectedComponent = connect(mapState, actionCreators)(Register);
export { connectedComponent as Register };