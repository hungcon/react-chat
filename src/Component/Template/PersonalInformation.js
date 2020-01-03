import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CallIcon from '@material-ui/icons/Call';
import FaceIcon from '@material-ui/icons/Face';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Typography, Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import useForm from "react-hook-form";
import {firebaseConnect} from '../../firebaseConnect';

const useStyles = makeStyles(theme => ({
   img: {
        
        marginTop: theme.spacing(3),
        maxWidth: '100%',
        height: 'auto'
   },
   red: {
       color: 'red'
   },
   font: {
       fontFamily: '"Marcellus", serif',
       fontWeight: 'bold'
   }, 
   information: {
       marginTop: theme.spacing(3),
       margin: 'auto'
   },
   input: {
        margin: theme.spacing(1),
   },
   btn: {
       margin: theme.spacing(3),
   }, 
   upload: {
        display: 'none',
   },
}));

export default function PersonalInformation(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({});
    const fileInput = useRef(null);
    const [avatarPath, setAvatarPath] = useState('');
    const [userInfor, setUserInfor] = useState({phoneNumber: '', firstName: '', lastName: '', email: ''});
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        values.userName = localStorage.getItem('userName');
        values.avatarURL = avatarPath;
        axios.post('https://api-chat-hust.herokuapp.com/update_user_information', values)
        .then(result =>{
            if (result.status === 201){
                if(result.data.message === "OK"){
                  setOpen(true);
                }
            } else {
                setSnackbar({
                    message: 'Internal server error',
                    open: true
                });
            }
        })
        .catch(err => {
            setSnackbar({
                message: 'Internal server error',
                open: true
            });
        })
    };

    const handleChange = name => event => {
        setUserInfor({ ...userInfor, [name]: event.target.value });
      };
    
    useEffect(() => {
        var data = {
            userInforId: localStorage.getItem('idUserInfor')
        }
        axios.post('https://api-chat-hust.herokuapp.com/get_user_infor', data)
        .then(result => {
            if (result.status === 201){
               setUserInfor(result.data);
            } else {
                setSnackbar({
                    message: 'Internal server error',
                    open: true
                });
            }
        })
        .catch(err => {
            setSnackbar({
                message: 'Internal server error',
                open: true
            });
        })
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const closeSnackbar = () => {
        setSnackbar({
            message: '',
            open: false
        })
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarPath(URL.createObjectURL(event.target.files[0]))
        }
    };

    const uploadAvatar = (file) => {
        var storageRef = firebaseConnect.storage().ref();
        var metadata = {
            contentType: file.type
          };
        var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
        uploadTask.on('state_changed', function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, function(error) {
            console.log(error);
          }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              setAvatarPath(downloadURL);
            });
          });
    };
    
    const getAvatarFile = (event) => {
        event.preventDefault();
        if (fileInput.current.files[0] ===  undefined){
            window.alert('Choose your avatar first.');
        } else {
            uploadAvatar(fileInput.current.files[0]);
        }
    }

    return (
       <React.Fragment>
           <Header history={props.history}></Header>
           <Container>
           <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <img className={classes.img} alt="complex" src={ avatarPath || userInfor.avatarURL} />
                    <form onSubmit={getAvatarFile} className={classes.form}>
                        <div className={classes.input}>
                            <input
                                accept="image/*"
                                className={classes.upload}
                                id="contained-button-file"
                                multiple
                                type="file"
                                name="avatarPath"
                                ref={fileInput}
                                onChange={onImageChange}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" component="span" color="secondary">
                                Change your avatar
                                </Button>
                            </label>
                        </div>
                    </form>
                </Grid>
                <Grid item xs={6} className={classes.information}>
                    <Grid container spacing={2} >
                        <Grid item>
                            <CallIcon className={classes.red}/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.font}>Phone number: </Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                        <TextField
                            id="phoneNumber"
                            name="phoneNumber"
                            error={!!(errors && errors.phoneNumber)}
                            helperText={(errors && errors.phoneNumber) ? errors.phoneNumber.message : ''}
                            value={userInfor.phoneNumber}
                            inputRef={register({
                                required: 'Required',
                            })}
                            variant="outlined"
                            className={classes.input}
                            onChange={handleChange("phoneNumber")}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item>
                            <FaceIcon className={classes.red}/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.font}>First name: </Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                    <TextField
                        name="firstName"
                        id="firstName"
                        error={!!(errors && errors.firstName)}
                        helperText={(errors && errors.firstName) ? errors.firstName.message : ''}
                        value={userInfor.firstName}
                        inputRef={register({
                            required: 'Required',
                        })}
                        variant="outlined"
                        className={classes.input}
                        onChange={handleChange("firstName")}
                    />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item>
                            <FaceIcon className={classes.red}/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.font}>Last name: </Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                     <TextField
                        id="lastName"
                        name="lastName"
                        error={!!(errors && errors.lastName)}
                        helperText={(errors && errors.lastName) ? errors.lastName.message : ''}
                        value={userInfor.lastName}
                        inputRef={register({
                            required: 'Required',
                        })}
                        variant="outlined"
                        className={classes.input}
                        onChange={handleChange("lastName")}
                    />
                    </Grid>
                    <Grid container spacing={2} >
                        <Grid item>
                            <MailOutlineIcon className={classes.red}/>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.font}>Email: </Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                    <TextField
                        id="email"
                        name="email"
                        error={!!(errors && errors.email)}
                        helperText={(errors && errors.email) ? errors.email.message : ''}
                        className={classes.input}
                        value={userInfor.email}
                        inputRef={register({
                            required: 'Required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email address"
                                }
                        })}
                        variant="outlined"
                        onChange={handleChange("email")}
                    />
                    </Grid>
                    <Button variant="outlined" color="primary" className={classes.btn} type="submit">
                        Update
                    </Button>
                </Grid>
            </Grid>
            </form>
           </Container>
           <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                <DialogContentText id="context">
                    Update successfully
                </DialogContentText>
                </DialogContent>
                <DialogActions style={{margin: 'auto'}}>
                <Button onClick={handleClose} color="primary" variant="outlined">
                    OK
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={2000}
                message={snackbar.message}
                open={snackbar.open}
                onClose={closeSnackbar}
            />
       </React.Fragment>
    );
}