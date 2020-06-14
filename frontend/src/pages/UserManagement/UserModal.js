import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { isValidEmail } from '../../helpers/utils';

const initState = {
  user: {
    id: -1,
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    is_active: true,
  },
  submitted: false,
  addingUser: true,
};

class UserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initState };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const user = props.user;
    if (user && user.id !== state.user.id) {
      return {
        user,
        submitted: false,
        addingUser: false,
      }
    }

    if (!user && state.user.id !== -1) {
      return { ...initState };
    }
    return null;
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  handleSwitch(e) {
    const { name, checked } = e.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: checked
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });

    const user = Object.assign({}, this.state.user);
    if (this.state.addingUser && user.first_name && user.last_name && isValidEmail(user.email) && user.password && user.password.length >= 6) {
      delete user.id;
      this.props.createUser(user);
      this.setState({ ...initState });
      this.props.onHide();
    }

    if (!this.state.addingUser && user.first_name && user.last_name) {
      if (!user.password) {
        delete user.password;
      }
      if (user.password && user.password.length < 6) {
        return;
      }
      this.props.updateUser(user);
      this.setState({ ...initState });
      this.props.onHide();
    }
  }

  render() {
    const { user, submitted, addingUser } = this.state;
    const { authentication } = this.props;
    return (
      <Modal
        {...this.props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{addingUser ? 'Add User' : 'Edit User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" isInvalid={submitted && !user.first_name}
                placeholder="First Name" name="first_name"
                onChange={this.handleChange} value={user.first_name} />
              {submitted && !user.first_name &&
                <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
              }
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" isInvalid={submitted && !user.last_name}
                placeholder="Last Name" name="last_name"
                onChange={this.handleChange} value={user.last_name} />
              {submitted && !user.last_name &&
                <Form.Control.Feedback type="invalid">Last Name is required</Form.Control.Feedback>
              }
            </Form.Group>
            {addingUser &&
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" isInvalid={submitted && (!user.email || !isValidEmail(user.email))}
                  placeholder="Email" name="email" autoComplete="off"
                  onChange={this.handleChange} value={user.email} />
                {submitted && !user.email &&
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                }
                {submitted && user.email && !isValidEmail(user.email) &&
                  <Form.Control.Feedback type="invalid">Email is invalid</Form.Control.Feedback>
                }
              </Form.Group>
            }

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                isInvalid={submitted && ((addingUser && !user.password) || (user.password && user.password.length < 6))}
                placeholder="Password" name="password" autoComplete="off"
                onChange={this.handleChange} value={user.password || ''} />
              {submitted && addingUser && !user.password &&
                <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
              }
              {submitted && user.password && user.password.length < 6 &&
                <Form.Control.Feedback type="invalid">Password must have at least 6 characters.</Form.Control.Feedback>
              }
              {!addingUser &&
                <span className="text-info">Leave empty to keep previous password.</span>
              }
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" custom value={user.role} name="role" onChange={this.handleChange}>
                <option value="Client">Client</option>
                <option value="Realtor">Realtor</option>
                <option value="Admin">Admin</option>
              </Form.Control>
            </Form.Group>
            {authentication.user.id !== user.id &&
              <Form.Group controlId="active">
                <Form.Check type="switch" label="Is Active" name="is_active" checked={user.is_active}
                  onChange={this.handleSwitch} />
              </Form.Group>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

function mapState(state) {
  return {authentication: state.authentication};
}

const connectedComponent = connect(mapState, null)(UserModal);
export { connectedComponent as UserModal };