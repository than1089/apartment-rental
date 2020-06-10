import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { validateEmail } from '../../helpers/utils';
import { userActions } from '../../redux/actions';

const loginCardStyle = {
  maxWidth: 400,
  margin: 'auto',
  marginTop: 100,
};


class Login extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.logout();

    this.state = {
      email: '',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && validateEmail(email) && password) {
      this.props.login(email, password);
    }
  }

  render() {
    const { loggingIn } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div style={loginCardStyle}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" isInvalid={submitted && (!email || !validateEmail(email))}
                  placeholder="email" name="email"
                  onChange={this.handleChange} value={email} />
                {submitted && !email &&
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                }
                {submitted && email && !validateEmail(email) &&
                  <Form.Control.Feedback type="invalid">Email is invalid</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" isInvalid={submitted && !password}
                  placeholder="Password" name="password"
                  onChange={this.handleChange} value={password} />
                {submitted && !password &&
                  <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                }
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit" className="mr-2">Login</Button>
                {loggingIn &&
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" alt="loading" />
                }
                <Link to="/register" className="btn btn-link">Register</Link>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { loggingIn } = state.authentication;
  return { loggingIn };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout
};

const connectedComponent = connect(mapState, actionCreators)(Login);
export { connectedComponent as Login };