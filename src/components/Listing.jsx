import React, { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "../css/Listing.module.css";

export const Listing = () => {
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductImg, setNewProductImg] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const productsCollectionRef = collection(db, "products");
  const fileInputClear = useRef(null);

  const handleListProduct = async () => {
    // Validates the inputs before uploading the product
    if (
      !newProductName.trim() ||
      !newProductDescription.trim() ||
      newProductPrice <= 0 ||
      !newProductCategory ||
      !newProductImg
    ) {
      setConfirmationMessage("Please fill all fields.");
      setIsSuccess(false);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
      return;
    }

    try {
      //Process the image upload
      let imageUrl = "";
      if (newProductImg) {
        const imageFolderRef = ref(
          storage,
          `marketFiles/${newProductImg.name}`
        );
        await uploadBytes(imageFolderRef, newProductImg);
        imageUrl = await getDownloadURL(imageFolderRef);
      }

      //Product upload to Firestore
      await addDoc(productsCollectionRef, {
        name: newProductName,
        description: newProductDescription,
        price: newProductPrice,
        category: newProductCategory,
        userId: auth?.currentUser?.uid,
        imageUrl: imageUrl,
      });

      setNewProductName("");
      setNewProductDescription("");
      setNewProductPrice(0);
      setNewProductCategory("");
      setNewProductImg(null);
      fileInputClear.current.value = "";

      setConfirmationMessage("Product listed successfully");
      setIsSuccess(true);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setConfirmationMessage("Error listing the product.");
      setIsSuccess(false);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  //Process only JPG, JPG AND PNG
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setNewProductImg(file);
    } else {
      alert("Please upload an image file (JPG, JPEG, PNG).");
      e.target.value = ""; //If the file type is invalid the input is cleared.
      setNewProductImg(null);
    }
  };

  return (
    <div>
      {confirmationMessage && (
        <div
          className={styles.success_btn}
          style={{
            backgroundColor: isSuccess ? "#4CAF50" : "#f44336",
          }}
        >
          {confirmationMessage}
        </div>
      )}
      <div className="container">
        <br />
        <h2>
          <b>List Your Product</b>
        </h2>
        <hr />
        <form
          autoComplete="off"
          className="form-group"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="product-name">Product Name</label>
          <br />
          <input
            type="text"
            className="form-control"
            required
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <br />
          <label htmlFor="product-description">Description</label>
          <br />
          <input
            type="text"
            className="form-control"
            maxLength={25}
            required
            value={newProductDescription}
            onChange={(e) => setNewProductDescription(e.target.value)}
          />
          <br />
          <label htmlFor="product-price">Price</label>
          <br />
          <input
            type="number"
            className="form-control"
            required
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(Number(e.target.value) || 0)}
          />
          <br />
          <label htmlFor="product-category">Category</label>
          <br />
          <select
            className="form-control"
            required
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
          >
            <option value="" disabled>
              Choose category
            </option>
            <optgroup label="Cars, Motorcycles, and Boats">
              <option>Cars</option>
              <option>Motorcycles</option>
              <option>Boats</option>
              <option>Parts and Accessories</option>
            </optgroup>
            <optgroup label="Real Estate">
              <option>Apartments</option>
              <option>Houses</option>
              <option>Rooms for Rent</option>
              <option>Land and Farms</option>
              <option>Garages and Parking</option>
              <option>Offices and Commercial Spaces</option>
              <option>Warehouses</option>
            </optgroup>
            <optgroup label="Baby and Child">
              <option>Baby Clothes</option>
              <option>Children's Clothes</option>
              <option>Footwear</option>
              <option>Safety and Nursery</option>
              <option>Feeding and Chairs</option>
              <option>Toys and Games</option>
            </optgroup>
            <optgroup label="Leisure">
              <option>Toys and Games</option>
              <option>Musical Instruments</option>
              <option>Books and Magazines</option>
              <option>Sports and Fitness</option>
              <option>Video Games and Consoles</option>
              <option>Movies and Series</option>
            </optgroup>
            <optgroup label="Mobile Phones and Tablets">
              <option>Mobile Phones</option>
              <option>Tablets</option>
              <option>Accessories</option>
              <option>Smartwatches</option>
            </optgroup>
            <optgroup label="Technology">
              <option>Consoles</option>
              <option>Laptops</option>
              <option>Desktop Computers</option>
              <option>Components and Parts</option>
              <option>Photography and Drones</option>
              <option>TV, Audio, and Multimedia</option>
            </optgroup>
            <optgroup label="Furniture, Home, and Garden">
              <option>Furniture</option>
              <option>Decoration</option>
              <option>Home Appliances</option>
              <option>Gardening and Farming</option>
              <option>Pets</option>
              <option>Pet Products</option>
            </optgroup>
            <optgroup label="Jobs">
              <option>Construction</option>
              <option>Health and Beauty</option>
              <option>IT and Programming</option>
              <option>Hospitality and Catering</option>
              <option>Sales and Marketing</option>
              <option>Others</option>
            </optgroup>
            <optgroup label="Services">
              <option>Transportation and Moving</option>
              <option>Lessons and Tutoring</option>
              <option>Consulting and Business</option>
              <option>Event Planning</option>
              <option>Domestic Services</option>
              <option>Other Services</option>
            </optgroup>
            <optgroup label="Others">
              <option>Antiques and Collectibles</option>
              <option>Other Items</option>
            </optgroup>
          </select>
          <br />
          <input
            type="file"
            className="form-control"
            ref={fileInputClear}
            required
            onChange={handleFileChange}
          />
          <br />
          <button className={styles.list_btn} onClick={handleListProduct}>
            List Product
          </button>
        </form>
      </div>
    </div>
  );
};
