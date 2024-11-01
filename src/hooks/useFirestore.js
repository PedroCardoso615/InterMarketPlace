import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import {db} from '../firebase';

export default function useFirestore(collectionName) {
    const [products, setProducts] = useState([]);

    const collectionRef = collection(db, collectionName);

    useEffect (() => {
        const unsubscribe = onSnapshot(
          query(collectionRef),
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
      }, [collectionRef]);

    return [products, setProducts];
}