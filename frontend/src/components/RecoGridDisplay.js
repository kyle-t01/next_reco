import React from "react";
import RecoBox from "./RecoBox";


const RecoGridDisplay = ({ recos }) => {
    if (!recos || recos.length === 0) {
        return <p>GET STARTED BY ADDING A NEW RECO!!</p>;
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
