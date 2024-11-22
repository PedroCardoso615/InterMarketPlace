import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  doc,
  setDoc,
  increment,
} from "firebase/firestore";
import styles from "../css/Catalog.module.css";

export const Catalog = () => {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // State for category
  const productsPerPage = 8;
  const productsCollectionRef = collection(db, "products");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const getProductList = async () => {
      try {
        const data = await getDocs(productsCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProductList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getProductList();
  }, [productsCollectionRef]);

  // Filter and sort products
  const filteredProducts = [...productList]
    .filter((product) => {
      if (!selectedCategory) return true;
      return product.category === selectedCategory;
    })
    .sort((a, b) => {
      switch (filterOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addToCart = async (product) => {
    const cartDocRef = doc(db, "Cart", product.id);

    try {
      await setDoc(
        cartDocRef,
        {
          ...product,
          qty: increment(1),
          TotalProductPrice: increment(product.price),
        },
        { merge: true }
      );
      setConfirmationMessage("Added to cart successfully!");
      setIsSuccess(true);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setConfirmationMessage("Error adding to the cart.");
      setIsSuccess(false);

      setTimeout(() => {
        setConfirmationMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  return (
    <div>
      <div className={styles.filter_container}>
        <select
          onChange={(e) => setFilterOption(e.target.value)}
          value={filterOption}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>

        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
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
      </div>

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

      <div className={styles.catalog_container}>
        {currentProducts.map((product) => (
          <div key={product.id} className={styles.product_card}>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} />
            )}
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price}€</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className={styles.pagination_bar}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? styles.active : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
