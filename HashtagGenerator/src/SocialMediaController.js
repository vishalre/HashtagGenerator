import React, { useEffect, useState } from "react";

// const getFacebookPages = (facebookAccessToken) => {
//     const apiBuilder = {
//         description: "Get Facebook pages of the logged in user",
//         method: "GET",
//         endpoint: "me/accounts",
//         requestQueryParams: { access_token: facebookAccessToken },
//     }
//     return UniversalAPIHandler(apiBuilder)?.data;
// }

class TwitterController extends React.Component {
    constructor(props) {
        super(props);
    }
}

class InstagramController extends React.Component {
    constructor(props) {
        super(props);
        this.state.facebookAccessToken = props.facebookAccessToken;
    }
}

class FacebookController extends React.Component {
    constructor(props) {
        super(props);
        // this.getFacebookPages.bind(this);
        this.getFacebookPages();
        //if(this.state.facebookPages[0]?.id){
            //this.getFacebookPageToken.bind(this);
        //}
    }

    state = {
        facebookAccessToken: this.props.facebookAccessToken,
    }
    //this.facebookAccessToken =10;
    tempMethod = response => {
            debugger;
            this.setState({facebookPages: response.data});
        }
    getFacebookPages =()=> {
        const apiBuilder = {
            description: "Get Facebook pages of the logged in user",
            method: "GET",
            endpoint: "me/accounts",
            requestQueryParams: { access_token: this.state.facebookAccessToken },
        }
        
        var temp = {};
        window.FB.api(apiBuilder.endpoint, apiBuilder.method, apiBuilder.requestQueryParams, 
        (response) => {this.tempMethod(response)});
        console.log(temp)
        // alert(this.state.facebookPages[0].id);
    }

    getFacebookPageToken = ()=> {
        const apiBuilder = {
            description: "Get Facebook Page access token",
            method: "GET",
            endpoint:  `${this.state.facebookPages[0]?.id}` ,
            requestQueryParams: { access_token: this.state.facebookAccessToken, 
                                  fields: "access_token"}
        }
        window.FB.api(apiBuilder.endpoint, apiBuilder.method, apiBuilder.requestQueryParams, 
        (response) => {this.setState({facebookPageToken: response.access_token})});
        alert(this.state.facebookPageToken);
    }

    postToFeed = () => {
        if (this.state.facebookAccessToken) {

            console.log("posted");
        }
    }

    render() {
        return <div></div>
    }
}


class SocialMediaController extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        facebookAccessToken: this.props.facebookAccessToken ? this.props.facebookAccessToken : "",
        facebookController: new FacebookController({ facebookAccessToken: this.props.facebookAccessToken })
    }

    publishToFacebook = async () => {
        this.state.facebookController.postToFeed();
    }

    render() {
        return this;
    }
}

export default SocialMediaController;