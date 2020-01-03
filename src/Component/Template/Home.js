import React , { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import Header from './Header';
import axios from 'axios';


const useStyles = makeStyles(theme => ({
  typo: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  text: {
    fontFamily: 'Courgette, cursive'
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    margin:'auto',
    flexGrow: 1,
  },
}));


export default function Home(props) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [status, setStatus] = useState(false);
  const [listFriend, setListFriend] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState({});

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === 'Enter') {
      getSearchValue();
    }
  };

  const getSearchValue = () => {
    if(searchValue === ""){
      setSearching(false);
    } else {
      let data = {
        searchValue: searchValue,
        userName: localStorage.getItem('userName')
      }
      axios.post('http://localhost:4000/find_friend', data)
      .then(result => {
        if (result.status === 201){
          setSearchResult(result.data);
          setSearching(true);
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
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeSnackbar = () => {
    setSnackbar({
        message: '',
        open: false
    })
  }

  async function fetchData() {
    var data = {
      userId: localStorage.getItem('idUserInfor')
    }
    axios.post('http://localhost:4000/get_all_friend', data)
    .then(result => {
      if (result.status === 201){
        setListFriend(result.data);
      } else {
        setSnackbar({
            message: 'Internal server error',
            open: true
        });
      }
    })
    .catch(err => {
      console.log(err);
    })
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const requestFriend = (e) => {
    var data = {
      requesterId: localStorage.getItem('idUserInfor'),
      recipientId: e.currentTarget.value
    }
    axios.post('http://localhost:4000/request_friend', data )
    .then(result => {
      if (result.status === 201){
        if(result.data.message === "OK"){
          openNotify('Your friend request have been sent');
        }
      } else {
        setSnackbar({
            message: 'Internal server error',
            open: true
        });
      }
    })
    .catch( err => {
      setSnackbar({
        message: 'Internal server error',
        open: true
      });
    })
  };

  const unfriend = (e) => {
    var data = {
      userId: localStorage.getItem('idUserInfor'),
      unfriendId: e.currentTarget.value
    }
    axios.post('http://localhost:4000/unfriend', data)
    .then(result => {
      if (result.status === 201){
        if(result.data.message === "OK"){
          setStatus(true);
          openNotify('Unfriend successfully');
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
  }

  const openNotify = (message) => {
    setOpen(true);
    setMessage(message);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header history={props.history} ></Header>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom className={classes.text} >
             Welcome to chat app
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph className={classes.text}>         
                Your friends list is shown below. You can search more another friend by searching by name in search box.
            </Typography>
            <TextField
              label="Search Friend"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={getSearchValue} >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Container>
        </div>
        {!searching &&
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {listFriend.map(friend => (
              <Grid item key={friend._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={friend.avatarURL}
                    title={friend.lastName}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.text}>
                      {friend.firstName + " " + friend.lastName}
                    </Typography>
                  </CardContent>
                  <CardActions style={{margin:'auto'}}>
                    <Button size="small" color="primary" variant="outlined" onClick={() => props.history.push('message-history')}>
                      Send Message
                    </Button>
                    <Button size="small" color="secondary" variant="outlined" onClick={unfriend} value={friend._id}>
                      Unfriend
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        }
        {searching &&
        <Container className={classes.cardGrid} maxWidth="md">
          {searchResult.length === 0 ? 
          <Typography component="h5" variant="h6" align="center" color="textPrimary"  className={classes.text} >
            Not found
          </Typography>
          :
          <Grid container spacing={4}>
            {searchResult.map(user => (
              <Grid item key={user._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title={user.lastName}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {user.firstName + " " + user.lastName}
                    </Typography>
                  </CardContent>
                  <CardActions >
                    <Button size="small" color="primary" variant="outlined" onClick = {requestFriend} value={user._id}>
                      Add Friend
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          }
        </Container>
        }
      </main>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <DialogContentText id="context">
            {message}
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