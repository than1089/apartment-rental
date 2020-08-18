import React from 'react';
import { Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import { history } from '../../helpers';
import { alertActions } from '../../redux/actions';
import { PrivateRoute } from '../../components';
import { ApartmentListView, ApartmentMapView } from '../ApartmentView';
import { ApartmentDetail } from '../ApartmentDetail';
import { ApartmentManagement } from '../ApartmentManagement';
import { UserManagement } from '../UserManagement';
import { VerifyEmail } from '../VerifyEmail';
import { UploadAvatar } from '../UserProfile';
import { Login } from '../Login';
import { Register } from '../Register';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });
  }

  render() {
    const { alert, authentication } = this.props;
    const user = this.props.authentication.user;
    let displayName = '';
    if (user) {
      displayName = user.first_name ? user.first_name + ' ' + user.last_name : user.email;
    }
    return (
      <Router history={history}>
        <div className="wrapper">
          {user && !authentication.loggingIn &&
            <Navbar bg="dark-blue" variant="dark" expand="lg" className="mb-4">
              <Navbar.Brand>
                <Link to="/" className="nav-link" role="button">
                  <img src={process.env.PUBLIC_URL + '/logo.png'} width="120" alt="Logo"/>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/" className="nav-link" role="button">List View</Link>
                  <Link to="/map" className="nav-link" role="button">Map View</Link>
                  {user.role === 'Admin' &&
                    <Link to="/user-management" className="nav-link" role="button">User Management</Link>
                  }
                  {['Admin', 'Realtor'].indexOf(user.role) !== -1 &&
                    <Link to="/apartment-management" className="nav-link" role="button">Apartment Management</Link>
                  }
                </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
                <NavDropdown title={displayName}>
                  <Link to="/profile" className="nav-link" role="button">Change Avatar</Link>
                  <Link to="/login" className="nav-link" role="button"><i className="fa fa-sign-out mr-1" aria-hidden="true"></i>Logout</Link>
                </NavDropdown>
                {user.profile_img &&
                  <NavItem>
                    <img src={user.profile_img} width="30" height="30" className="profile-image" alt="Avatar"/>
                  </NavItem>
                }
                {!user.profile_img &&
                  <NavItem>
                    <img src={process.env.PUBLIC_URL + '/avatar.jpg'} width="30" height="30" className="profile-image" alt="Avatar"/>
                  </NavItem>
                }
              </Navbar.Collapse>
            </Navbar>
          }
          <div className="container-fluid">
            <div className="col">
              {alert.message &&
                <div className={`alert ${alert.type}`}>
                  {alert.message}
                  <button type="button" className="close"
                    data-dismiss="alert" aria-label="Close"
                    onClick={this.props.clearAlerts}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              }
                <Switch>
                  <PrivateRoute exact path="/" component={ApartmentListView} />
                  <PrivateRoute path="/apartment/:apartmentId" component={ApartmentDetail} />
                  <PrivateRoute exact path="/map" component={ApartmentMapView} />
                  <PrivateRoute exact path="/user-management" component={UserManagement} />
                  <PrivateRoute exact path="/apartment-management" component={ApartmentManagement} />
                  <PrivateRoute exact path="/profile" component={UploadAvatar} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/verify-email/" component={VerifyEmail} />
                  <Redirect from="*" to="/" />
                </Switch>
            </div>
          </div>
          <footer>
            <div className="container-fluid">
              <div className="p-2 text-center">@ Apartment Rental 2020</div>
            </div>
          </footer>
        </div>
      </Router>
    );
  }
}

function mapState(state) {
  const { alert, authentication } = state;
  return { alert, authentication };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };