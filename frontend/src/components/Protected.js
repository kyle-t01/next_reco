// Protected component that redirects to the home page if user not signed in
import { useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext'
const Protected = ({ children }) => {
    const navigate = useNavigate()

    const { user } = UserAuth()

    if (!user) {
        return navigate('/');
    }
    return (children);
}

export default Protected;