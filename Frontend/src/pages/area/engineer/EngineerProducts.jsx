import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Form, Alert, Button, Pagination } from 'react-bootstrap' 
import '../../../components/css/Products.css' 
import box from "../../../assets/image/box.png" 
import GearSet from '../../../components/Gear';

export default function EngineerProducts() {
  // Recupera il token di autenticazione una sola volta
  const token = localStorage.getItem("token");

  // --- STATI FORM (Input Utente) ---
  const [productName, setProductName] = useState("");
  const [weight, setWeight] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productCode, setProductCode] = useState("PRD-0001");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // --- STATI LISTA E UI ---
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [msg, setMsg] = useState(null); 
  const [error, setError] = useState(null);

  // --- STATO MODIFICA ---
  // Contiene l'oggetto del prodotto in modifica o null
  const [editingProduct, setEditingProduct] = useState(null); 

  // --- PAGINAZIONE ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // 12 prodotti per pagina
  const maxPagesToShow = 5;   // Numero massimo di bottoni pagina visibili

  // Calcola gli indici di inizio e fine per la paginazione
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Prodotti visualizzati sulla pagina corrente
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

  // Numero totale di pagine
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Funzione per cambiare pagina
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calcolo dei numeri di pagina visibili (logica del "finestrino scorrevole")
  const pageNumbers = useMemo(() => {
    const numbers = [];

    if (totalPages <= 1) {
      return numbers;
    }

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
    } else {
        // Logica per lo scorrimento della finestra (es. 6-10, 11-15, ecc.)
        const startPage = Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
    }

    return numbers;
  }, [totalPages, currentPage]);

  // --- EFFETTI ---
  useEffect(() => {
    fetchProducts();
  }, []);

  // Logica di Ricerca: Filtra i prodotti in tempo reale
  useEffect(() => {
    let filtered;
    if (searchTerm === "") {
      filtered = products;
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(lowerTerm) ||
          p.productCode.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); 
    
  }, [searchTerm, products]); 

  // GESTIONE RESET DEL FORM: Funzione per uscire dalla modalità modifica
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductName("");
    setWeight("");
    setMeasurement("");
    setPrice("");
    setStock("");
    setProductCode("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setMsg(null); 
  };

  // GESTIONE MODIFICA: Pre-popola il form con i dati della card selezionata
  const handleEdit = (product) => {
    setEditingProduct(product);

    // Pre-popola i campi del form
    setProductName(product.productName || "");
    setWeight(product.weight || "");
    setMeasurement(product.measurement || "");
    setPrice(product.price || "");
    setStock(product.stock || "");
    setProductCode(product.productCode || "");
    setDescription(product.description || "");
    setDate(product.insertionDate || new Date().toISOString().split("T")[0]);

    // Scrolla verso il form per avviare la modifica
    const formElement = document.getElementById('product-form-card');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // GESTIONE ELIMINA: Invia la richiesta DELETE all'API (URL AGGIORNATO)
  const handleDelete = async (productId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto? L'operazione è irreversibile.")) return;

    setLoading(true);
    setMsg(null);
    
    // ** CORREZIONE URL: Usa @RequestParam come nel backend **
    const url = `/products/delete?product=${productId}`; 

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) { 
        setMsg({ variant: "success", text: "Prodotto eliminato correttamente." });
        fetchProducts(); 
      } else {
        const text = `Eliminazione fallita! Status: ${res.status}`;
        setMsg({ variant: "danger", text });
      }
    } catch {
      setMsg({ variant: "danger", text: "Errore di rete durante l'eliminazione." });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  // GET: Recupera la lista dei prodotti
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/products?size=1000`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error("Errore nel caricamento prodotti. Accesso negato o server non disponibile.");

      const data = await response.json();

      // 🔥 ORDINA PER CODICE PRODOTTO
      const list = (data.content || []).sort((a, b) => 
        a.productCode.localeCompare(b.productCode, undefined, { numeric: true })
      );

      setProducts(list);
      setFilteredProducts(list);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST/PUT: Invia i dati per creare o modificare un prodotto (URL AGGIORNATO)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    
    // Determina l'ID del prodotto, il metodo (POST/PUT) e l'URL
    const productId = editingProduct ? editingProduct.id_product : null;
    const method = productId ? "PUT" : "POST";
    
    let url;
    let successStatus;

    if (productId) {
        // ** CORREZIONE URL: Usa /update?product={ID} e Status 202 (Accepted) **
        url = `/products/update?product=${productId}`; 
        successStatus = 202; 
    } else {
        url = "/products"; 
        successStatus = 201; 
    }

    // Payload basato sui dati del form
    const payload = {
      productName: productName,
      measurement: measurement,
      description: description,
      productCode: productCode,
      insertionDate: date, 
      weight: weight ? parseFloat(weight) : null,
      price: price ? parseFloat(price) : null,
      stock: stock ? parseInt(stock) : null,
    };

    try {
      const res = await fetch(url, {
        method: method, 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === successStatus) {
        setMsg({ 
          variant: "success", 
          text: productId ? "Prodotto modificato correttamente!" : "Prodotto aggiunto correttamente!" 
        });

        handleCancelEdit(); 
        fetchProducts(); 
        setTimeout(() => setMsg(null), 3000);
      } else {
        const raw = await res.text().catch(() => "");
        let text = `Operazione fallita! Status: ${res.status}`;
        try {
          const data = raw ? JSON.parse(raw) : null;
          if (data?.message) text = data.message; 
          else if (Array.isArray(data)) text = data.join(", "); 
          else if (raw) text = raw; 
        } catch {""}
        setMsg({ variant: "danger", text });
      }
    } catch {
      setMsg({
        variant: "danger",
        text: "Errore di rete o server non raggiungibile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="mx-0 h-100">
      
      {/* --- COLONNA SINISTRA: LISTA --- */}
      <Col xs={{ span: 12, order: 1 }} md={{ span: 12, order: 2 }} lg={{ span: 9,  order: 1 }} xl={{ span: 9,  order: 1 }} xxl={{ span: 9, order: 1 }}>

        <Row className="gy-4 mt-5">
          {/* LOADING SPINNER LISTA */}
          {loading && <div className="justify-content-center d-flex align-items-center w-100" style={{ height: "90vh" }}><GearSet /></div>}

          {/* Mappa solo i prodotti della pagina corrente */}
          {!loading && currentProducts.map((item) => (
            <Col key={item.id_product || item.productCode} xs={12} sm={12} md={6} lg={6} xl={4} xxl={3}>
              <Card className="card-container w-100 p-0 position-relative overflow-hidden" style={{ height: "325px" }}>

                {/* CARD FRONT (visibile di default) */}
                <div className="card-front w-100 h-100 d-flex flex-column justify-content-between">
                  <div style={{ height: "60%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Card.Img variant="top" src={box} style={{ objectFit: "contain" }} />
                  </div>

                  <div className="text-center mb-3">
                    <Card.Title className="fw-bold m-0 text-truncate px-2">{item.productName}</Card.Title>
                    <Card.Text className="m-0">Quantità: {item.stock}</Card.Text>
                    <Card.Text className="small">Codice: {item.productCode}</Card.Text>
                  </div>
                </div>

                {/* CARD BACK (visibile all'hover) */}
                <div className="card-back position-absolute w-100 h-100 p-3 d-flex flex-column justify-content-center align-items-start">
                  <Card.Text><strong>Peso:</strong> {item.weight} kg</Card.Text>
                  <Card.Text><strong>Grandezza:</strong> {item.measurement} cm</Card.Text>
                  <Card.Text><strong>Prezzo:</strong> {item.price}€</Card.Text>
                  <Card.Text><strong>Data:</strong> {item.insertionDate}</Card.Text>
                  <Card.Text className="text-truncate w-100"><strong>Desc.:</strong> {item.description}</Card.Text>

                  <div className="d-flex justify-content-around mt-3 w-100">
                    <Button variant="primary" size="sm" onClick={() => handleEdit(item)} disabled={loading}>Modifica</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id_product)} disabled={loading}>Elimina</Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
          
          {/* MESSAGGIO SE LISTA FILTRATA VUOTA */}
          {!loading && filteredProducts.length === 0 && ( 
            <div className="justify-content-center d-flex align-items-center w-100" style={{ color: "var(--label-color)", height: "90vh"}}>
              <h2>Nessn prodotto trovato</h2>
            </div> 
          )}
        </Row>
        
        {/* --- COMPONENTE PAGINAZIONE --- */}
        {!loading && totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              
              <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

              {/* Ellipsis iniziale */}
              {pageNumbers[0] > 1 && <Pagination.Ellipsis disabled />}

              {/* Mappa i numeri di pagina visibili (finestra di 5) */}
              {pageNumbers.map(number => (
                <Pagination.Item 
                  key={number} 
                  active={number === currentPage} 
                  onClick={() => paginate(number)}
                >
                  {number}
                </Pagination.Item>
              ))}

              {/* Ellipsis finale */}
              {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && <Pagination.Ellipsis disabled />}

              <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </Col>

      {/* --- COLONNA DESTRA: SEARCH & FORM --- */}
      <Col xs={{ span: 12, order: 2 }} md={{ span: 12, order: 1 }} lg={{ span: 3, order: 2 }} xl={{ span: 3, order: 2 }} xxl={{ span: 3, order: 2 }}>
        <Row className='mt-5 gap-3'>
          <Card>
            <Card.Body>
              {/* INPUT RICERCA */}
              <Form className="search-form d-flex align-items-center position-relative" onSubmit={(e) => e.preventDefault()}>
                <button className='border-0 bg-transparent' style={{ color: "#8b8ba7"}}>
                  <svg width="17" height="15" className="mb-1" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth={1.333} strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>

                <input className="input w-100 h-100 border-0" placeholder="Cerca per nome o codice..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                <button className='reset border-0 bg-transparent' style={{ color: "#8b8ba7" }} type="button" onClick={() => setSearchTerm("")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mb-1" width="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </Form>
            </Card.Body>
          </Card>
          
          {/* TITOLO DINAMICO 
          <h2 className='my-5' style={{ color: "var(--label-color)"}}>
            {editingProduct ? `Modifica: ${editingProduct.productName}` : 'Aggiungi un prodotto'}
          </h2> */}
          
          {/* AGGIUNTO ID PER LO SCROLL */}
          <Card id="product-form-card" className="shadow-lg rounded-4" style={{ backgroundColor: "var(--card-bg)", border: "var(--border)" }}>
            <Card.Body className="p-4">
                
              {/* BOTTONE ANNULLA MODIFICA (Mostrato solo se in editing) */}
              {editingProduct && (
                <Button variant="outline-secondary" size="sm" className="mb-3 w-100" onClick={handleCancelEdit}>Annulla Modifica</Button>
              )}
              
              <Form className="form mx-auto d-flex gap-3 flex-column" onSubmit={handleSubmit}>
                
                <span className="input-span">
                  <input type="text" id="product_name" name='product_name' value={productName} onChange={(e) => setProductName(e.target.value)} required />
                  <label htmlFor="product_name" className="label">Nome Prodotto</label>
                </span>

                <span className="input-span">
                  <input type="text" id="measurement" name='measurement' value={measurement} onChange={(e) => setMeasurement(e.target.value)} required />
                  <label htmlFor="measurement" className="label">Grandezza</label>
                </span>

                <span className="input-span">
                  <input type="number" step="0.01" id="weight" name='weight' value={weight} onChange={(e) => setWeight(e.target.value)} required />
                  <label htmlFor="weight" className="label">Peso</label>
                </span>

                <span className="input-span">
                  <input type="number" step="0.01" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  <label htmlFor="price" className="label">Prezzo €</label>
                </span>

                <span className="input-span">
                  <input type="number" id="stock" name="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  <label htmlFor="stock" className="label">Quantità</label>
                </span>

                <span className="input-span">
                  <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  <label htmlFor="description" className="label">Descrizione</label>
                </span>

                <span className="input-span">
                  <input type="text" id="product_code" name="product_code" value={productCode} onChange={(e) => setProductCode(e.target.value)} required />
                  <label htmlFor="product_code" className="label">Codice Prodotto</label>
                </span>

                <span className="input-span">
                  <input type="date" id="date" name="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                  <label htmlFor="date" className="label">Data</label>
                </span>

                {/* PULSANTE SUBMIT DINAMICO: "Salva Modifica" o "Aggiungi" */}
                <input className="submit btn" type="submit" value={loading ? "Salvataggio..." : (editingProduct ? "Salva Modifica" : "Aggiungi")} disabled={loading} />
              </Form>
            </Card.Body>
          </Card>
        </Row>

        <div className="mt-3">
          {/* FEEDBACK ERRORI LISTA */}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {/* MESSAGGIO DI SUCCESSO/ERRORE */}
          {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}
        </div>
      </Col>

    </Row>
  )
}