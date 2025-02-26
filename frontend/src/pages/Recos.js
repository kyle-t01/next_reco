import { useEffect, useState } from "react";
import { getRecos, getGroupRecos, getProposedRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";
import RecoGridDisplay from "../components/RecoGridDisplay";

const Recos = () => {
    const { user } = UserAuth()
    // recos
    const [personalRecos, setPersonalRecos] = useState(null)
    const [groupRecos, setGroupRecos] = useState(null)
    const [proposedRecos, setProposedRecos] = useState(null)

    const [isFormOpen, setIsFormOpen] = useState(false)

    // retrieving recos
    const retrievePersonalRecos = async () => {
        if (!user) return;
        const data = await getRecos(user)
        console.log(data)
        setPersonalRecos(data)
    }
    const retrieveGroupRecos = async () => {
        if (!user) return;
        const data = await getGroupRecos(user)
        console.log(data)
        setGroupRecos(data)
    }
    const retrieveProposedRecos = async () => {
        if (!user) return;
        const data = await getProposedRecos(user)
        console.log(data)
        setProposedRecos(data)
    }
    // refresh all reco lists
    const refreshAllRecos = async () => {
        await retrievePersonalRecos()
        await retrieveGroupRecos()
        await retrieveProposedRecos()
    }

    useEffect(() => {

        retrievePersonalRecos()
        retrieveGroupRecos()
        retrieveProposedRecos()

    }, [user]);



    return (
        <div className="recos">
            <h1>This is where you can see all Recos</h1>
            <h2>Personal recos</h2>
            <RecoGridDisplay recos={personalRecos} />
            <h2>Group recos</h2>
            <RecoGridDisplay recos={groupRecos} />
            <h2>Proposed recos</h2>
            <RecoGridDisplay recos={proposedRecos} />
            <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={refreshAllRecos} />
        </div>
    );
}

export default Recos