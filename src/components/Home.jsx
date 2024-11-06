import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";

function Home() {

  const [newProductImg, setNewProductImg] = useState(null);

  const uploadImage = async () => {
    if (!newProductImg) return;
    const imageFolderRef = ref(storage, `marketFiles/${newProductImg.name}`);
    try {
      await uploadBytes(imageFolderRef, newProductImg);
    } catch(err) {
      console.error(err);
    }
  };

    return (
      <div>
          <input 
        type="file" 
        className="form-control"
        required
        onChange={(e) => setNewProductImg(e.target.files[0])}
        />
         <button onClick={uploadImage}>Upload Image</button> 
      </div>
    );
  }
  
  export default Home;