// A box containing a summary of basic Reco information

/* RECO */
/*
    title
    category
    address
    description
    is_private
    is_proposed
    uid

*/

const RecoBox = ({ reco }) => {
    return (
        <div className="reco-box">
            <h4>{reco.title}</h4>
            <p>Placeholder Image</p>
            <p>short description</p>
            <p>{reco.createdAt}</p>
        </div>);
}

export default RecoBox;