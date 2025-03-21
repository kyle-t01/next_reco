import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logOut } = UserAuth()
    const navigate = useNavigate()
    const handleLogOut = async () => {
        try {
            await logOut()
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="navbar">
            <div className="welcome">
                <h1>NextReco</h1>
                {user && <h1>Welcome back, {user && user.displayName}!</h1>}
            </div>

            {user ? <button onClick={handleLogOut}>Logout</button> : <Link to='/signin'>Sign In</Link>}
        </div>
    )
}

export default Navbar;