import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
//React Hook Form
import useForm from "react-hook-form";

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none'
  }
}));

export default function SignUp(props) {

  const { handleSubmit, register, errors, watch } = useForm();
  const [snackbar, setSnackbar] = useState({});
  
  const onSubmit = values => {
    // console.log(values)
    axios.post('http://localhost:4000/create_account', values)
    .then(result => {
      //Lấy thông điệp trả về
      let message = result.data.message;
      if (result.status === 201){
        if(result.data.message === "OK"){
          localStorage.setItem('userName', values.userName);
          props.history.push('/config-information');
        } else {
          setSnackbar({
            message,
            open: true
          });
        }
      } else {
        setSnackbar({
          mesage: 'Internal server error',
          open: true
        });
      }
    })
    .catch(err => {
      setSnackbar({
        mesage: 'System error.',
        open: true
      });
    })
  };

  const closeSnackbar = () => {
    setSnackbar({
      message: '',
      open: false
    })
  };

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="userName"
                variant="outlined"
                required
                autoFocus
                fullWidth
                error={!!(errors && errors.username)}
                helperText={(errors && errors.username) ? errors.username.message : ''}
                id="username"
                label="Username"
                autoComplete="uname"
                inputRef={register({
                  required: 'Required',
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                required
                error={!!(errors && errors.password)}
                helperText={(errors && errors.password) ? errors.password.message : ''}
                name="password"
                label="Password"
                type="password"
                id="password"
                inputRef={register({
                  required: 'Required',
                  maxLength: {
                    value: 15,
                    message: 'Password must be less than 15 charaters'
                  },
                  minLength: {
                    value: 6,
                    message: 'Password must be more than 6 charaters'
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                error={!!(errors && errors.retypePassword)}
                helperText={(errors && errors.retypePassword) ? errors.retypePassword.message : ''}
                name="retypePassword"
                label="Retype Password"
                type="password"
                id="retypePassword" 
                inputRef={register({
                  required: 'Required',
                  validate: (value) => value === watch('password') || 'Retype password not match'
                })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link className={classes.link} to="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        autoHideDuration={2000}
        message={snackbar.message}
        open={snackbar.open}
        onClose={closeSnackbar}
      />
    </Container>
  );
}