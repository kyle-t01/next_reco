// A box containing a summary of basic Reco information



const RecoBox = ({ reco }) => {
    const { title, description, googleImageUrl } = reco;
    return (
        <div className="reco-box">
            {/* Title */}
            <h4 className="reco-title">{title}</h4>

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