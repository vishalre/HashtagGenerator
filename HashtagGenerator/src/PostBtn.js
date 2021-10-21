import { formatISO } from "date-fns";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import SocialMediaController from "./SocialMediaController";

function PostBtn(props) {
//         postToFacebook={postToFacebook}
//         postToInstagram={postToInstagram}
//         postToTwitter={postToTwitter}
//         facebookAccessToken = {props.facebookAccessToken}
//         images={props.images}
//         description={props.description}
//         date={props.date}

    const [postToFacebook, setPostToFacebook] = useState(props.postToFacebook);
    const [postToInstagram, setPostToInstagram] = useState(props.postToInstagram);
    const [postToTwitter, setPostToTwitter] = useState(props.postToTwitter);
    const [enablePostBtn, setEnablePostBtn] = useState(postToFacebook || postToInstagram || postToTwitter);
    const [postBtnMessage, setPostBtnMessage] = useState("Post");
    const [posting, setPosting] = useState(false);
    //const imageUrl="https://static8.depositphotos.com/1343666/819/i/950/depositphotos_8191507-stock-photo-chocolate-chip-cookie-isolated-with.jpg";
   
  const [imageUrl, setImageUrl] = useState("");

    useEffect( () => {
    setPostToFacebook(props.postToFacebook);
    setPostToInstagram(props.postToInstagram);
    setPostToTwitter(props.postToTwitter);
    setEnablePostBtn(props.postToFacebook || props.postToInstagram || props.postToTwitter);
    }, [props.postToFacebook, props.postToInstagram, props.postToTwitter]);


  // GET Facebook page -- We only require ID
  const getFacebookPages = () => {
    return new Promise((resolve) => {
      window.FB.api(
        "me/accounts",
        { access_token: props.facebookAccessToken },
        (response) => {
          resolve(response.data);
        }
      );
    });
  };
  
  //GET Instagram ID from facebook Page ID
  const getInstagramAccountId = (facebookPageId) => {
    return new Promise((resolve) => {
      window.FB.api(
        facebookPageId,
        {
          access_token: props.facebookAccessToken,
          fields: "instagram_business_account",
        },
        (response) => {
          resolve(response.instagram_business_account.id);
        }
      );
    });
  };
  
  //Create media object container (3rd step to post to Insta)
  const createMediaObjectContainer = (instagramAccountId) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media`,
        "POST",
        {
          access_token: props.facebookAccessToken,
          image_url: imageUrl,
          caption: props.description,
        },
        (response) => {
          resolve(response.id);
          console.log(response);
        }
      );
    });
  };

  //Publish Media Object Container (4th step to post to Insta)
  const publishMediaObjectContainer = (
    instagramAccountId,
    mediaObjectContainerId
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media_publish`,
        "POST",
        {
          access_token: props.facebookAccessToken,
          creation_id: mediaObjectContainerId,
        },
        (response) => {
          resolve(response.id);
          console.log(response);
        }
      );
    });
  };
  
  // GET facebook page access token (requires facebook page ID)
  const getFacebookPageAccessToken = (
    facebookPageId
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${facebookPageId}`,
        "GET",
        {
          access_token: props.facebookAccessToken,
          fields: "access_token",
        },
        (response) => {
          resolve(response.access_token);
        }
      );
    });
  };

  //Post media to facebook --> requires PageID and UserAccessToken
  const postMediaToFacebook = (
    facebookPageId,
    facebookPageAccessToken, 
  ) => {
      if(!props.scheduled){
    return new Promise((resolve) => {
      window.FB.api(
        `${facebookPageId}/feed`,
        "POST",
        {
          access_token: facebookPageAccessToken,
          //link: "https://satpreetkaur.files.wordpress.com/2018/05/dirty-burgers.jpg",
          link: imageUrl,
          message: props.description,
        },
        (response) => {		  
          resolve(response.id);
          console.log(response);
          // alert(response);
        },
		(reject) => {		  
          console.log(reject);
          // alert(response);
        },
      );
    });
      }
      else{
        return new Promise((resolve) => {
      window.FB.api(
        `${facebookPageId}/feed`,
        "POST",
        {
          access_token: facebookPageAccessToken,
          //link: "https://satpreetkaur.files.wordpress.com/2018/05/dirty-burgers.jpg",
          link: imageUrl,
          message: props.description,
          published: false,
          scheduled_publish_time: Math.round(props.date)
        },
        (response) => {
          resolve(response.id);
          console.log(response);
          // alert(response);
        }
      );
    });
      }
  };
  
  /* --------------------------------------------------------
   *            Steps to share instagram post
   * 1. Get FacebookUserAccessToken
   * 2. Get FacebookPages and ID
   * 3. Get InstagramID using facebook page ID
   * 4. Create Media object container
   * 5. Publish media object container
   * --------------------------------------------------------
   */

  const shareInstagramPost = async () => {
    const facebookPages = await getFacebookPages();
    const instagramAccountId = await getInstagramAccountId(facebookPages[0].id);
    const mediaObjectContainerId = await createMediaObjectContainer(
      instagramAccountId
    );

    await publishMediaObjectContainer(
      instagramAccountId,
      mediaObjectContainerId
    );
  };

/* --------------------------------------------------------
   *            Steps to share facebook post
   * 1. Get FacebookUserAccessToken
   * 2. Get FacebookPages and ID
   * 3. Get PageToken using facebook page ID
   * 4. Post Image using PageToken and UserToken 
   * --------------------------------------------------------
   */

  const shareFacebookPost = async () => {
    const facebookPages = await getFacebookPages();
    const facebookPageId = facebookPages[0].id;
    const facebookPageAccessToken = await getFacebookPageAccessToken(facebookPages[0].id);
    //const scheduled = props.schedule;
    await postMediaToFacebook(
      facebookPageId,
      facebookPageAccessToken,
    );
  };


  const generateUrl = () => {
    var files = props.images;
    var imagesUrls = [];

    files.map((file, index) => {
      var formBody = [];
      var details = {
        image: file.data_url.split("base64,")[1],
      };

      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      fetch(
        "https://api.imgbb.com/1/upload?key=5028a841f43496e1811ee4bd6b106276",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        }
      )
        .then((response) => response.body)
        .then((body) => {
          let decoder = new TextDecoder("utf-8");
          const reader = body.getReader();

          reader
            .read()
            .then(function (result) {
              var tempImageUrl = JSON.parse(decoder.decode(result.value)).data
                .display_url;
              imagesUrls.push(tempImageUrl);
              debugger;
              if (files.length - 1 == index) {
                imagesUrls.map((imageUrl) => {
                  setImageUrl(imageUrl);
                  // if (props.schedule === "true") {
                    // setPostBtnMessage("Scheduling");
                  // } else {
                    // setPostBtnMessage("Posting");
                  // }
                  if (postToFacebook) {
                    //socialMediaController.publishToFacebook();
                    shareFacebookPost();
                  }
                  if (postToInstagram) {
                    shareInstagramPost();
                  }
                  setPosting(false);
                });
              }
            })
            .catch((e) => {
              debugger;
            });
        });
    });
  };

    //Function to share posts 
    // TO DO - Divide into Schedule and post 
    const sharePosts = () => {
    setPosting(true);
	
    generateUrl();
};
    //console.log("post button re-rendered");
    return (
        <Button
        variant="warning"
            onClick={sharePosts}
            disabled={!enablePostBtn}
            class="btn btn-warning">
            {/* {(scheduling ? <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            /> : null)} */}
            {postBtnMessage}
        </Button>
    );
}

export default PostBtn;