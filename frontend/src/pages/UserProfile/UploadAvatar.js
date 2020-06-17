import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { userActions } from '../../redux/actions';


class UploadAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      files: event.target.files
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  
    this.setState({
        submitted: true
    });
    const { user } = this.props.auth;
    this.props.uploadAvatar(user.id, this.state.files);
  }

  render() {
    const { files, submitted } = this.state;
    const { uploadingAvatar } = this.props.auth;
    return (
      <div className="row">
        <div className="col col-lg-4 col-md-6">
          <h2 className="mb-4">Upload your avatar image</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="first-name">
              <Form.Label>Avatar Image</Form.Label>
              <Form.Control
                type="file"
                onChange={this.handleChange}
                name="profile_img"
                accept="image/png, image/jpeg"
                isInvalid={submitted && !files}
              >
              </Form.Control>
              {submitted && !files &&
                <Form.Control.Feedback type="invalid">Please select one image.</Form.Control.Feedback>
              }
            </Form.Group>
            <Form.Group>
              <Button type="submit" className="mr-2">Submit</Button>
              {uploadingAvatar &&
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" alt="loading" />
              }
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    auth: state.authentication,
  };
}

const actionCreators = {
  uploadAvatar: userActions.uploadAvatar,
};

const connectedComponent = connect(mapState, actionCreators)(UploadAvatar);
export { connectedComponent as UploadAvatar };