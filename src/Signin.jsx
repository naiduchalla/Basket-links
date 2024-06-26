import React, { useEffect, useState } from 'react';
import DataEntry from './DataEntry';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { auth } from './firebase'; 
import { Link } from 'react-router-dom';

import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import CombinedComponent from './Combined';


function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen md:mx-60">
        <div className="bg-slate-800 p-6 text-center text-white rounded-lg md:px-20 shadow-2xl">
        <h1 className='py-4'>My Basket</h1>
        <p className='py-4'>Please sign-in:</p>
        <button className='py-4 text-white bg-gray-900' onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
      </div>
    );
  }
  return (
    <CombinedComponent/>
  );
}

export default SignInScreen;