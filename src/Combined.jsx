import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, get, remove, set,update } from 'firebase/database';
import ContentField from './ContentField';
import SignOutButton from './Signout';
import { auth,db, storage } from './firebase';
import { getStorage,ref as createRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const CombinedComponent = () => {
  const [contentFields, setContentFields] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [title, setTitle] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [oldPreferredName, setOldPreferredName] = useState('');
  const [isEditingPreferredName, setIsEditingPreferredName] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isTitleExists, setIsTitleExists] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [hasUploadedBefore, setHasUploadedBefore] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const fetchData = async () => {
    
    if (user) {  
        
      const dbRef = ref(getDatabase(), `users/${user.uid}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPreferredName(data.preferredName || '');
        setTitle(data.title || '');
        setProfilePicUrl(data.profilePic || '');
        setIsTitleExists(!!data.title);
        setIsFirstTime(!data.title);
        setHasUploadedBefore(!!data.profilePic);
        
      }
    }
  };
  useEffect(() => {
    
    fetchData();
  }, []); 
  useEffect(() => {
    fetchData();
  }, [userId]); //

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

  useEffect(() => {
    fetchData(); 
  }, []);

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

  // Functions from DataEntry
  const handleProfilePicUpload = async (event) => {
    const user = getAuth().currentUser;
    if (user) {
      setIsUploading(true);
      const file = event.target.files[0];
      const storage = getStorage();
      const fileRef = createRef(storage, `profilePics/${user.uid}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.error("Upload failed", error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfilePicUrl(downloadURL);
          setIsUploading(false); 
          setHasUploadedBefore(true); 
  
          const updates = {};
          updates[`profilePic`] = downloadURL;
          await update(ref(db, `users/${user.uid}`), updates);
          // Fetch the latest data after updating
          fetchData();
        }
      );
    }
  };
  
  // Define newPreferredNameToSave outside the function
  let newPreferredNameToSave = preferredName;
  let PreferredNameToSave = preferredName;

const updatePreferredName = async (preferredName) => {
  const user = getAuth().currentUser;
  if (!user) {
    console.error("No user is currently signed in.");
    return;
  }

  const db = getDatabase();
  const userRef = ref(db, `users/${user.uid}`);
  const newNameRef = ref(db, `preferredNames/${newPreferredNameToSave.toLowerCase()}`);
  const oldNameRef = ref(db, `preferredNames/${newPreferredNameToSave}`);
  try {
    const newNameSnapshot = await get(newNameRef);
    if (newNameSnapshot.exists()) {
      alert('This preferred name is already taken. Please choose another one.');
      return;
    }

    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    const currentPreferredName = userData.preferredName;

    if (currentPreferredName) {
      const currentNameRef = ref(db, `preferredNames/${currentPreferredName.toLowerCase()}`);
      await remove(currentNameRef);
    }

    await set(oldNameRef, user.uid);
    await update(userRef, { preferredName: newPreferredNameToSave });

    fetchData();
    updateData();
    setIsEditingPreferredName(false);
  } catch (error) {
    console.error("Error updating preferred name: ", error);
  }
};
  


 
  const updateData = async () => {
    const user = getAuth().currentUser;
    if (user) {
      const db = getDatabase();
      const updates = {};
      updates[`title`] = title;
      updates[`profilePic`] = profilePicUrl;
      updates[`preferredName`] = preferredName; 
      await update(ref(db, `users/${user.uid}`), updates);
      setIsEditingTitle(false);
      fetchData();
    }
  };



return (
  <div >
    
      <div className="flex flex-col justify-left  bg-gray-200 md:py-40 md:px-80">
      
<div className='p-4 bg-gray-900 rounded-lg'>
<div className="mb-6" ><h1 className='text-white text-center'>Welcome to My Basket</h1></div>

<div className="w-14 h-14 border border-black overflow-hidden mb-2">
          <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: 'auto' }} />
        </div>
        
        {isEditingProfilePic || !hasUploadedBefore ? (
          <div>
            <input type="file" onChange={handleProfilePicUpload} />
            <button onClick={() => setIsEditingProfilePic(false)}>
              {hasUploadedBefore ? 'Done' : 'Upload'}
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditingProfilePic(true)}>
            Edit Profile Picture
          </button>
        )}
        <div>
        <input className="mr-2 pl-2 mt-6 my-2 py-1 rounded-sm text-white"
  placeholder={` Enter preferred Name`}
  value={preferredName}
  onChange={(e) => setPreferredName(e.target.value)}
  disabled={!isEditingPreferredName}
/>
{isEditingPreferredName && (
  <button className="mb-2" onClick={updatePreferredName} disabled={!preferredName}>
    Update Basket Name
  </button>
)}
{!isEditingPreferredName && (
<button className="mb-2" onClick={() => setIsEditingPreferredName(true)}>
  Edit Basket Name
</button>
)}
        </div>
        <div>
          <input className="mr-2 mt-6 my-4 pl-2 py-1 rounded-sm text-white"
            placeholder=" Enter Bio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditingTitle}
          />
          {isEditingTitle && (
  <button className="mb-2" onClick={updateData} disabled={!title}>
    Update Bio
  </button>
)}
{!isEditingTitle && (
<button className="mb-2" onClick={() => setIsEditingTitle(true)}>
  Edit Bio
</button>
)}
        </div>
        {contentFields}
        <button className="mr-2" onClick={addContentField}>Add content field</button>
        <div className="mt-2 ">
        <SignOutButton />
        <Link to={`/${preferredName}`} className="bg-blue-500 text-white px-4 ml-4 py-2 rounded hover:bg-blue-700">
        Go to Your Basket
      </Link> 
      </div>
      </div>
      </div>
       
  </div>

);
        }
export default CombinedComponent;