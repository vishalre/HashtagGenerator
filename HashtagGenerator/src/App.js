import React, { useEffect, useState } from "react";
import ImageUploading from 'react-images-uploading';
import StepByStep from "./StepByStep/StepByStep";
import SharingControls from "./SharingControls";
import "./styles.css";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [isSharingPost, setIsSharingPost] = useState(false);
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");
  const [images, setImages] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const maxNumber = 69;
  console.log(postCaption);
  /* --------------------------------------------------------
   *                      FACEBOOK LOGIN
   * --------------------------------------------------------
   */

  // Check if the user is authenticated with Facebook
  useEffect(() => {
    window.FB.getLoginStatus((response) => {
      setFacebookUserAccessToken(response.authResponse?.accessToken);
    });
  }, [facebookUserAccessToken]);

  const logInToFB = () => {
    window.FB.login(
      (response) => {
        setFacebookUserAccessToken(response.authResponse?.accessToken);
        console.log(response);
      },
      {
        // Scopes that allow us to publish content to Instagram
        scope: "instagram_basic,pages_show_list",
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {
      setFacebookUserAccessToken(undefined);
    });
  };

  /* --------------------------------------------------------
   *             INSTAGRAM AND FACEBOOK GRAPH APIs
   * --------------------------------------------------------
   */
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const getFacebookPages = () => {
    return new Promise((resolve) => {
      window.FB.api(
        "me/accounts",
        { access_token: facebookUserAccessToken },
        (response) => {
          resolve(response.data);
        }
      );
    });
  };

  const getInstagramAccountId = (facebookPageId) => {
    return new Promise((resolve) => {
      window.FB.api(
        facebookPageId,
        {
          access_token: facebookUserAccessToken,
          fields: "instagram_business_account",
        },
        (response) => {
          resolve(response.instagram_business_account.id);
        }
      );
    });
  };

  const createMediaObjectContainer = (instagramAccountId) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media`,
        "POST",
        {
          access_token: facebookUserAccessToken,
          image_url: imageUrl,
          caption: postCaption,
        },
        (response) => {
          resolve(response.id);
        }
      );
    });
  };

  const publishMediaObjectContainer = (
    instagramAccountId,
    mediaObjectContainerId
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media_publish`,
        "POST",
        {
          access_token: facebookUserAccessToken,
          creation_id: mediaObjectContainerId,
        },
        (response) => {
          resolve(response.id);
        }
      );
    });
  };

  const getFacebookPageAccessToken = (
    facebookPageId
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${facebookPageId}`,
        "GET",
        {
          access_token: facebookUserAccessToken,
          fields: "access_token",
        },
        (response) => {
          resolve(response.access_token);
        }
      );
    });
  };

  const postMediaToFacebook = (
    facebookPageId,
    facebookPageAccessToken
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${facebookPageId}/feed`,
        "POST",
        {
          access_token: facebookPageAccessToken,
          url: imageUrl,
          message: postCaption,
        },
        (response) => {
          resolve(response.id);
        }
      );
    });
  };

  const shareInstagramPost = async () => {
    setIsSharingPost(true);
    const facebookPages = await getFacebookPages();
    const instagramAccountId = await getInstagramAccountId(facebookPages[0].id);
    const mediaObjectContainerId = await createMediaObjectContainer(
      instagramAccountId
    );

    await publishMediaObjectContainer(
      instagramAccountId,
      mediaObjectContainerId
    );

    setIsSharingPost(false);

    // Reset the form state
    setImageUrl("");
    setPostCaption("");
  };

  const shareFacebookPost = async () => {
    setIsSharingPost(true);
    const facebookPages = await getFacebookPages();
    const facebookPageId = facebookPages[0].id;
    const facebookPageAccessToken = await getFacebookPageAccessToken(facebookPages[0].id);
    await postMediaToFacebook(
      facebookPageId,
      facebookPageAccessToken
    );

    setIsSharingPost(false);

    // Reset the form state
    setImageUrl("");
    setPostCaption("");
  };

  const generateHashtags = (event) => {
    console.log(images);
    var myHeaders = new Headers();
myHeaders.append("accept", "application/json");
myHeaders.append("Content-Type", "multipart/form-data");
 
var formdata = new FormData();
formdata.append("file", images[0].file,"C:/Users/gurra/Documents/test1.jpg");
 
var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};
 
//fetch("https://0aa9d38e2dd3.ngrok.io/predict/image", requestOptions)
 // .then(response => {setHashtags(response.text());
  //                    console.log(response);})
  //.then(result => console.log(result))
  //.catch(error => console.log('error', error));
fetch("https://0aa9d38e2dd3.ngrok.io/predict/image", requestOptions)
.then(x=>x.json()).then(y=>setHashtags(y))
  // .then(response => {setHashtags(response.text());
                      // console.log(response);})
  // .then(result => console.log(result))
  // .catch(error => console.log('error', error));
  }

  return (
    <>
      <main id="app-main">
        <section className="app-section">
          <h3>Log in with Facebook</h3>
          {facebookUserAccessToken ? (
            <button onClick={logOutOfFB} className="btn action-btn">
              Log out of Facebook
            </button>
          ) : (
            <button onClick={logInToFB} className="btn action-btn">
              Login with Facebook
            </button>
          )}
        </section>
        {facebookUserAccessToken ? (
          <div>
          <section className="app-section">
            
            <h3>Send posts to Instagram or Facebook</h3>
            {/* <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter a JPEG image url"
            /> */}
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  <button
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Click or Drop here
                  </button>
                  &nbsp;
                  <button onClick={onImageRemoveAll}>Remove all images</button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image['data_url']} alt="" width="100" />
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>Update</button>
                        <button onClick={() => onImageRemove(index)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
            <textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder="Please write a caption&#13;&#10;We recommend writing 120-160 characters"
              rows="5"
            />
             <button
              onClick={generateHashtags}
              className="btn action-btn"
              disabled={!(images.length > 0)}>
              Generate Hashtags
            </button>
            <textarea
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Enter some hashtags or use our tool to generate a few"
              rows="5"
            />
          </section>
          <section className="sharing-controls">
            {images.length > 0 || postCaption.length > 0 ? <SharingControls
            images={images}
            description={postCaption + "  " + hashtags}
            facebookAccessToken={facebookUserAccessToken}/> : null}
          </section>
          </div>
        ) : null}
      </main>
      {/* <StepByStep facebookUserAccessToken={facebookUserAccessToken} /> */}
    </>
  );
}

export default App;