import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

function SignOutButton() {
  const auth = getAuth();

  const signOutUser = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  return (
    <button onClick={signOutUser}>Sign Out</button>
  );
}

export default SignOutButton;