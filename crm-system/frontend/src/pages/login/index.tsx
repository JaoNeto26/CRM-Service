import { Link } from "react-router-dom";
import "./style.css";
function Login() {
    return (
        <div>
            <h1>Login</h1>
            <div>
                <Link to="/home">Home</Link>
            </div>
        </div>
    );
}

export default Login;
