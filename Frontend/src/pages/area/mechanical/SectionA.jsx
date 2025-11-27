import { useState, useEffect } from "react";
import { Card, Col, Row, Alert, ListGroup, Badge, Form, Button } from "react-bootstrap";
import GearSet from "../../../components/Gear";
import '../../../components/css/Sections.css';

export default function SectionA() {
    const token = localStorage.getItem("token");

    // RACKS
    const [racks, setRacks] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);

    // SHELFS
    const [shelves, setShelves] = useState([]);
    const [selectedShelf, setSelectedShelf] = useState(null);

    // PRODUCTS
    const [products, setProducts] = useState([]);

    // UI
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);


    // CARICO LE RACK DELLA SEZIONE A
    useEffect(() => {
        loadSectionARacks();
    }, []);

    const fetchSectionAId = async () => {
        const res = await fetch("/sections/by-code?sectionCode=S_A", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Errore nel recupero sezione A");

        const data = await res.json();
        return data.id_section; // UUID
    };

    const loadSectionARacks = async () => {
        try {
            setLoading(true);

            const sectionAId = await fetchSectionAId();

            const res = await fetch(`/racks/by-section?sectionId=${sectionAId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Errore nel recupero racks");

            const list = await res.json();

            const sorted = list.sort((a, b) =>
                (a.rackCode || "").localeCompare(b.rackCode || "", undefined, { numeric: true })
            );

            setRacks(sorted);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // QUANDO CLICCO SU UNA RACK → CARICO GLI SHELF
    const loadShelvesForRack = async (rackId) => {
        try {
            setSelectedRack(rackId);
            setSelectedShelf(null);
            setProducts([]);

            const res = await fetch(`/shelfs/by-rack?rackId=${rackId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Errore nel recupero degli shelf");

            const data = await res.json();

            // ordina per numero shelf
            const sorted = data.sort((a, b) => a.shelf_number - b.shelf_number);

            setShelves(sorted);
        } catch (err) {
            setError(err.message);
        }
    };


    // QUANDO CLICCO SULLO SHELF → CARICO PRODOTTI
    const loadProductsForShelf = async (shelfId) => {
        try {
            setSelectedShelf(shelfId);
            setLoadingProducts(true);

            const res = await fetch(`/collocations/products-by-shelf?shelfId=${shelfId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Errore nel recupero prodotti");

            const list = await res.json();
            setProducts(list);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    return (
        <Row>
            <Col xxl={8} className="mb-4">
                <Card className="h-100">
                    <Card.Header as="h5">📦 Racks Sezione A</Card.Header>
                    <Row className="g-0">
                        <Col xs={2}>
                            <ListGroup style={{ maxHeight: "50px"}}>
                                {loading && <GearSet />}
                                {!loading && racks.length === 0 && <p className="text-center py-3">Nessuna rack trovata</p>}

                                {!loading && racks.map((rack) => (
                                    <ListGroup.Item  key={rack.id_rack} action active={selectedRack === rack.id_rack} onClick={() => loadShelvesForRack(rack.id_rack)}>
                                        <strong>{rack.rackCode}</strong>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        <Col xs={10}>
                            <div className="shadow-sm p-2 border-bottom">
                                <h6 className="mb-1 fw-bold">{racks.find(r => r.id_rack === selectedRack)?.rackCode || 'Seleziona Scaffale'}</h6>
                                <small className="text-muted d-block mb-2">Seleziona il ripiano per visualizzare i prodotti</small>
                                {selectedRack && (
                                    <div>
                                        {/* SHELF TABS */}
                                        <div className="d-flex gap-3 mb-4">
                                            {shelves.map((shelf) => (
                                                <button key={shelf.id_shelf} className={`btn ${selectedShelf === shelf.id_shelf ? "btn-primary" : ""}`} onClick={() => loadProductsForShelf(shelf.id_shelf)}>
                                                    Ripiano {shelf.shelf_number}
                                                    <Badge bg="secondary" className="ms-2">{products.length}</Badge>
                                                </button>
                                            ))}
                                        </div>

                                        {/* PRODOTTI */}
                                        {loadingProducts && <GearSet />}

                                        {!loadingProducts && selectedShelf && products.length === 0 && (
                                            <Card className="text-center py-5 mx-3 box border-0">
                                                <Card.Text className="mb-0 text-muted">Nessun prodotto sul ripiano selezionato.</Card.Text>
                                                <small className="text-info mt-2">Usa il modulo di Carico per aggiungere articoli.</small>
                                            </Card>
                                        )}

                                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                        {!loadingProducts && products.map((prod) => (
                                            <Card key={prod.idProduct} className="mb-3 shadow-sm">
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5>{prod.productName}</h5>
                                                        <small>Seriale: {prod.serialCode}</small>
                                                    </div>

                                                    <Badge bg="primary" pill style={{ fontSize: "1rem" }}>
                                                        Qtà: {prod.quantity}
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
                    {/* FORM 1: Aggiunta/Carico Prodotto */}
                    <Card className="shadow">
                        <Card.Header as="h5" className="bg-success text-white">➕ Carico Prodotto</Card.Header>
                        <Card.Body>
                            <Form >
                                <Form.Group className="mb-3">
                                    <Form.Label>Prodotto/Codice Articolo</Form.Label>
                                    <Form.Control type="text" placeholder="Es. P001" />
                                </Form.Group>
                                        
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Scaffale</Form.Label>
                                        <Form.Control type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Ripiano</Form.Label>
                                        <Form.Select >
                                            <option>A</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Quantità da Caricare</Form.Label>
                                    <Form.Control type="number" min="1" />
                                </Form.Group>
                                        
                                <Button variant="success" type="submit" className="w-100">Aggiungi a Scaffale</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                        
                    {/* FORM 2: Prelevamento/Scarico Prodotto */}
                    <Card className="shadow my-4">
                        <Card.Header as="h5" className="bg-primary text-white">➖ Prelevamento Prodotto</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prodotto/Codice Articolo</Form.Label>
                                    <Form.Control type="text" placeholder="Es. P001" />
                                </Form.Group>
                                        
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Scaffale</Form.Label>
                                        <Form.Control type="text" readOnly />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Ripiano</Form.Label>
                                        <Form.Select >
                                            <option>A</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Quantità da Prelevare</Form.Label>
                                    <Form.Control type="number" min="1" />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">Scarica per Manutenzione</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Col>
        </Row>
    );
}
