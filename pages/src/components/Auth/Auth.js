import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { signin, signup } from '../../actions/auth';
const initialState = {
    firstname       : '',
    lastname        : '',
    email           : '',
    password        : '',
    confirmPassword : ''
}

const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState)
    
    const dispatch = useDispatch();
    const history = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if(isSignup){
            dispatch(signup(formData, history));
        }else{
            dispatch(signin(formData, history));
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
        
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword)=> !prevShowPassword);
    const switchMode = () => {
        setIsSignup((prevIsSignup)=> !prevIsSignup);
        handleShowPassword(false);
    }
    return (
        <Container maxWidth="xs" component="main">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ?"Sign Up":"Sign In"}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstname" label="firstname" handleChange={handleChange} autofocus half/>
                                    <Input name="lasttname" label="lastname" handleChange={handleChange} half/>
                                </>                            
                                )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type='email'/>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword?'text':'password'} handleShowPassword={handleShowPassword}/>
                        {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type='password'/>}
                    </Grid>
                    <Button type="Submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? "Sign Up":"Sign In"}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? "Already have an account? Sign In":"Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>

                </form>                    
            </Paper>
        </Container>

    )
}

export default Auth
