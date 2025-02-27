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
        return <div className="reco-front">
            <h4 className="reco-title" > {title}</h4>
            <p> {subTitle}</p>
            {renderShortDesc()}
            {renderImage()}
            {renderReviews()}


        </div>
    }




    const renderReviews = () => {
        if (!googleData) return;
        const { rating, user_ratings_total, price_level } = googleData;

        const price = price_level ? "$".repeat(price_level) : "N/A";
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <div className="reco-reviews">
                <span className="stars">[{rating || "N/A"} {"⭐".repeat(fullStars)}{hasHalfStar ? "+" : ""}]</span>
                <span className="ratings">({user_ratings_total || "0"} reviews)</span>
                <span className="price">{price}</span>
            </div>
        )
    }

    const renderBackBox = () => {

        if (!isViewing) return;
        return <div className="reco-back">
            <h4 className="reco-title" > {title}</h4>
            <p> {subTitle}</p>
            {renderLongDesc()}
            {renderGoogleDesc()}
        </div>
    }

    const renderLongDesc = () => {
        return <div className="long-desc">
            <p> {description} </p>
        </div>
    }

    const renderShortDesc = () => {
        if (!description) return;
        return <p> {description.slice(0, 20)}... </p>

    }

    const renderGoogleDesc = () => {

        if (!googleData) return;

        return (

            < div >
                <h2>{googleData.name}</h2>
                <p>{googleData.formattedAddress}</p>
                <p>{googleData.website}</p>
            </div >
        )
    }

    const renderImage = () => {
        if (!googleData || !googleData.img_urls) return;
        // for now only render the first image 
        if (googleData.img_urls.length > 0) {
            console.log(googleData.img_urls)

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