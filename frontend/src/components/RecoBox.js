// A box containing a summary of basic Reco information
import { useState } from "react";


const RecoBox = ({ reco }) => {

    const { title, subTitle, description, googleImageUrl } = reco;
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
            <p> {description.slice(0, 20)}...</p>
            {renderImage()}

        </div>
    }

    const renderBackBox = () => {
        console.log("could add autogenerated description")
        if (!isViewing) return;
        return <div className="reco-back">
            <h4 className="reco-title" > {title}</h4>
            <p> {subTitle}</p>
            <p> {description}</p>

        </div>
    }

    const renderImage = () => {
        if (googleImageUrl) return <img src={googleImageUrl} alt={title} className="reco-image" />;
        return <div className="image-placeholder">[No Image Available]</div>;
    }
    return (
        <div className="reco-box" onClick={handleViewDetails} >
            {renderFrontBox()}
            {renderBackBox()}
        </div>
    );
}

export default RecoBox;