import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue, off } from "firebase/database";
import ContentField from './ContentField'; // import your ContentField component

function DataDisplay() {
  const { preferredName } = useParams();
  const [data, setData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const nameToUidRef = ref(db, `preferredNames/${preferredName}`);
    const nameToUidof= onValue(nameToUidRef, (snapshot) => {
      const uid = snapshot.val();
      const dataRef = ref(db, `users/${uid}/contents`);
      const dataof= onValue(dataRef, (dataSnapshot) => {
        const data = dataSnapshot.val();
        setData(data);
      });
      const profilePicRef = ref(db, `users/${uid}/profilePic`);
      const profilePicof= onValue(profilePicRef, (profilePicSnapshot) => {
        const profilePic = profilePicSnapshot.val();
        setProfilePicUrl(profilePic);
      });
      const titleRef = ref(db, `users/${uid}/title`);
      const titleof= onValue(titleRef, (titleSnapshot) => {
        const title = titleSnapshot.val();
        setTitle(title);

      });
      return () => {
        // Detach the listeners
        off(profilePicRef, profilePicof);
        off(titleRef, titleof);
        off(nameToUidRef, nameToUidof);
        off(dataRef, dataof);
  }
    });
    


  }, [preferredName]);

  

  return (
    <div className="flex flex-col md:px-60 justify-center px-4 bg-gray-800 min-h-screen">
      <div className="bg-slate-400 rounded-lg p-4">
      <div className="flex flex-col items-center ">
        {profilePicUrl && (
          <div className="w-40 h-40 rounded-full border border-black mb-4">
            <img src={profilePicUrl} alt="Profile" className="w-full h-full rounded-full" />
          </div>
        )}
        <p className="mb-4 font-bold">{preferredName}</p>
        <p className="mb-4">{title}</p>
      </div>
      <div >
        {data && Object.keys(data).map((key, index) => (
          <div key={key}>
            <div className="flex flex-row  mb-2 px-28 space-x-4 md:px-0 md:justify-center items-center rounded-lg p-2 bg-white shadow ">
              <div className="w-8 h-8 ">
                <img src={data[key].image} alt="Selected" className="w-full h-full" />
              </div>
              <div >
              <a href={`https://${data[key].content}`} target="_blank" rel="noopener noreferrer">{data[key].header}</a>
            </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
        }
  export default DataDisplay;
  