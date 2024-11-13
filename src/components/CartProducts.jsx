import React from "react";
import { IndividualCartProduct } from "./IndividualCartProduct";

export const CartProducts = ({
  cartProducts,
  increaseQty,
  decreaseQty,
  removeProduct,
}) => {
  return cartProducts.map((product) => (
    <IndividualCartProduct
      key={product.id}
      product={product}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      removeProduct={removeProduct}
    />
  ));
};
