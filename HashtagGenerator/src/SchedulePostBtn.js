import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import SocialMediaController from "./SocialMediaController";

function setScheduling(inProgress){
    this.state.scheduling = inProgress;
}

function setScheduleBtnMessage(scheduleBtnMessage){
    this.state.scheduleBtnMessage = scheduleBtnMessage;
}

function SchedulePostBtn(props) {
    const [postToFacebook, setPostToFacebook] = useState(props.postToFacebook);
    const [postToInstagram, setPostToInstagram] = useState(props.postToInstagram);
    const [postToTwitter, setPostToTwitter] = useState(props.postToTwitter);
    const [enableScheduleBtn, setEnableScheduleBtn] = useState(postToFacebook || postToInstagram || postToTwitter);
    const [scheduleBtnMessage, setScheduleBtnMessage] = useState("Schedule Post");
    const [scheduling, setScheduling] = useState(false);
    //const [facebookPages, setFacebookPages] = useState([]);
    //const [instagramAccountId, setInstagramAccountId] = useState();
    //const [containerId, setContainerId] = useState();
    //const [facebookPageAccessToken, setFacebookPageAccessToken] = useState();

    useEffect( () => {
    setPostToFacebook(props.postToFacebook);
    setPostToInstagram(props.postToInstagram);
    setPostToTwitter(props.postToTwitter);
    setEnableScheduleBtn(props.postToFacebook || props.postToInstagram || props.postToTwitter);
    
    }, [props.postToFacebook, props.postToInstagram, props.postToTwitter]);
    console.log("in schedule posts");

    const schedulePosts = () => {
    let socialMediaController = new SocialMediaController({facebookAccessToken: props.facebookAccessToken});
    console.log(socialMediaController);
    setScheduling(true);
    setScheduleBtnMessage("Scheduling Post");
    
    if (postToFacebook) {
        socialMediaController.publishToFacebook.bind(this);
    }
    if (postToInstagram) {
        // await shareToInstagram();
    }
    if (postToTwitter) {
        // await shareToTwitter();
    }
    setScheduleBtnMessage("Scheduled!");
    setScheduling(false);
};
    return (
        <Button
            onClick={schedulePosts}
            disabled={!enableScheduleBtn}>
            {/* {(scheduling ? <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            /> : null)} */}
            {scheduleBtnMessage}
        </Button>
    );
}

export default SchedulePostBtn;