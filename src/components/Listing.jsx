import React, { useState } from "react";
// import { getStorage } from "firebase/storage";
// import db from "../firebase";

import { storage, db } from "../firebase";

export const Listing = () => {

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productCategory, setProductCategory] = useState('');
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState('');

  const types = ['image/png', 'image/jpeg'];

  const productImgHandler = (e) => {
    let selectedFile = e.target.files[0];
    if(selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError('');
    }
    else {
      setProductImg(null);
      setError('Please select a valid image format (PNG or JPEG)');
    }
  }

  const addProduct = (e) => {
    e.preventDefault();
    // console.log(productName, productDescription, productPrice, productCategory, productImg);
    const uploadTask = storage.ref(`product-images/${productImg.name}`).put(productImg);
    uploadTask.on('state-changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
    }, err => {
      setError(err.message)
    }, () => {
      storage.ref('product-images').child(productImg.name).getDownloadURL().then(url => {
        db.collection('Products').add({
          productName: productName,
          productDescription: productDescription,
          productCategory: productCategory,
          productPrice: Number(productPrice),
          productImg: url
        }).then(() => {
          setProductName('');
          setProductDescription('');
          setProductCategory('');
          setProductPrice(0);
          setProductImg('');
          setError('');
          document.getElementById('file').value = '';
        }).catch(err=>setError(err.message));
      })
    })
  }

  return (
    <div className="container">
      <br />
      <h2>
        <b>List Your Product</b>
      </h2>
      <hr />
      <form autoComplete="off" className="form-group" onSubmit={addProduct}>
        <label htmlFor="product-name">Product Name</label>
        <br />
        <input 
        type="text" 
        className="form-control" 
        required 
        onChange={(e)=>setProductName(e.target.value)} 
        value={productName}
        />
        <br />
        <label htmlFor="product-description">Description</label>
        <br />
        <input 
        type="text" 
        className="form-control" 
        required 
        onChange={(e)=>setProductDescription(e.target.value)} 
        value={productDescription}
        />
        <br />
        <label htmlFor="product-price">Price</label>
        <br />
        <input 
        type="number" 
        className="form-control" 
        required 
        onChange={(e)=>setProductPrice(e.target.value)} 
        value={productPrice}
        />
        <br />
        <label htmlFor="product-category">Category</label>
        <br />
        <select 
        className="form-control"
        required
        onChange={(e) => setProductCategory(e.target.value)}
        value={productCategory}
        >
          <option value='' disabled>Choose category</option>
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
        id="file"  
        required 
        onChange={productImgHandler}
        />
        {error && <span>{error}</span>}
        <br />
        <br />
        <button className="btn btn-success butn-md list-btn">List Product</button>
      </form>
    </div>
  );
}

export default Listing;
