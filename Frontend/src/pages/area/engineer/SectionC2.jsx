import { useState, useEffect } from "react";
import { Card, Col, Row, Alert, ListGroup, Badge, Form, Button } from "react-bootstrap";
import '../../../components/css/Sections.css';

export default function SectionA() {
    const token = localStorage.getItem("token");

    // --- Stati Rack/Shelf/Prodotti ---
    const [racks, setRacks] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [shelfs, setShelfs] = useState([]);
    const [selectedShelf, setSelectedShelf] = useState(null);
    // Lo stato 'products' ora contiene oggetti di tipo Collocation mappati
    const [products, setProducts] = useState([]); 

    // --- UI ---
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);

    // --- Fetch Sezione C ---
    useEffect(() => {
        loadSectionCRacks();
    }, []);

    const fetchSectionCId = async () => {
        const res = await fetch("/sections/by-code?sectionCode=S_C", {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Errore nel recupero sezione C");
        const data = await res.json();
        return data.id_section;
    };

    const loadSectionCRacks = async () => {
        try {
            setLoading(true);
            const sectionCId = await fetchSectionCId();

            const res = await fetch(`/racks/by-section?sectionId=${sectionCId}`, {
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

    return (
        <Row>
            <Col xxl={12} className="mb-4">
                <Card className="h-100">
                    <Card.Header as="h5">📦 Racks Sezione C</Card.Header>
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
        </Row>
    );
}