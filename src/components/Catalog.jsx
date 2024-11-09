// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { getDocs, collection } from 'firebase/firestore';
// import styles from '../css/Catalog.module.css';


// function Catalog() {
//   const [productList, setProductList] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
 
//   const productsPerPage = 8;
//   const productsCollectionRef = collection(db, "products");

//   useEffect(() => {
//     const getProductList = async () => {
//       try {
//         const data = await getDocs(productsCollectionRef);
//         const filteredData = data.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id
//         }));
//         setProductList(filteredData);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     getProductList();
//   }, [productsCollectionRef]);

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);

//   // Calculate total pages
//   const totalPages = Math.ceil(productList.length / productsPerPage);

//   // Handle page navigation
//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div>
//       <div className={styles.catalog_container}>
//         {currentProducts.map((product) => (
//           <div key={product.id} className={styles.product_card}>
//             {product.imageUrl && (
//               <img src={product.imageUrl} alt={product.name} />
//             )}
//             <h1>{product.name}</h1>
//             <p>{product.description}</p>
//             <p>{product.price}€</p>
//             <button>Add to Cart</button>
//           </div>
//         ))}
//       </div>

//       <div className={styles.pagination_bar}>
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index + 1}
//             onClick={() => goToPage(index + 1)}
//             className={currentPage === index + 1 ? styles.active : ''}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Catalog;


import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import styles from '../css/Catalog.module.css';

function Catalog() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(''); // Sorting criteria
  const [filterCategory, setFilterCategory] = useState(''); // Category filter

  const productsPerPage = 8;
  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const getProductList = async () => {
      try {
        const data = await getDocs(productsCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setProductList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getProductList();
  }, [productsCollectionRef]);

  // Sort products based on selected sort option
  const sortedProducts = [...productList]
    .filter((product) => !filterCategory || product.category === filterCategory) // Apply category filter if selected
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Filter and Sort Options */}
      <div className={styles.filter_sort_container}>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Display Products */}
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

      {/* Pagination Bar */}
      <div className={styles.pagination_bar}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
