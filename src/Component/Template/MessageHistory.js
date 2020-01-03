import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Drawer from '@material-ui/core/Drawer';
import Avatar from "@material-ui/core/Avatar";
import { 
    TextField,
    Grid,
    Typography,
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon 
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Send from '@material-ui/icons/SendSharp';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
   
    drawer: {
        width: '280px',
        flexShrink: 0,
    },
    drawerPaper: {
        width: '280px',
        backgroundColor: '#F5DEB3',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
        maxWidth: '65%',
        maxHeight: '90%'
    },
    listMessage: {
        height: '500px',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
    toolbar: theme.mixins.toolbar,
    receivedMsg: {
        borderRadius: '3px',
        backgroundColor: '#ebebeb',
        padding: '8px',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginTop: '5px'
    },
    sendMsg: {
        borderRadius: '3px',
        backgroundColor: '#05728c',
        color: 'white',
        padding: '8px',
        marginRight: theme.spacing(4),
        marginTop: '5px'
    },
    time: {
        fontSize: '13px',
    },
    type: {
        display: 'flex',
        padding: theme.spacing(3),
    },
    button: {
      margin: 'auto',
    },
    textField: {
        flexGrow: 1,
        maxWidth: '90%',
    },
    statistic: {
        margin: theme.spacing(2),
        
    }, 
    chosen: {
        backgroundColor: '#e9a5a7',
    }
}));

export default function MessageHistory(props) {
    const classes = useStyles();
    const [status, setStatus] = useState(false);
    const [sendMessage, setSendMessage] = useState('');
    const [listFriend, setListFriend] = useState([]);
    const [listMessage, setListMessage] = useState([]);
    const [chosenFriend, setChosenFriend] = useState();
    const [snackbar, setSnackbar] = useState({});

    const closeSnackbar = () => {
        setSnackbar({
            message: '',
            open: false
        })
    };

    const handleChange = (event) => {
        setSendMessage(event.target.value);
    };

    const handleKeyPress = (event) => {
        const key = event.key;
    
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        }
    
        if (key === 'Enter') {
            storeMessage();
        }
    };

    const storeMessage = () => {
        var data = {
            sender: localStorage.getItem('idUserInfor'),
            receiver: chosenFriend,
            content: sendMessage
        };
        axios.post('http://localhost:4000/store_message', data)
        .then(result => {
            console.log(result);
            setStatus(!status);
            setSendMessage('');
        })
        .catch(err => {
            console.log(err)
        })
    };

    async function fetchData() {
        var data = {
          userId: localStorage.getItem('idUserInfor')
        }
        axios.post('http://localhost:4000/get_all_friend', data)
        .then(result => {
          if (result.status === 201){
            for(var i = 0; i < result.data.length; i++){
                setChosenFriend(result.data[i]._id);
                break;
            }
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
    }, []);

    useEffect(() => {
        var data = {
            chosenFriend: chosenFriend,
            idUserInfor: localStorage.getItem('idUserInfor')
        };
        axios.post('http://localhost:4000/get_list_message', data)
        .then(result => {
            console.log(result)
            if (result.status === 201){
               setListMessage(result.data);
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
    }, [chosenFriend, status]);

    return (
       <React.Fragment>
            <Header history={props.history}></Header>
            <div className={classes.root}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    <List>
                        {listFriend.map(friend => (
                            <ListItem button key={friend._id} onClick={() => setChosenFriend(friend._id)} className={friend._id === chosenFriend ? classes.chosen : ''}>
                                <ListItemIcon>
                                    <Avatar alt="Hung Con" src="./images/per-avatar.jpg"  />
                                </ListItemIcon>
                                <ListItemText primary={friend.firstName + " " + friend.lastName} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <div className={classes.content}>
                    <div className={classes.listMessage} >
                        {listMessage.map( msg => (
                                <Grid container  key={msg._id} justify={msg.sender === localStorage.getItem('idUserInfor') ? 'flex-end' : 'flex-start'}>
                                    {
                                        msg.sender === localStorage.getItem('idUserInfor') ?     
                                    <Grid item></Grid> 
                                        :
                                        <Grid item>
                                            <Avatar alt="Hung Con" src="./images/per-avatar.jpg"  />
                                        </Grid>
                                    }
                                    <Grid item  className={msg.receiver ===  localStorage.getItem('idUserInfor') ? classes.receivedMsg: classes.sendMsg}>
                                        <Typography>
                                            {msg.content}
                                        </Typography>
                                        <Typography className={classes.time}>
                                            {msg.time}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))
                        }
                    </div>
                    <div className={classes.type}>
                        <TextField
                            id="outlined-basic"
                            className={classes.textField}
                            label="Message"
                            margin="normal"
                            variant="outlined"
                            onKeyPress={handleKeyPress}
                            value={sendMessage}
                            onChange={handleChange}
                        />
                        <Fab color="primary" className={classes.button} onClick={storeMessage}>
                            <Send />
                        </Fab>
                    </div>
                </div>
                <div className={classes.statistic}>
                    Count message: {listMessage.length}
                </div>
            </div>
            <Snackbar
                autoHideDuration={2000}
                message={snackbar.message}
                open={snackbar.open}
                onClose={closeSnackbar}
            />
       </React.Fragment>
    );
}