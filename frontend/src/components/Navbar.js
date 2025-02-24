import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logOut } = UserAuth()

    return (
        <div className="navbar">
            <h1>NextReco</h1>
            {user ? <button>Logout</button> : <Link to='/signin'>Sign In</Link>}
        </div>
    )
}

export default Navbar;