import React, { useState, useEffect } from "react";
import { useLocation,useNavigate  } from "react-router-dom";
import "./updateimage.css";
import api from "./../../../../api.js";
import Dashheader from "../../Dashheader/Dashheader";
import { useToasts } from "react-toast-notifications";
import utilis from "../../../../utilis";

const UpdateImages = () => {
    let navigate = useNavigate();
    const { addToast } = useToasts();
    const location = useLocation();
    const towerId = location.state?.towerId || "";
    const [images, setImages] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [imageType, setImageType] = useState("");
    const [newNearbyName, setNewNearbyName] = useState("");

    const GetprojectImages = async () => {
        try {
            let response = await api.getImagesforProject(towerId);
            console.log("Fetched Image Data:", response.data);
            if(response.status === 401){
                console.log("Session Expired! Redirecting to Login.");
                localStorage.removeItem(utilis.string.localStorage.sessionId);
                localStorage.removeItem(utilis.string.localStorage.userData);
                navigate('/');
              }
            setImages(response.data.data || []);
        } catch (error) {
            console.error("Error fetching project images:", error);
        }
    };

    useEffect(() => {
        GetprojectImages();
    }, []);

    const requestDelete = (imageUrl, remarkType) => {
        setConfirmDelete({ imageUrl, remarkType });
    };

    const confirmDeletion = async () => {
        if (!confirmDelete) return;
        
        const imageId = images[0]?._id;
        const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
        let managementId = storedData?.data?.data?._id || null;

        if (!imageId) {
            console.warn("Missing imageId for deletion:", confirmDelete.imageUrl);
            addToast("No image ID found for deletion.", { appearance: "warning", autoDismiss: true });
            return;
        }

        try {
            let response = await api.deleteImageproject({
                _id: imageId,
                imageUrl: confirmDelete.imageUrl,
                updatedBy: managementId,
                remarks: confirmDelete.remarkType
            });
            if (response.status === 200) {
                addToast("Image deleted successfully!", { appearance: "success", autoDismiss: true });
                GetprojectImages();
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            addToast("Failed to delete image.", { appearance: "error", autoDismiss: true });
        }

        setConfirmDelete(null);
    };

    // const handleImageUpload = async (e, type) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Ensure only one image/video exists for TOWER-LOGO and WALKTHROUGH-VIDEO
    //         if ((type === "TOWER-LOGO" || type === "WALKTHROUGH-VIDEO") && images[0]?.[type.toLowerCase()]?.length > 0) {
    //             addToast(`Please delete the existing ${type.replace('-', ' ').toLowerCase()} before uploading a new one.`, { appearance: "warning", autoDismiss: true });
    //             return;
    //         }
            
    //         setNewImage(file);
    //         setImageType(type);
    //     }
    // };
    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // Ensure only one image/video exists for TOWER-LOGO and WALKTHROUGH-VIDEO
        if (type === "TOWER-LOGO" && images[0]?.logoLink?.length > 0) {
            addToast("Please delete the existing logo before uploading a new one.", { appearance: "warning", autoDismiss: true });
            return;
        }
        
        if (type === "WALKTHROUGH-VIDEO" && images[0]?.walkThroughVideo?.length > 0) {
            addToast("Please delete the existing walkthrough video before uploading a new one.", { appearance: "warning", autoDismiss: true });
            return;
        }
        
        setNewImage(file);
        setImageType(type);
    };

    const [showInput, setShowInput] = useState({
        "TOWER-GALARY": false,
        "TOWER-LOGO": false,
        "TOWER-PLAN": false,
        "BLOCK-PLAN": false,
        "WALKTHROUGH-VIDEO": false,
        "NEARBY-IMAGE": false,
        "PRO-LOGO": false,
        "FLAT-IMAGES": false,
        "FLAT-PLAN": false
    });

    const handleAddImageClick = (imageType) => {
        setShowInput((prev) => ({ ...prev, [imageType]: true }));
    };
    
    const uploadImage = async () => {
        if (!newImage || !imageType) {
            addToast("Please select an image before uploading.", { appearance: "warning", autoDismiss: true });
            return;
        }
    
        // Validate name for nearby images
        if (imageType === "TOWER-NEARBY" && !newNearbyName.trim()) {
            addToast("Please enter a name for the nearby image.", { appearance: "warning", autoDismiss: true });
            return;
        }
    
        const storedData = JSON.parse(localStorage.getItem("AdminDetails")) || {};
        let managementId = storedData?.data?.data?._id || null;
    
        if (!managementId) {
            addToast("User not authorized.", { appearance: "error", autoDismiss: true });
            return;
        }
    
        const formData = new FormData();
        formData.append("_id", towerId);
        formData.append("updatedBy", managementId);
    
        // Set the name dynamically based on the image type
        if (imageType === "TOWER-NEARBY") {
            formData.append("name", newNearbyName); // Use the input field value for nearby images
        } else {
            formData.append("name", "Project Image"); // Default name for other image types
        }
    
        formData.append("remarks", imageType);
    
        switch (imageType) {
            case "TOWER-GALARY":
                formData.append("gallery", newImage);
                break;
            case "TOWER-LOGO":
                formData.append("logo", newImage);
                break;
            case "TOWER-PLAN":
                formData.append("planImages", newImage);
                break;
            case "BLOCK-PLAN":
                formData.append("blockPlanImages", newImage);
                break;
            case "WALKTHROUGH-VIDEO":
                formData.append("walkThroughVideo", newImage);
                break;
            case "TOWER-NEARBY": // Handle nearby images
                formData.append("nearbyImage", newImage);
                break;
            case "PRO-LOGO":
                formData.append("proLogo", newImage);
                break;
            case "FLAT-IMAGES":
                formData.append("flatImages", newImage);
                break;
            case "FLAT-PLAN":
                formData.append("flatPlanImages", newImage);
                break;
            default:
                addToast("Invalid image type.", { appearance: "error", autoDismiss: true });
                return;
        }
    
        try {
            const response = await api.AddIMages(formData);
            if (response.status === 200) {
                addToast("Image uploaded successfully!", { appearance: "success", autoDismiss: true });
    
                // Clear the input fields for nearby images
                setNewImage(null);
                setNewNearbyName(""); // Clear the name field
    
                // Explicitly close the input fields for "NEARBY-IMAGE"
                setShowInput((prev) => {
                    console.log("Closing input fields for:", imageType); // Debugging log
                    return { ...prev, [imageType]: false };
                });
    
                // Refresh the images list
                GetprojectImages();
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            addToast("Failed to upload image.", { appearance: "error", autoDismiss: true });
        }
    };
    

    return (
        <>
            <Dashheader />
            <div className="update-images-container">
                <h2>Project Images</h2>

                {images.length > 0 && (
                    <div className="image-sections">
                        <div className="image-category">
                            <h3>Gallery Images</h3>
                            {/* <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-GALARY")} />
                            <button onClick={uploadImage} className="add-button">Add Image</button> */}
                               {showInput["TOWER-GALARY"] ? (
        <>
            <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-GALARY")} className="uploadimageinput"/>
            <button onClick={uploadImage} className="add-button">Upload</button>
        </>
    ) : (
        <button onClick={() => handleAddImageClick("TOWER-GALARY")} className="add-button">
            Add Image
        </button>
    )}
                            <div className="image-list">
                                {images[0]?.galary?.map((img, index) => (
                                    <div key={index} className="image-item">
                                        <img src={img} alt={`Gallery ${index}`} />
                                        <button onClick={() => requestDelete(img, "TOWER-GALARY")}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="image-category">
                            <h3>Logo</h3>
                            {/* <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-LOGO")} />
                            <button onClick={uploadImage} className="add-button">Add Logo</button> */}
                            {showInput["TOWER-LOGO"] ? (
    <>
        <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-LOGO")} className="uploadimageinput"/>
        <button onClick={uploadImage} className="add-button">Upload</button>
    </>
) : (
    <button onClick={() => handleAddImageClick("TOWER-LOGO")} className="add-button">
        Add Logo
    </button>
)}

                           
                            {images[0]?.logoLink?.[0] && (
                                <div className="image-item">
                                    <img src={images[0].logoLink[0]} alt="Logo" />
                                    <button onClick={() => requestDelete(images[0].logoLink[0], "TOWER-LOGO")}>Delete</button>
                                </div>
                            )}
                        </div>

                        <div className="image-category">
                            <h3>Plan Images</h3>
                            {/* <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-PLAN")} />
                            <button onClick={uploadImage} className="add-button">Add Plan</button> */}
                            {showInput["TOWER-PLAN"] ? (
    <>
        <input type="file" onChange={(e) => handleImageUpload(e, "TOWER-PLAN")} className="uploadimageinput"/>
        <button onClick={uploadImage} className="add-button">Upload</button>
    </>
) : (
    <button onClick={() => handleAddImageClick("TOWER-PLAN")} className="add-button">
        Add Plan
    </button>
)}

                            <div className="image-list">
                                {images[0]?.planImages?.map((img, index) => (
                                    <div key={index} className="image-item">
                                        <img src={img} alt={`Plan ${index}`} />
                                        <button onClick={() => requestDelete(img, "TOWER-PLAN")}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

<div className="image-category">
    <h3>Nearby Images</h3>
    {showInput["NEARBY-IMAGE"] ? (
        <>
            <input
                type="file"
                onChange={(e) => handleImageUpload(e, "TOWER-NEARBY")}
                className="uploadimageinput"
            />
            <input
                type="text"
                placeholder="Enter name"
                value={newNearbyName}
                onChange={(e) => setNewNearbyName(e.target.value)}
                className="uploadnameinput"
            />
            <button onClick={uploadImage} className="add-button">Upload</button>
        </>
    ) : (
        <button
            onClick={() => handleAddImageClick("NEARBY-IMAGE")}
            className="add-button"
        >
            Add Nearby Image
        </button>
    )}

    <div className="image-list">
        {images[0]?.nearby?.map((nearbyItem, index) => (
            <div key={index} className="image-item">
                <img src={nearbyItem.image} alt={`Nearby ${nearbyItem.name}`} />
                <p>{nearbyItem.name}</p>
                <button
                    onClick={() => requestDelete(nearbyItem.image, "TOWER-NEARBY")}
                >
                    Delete
                </button>
            </div>
        ))}
    </div>
</div>
                     {/* Walkthrough Video */}
                     <div className="image-category">
                    <h3>Walkthrough Video</h3>
                    {/* <input type="file" accept="video/mp4" onChange={(e) => handleImageUpload(e, "WALKTHROUGH-VIDEO")} />
                    <button onClick={uploadImage} className="add-button">Add Video</button> */}
                    {showInput["WALKTHROUGH-VIDEO"] ? (
    <>
        <input type="file" accept="video/mp4" onChange={(e) => handleImageUpload(e, "WALKTHROUGH-VIDEO")} className="uploadimageinput"/>
        <button onClick={uploadImage} className="add-button">Upload</button>
    </>
) : (
    <button onClick={() => handleAddImageClick("WALKTHROUGH-VIDEO")} className="add-button" style={{marginRight:"5%"}}>
        Add Video
    </button>
)}

                    {images[0]?.walkThroughVideo?.[0] && (
                        <>
                            <video width="500" controls>
                                <source src={images[0]?.walkThroughVideo[0]} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <button onClick={() => requestDelete(images[0]?.walkThroughVideo[0], "TOWER-WLAKTHROUGH")}  className="add-button" 
                                style={{marginLeft:"5%"}}>Delete</button>
                        </>
                    )}
                </div>


                {confirmDelete && (
                    <div className="modal-overlay">
                        <div className="confirm-delete-modal">
                            <p>Are you sure you want to delete this image?</p>
                            <button className="confirm-btn" onClick={confirmDeletion}>Yes, Delete</button>
                            <button className="cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateImages;
