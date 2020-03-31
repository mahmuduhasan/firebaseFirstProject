import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn :false,
    name:'',
    email: '',
    photo:'',
    password : ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL , email} = res.user;
      const signedInUser ={
        isSignedIn: true,
        name: displayName,
        email : email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName,photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo : '',
        email : '',
        password: '',
        isValid: false,
        error: '',
        existingUser : false
      }
      setUser(signedOutUser);
    })
    .catch (err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const isValidEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const isValidPassword = password => /\d/.test(password);
  const switchForm =event => {
    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
  }
  const handleChange = event => {
    
    const newUserInfo ={
      ...user
    };
    let isValid = true;
    if(event.target.name === 'email'){
        isValid = isValidEmail(event.target.value);
    }
    if(event.target.name === 'password'){
      isValid = event.target.value.length > 8 && isValidPassword(event.target.value);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) =>{
    
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email , user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err=>{
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email , user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err=>{
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out with Google!</button>:
        <button onClick={handleSignIn}>Sign in with Google!</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome , {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication!</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm"> Returning User</label>
      <br/>
      <br/>
      <form style={{display:user.existingUser? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your email!" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password!" required/>
        <br/>
        <input type="submit" value="Sign In Account"/>
      </form>
      <br/>
      <br/>
      <form style={{display:user.existingUser? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Enter Your Name!" required></input>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your email!" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password!" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
