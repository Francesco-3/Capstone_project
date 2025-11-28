import { useState, useEffect } from "react";
import { Card, Col, Row, Alert, ListGroup, Badge, Form, Button } from "react-bootstrap";
import '../../../components/css/Sections.css';

const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        // Sostituisce caratteri non-base64 standard
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decodifica base64 e JSON
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        // Restituisce l'ID. Adatta la chiave ('id_user', 'sub', etc.) alla struttura reale del tuo token.
        return payload.id_user || payload.sub || null; 
    } catch (e) {
        console.error("Errore decodifica token:", e);
        return null;
    }
};

export default function SectionB() {
    const token = localStorage.getItem("token");

    // --- Stati Rack/Shelf/Prodotti ---
    const [racks, setRacks] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [shelfs, setShelfs] = useState([]);
    const [selectedShelf, setSelectedShelf] = useState(null);
    // Lo stato 'products' ora contiene oggetti di tipo Collocation mappati
    const [products, setProducts] = useState([]); 

    // --- Stati Form Carico ---
    const [formLoad, setFormLoad] = useState({ id_product: "", productCode: "", quantity: "", notes: "" });
    const [productSearchTermLoad, setProductSearchTermLoad] = useState("");
    const [productSuggestionsLoad, setProductSuggestionsLoad] = useState([]);
    const [submitErrorLoad, setSubmitErrorLoad] = useState(null);
    const [submitSuccessLoad, setSubmitSuccessLoad] = useState(null);
    const [isSubmittingLoad, setIsSubmittingLoad] = useState(false);

    // --- Stati Form Scarico ---
    // Stato per la quantità massima disponibile del prodotto selezionato
    const [maxQuantityUnload, setMaxQuantityUnload] = useState(0); 
    const [formUnload, setFormUnload] = useState({ id_product: "", productCode: "", quantity: "", notes: "" });
    const [submitErrorUnload, setSubmitErrorUnload] = useState(null);
    const [submitSuccessUnload, setSubmitSuccessUnload] = useState(null);
    const [isSubmittingUnload, setIsSubmittingUnload] = useState(false);

    // --- UI ---
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);

    // --- Gestori di cambio input per i form ---
    const handleLoadChange = (e) => {
        const { name, value } = e.target;
        setFormLoad({ ...formLoad, [name]: value });
    };

    const handleUnloadChange = (e) => {
        const { name, value } = e.target;
        setSubmitErrorUnload(null); // Pulisci errore al cambio

        if (name === 'id_product') {
            const selectedProduct = products.find(p => p.id_product === value);
            if (selectedProduct) {
                // Aggiorna la quantità massima disponibile quando l'utente seleziona un prodotto
                setMaxQuantityUnload(selectedProduct.quantityAvailable);
                setFormUnload(prev => ({ 
                    ...prev, 
                    id_product: value, 
                    productCode: selectedProduct.productCode,
                    // Resetta la quantità se non è valida dopo il cambio prodotto
                    quantity: "" 
                }));
            } else {
                setMaxQuantityUnload(0);
                setFormUnload(prev => ({ ...prev, id_product: value, productCode: "" }));
            }
        } else {
            setFormUnload(prev => ({ ...prev, [name]: value }));
        }
    };

    // Funzione di pulizia del form e degli stati di submit
    const resetFormLoad = () => {
        setFormLoad({ id_product: "", productCode: "", quantity: "", notes: "" });
        setProductSearchTermLoad("");
        setProductSuggestionsLoad([]);
        setTimeout(() => setSubmitSuccessLoad(null), 3000);
    };

    const resetFormUnload = () => {
        setFormUnload({ id_product: "", productCode: "", quantity: "", notes: "" });
        setMaxQuantityUnload(0);
        setTimeout(() => setSubmitSuccessUnload(null), 3000);
    };

    // --- Fetch Sezione B ---
    useEffect(() => {
        loadSectionBRacks();
    }, []);

    const fetchSectionBId = async () => {
        const res = await fetch("/sections/by-code?sectionCode=S_B", {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Errore nel recupero sezione A");
        const data = await res.json();
        return data.id_section;
    };

    const loadSectionBRacks = async () => {
        try {
            setLoading(true);
            const sectionBId = await fetchSectionBId();

            const res = await fetch(`/racks/by-section?sectionId=${sectionBId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Errore nel recupero racks");
            const list = await res.json();
            const sorted = list.sort((a, b) => (a.rackCode || "").localeCompare(b.rackCode || "", undefined, { numeric: true }));
            setRacks(sorted);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadShelvesForRack = async (rackId) => {
        try {
            setSelectedRack(rackId);
            setSelectedShelf(null);
            setProducts([]); // Resetta i prodotti quando cambia lo scaffale
            resetFormUnload(); // Resetta il form di Scarico
            resetFormLoad(); // Resetta il form di Carico

            const res = await fetch(`/shelfs/by-rack?rackId=${rackId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Errore nel recupero degli shelf");
            const data = await res.json();
            console.log("Shelfs fetched:", data);
            const sorted = data.sort((a, b) => a.shelfNumber - b.shelfNumber);
            setShelfs(sorted);

        } catch (err) {
            setError(err.message);
        }
    };

    // FUNZIONE PER CARICARE I PRODOTTI COLLOCATI NEL RIPANO
    const loadProductsForShelf = async (shelfId) => {
        try {
            setSelectedShelf(shelfId);
            setLoadingProducts(true);
            setProducts([]); // Resetta i prodotti prima di caricarne di nuovi
            resetFormUnload(); // Resetta il form di Scarico

            // Usa l'endpoint /collocations/by-shelf
            const res = await fetch(`/collocations/by-shelf?shelf=${shelfId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Errore nel recupero prodotti collocati");
            
            const pageData = await res.json();
            
            // Mappa i dati della Collocation in un formato più semplice per la UI
            const mappedProducts = pageData.content.map(collocation => ({
                id_collocation: collocation.id_collocation, 
                id_product: collocation.productId.id_product,
                productCode: collocation.productId.productCode,
                productName: collocation.productId.productName,
                // Aggiungiamo la quantità disponibile come 'quantityAvailable'
                quantityAvailable: collocation.quantity, 
            }));
            
            setProducts(mappedProducts);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    // --- Autocomplete prodotti (SOLO PER CARICO) ---
    useEffect(() => {
        const fetchProducts = async () => {
            if (!productSearchTermLoad) return; 

            try {
                const res = await fetch(`/products?size=1000`, { 
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "application/json" 
                    },
                });

                if (!res.ok) throw new Error("Errore caricamento prodotti");

                const list = await res.json();
                
                const allProducts = list.content || []; 

                if (productSearchTermLoad) {
                    const lower = productSearchTermLoad.toLowerCase();
                    setProductSuggestionsLoad(
                        allProducts.filter(p => 
                            p.productName.toLowerCase().includes(lower) || 
                            p.productCode.toLowerCase().includes(lower)
                        )
                    );
                }
            } catch (error) { 
                console.error(error); 
            }
        };
        fetchProducts();
    }, [productSearchTermLoad, token]); 

    // --- Logica di Submit del Movimento (AGGIORNATA PER GESTIRE IL RELOAD) ---
    const executeMovement = async (payload, type) => {
        const isLoad = type === 'load';

        try {
            isLoad ? setIsSubmittingLoad(true) : setIsSubmittingUnload(true);
            isLoad ? setSubmitErrorLoad(null) : setSubmitErrorUnload(null);
            isLoad ? setSubmitSuccessLoad(null) : setSubmitSuccessUnload(null);

            const res = await fetch("/movements", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // Cattura l'errore del backend (es. BadRequestException con messaggio specifico)
                const errorData = await res.json();
                throw new Error(errorData.message || `Errore sconosciuto nel movimento di ${type}. Status: ${res.status}`);
            }

            // Movimento riuscito (Status 201 Created)
            isLoad
                ? setSubmitSuccessLoad("Movimento effettuato con successo!")
                : setSubmitSuccessUnload("Movimento effettuato con successo!");

            isLoad ? resetFormLoad() : resetFormUnload();

            // *** LOGICA CRITICA: RICARICA LA LISTA DEI PRODOTTI ***
            // Questo assicura che il badge e la lista prodotti mostrino la quantità aggiornata (o la rimozione).
            if (selectedShelf) {
                // Usiamo await per assicurarci che il ricaricamento finisca prima di sbloccare il pulsante
                await loadProductsForShelf(selectedShelf); 
            }

        } catch (err) {
            // Mostra il messaggio di errore specifico, compreso quello sulla quantità insufficiente
            isLoad
                ? setSubmitErrorLoad(err.message)
                : setSubmitErrorUnload(err.message);
        } finally {
            isLoad
                ? setIsSubmittingLoad(false)
                : setIsSubmittingUnload(false);
        }
    };

    // --- Submit Carico ---
    const handleLoadSubmit = async (e) => {
        e.preventDefault();

        const id_user_raw = getUserIdFromToken(token);
        const id_product_raw = formLoad.id_product;
        // Assumiamo che il backend gestisca l'inserimento della data/ora del movimento
        const date_string = new Date().toISOString().split('T')[0]; 

        if (!selectedShelf || !id_user_raw || !id_product_raw || !date_string || !formLoad.quantity) {
            setSubmitErrorLoad("Devi selezionare un Ripiano, un Prodotto e specificare la Quantità.");
            return;
        }

        const payload = {
            userId: id_user_raw,
            productId: id_product_raw,
            shelfId: selectedShelf,
            // palletId lasciato a null se non usato
            date_time: date_string, 
            movementType: 'INBOUND',
            quantity: parseInt(formLoad.quantity),
            notes: formLoad.notes,
        };

        console.log("Payload Carico:", payload);
        await executeMovement(payload, 'load');
    };

    // --- Submit Scarico ---
    const handleUnloadSubmit = async (e) => {
        e.preventDefault();

        const id_user_raw = getUserIdFromToken(token);
        const id_product_raw = formUnload.id_product;
        const date_string = new Date().toISOString().split('T')[0];
        const requestedQuantity = parseInt(formUnload.quantity);

        if (!selectedShelf || !id_user_raw || !id_product_raw || !date_string || !requestedQuantity) {
            setSubmitErrorUnload("Devi selezionare un Ripiano, un Prodotto e specificare la Quantità.");
            return;
        }
        
        // VALIDAZIONE FRONTEND (safety check, la vera validazione è sul backend)
        if (requestedQuantity > maxQuantityUnload) {
            setSubmitErrorUnload(`Impossibile scaricare ${requestedQuantity} unità. Disponibilità massima: ${maxQuantityUnload}.`);
            return;
        }

        const payload = {
            userId: id_user_raw,
            productId: id_product_raw,
            shelfId: selectedShelf,
            // palletId lasciato a null se non usato
            date_time: date_string,
            movementType: 'OUTBOUND',
            quantity: requestedQuantity,
            notes: formUnload.notes,
        };

        console.log("Payload Scarico:", payload);
        await executeMovement(payload, 'unload');
    };


    return (
        <Row>
            <Col xxl={8} className="mb-4">
                <Card className="h-100">
                    <Card.Header as="h5">📦 Racks Sezione A</Card.Header>
                    <Row className="g-0">
                        {/* LISTA RACKS */}
                        <Col xs={2}>
                            <ListGroup style={{ maxHeight: "500px", overflowY: "auto"}}>
                                {!loading && racks.length === 0 && <p className="text-center py-3">Nessuna rack trovata</p>}

                                {!loading && racks.map(rack => (
                                    <ListGroup.Item key={rack.id_rack} action active={selectedRack === rack.id_rack} onClick={() => loadShelvesForRack(rack.id_rack)}>
                                        <strong>{rack.rackCode}</strong>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        {/* DETTAGLI SCAFFALE E PRODOTTI */}
                        <Col xs={10}>
                            <div className="shadow-sm p-2 border-bottom">
                                <h6 className="mb-1 fw-bold">{racks.find(r => r.id_rack === selectedRack)?.rackCode || 'Seleziona Scaffale'}</h6>
                                <small className="text-muted d-block mb-2">Seleziona il ripiano per visualizzare i prodotti</small>
                                {selectedRack && (
                                    <div>
                                        <div className="d-flex gap-3 mb-4 flex-wrap">
                                            {shelfs.map(shelf => (
                                                <button 
                                                    key={shelf.id_shelf} 
                                                    className={`btn ${selectedShelf === shelf.id_shelf ? "btn-primary" : "btn-outline-secondary"}`} 
                                                    onClick={() => loadProductsForShelf(shelf.id_shelf)}
                                                >
                                                    Ripiano {shelf.shelfNumber}
                                                    {/* LOGICA DEL BADGE CORRETTA */}
                                                    <Badge bg="secondary" className="ms-2">
                                                        {selectedShelf === shelf.id_shelf ? products.length : 0}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>

                                        {!loadingProducts && selectedShelf && products.length === 0 && (
                                            <Card className="text-center py-5 mx-3 box border-0">
                                                <Card.Text className="mb-0 text-muted">Nessun prodotto sul ripiano selezionato.</Card.Text>
                                                <small className="text-info mt-2">Usa il modulo di Carico per aggiungere articoli.</small>
                                            </Card>
                                        )}
                                        {loadingProducts && <p className="text-center py-5">Caricamento prodotti...</p>}

                                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                        {!loadingProducts && products.map(prod => (
                                            <Card key={prod.id_product} className="mb-3 shadow-sm">
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5>{prod.productName}</h5>
                                                        <small>Codice: {prod.productCode}</small>
                                                    </div>

                                                    <Badge bg="primary" pill style={{ fontSize: "1rem" }}>
                                                        Qtà: {prod.quantityAvailable}
                                                    </Badge>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>

            <Col md={4}>
                <Row>
                    {/* FORM CARICO */}
                    <Card className="shadow mb-4">
                        <Card.Header as="h5" className="bg-success text-white">➕ Carico Prodotto</Card.Header>
                        {submitErrorLoad && <Alert variant="danger">{submitErrorLoad}</Alert>}
                        {submitSuccessLoad && <Alert variant="success">{submitSuccessLoad}</Alert>}
                        <Card.Body>
                            <Form onSubmit={handleLoadSubmit}>
                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label>Prodotto / Codice</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Digita codice o nome" 
                                        value={productSearchTermLoad} 
                                        onChange={e => { 
                                            const value = e.target.value; 
                                            setProductSearchTermLoad(value);
                                            setFormLoad({ ...formLoad, productCode: value }); 
                                        }}
                                    />

                                    {productSuggestionsLoad.length > 0 && productSearchTermLoad && (
                                        <ListGroup className="position-absolute w-100 shadow-sm" style={{ zIndex: 999 }}>
                                            {productSuggestionsLoad.map(p => (
                                                <ListGroup.Item key={`${p.id_product}-${p.productCode}`} action onClick={() => { setFormLoad({ ...formLoad, productCode: p.productCode, id_product: p.id_product }); setProductSearchTermLoad(p.productName); setProductSuggestionsLoad([]); }}>
                                                    <strong>{p.productCode}</strong> — {p.productName}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}
                                    {formLoad.productCode && <small className="text-success mt-1 d-block">Codice selezionato: {formLoad.productCode}</small>}
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Rack (*)</Form.Label>
                                            <Form.Control type="text" readOnly value={racks.find(r => r.id_rack === selectedRack)?.rackCode || ""} placeholder="Seleziona rack a sinistra" isInvalid={!selectedRack} />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                        <Form.Label>Ripiano (*)</Form.Label>
                                        <Form.Control type="text" readOnly value={selectedShelf ? shelfs.find(s => s.id_shelf === selectedShelf)?.shelfNumber : ""} placeholder="Seleziona ripiano a sinistra" isInvalid={!selectedShelf} />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Quantità (*)</Form.Label>
                                            <Form.Control type="number" name="quantity" min="1" value={formLoad.quantity} onChange={handleLoadChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Note (opzionale)</Form.Label>
                                    <Form.Control type="text" name="notes" value={formLoad.notes} onChange={handleLoadChange} />
                                </Form.Group>

                                <Button variant="success" type="submit" className="w-100" disabled={isSubmittingLoad || !selectedRack || !selectedShelf || !formLoad.id_product || !formLoad.quantity}>
                                    {isSubmittingLoad ? 'Caricamento...' : 'Aggiungi a Scaffale'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* FORM SCARICO */}
                    <Card className="shadow mb-4">
                        <Card.Header as="h5" className="bg-primary text-white">➖ Prelevamento Prodotto</Card.Header>
                        <Card.Body>
                            {submitErrorUnload && <Alert variant="danger">{submitErrorUnload}</Alert>}
                            {submitSuccessUnload && <Alert variant="success">{submitSuccessUnload}</Alert>}

                            <Form onSubmit={handleUnloadSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prodotto da Scaricare (*)</Form.Label>
                                    <Form.Select 
                                        name="id_product" 
                                        value={formUnload.id_product} 
                                        onChange={handleUnloadChange} 
                                        required
                                        disabled={!selectedShelf || products.length === 0}
                                    >
                                        <option value="">Seleziona un prodotto...</option>
                                        {/* Popola il Select solo con i prodotti del ripiano selezionato */}
                                        {products.map(p => (
                                            <option key={p.id_product} value={p.id_product}>
                                                {p.productCode} - {p.productName} (Qtà disp: {p.quantityAvailable})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {formUnload.productCode && <small className="text-success mt-1 d-block">Codice selezionato: {formUnload.productCode}</small>}
                                    {maxQuantityUnload > 0 && formUnload.id_product && <small className="text-info mt-1 d-block">Massima quantità scaricabile: {maxQuantityUnload}</small>}
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Rack (*)</Form.Label>
                                            <Form.Control type="text" readOnly value={racks.find(r => r.id_rack === selectedRack)?.rackCode || ""} placeholder="Seleziona rack a sinistra" isInvalid={!selectedRack} />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Ripiano (*)</Form.Label>
                                            <Form.Control type="text" readOnly value={selectedShelf ? shelfs.find(s => s.id_shelf === selectedShelf)?.shelfNumber : ""} placeholder="Seleziona ripiano a sinistra" isInvalid={!selectedShelf} />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Quantità (*)</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                name="quantity" 
                                                min="1" 
                                                // Max è la quantità disponibile
                                                max={maxQuantityUnload} 
                                                value={formUnload.quantity} 
                                                onChange={handleUnloadChange} 
                                                required 
                                                disabled={!formUnload.id_product}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Note (opzionale)</Form.Label>
                                    <Form.Control type="text" name="notes" value={formUnload.notes} onChange={handleUnloadChange} />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" disabled={isSubmittingUnload || !selectedRack || !selectedShelf || !formUnload.id_product || !formUnload.quantity || formUnload.quantity > maxQuantityUnload}>
                                    {isSubmittingUnload ? 'Prelevamento in corso...' : 'Scarica per Manutenzione'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Col>
        </Row>
    );
}