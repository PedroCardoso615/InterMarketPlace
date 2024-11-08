import React, { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const Listing = () => {

  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductImg, setNewProductImg] = useState(null);

  const productsCollectionRef = collection(db, "products");
  const fileInputClear = useRef(null);

  const handleListProduct = async () => {
    try {
      //Process the image upload
      let imageUrl = "";
      if (newProductImg) {
        const imageFolderRef = ref(storage, `marketFiles/${newProductImg.name}`);
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
      alert("Product listed successfully!");
    } catch(err) {
      console.error(err);
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
    <div className="container">
      <br />
      <h2>
        <b>List Your Product</b>
      </h2>
      <hr />
      <form autoComplete="off" className="form-group" onSubmit={(e) => e.preventDefault()}>
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
          <option value="" disabled>Choose category</option>
          <optgroup label="Carros, Motas e Barcos">
            <option>Carros</option>
            <option>Motas</option>
            <option>Barcos</option>
            <option>Peças e Acessórios</option>
          </optgroup>
          <optgroup label="Imóveis">
            <option>Apartamentos</option>
            <option>Moradias</option>
            <option>Quartos para Alugar</option>
            <option>Terrenos e Quintas</option>
            <option>Garagens e Estacionamento</option>
            <option>Escritórios e Comércio</option>
            <option>Armazéns</option>
          </optgroup>
          <optgroup label="Bebé e Criança">
            <option>Roupas para Bebé</option>
            <option>Roupas para Criança</option>
            <option>Calçado</option>
            <option>Segurança e Puericultura</option>
            <option>Alimentação e Cadeiras</option>
            <option>Brinquedos e Jogos</option>
          </optgroup>
          <optgroup label="Lazer">
            <option>Brinquedos e Jogos</option>
            <option>Instrumentos Musicais</option>
            <option>Livros e Revistas</option>
            <option>Desporto e Fitness</option>
            <option>Videogames e Consolas</option>
            <option>Filmes e Séries</option>
          </optgroup>
          <optgroup label="Telemóveis e Tablets">
            <option>Telemóveis</option>
            <option>Tablets</option>
            <option>Acessórios</option>
            <option>Smartwatches</option>
          </optgroup>
          <optgroup label="Tecnologia">
            <option>Consolas</option>
            <option>Computadores Portáteis</option>
            <option>Computadores de Secretária</option>
            <option>Componentes e Peças</option>
            <option>Fotografia e Drones</option>
            <option>TV, Som e Multimédia</option>
          </optgroup>
          <optgroup label="Móveis, Casa e Jardim">
            <option>Móveis</option>
            <option>Decoração</option>
            <option>Electrodomésticos</option>
            <option>Jardinagem e Agricultura</option>
            <option>Animais de Estimação</option>
            <option>Produtos para Animais</option>
          </optgroup>
          <optgroup label="Emprego">
            <option>Construção Civil</option>
            <option>Saúde e Beleza</option>
            <option>Informática e Programação</option>
            <option>Hotelaria e Restauração</option>
            <option>Comercial e Vendas</option>
            <option>Outros</option>
          </optgroup>
          <optgroup label="Serviços">
            <option>Transporte e Mudanças</option>
            <option>Aulas e Explicações</option>
            <option>Consultoria e Negócios</option>
            <option>Organização de Eventos</option>
            <option>Serviços Domésticos</option>
            <option>Outros Serviços</option>
          </optgroup>
          <optgroup label="Outros">
            <option>Antiguidades e Coleções</option>
            <option>Outros Artigos</option>
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
        <button className="btn btn-success butn-md list-btn" onClick={handleListProduct}>List Product</button>
      </form>
    </div>
  );
};