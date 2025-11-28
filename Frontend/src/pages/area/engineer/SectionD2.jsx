import { useState, useEffect } from "react";
import { Card, Col, Row, Alert, ListGroup, Badge, Form, Button } from "react-bootstrap";
import '../../../components/css/Sections.css';

export default function SectionD() {
    const token = localStorage.getItem("token");

    // --- Stati Pallet/Prodotti ---
    const [pallets, setPallets] = useState([]);
    const [selectedPallet, setSelectedPallet] = useState(null);
    const [products, setProducts] = useState([]); 

    // --- UI ---
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);

    // --- Fetch Pallets Sezione D ---
    useEffect(() => {
        loadSectionDPallets();
    }, []);

    const fetchSectionDId = async () => {
        const res = await fetch("/sections/by-code?sectionCode=S_D", {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Errore nel recupero sezione D");
        const data = await res.json();
        return data.id_section;
    };

    const loadSectionDPallets = async () => {
        try {
            setLoading(true);
            const sectionDId = await fetchSectionDId();

            const res = await fetch(`/pallets/by-section?sectionId=${sectionDId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Errore nel recupero pallets");
            const list = await res.json();
            const sorted = list.sort((a, b) => (a.palletCode || "").localeCompare(b.palletCode || "", undefined, { numeric: true }));
            setPallets(sorted);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // FUNZIONE PER CARICARE I PRODOTTI COLLOCATI NEL PALLET (rinominata per chiarezza)
    const loadProductsForPallet = async (palletId) => {
        try {
            setSelectedPallet(palletId);
            setLoadingProducts(true);
            setProducts([]);

            // Usa l'endpoint /collocations/by-pallet
            const res = await fetch(`/collocations/by-pallet?pallet=${palletId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Errore nel recupero prodotti collocati");
            
            const pageData = await res.json();

            const mappedProducts = pageData.content.map(collocation => ({
                id_collocation: collocation.id_collocation, 
                id_product: collocation.productId.id_product,
                productCode: collocation.productId.productCode,
                productName: collocation.productId.productName,
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
                    {/* TITOLO AGGIORNATO */}
                    <Card.Header as="h5">📦 Pallets Sezione D</Card.Header>
                    <Row className="g-0">
                        {/* LISTA PALLETS */}
                        <Col xs={2}>
                            <ListGroup style={{ maxHeight: "500px", overflowY: "auto"}}>
                                {!loading && pallets.length === 0 && <p className="text-center py-3">Nessun pallet trovato</p>}

                                {!loading && pallets.map(pallet => (
                                    <ListGroup.Item key={pallet.id_pallet} action active={selectedPallet === pallet.id_pallet} onClick={() => loadProductsForPallet(pallet.id_pallet)}>
                                        <strong>{pallet.palletCode}</strong>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        {/* DETTAGLI PALLET E PRODOTTI */}
                        <Col xs={10}>
                            <div className="shadow-sm p-2 border-bottom">
                                <h6 className="mb-1 fw-bold">{pallets.find(p => p.id_pallet === selectedPallet)?.palletCode || 'Seleziona Pallet'}</h6>
                                <small className="text-muted d-block mb-2">Seleziona il pallet per visualizzare i prodotti</small>
                                {selectedPallet && (
                                    <div>
                                        <div className="d-flex gap-3 mb-4 flex-wrap">
                                            {pallets.map(pallet => (
                                                <button 
                                                    key={pallet.id_pallet} 
                                                    className={`btn ${selectedPallet === pallet.id_pallet ? "btn-primary" : "btn-outline-secondary"}`} 
                                                    onClick={() => loadProductsForPallet(pallet.id_pallet)}
                                                >
                                                    {/* ETICHETTA AGGIORNATA */}
                                                    Pallet {pallet.palletCode}
                                                    {/* LOGICA DEL BADGE CORRETTA */}
                                                    <Badge bg="secondary" className="ms-2">
                                                        {selectedPallet === pallet.id_pallet ? products.length : 0}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>

                                        {!loadingProducts && selectedPallet && products.length === 0 && (
                                            <Card className="text-center py-5 mx-3 box border-0">
                                                <Card.Text className="mb-0 text-muted">Nessun prodotto sul pallet selezionato.</Card.Text>
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