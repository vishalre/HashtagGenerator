import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import PostBtn from "./PostBtn";
import 'date-fns';
//import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function SharingControls(props){
    const [images , setImages] = useState(props.images);
    const [description, setDescription] = useState(props.description);
    //const [socialMediaController, setSocialMediaController] = useState(new SocialMediaController({facebookAccessToken: props.facebookAccessToken}));
    const [postToTwitter, setPostToTwitter] = useState(false);
    const [postToInstagram, setPostToInstagram] = useState(false);
    const [postToFacebook, setPostToFacebook] = useState(false);
    const [scheduleBtnVisible, setScheduleBtnVisible] = useState(true);
    const [dateTimeVisible, setDateTimeVisible] = useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [scheduled, setScheduled] = useState(false);

    const handleDateChange = (date) => {
    setSelectedDate(date);
  };

    const handleScheduleBtnClick = (event) => {
      setScheduleBtnVisible(false);
      setDateTimeVisible(true);
      setScheduled(true);
    }

    return(
        <div>
            <FormGroup column>
      <FormControlLabel
        control={
			<Checkbox 
            disabled={false}
			checked={postToInstagram}
            onChange={(event) => setPostToInstagram(event.target.checked)} 
			name="InstagramCheckBox" />
			}
        label="Instagram"
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={false}
            checked={postToFacebook}
            onChange={(event) => setPostToFacebook(event.target.checked)} 
			name="FacebookCheckBox"
            color="primary"
          />
        }
        label="Facebook"
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={true}
            checked={postToTwitter}
            onChange={(event) => setPostToTwitter(event.target.checked)} 
			name="TwitterCheckBox"
          />
        }
        label="Twitter"
      />
    </FormGroup>
        
        {!dateTimeVisible ? 
        <Button
        variant="warning"
        onClick={handleScheduleBtnClick}
        visible={scheduleBtnVisible}
        disabled={!(postToFacebook || postToInstagram || postToTwitter)}>
          Schedule Post
        </Button> : 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          variant="inline"
          id="time-picker"
          label="Time picker"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
        }
        <PostBtn
        postToFacebook={postToFacebook}
        postToInstagram={postToInstagram}
        postToTwitter={postToTwitter}
        facebookAccessToken = {props.facebookAccessToken}
        date={selectedDate}
        scheduled={scheduled}
        images={props.images}
        description={props.description}
        />


        {/* <PostBtn
        postToFacebook={postToFacebook}
        postToInstagram={postToInstagram}
        postToTwitter={postToTwitter}
        facebookAccessToken = {props.facebookAccessToken}
        schedule="true"
        images={props.images}
        description={props.description}
        /> */}
        </div>
    );
}

export default SharingControls;
