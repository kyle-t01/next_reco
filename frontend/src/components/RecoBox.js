// A box containing a summary of basic Reco information
import { useState } from "react";
import RecoForm from "./RecoForm";

const RecoBox = ({ reco }) => {


    const [isViewing, setIsViewing] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isRecoDeleted, setIsRecoDeleted] = useState(false)
    const [recoData, setRecoData] = useState(reco);

    const handleRecoUpdated = (updatedReco) => {
        setIsFormOpen(false)
        setRecoData(updatedReco)
        return;
    }

    const handleRecoDeleted = () => {
        setIsFormOpen(false)
        setIsRecoDeleted(true)
        return;
    }

    // shows more details of the Reco
    const handleViewDetails = () => {
        if (isFormOpen) return;
        setIsViewing(!isViewing)
    }

    const renderFrontBox = () => {
        if (isViewing) return;
        return (<div className="reco-front">
            <h4 className="reco-title" > {recoData.title}</h4>
            <p> {recoData.subTitle}</p>
            {renderShortDesc()}
            {renderImage()}
            {renderReviews()}


        </div>
        )
    }




    const renderReviews = () => {
        if (!googleData) return;
        const { rating, user_ratings_total, price_level } = recoData.googleData;

        const price = price_level ? "$".repeat(price_level) : "N/A";
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <div className="reco-reviews">
                <div className="stars">{rating || "N/A"} {"⭐".repeat(fullStars)}{hasHalfStar ? "+" : ""}</div>
                <div className="ratings">({user_ratings_total || "0"} reviews)</div>
                <div className="price">Price: {price}</div>
            </div>
        )
    }

    const renderBackBox = () => {

        if (!isViewing) return;
        return (
            <div className="reco-back">
                <div className="back-content">
                    <h4 className="reco-title" > {recoData.title}</h4>
                    <p> {recoData.subTitle}</p>
                    {renderLongDesc()}
                    {renderGoogleDesc()}
                </div>
                <div className="edit-button">
                    <button onClick={() => setIsFormOpen(true)}>[Edit]</button>
                </div>

            </div>
        )
    }



    const renderLongDesc = () => {
        return <div className="long-desc">
            <p> {recoData.description} </p>
        </div>
    }

    const renderShortDesc = () => {
        if (!recoData.description) return;
        if (recoData.description.length >= 20) {
            return <p>{recoData.description.slice(0, 20)}...</p>
        }
        return <p>{recoData.description}</p>

    }

    const renderGoogleDesc = () => {

        if (!recoData.googleData) return;

        return (

            < div >
                <p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recoData.googleData.vicinity)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📍 {recoData.googleData.vicinity}
                    </a>
                </p>
                {
                    recoData.googleData.website && <a
                        href={recoData.googleData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🌐 {recoData.googleData.website}
                    </a>
                }
            </div >
        )
    }

    const renderImage = () => {
        // if there was no google data, then there wasn't an image
        if (!recoData.googleData || !recoData.googleData.imageUrls) return;
        // for now only render the first image 
        if (recoData.googleData.imageUrls.length > 0) {
            return <img src={recoData.googleData.imageUrls[0]} alt={`Google Image `} className="reco-image" />
        }
    }

    const renderRecoBox = () => {
        if (isRecoDeleted) return (
            <div className="reco-box">Reco changed - please refresh page</div>
        );
        return (
            <div className="reco-box" onClick={handleViewDetails}>{renderFrontBox()}{renderBackBox()}</div>
        );
    }

    // if the recodata is deleted, then return null
    if (isRecoDeleted) return null;

    return (

        <div>
            {renderRecoBox()}
            <div>{isFormOpen && <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoUpdated={handleRecoUpdated} onRecoDeleted={handleRecoDeleted} reco={recoData} />}</div>
        </div>
    );
}

export default RecoBox;