import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { userActions } from '../../redux/actions';
import { isValidEmail } from '../../helpers/utils';


class InviteUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        email: '',
        submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const {email} = this.state;
    if (isValidEmail(email)) {
      this.props.inviteUser(email);
      this.props.onHide();
    }
  }

  render() {
    const { submitted, email } = this.state;
    return (
      <Modal
        {...this.props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Invite New User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
              <Form.Group controlId="email">
                <Form.Label>Enter email to invite new user.</Form.Label>
                <Form.Control type="text" isInvalid={submitted && (!email || !isValidEmail(email))}
                  placeholder="Email" name="email" autoComplete="off"
                  onChange={this.handleChange} value={email} />
                {submitted && !email &&
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                }
                {submitted && email && !isValidEmail(email) &&
                  <Form.Control.Feedback type="invalid">Email is invalid</Form.Control.Feedback>
                }
              </Form.Group>
            
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

const actionCreators = {
  inviteUser: userActions.invite,
}

const connectedComponent = connect(null, actionCreators)(InviteUserModal);
export { connectedComponent as InviteUserModal };