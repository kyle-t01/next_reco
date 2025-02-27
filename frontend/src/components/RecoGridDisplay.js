import React from "react";
import RecoBox from "./RecoBox";


const RecoGridDisplay = ({ recos }) => {
    if (!recos || recos.length === 0) {
        return <div className="reco-instructions">
            <p>Get Started By Clicking The [+ Add Reco] Tab To Add A New Reco!</p>
        </div>;
    }

    return (
        <div className="reco-grid">
            {recos.map((reco) => {


                return <RecoBox key={reco._id} reco={reco} />;
            })}
        </div>
    );
};

export default RecoGridDisplay;
