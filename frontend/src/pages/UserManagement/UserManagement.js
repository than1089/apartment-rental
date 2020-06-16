import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Form } from 'react-bootstrap';
import { userActions } from '../../redux/actions';
import { UserModal } from './UserModal';
import { InviteUserModal } from './InviteUserModal';
import { Pagination } from '../../components';

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userModalShow: false,
      inviteModalShow: false,
      editingUser: null,
    };

    this.resetModal = this.resetModal.bind(this);
    this.editUser = this.editUser.bind(this);
  }
  componentDidMount() {
    this.props.fetchUsers();
  }

  resetModal() {
    this.setState({
      userModalShow: false,
      editingUser: null,
    });
  }

  editUser(user) {
    this.setState({
      editingUser: user,
      userModalShow: true,
    });
  }

  deleteUser(user) {
    const ok = window.confirm('Are you sure you want to delete this user?');
    if (ok) {
      this.props.deleteUser(user);
    }
  }

  render() {
    const { users, authentication } = this.props;
    const { userModalShow, inviteModalShow, editingUser } = this.state;
    return (
      <div>
        <h2 className="mb-4">User Management</h2>
        <div className="mb-3">
          <Button variant="outline-primary mr-2" size="sm"
            onClick={() => this.setState({ userModalShow: true })}>
            Add User <i className="fas fa-plus"></i>
          </Button>
          <Button variant="outline-primary mr-2" size="sm"
            onClick={() => this.setState({ inviteModalShow: true })}>
            Invite New User <i className="fas fa-envelop"></i>
          </Button>
        </div>
        <UserModal
          show={userModalShow}
          onHide={() => this.resetModal()}
          user={editingUser}
          createUser={this.props.createUser}
          updateUser={this.props.updateUser}
        />
        <InviteUserModal
          show={inviteModalShow}
          onHide={() => this.setState({inviteModalShow: false})}
        />
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Active</th>
              <th className="text-center">Email Verified</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.results.map((user, index) =>
              <tr key={index}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center">
                  {user.is_active && 
                    <i className="fa fa-check text-success"></i>
                  }
                  {!user.is_active && 
                    <i className="fa fa-times text-danger"></i>
                  }
                </td>
                <td className="text-center">
                  {user.verified_email && 
                    <i className="fa fa-check text-success"></i>
                  }
                  {!user.verified_email && 
                    <i className="fa fa-times text-danger"></i>
                  }
                </td>
                <td style={{whiteSpace: 'nowrap'}} className="text-center">
                  <Button size="sm" variant="outline-secondary mr-2" onClick={() => this.editUser(user)}>
                    <i className="fa fa-pencil"></i></Button>
                  {authentication.user.id !== user.id &&
                    <Button size="sm" variant="outline-danger" onClick={() => this.deleteUser(user)}>
                      <i className="fa fa-trash"></i></Button>
                  }
                  {authentication.user.id === user.id && <span style={{width: 32, display: 'inline-block'}}></span>}
                </td>
              </tr>
            )
            }
          </tbody>
        </Table>
        <Pagination
          count={users.count}
          next={users.next}
          previous={users.previous}
          fetch={this.props.fetchUsers}
        />
      </div>
    );
  }
}

function mapState(state) {
  const {users, authentication} = state;
  return {users, authentication};
}

const actionCreators = {
  fetchUsers: userActions.fetchAll,
  createUser: userActions.create,
  updateUser: userActions.update,
  deleteUser: userActions.delete,
}

const connectedComponent = connect(mapState, actionCreators)(UserManagement);
export { connectedComponent as UserManagement };