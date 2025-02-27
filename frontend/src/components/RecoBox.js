// A box containing a summary of basic Reco information
import { useState } from "react";


const RecoBox = ({ reco }) => {

    const { title, subTitle, description, googleData } = reco;
    console.log(reco)
    const [isViewing, setIsViewing] = useState(false);
    // shows more details of the Reco
    const handleViewDetails = () => {
        setIsViewing(!isViewing)
        console.log("Viewing more details of: ", reco.title, " viewing back?: ", isViewing)
    }

    const renderFrontBox = () => {
        if (isViewing) return;
        return (<div className="reco-front">
            <h4 className="reco-title" > {title}</h4>
            <p> {subTitle}</p>
            {renderShortDesc()}
            {renderImage()}
            {renderReviews()}


        </div>
        )
    }




    const renderReviews = () => {
        if (!googleData) return;
        const { rating, user_ratings_total, price_level } = googleData;

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
                    <h4 className="reco-title" > {title}</h4>
                    <p> {subTitle}</p>
                    {renderLongDesc()}
                    {renderGoogleDesc()}
                </div>
                <div className="edit-button">+EDIT</div>

            </div>
        )
    }

    const renderLongDesc = () => {
        return <div className="long-desc">
            <p> {description} </p>
        </div>
    }

    const renderShortDesc = () => {
        if (!description) return;
        if (description.length >= 20) {
            return <p>{description.slice(0, 20)}...</p>
        }
        return <p>{description}</p>

    }

    const renderGoogleDesc = () => {

        if (!googleData) return;

        return (

            < div >
                <p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleData.vicinity)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📍 {googleData.vicinity}
                    </a>
                </p>
                {
                    googleData.website && <a
                        href={googleData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🌐 {googleData.website}
                    </a>
                }
            </div >
        )
    }

    const renderImage = () => {
        // if there was no google data, then there wasn't an image
        if (!googleData || !googleData.imageUrls) return;
        // for now only render the first image 
        if (googleData.imageUrls.length > 0) {
            return <img src={googleData.imageUrls[0]} alt={`Google Image `} className="reco-image" />
        }
    }

    return (
        <div className="reco-box" onClick={handleViewDetails} >
            {renderFrontBox()}
            {renderBackBox()}
        </div>
    );
}

export default RecoBox;