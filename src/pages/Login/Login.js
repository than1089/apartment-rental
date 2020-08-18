import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { isValidEmail } from '../../helpers/utils';
import { userActions } from '../../redux/actions';
import SocialButton from './SocialButton';

const loginCardStyle = {
  maxWidth: 400,
  margin: 'auto',
  marginTop: 50,
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

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
  }

  componentDidMount() {
    document.body.classList.add('bg-blue-gradient');
  }
  componentWillUnmount() {
    document.body.classList.remove('bg-blue-gradient');
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && isValidEmail(email) && password) {
      this.props.login(email, password);
    }
  }

  onLoginSuccess(provider, response) {
    this.props.loginSocial(provider, response.token.accessToken);
  }

  onLoginFailure(error) {
    console.log(error);
  }

  render() {
    const { loggingIn } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div style={loginCardStyle}>
        <div class="text-center mb-4">
          <img src={process.env.PUBLIC_URL + '/logo.png'} width="200" alt="Logo"/>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center">Login</h2>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" isInvalid={submitted && (!email || !isValidEmail(email))}
                  placeholder="email" name="email"
                  onChange={this.handleChange} value={email} />
                {submitted && !email &&
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                }
                {submitted && email && !isValidEmail(email) &&
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
            <div className="row">
              <div className="col">
                <SocialButton
                  provider='facebook'
                  appId={process.env.REACT_APP_FB_APP_ID}
                  onLoginSuccess={(response) => this.onLoginSuccess('facebook', response)}
                  onLoginFailure={this.onLoginFailure}
                  className="btn btn-sm w-100" style={{backgroundColor: '#3b5998', color: '#fff'}}
                >
                  <i className="fab fa-facebook-f"></i> Login with Facebook
                </SocialButton>
              </div>
              <div className="col">
                <SocialButton
                  provider='google'
                  appId={process.env.REACT_APP_GG_APP_ID}
                  onLoginSuccess={(response) => this.onLoginSuccess('google', response)}
                  onLoginFailure={this.onLoginFailure}
                  className="btn btn-sm w-100" style={{backgroundColor: '#db3236', color: '#fff'}}
                >
                  <i className="fab fa-google"></i> Login with Google
                </SocialButton>
              </div>
            </div>
            <div className="mt-3">
              Client: client@example.com<br/>
              Realtor: realtor1@example.com<br/>
              Pass: 123456
            </div>
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
  logout: userActions.logout,
  loginSocial: userActions.loginSocial,
};

const connectedComponent = connect(mapState, actionCreators)(Login);
export { connectedComponent as Login };