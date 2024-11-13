import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import styles from "../css/Cart.module.css";

export const IndividualCartProduct = ({
  product,
  increaseQty,
  decreaseQty,
  removeProduct,
}) => {
  return (
    <div className={styles.product}>
      <div className={styles.product_img}>
        <img src={product.imageUrl} alt="product-img" />
      </div>
      <div className={styles.product_details}>
        <h2>{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>Quantity: {product.qty}</p>
        <div className={styles.quantity_controls}>
          <button onClick={() => decreaseQty(product)}>
            <Icon icon={minus} />
          </button>
          <button onClick={() => increaseQty(product)}>
            <Icon icon={plus} />
          </button>
        </div>
        <button
          onClick={() => removeProduct(product.id)}
          className={styles.rm_button}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
