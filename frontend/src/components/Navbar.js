import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logOut } = UserAuth()

    const handleLogOut = async () => {
        try {
            await logOut()
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="navbar">
            <h1>NextReco</h1>
            {user ? <button onClick={handleLogOut}>Logout</button> : <Link to='/signin'>Sign In</Link>}
        </div>
    )
}

export default Navbar;