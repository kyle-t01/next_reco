import { useEffect, useState } from "react";
import { getRecos, getGroupRecos, getProposedRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";
import RecoGridDisplay from "../components/RecoGridDisplay";

const Recos = () => {
    const { user } = UserAuth()
    // recos
    const [recos, setRecos] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    // active tab
    const [activeTab, setActiveTab] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // load recos
    const loadRecos = async () => {
        if (!user) return;
        // load recos depending on the activeTab
        setIsLoading(true);
        if (activeTab === 0) {
            setRecos(await getRecos(user));
        } else if (activeTab === 1) {
            setRecos(await getGroupRecos(user));
        } else if (activeTab === 2) {
            setRecos(await getProposedRecos(user));
        }

        setIsLoading(false);

    }


    // refresh recos of a specified tab
    const switchToTab = async (tabNum) => {
        // if tab num is the same, avoid retrieving from the database
        if (tabNum == activeTab) return;

        setActiveTab(tabNum);

    }

    useEffect(() => {
        loadRecos()

    }, [user, activeTab]);



    return (
        <div className="recos">
            <h1>This is where you can see all Recos</h1>

            <div className="reco-navbar">
                <button onClick={() => switchToTab(0)}>Personal</button>
                <button onClick={() => switchToTab(1)}>Group</button>
                <button onClick={() => switchToTab(2)}>Do this next</button>
                <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
            </div>

            {!isLoading && (activeTab == 0) && <RecoGridDisplay recos={recos} />}

            {!isLoading && (activeTab == 1) && <RecoGridDisplay recos={recos} />}

            {!isLoading && (activeTab == 2) && <RecoGridDisplay recos={recos} />}

            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={loadRecos} />
        </div>
    );
}

export default Recos