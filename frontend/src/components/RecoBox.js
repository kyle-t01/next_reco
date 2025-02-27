// A box containing a summary of basic Reco information



const RecoBox = ({ reco }) => {
    const { title, subTitle, googleImageUrl } = reco;
    return (
        <div className="reco-box">
            {/* Title */}
            <h4 className="reco-title">{title}</h4>
            {/* Sub title */}
            <p> {subTitle}</p>
            {/* Display Image */}
            {googleImageUrl ? (
                <img src={googleImageUrl} alt={title} className="reco-image" />
            ) : (
                <div className="image-placeholder">No Image Available</div>
            )}



        </div>
    );
}

export default RecoBox;