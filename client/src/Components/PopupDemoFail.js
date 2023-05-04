import React from "react";

const PopupDemoFail=({togglePopupVisibility})=>{
    const handleOuterClick=()=>{
        togglePopupVisibility();
    }
    const handleInnerClick=(e)=>{
        e.stopPropagation();
    }
    return(
        <div id="demoFailPopup" onClick={handleOuterClick}>
            <div className="innerPopup" id= "innerPopupJoinRoom" onClick={handleInnerClick}>
                <button type="close-btn" id="closePopupBtn" onClick={()=>togglePopupVisibility()}></button>
                Using the demo account failed, try again later.
            </div>
        </div>
    )
}

export default PopupDemoFail