import { useState, useEffect } from 'react';
import { collection, onSnapshot, query} from 'firebase/firestore';

import db from './firebase';

import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  const productsCollectionRef = collection(db, 'products');

  // One Time get function (needs refresh)
  // useEffect(() => {
  //   const getproducts = async () => {
  //     const querySnapshot = await getDocs(productsCollectionRef);

  //     const items = [];
  //     querySnapshot.forEach((doc) => {
  //       items.push(doc.data());
  //     });
  //     setproducts(items);
  //   };
  //   getproducts();
  // }, []);


  // Real Time Get Function
  useEffect (() => {
    const unsubscribe = onSnapshot(
      query(productsCollectionRef),
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setProducts(items);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [productsCollectionRef]);


  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} - {product.hasPic ? 'Has a Picture' : 'No Picture'} - {product.yearPro}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
