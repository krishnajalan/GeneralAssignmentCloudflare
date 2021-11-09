import React, { useState, useEffect } from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import memories from '../../images/memories.png';
import useStyles from './styles'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

const Navbar = () => {
    const [user, setUser] = useState();
    const classes = useStyles();
    const location = useLocation();
    const dispatch = useDispatch();

    const history = useNavigate();
    const logout = () => {
        dispatch({ type: "LOGOUT" });
        history("/");
        setUser(null);
    }
    useEffect(() => {
        // TODO: implement JWT
    }, [location])
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">
                    General Assignment
                </Typography>
                <img className={classes.image} src={memories} alt="icon" height="60" />
            </div>
            {/* <Toolbar className={classes.toolbar}>
                {user?.result ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={()=>{}}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                )}
            </Toolbar> */}
        </AppBar>
    );
};

export default Navbar;
