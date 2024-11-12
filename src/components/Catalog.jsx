import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import styles from "../css/Catalog.module.css";

export const Catalog = () => {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setilterOption] = useState("");

  const productsPerPage = 8; //Display only 8 products per page
  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const getProductList = async () => {
      // Get products from firebase
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

  // Sorting products
  const filteredProducts = [...productList].sort((a, b) => {
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

  // Pagination
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

  return (
    <div>
      <div className={styles.filter_container}>
        <select
          onChange={(e) => setilterOption(e.target.value)}
          value={filterOption}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <div className={styles.catalog_container}>
        {currentProducts.map((product) => (
          <div key={product.id} className={styles.product_card}>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} />
            )}
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price}€</p>
            <button>Add to Cart</button>
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
