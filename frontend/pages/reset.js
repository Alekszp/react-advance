import Reset from '../components/Reset';

const ResetPassword = props => (
    <div>
        <p>Reset your password {props.query.resetToken}</p>
        <Reset resetToken={props.query.resetToken} />
    </div>
)

export default ResetPassword;