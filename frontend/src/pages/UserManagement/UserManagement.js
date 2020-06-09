import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Form } from 'react-bootstrap';
import { userActions } from '../../redux/actions';
import { UserModal } from './UserModal';

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      modalShow: false,
      editingUser: null,
    };

    this.resetModal = this.resetModal.bind(this);
    this.setEditingUser = this.setEditingUser.bind(this);
  }
  componentDidMount() {
    this.props.fetchUsers();
  }

  resetModal() {
    this.setState({
      modalShow: false,
      editingUser: null,
    });
  }

  setEditingUser(index) {
    this.setState({
      editingUser: Object.assign({}, this.props.users[index]),
      modalShow: true,
    });
  }

  deleteUser(index) {
    const ok = window.confirm('Are you sure you want to delete this user?');
    if (ok) {
      this.props.deleteUser(this.props.users[index]);
    }
  }

  render() {
    const { users } = this.props;
    const { modalShow, editingUser } = this.state;
    return (
      <div>
        <h2 className="mb-4">Users Management</h2>
        <div className="mb-3">
          <Button variant="outline-primary" size="sm"
            onClick={() => this.setState({ modalShow: true })}>
            Add User <i className="fas fa-plus"></i>
          </Button>
        </div>
        <UserModal
          show={modalShow}
          onHide={() => this.resetModal()}
          user={editingUser}
        />
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Active</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.results.map((value, index) =>
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{value.first_name}</td>
                <td>{value.last_name}</td>
                <td>{value.username}</td>
                <td>{value.email}</td>
                <td>{value.role}</td>
                <td className="text-center">
                  <Form.Check type="switch" label="" disabled checked={value.is_active} />
                </td>
                <td className="text-center" style={{whiteSpace: 'nowrap'}}>
                  <Button size="sm" variant="outline-danger mr-1" onClick={() => this.deleteUser(index)}>
                    <i className="fa fa-trash"></i></Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => this.setEditingUser(index)}>
                    <i className="fa fa-pencil"></i></Button>
                </td>
              </tr>
            )
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

function mapState(state) {
  return {
    users: state.users
  }
}

const actionCreators = {
  fetchUsers: userActions.fetchAll,
  deleteUser: userActions.delete,
}

const connectedComponent = connect(mapState, actionCreators)(UserManagement);
export { connectedComponent as UserManagement };