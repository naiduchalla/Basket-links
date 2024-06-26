import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, get, remove, set } from 'firebase/database';
import { db } from './firebase'; // import your firebase config
import ContentField from './ContentField';
import SignOutButton from './Signout';

const ParentComponent = () => {
  const [contentFields, setContentFields] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (userId) {
      const dbRef = ref(db, `users/${userId}/contents`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setContentFields(Object.keys(data).map((key) => <ContentField key={key} index={key} onRemove={handleRemove} />));
        }
      });
    }
  }, [userId]);
  
  const addContentField = () => {
    setContentFields([...contentFields, <ContentField key={contentFields.length} index={contentFields.length} onRemove={handleRemove} />]);
  };

  const handleRemove = async (indexToRemove) => {
    if (userId) {
      const dbRef = ref(db, `users/${userId}/contents`);
      const snapshot = await get(dbRef);
      const data = snapshot.val();
  
      // Remove the content field at the specified index
      delete data[indexToRemove];
  
      // Reindex the remaining content fields
      const newData = Object.values(data).reduce((result, value, index) => {
        result[index] = value;
        return result;
      }, {});
  
      // Update the database
      await remove(dbRef);
      await set(ref(db, `users/${userId}/contents`), newData);
  
      // Update the state
      setContentFields(Object.keys(newData).map((key) => <ContentField key={key} index={key} onRemove={handleRemove} />));
    }
  };
  

  return (
    <div>
      {contentFields}
      <button onClick={addContentField}>Add content field</button>
      <SignOutButton />
    </div>
  );
};

export default ParentComponent;