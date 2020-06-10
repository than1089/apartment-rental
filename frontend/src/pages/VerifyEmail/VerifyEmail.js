import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../redux/actions';


class VerifyEmail extends React.Component {

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const key = searchParams.get('key')
    if (key) {
      this.props.verifyEmail(key);
    }
  }
  
  render() {
    const { verifyingEmail, verifiedEmail } = this.props.authentication;
    return (
      <div className="mt-4 text-center">
        {verifyingEmail &&
          <h5 className="text-center">Verifying your email address...</h5>
        }
        {!verifyingEmail && verifiedEmail &&
          <div>
            <h5 className="mb-3">Your email is verified successfully.</h5>
            <Link to="/login" className="btn btn-primary mr-2">Login</Link>
          </div>
        }
         {!verifyingEmail && !verifiedEmail &&
          <div>
            <h5 className="mb-3">
              We could not verify your email address.<br/>
              Contact support: admin@example.com
            </h5>
            <Link to="/login" className="btn btn-primary mr-2">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        }
      </div>
    );
  }
}

function mapState(state) {
  const { authentication } = state;
  return { authentication };
}

const actionCreators = {
  verifyEmail: userActions.verifyEmail,
};

const connectedComponent = connect(mapState, actionCreators)(VerifyEmail);
export { connectedComponent as VerifyEmail };