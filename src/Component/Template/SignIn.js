import React , {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link }  from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import useForm from "react-hook-form";
import axios from "axios";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none'
  }
}));



export default function SignIn(props) {
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const [snackbar, setSnackbar] = useState({});

  const onSubmit = values => {
    axios.post('http://localhost:4000/sign-in', values)
    .then(result => {
       //Lấy thông điệp trả về
      let message = result.data.message;
      if (result.status === 201){
        if(result.data.message === "OK"){
          localStorage.setItem('userName', values.userName);
          localStorage.setItem('idUserInfor', result.data.idUserInfor);
          if (result.data.checkConfiguration === 0) {
             props.history.push('/config-information');
          }else {
            props.history.push('/home');
          }
          
        } else {
          setSnackbar({
            message,
            open: true
          });
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
        message: 'System error.',
        open: true
      });
    })
  };

  const closeSnackbar = () => {
    setSnackbar({
      message: '',
      open: false
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            name="userName"
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!(errors && errors.userName)}
            helperText={(errors && errors.userName) ? errors.userName.message : ''}
            id="userName"
            label="Username"
            autoFocus
            inputRef={register({
              required: 'Required',
              
            })}
          />
        
          <TextField
            name="password"
            variant="outlined"
            error={!!(errors && errors.password)}
            helperText={(errors && errors.password) ? errors.password.message : ''}
            margin="normal"
            fullWidth
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
         
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link className={classes.link} to="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link className={classes.link} to="sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
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