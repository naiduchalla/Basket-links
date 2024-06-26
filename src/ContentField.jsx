import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set, remove, onValue, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase'; // import your firebase config


const ContentField = ({ index, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (userId) {
    const fetchContent = () => {
      const dbRef = ref(db, `users/${userId}/contents/` + index);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHeader(data.header);
          setContent(data.content);
          setSelectedImage(data.image);
        }
      });
    };
    
    fetchContent();
}
  }, [index, userId]);

  const handleChange = (e) => {
    if(userId){
    setSelectedOption(e.target.value);
  };}

  const handleFileChange = async (e) => {
    if (userId) {
    setIsUploading(true);
    const file = e.target.files[0];
    const storageReference = storageRef(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle progress
      }, 
      (error) => {
        // Handle error
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setSelectedImage(downloadURL);
        const dbRef = ref(db, `users/${userId}/contents/${index}`);
        await set(dbRef, { header, content, image: downloadURL });
        setIsUploading(false);
      }
    );
  }};

  const pushData = async () => {
    
    const dbRef = ref(db, `users/${userId}/contents/` + index);
    await set(dbRef, { header, content, image: selectedImage });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    
    const dbRef = ref(db, `users/${userId}/contents/` + index);
    await remove(dbRef);
    onRemove(index);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  useEffect(() => {
    if (selectedOption === 'instagram') {
      const imgURL = 'https://firebasestorage.googleapis.com/v0/b/basket-links.appspot.com/o/images%2Finstagram-1-svgrepo-com.svg?alt=media&token=b1aaefb5-bbd2-410a-a2a3-4906394ad0dd';
      setSelectedImage(imgURL);
      setIsUploading(false);

    }
    if (selectedOption === 'facebook') {
      const imgURL = 'https://firebasestorage.googleapis.com/v0/b/basket-links.appspot.com/o/images%2Ffacebookicon.svg?alt=media&token=ed97f71f-407b-4666-a2ce-182991cc8c00';
      setSelectedImage(imgURL);
      setIsUploading(false);

    }
    if (selectedOption === 'Twitter') {
      const imgURL = 'https://firebasestorage.googleapis.com/v0/b/basket-links.appspot.com/o/images%2Ftwitterx.svg?alt=media&token=b955545e-c96a-4858-b6a1-54b9077cd1d3';
      setSelectedImage(imgURL);
      setIsUploading(false);

    }
    if (selectedOption === 'Youtube') {
      const imgURL = 'https://firebasestorage.googleapis.com/v0/b/basket-links.appspot.com/o/images%2Fyoutubeicon.svg?alt=media&token=9cfb60bf-699e-4a5a-afb8-9b9a29a5ff8f';
      setSelectedImage(imgURL);
      setIsUploading(false);

    }
    if (selectedOption === 'otherlink') {
      const imgURL = 'https://firebasestorage.googleapis.com/v0/b/basket-links.appspot.com/o/images%2Fexploreicon.svg?alt=media&token=453e7f66-5eed-4a1f-96a5-65c1d4b40473';
      setSelectedImage(imgURL);
      setIsUploading(false);

    }
  }, [selectedOption]);

  return (
    <div className="flex flex-col justify-left items-center bg-gray-600 p-4 rounded-md mb-4 md:flex-row shadow">
    <div className="my-8" >
      
      <div className="mb-2" >
        {selectedImage && (
          <div style={{ width: '50px', height: '50px', border: '1px solid black', marginBottom: '1rem' }}>
            <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        <select value={selectedOption} onChange={handleChange} disabled={!isEditing || isUploading}>
          <option value="">Select an option...</option>
          <option value="device">Select from your device</option>
          <option value="instagram">instagram</option>
          <option value="facebook">facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="Youtube">Youtube</option>
          <option value="otherlink">otherlink</option>
        </select>
        {selectedOption === 'device' && <input type="file" onChange={handleFileChange} />}
        
      

      </div >

      <input className="my-2 mr-2 pl-2 rounded-sm text-white"
        placeholder={`${index + 1} Enter display text`}
        value={header}
        onChange={(e) => setHeader(e.target.value)}
        disabled={!isEditing}
      />
      <input className="my-2 mr-2  pl-2  rounded-sm text-white"
        placeholder={`${index + 1} Enter link `}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!isEditing}
      />
      <div>
      {isEditing && (
        <button className="mr-2 mb-2" onClick={pushData} disabled={!(selectedOption && header && content)}>
          Update Content
        </button>
      )}
      {!isEditing && <button className="mr-2" onClick={handleEditClick}>Edit Content</button>}
      <button onClick={handleDelete}>Delete Content</button>
      </div>
    
    </div>
    </div>
  );
};

export default ContentField;