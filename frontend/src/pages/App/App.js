import React from 'react';
import { Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap'
import { history } from '../../helpers';
import { alertActions } from '../../redux/actions';
import { PrivateRoute } from '../../components';
import { ApartmentListView, ApartmentMapView } from '../ApartmentView';
import { UserManagement } from '../UserManagement';
import { VerifyEmail } from '../VerifyEmail';
import { Login } from '../Login';
import { Register } from '../Register';


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
    return (
      <Router history={history}>
        <div className="wrapper">
          {authentication.user && !authentication.loggingIn &&
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
              <Navbar.Brand>Apartments Rental</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/" className="nav-link" role="button">List View</Link>
                  <Link to="/map" className="nav-link" role="button">Map View</Link>
                  {authentication.user.role === 'Admin' &&
                    <Link to="/user-management" className="nav-link" role="button">User Management</Link>
                  }
                </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  Signed in as: <strong>{authentication.user.first_name}</strong>
                </Navbar.Text>
                <Link to="/login" className="nav-link" role="button"><i className="fa fa-sign-out" aria-hidden="true"></i></Link>
              </Navbar.Collapse>
            </Navbar>
          }
          <div className="container-fluid">
            <div className="col">
              {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
              }
                <Switch>
                  <PrivateRoute exact path="/" component={ApartmentListView} />
                  <PrivateRoute exact path="/map" component={ApartmentMapView} />
                  <PrivateRoute exact path="/user-management" component={UserManagement} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/verify-email/" component={VerifyEmail} />
                  <Redirect from="*" to="/" />
                </Switch>
            </div>
          </div>
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