import React from 'react';
import useFirestore from '../hooks/useFirestore';
import Navbar from './Navbar';

function Catalog() {
  const products = useFirestore('products');


  return (
    <div>
        <>
            <Navbar />
        </>
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

export default Catalog;