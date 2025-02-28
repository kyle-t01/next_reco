// import { useEffect, useState } from "react";
// components
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { useEffect, useState } from "react";
const Home = () => {
    const { user } = UserAuth()
    const navigate = useNavigate()
    useEffect(() => {

        if (user != null) {
            // already signed in 
            console.log("already signed in")
            navigate('/recos')
        }
    }, [user]);
    return (
        <div className="home">
            <h1>Welcome to NextReco!</h1>
            <p>"Let's do this next!"</p>
            <p>You can view, share,and propose recommendations for your next group outing!</p>
        </div>
    );
}

export default Home