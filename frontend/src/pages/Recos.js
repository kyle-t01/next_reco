import { useEffect, useState } from "react";
import { getRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

const Recos = () => {
    const { user } = UserAuth()
    const [personalRecos, setPersonalRecos] = useState(null)

    useEffect(() => {
        const getPersonalRecos = async (user) => {
            const data = await getRecos(user)
            console.log(data)
        }
        getPersonalRecos(user)

    }, []);
    return (
        <div className="recos">
            <h1>This is where you can see all Recos</h1>
        </div>
    );
}

export default Recos