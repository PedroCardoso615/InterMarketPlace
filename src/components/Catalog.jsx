import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getDocs, collection, deleteDoc, doc, } from 'firebase/firestore';


function Catalog() {

  const [productList, setProductList] = useState([]);

  const productsCollectionRef = collection(db, "products");

  useEffect (() => {
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

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
  };

  return (
    <div>
      {productList.map((product) => (
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>{product.price}€</p>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
      ))}
    </div>
  );
}

export default Catalog;