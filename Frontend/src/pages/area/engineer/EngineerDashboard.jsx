import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Table, Image, Spinner, Alert } from "react-bootstrap";
import "../../../components/css/Dashboard.css"

export default function EngineerDashboard() {
  const token = localStorage.getItem("token");

  // Stati per Insights (adesso basati sul magazzino/costi)
  const [insightsData, setInsightsData] = useState({
    stockTotalValue: 0, // Nuovo: Valore monetario totale dello stock
    monthlyMovements: 0, // Nuovo: Totale movimenti (quantità) nell'ultimo mese
    lowStockCount: 0, // Nuovo: Conteggio prodotti con stock basso (alert)
    // Le percentuali verranno rimosse o ricalcolate, per ora sono solo di visualizzazione
  }); 
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState(null);

  // Stati per Movimenti (Mantenuti come prima)
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // --- FUNZIONI DI FETCH ---

  // 1. Fetch per le statistiche Insights del magazzino
  const fetchInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    
    // Assumi un endpoint che calcoli i 3 KPI chiave del magazzino.
    // Il backend dovrebbe:
    // 1. Calcolare SUM(product.price * product.stock) per stockTotalValue
    // 2. Calcolare SUM(movement.quantity) per i movimenti del mese (filtrati per data)
    // 3. Calcolare COUNT(product) dove product.stock < soglia (es. 5)
    const insightsUrl = `/warehouse/summary-kpis`; 

    try {
      const response = await fetch(insightsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nel caricamento delle statistiche: ${response.status}`);
      }

      const data = await response.json();
      
      // Assumi una risposta del tipo: 
      /* {
        stockTotalValue: 125024.50, 
        monthlyMovements: 4160, 
        lowStockCount: 3,
      }
      */
      setInsightsData(data); 

    } catch (err) {
      console.error("Errore nel recupero insights:", err);
      setInsightsError('Impossibile caricare le statistiche del magazzino.');
      setInsightsData({
        stockTotalValue: 0, 
        monthlyMovements: 0, 
        lowStockCount: 0,
      });
    } finally {
      setInsightsLoading(false);
    }
  };

  // 2. Fetch per i movimenti recenti (Mantenuta come prima)
  const fetchRecentMovements = async () => { 
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/movements?size=10`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nel caricamento dei movimenti: ${response.status}`);
      }

      const data = await response.json();
      setMovements(data.content || []);
    } catch (err) {
      console.error("Errore nel recupero dei movimenti:", err);
      setError('Impossibile caricare i movimenti. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchRecentMovements();
  }, []); 


  // Funzioni helper (Mantenute o adattate)
  const getMovementTextColor = (type) => {
    switch (type) {
      case 'INBOUND': 
        return 'text-success';
      case 'OUTBOUND': 
        return 'text-danger';
      case 'TRANSFER': 
        return 'text-warning';
      default:
        return 'text-info';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  // Funzione per il calcolo del dashoffset (es. 360 - 360 * 0.81)
  const calculateDashOffset = (percentage) => {
      // 226.19 è la circonferenza (2 * PI * 36)
      const circumference = 226.19; 
      return circumference - (percentage / 100) * circumference;
  }


  return (
    <Row className="mx-0 h-100">
      <Col xs={12} md={12} lg={9} xl={9} xxl={9}>
        <h2 className="mb-2" style={{ color: "var(--label-color)" }}>Riepilogo Magazzino</h2> {/* Titolo aggiornato */}
        
        {/* INSIGHTS CARDS */}
        {insightsLoading ? (
            <Spinner animation="border" size="sm" className="my-3 d-block mx-auto" />
        ) : insightsError ? (
            <Alert variant="danger" className="my-3">{insightsError}</Alert>
        ) : (
            <div className="insights d-grid">
                
              {/* CARD 1: VALORE TOTALE STOCK (Value) */}
              <Card className="sales mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
                <Card.Body>
                  <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--color-primary)", color: "var(--label-color)" }}>
                    {/* Icona (es. Valore/Moneta) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4h-2V9h4v4h2v4z" fill="white"/>
                    </svg>
                  </span>

                  <div className="middle d-flex align-items-center justify-content-space-between">
                    <div className="left">
                      <h3>Valore Totale Stock</h3>
                      {/* DATO DINAMICO: Valore in Euro/Dollari */}
                      <h1>€{insightsData.stockTotalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1> 
                    </div>

                    <div className="progress rounded-5 w-100 h-100">
                      <svg>
                        {/* Se non hai una metrica percentuale chiara, puoi usare un cerchio pieno o un valore fisso, o rimuovere il progress circle */}
                        <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={226.19} 
                        strokeDashoffset={0}></circle> {/* 0 = 100% visibile */}
                      </svg>

                      <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                        <p>100%</p>
                      </div>
                    </div>
                  </div>

                  <small className="text-muted d-block">Basato su stock e prezzo di vendita</small>
                </Card.Body>
              </Card>

              {/* CARD 2: MOVIMENTI MENSILI (Quantity) */}
              <Card className="expenses mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
                <Card.Body>
                  <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--danger)", color: "var(--label-color)" }}>
                    {/* Icona (es. Movimenti/Frecce) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="white"/>
                    </svg>
                  </span>

                  <div className="middle d-flex align-items-center justify-content-space-between">
                    <div className="left">
                      <h3>Movimenti Mese (Pezzi)</h3>
                      {/* DATO DINAMICO: Quantità totale movimentata */}
                      <h1>{insightsData.monthlyMovements.toLocaleString()}</h1>
                    </div>

                    <div className="progress rounded-5">
                      <svg>
                        {/* Esempio di Progresso (qui ipotizziamo una crescita del 62%) */}
                        <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={226.19} 
                        strokeDashoffset={calculateDashOffset(62)}></circle>
                      </svg>

                      <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                        <p>+62%</p> {/* Percentuale fissa, potresti calcolare (MeseCorrente vs MeseScorso) */}
                      </div>
                    </div>
                  </div>

                  <small className="text-muted d-block">Totale pezzi in entrata/uscita</small>
                </Card.Body>
              </Card>

              {/* CARD 3: PRODOTTI CON STOCK BASSO (Alert) */}
              <Card className="income mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
                <Card.Body>
                  <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--warning)", color: "var(--label-color)" }}>
                    {/* Icona (es. Allarme/Warning) */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="white"/>
                    </svg>
                  </span>

                  <div className="middle d-flex align-items-center justify-content-space-between">
                    <div className="left">
                      <h3>Prodotti a Basso Stock</h3>
                      {/* DATO DINAMICO: Conteggio prodotti a rischio */}
                      <h1>{insightsData.lowStockCount}</h1>
                    </div>

                    <div className="progress rounded-5">
                      <svg>
                        {/* Esempio di Progresso (qui usiamo un 44% di riempimento) */}
                        <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={226.19} 
                        strokeDashoffset={calculateDashOffset(44)}></circle>
                      </svg>

                      <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                        <p>Alert</p>
                      </div>
                    </div>
                  </div>

                  <small className="text-muted d-block">Articoli sotto la soglia di riordino</small>
                </Card.Body>
              </Card>
            </div>
        )}

        {/* TABLE MOVEMENT (Mantenuta come prima) */}
        <div className="movements mt-4">
                  {isLoading && (
                    <div className="text-center p-5">
                      <Spinner animation="border" role="status" variant="primary" className="me-2" />
                      <p>Caricamento dati...</p>
                    </div>
                  )}
            
                  {error && (
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  )}
            
            <h2 className="my-4" style={{ color: "var(--label-color)" }}>Movimenti Recenti</h2>
            {isLoading ? (
                <div className="text-center p-5">
                    <Spinner animation="border" role="status" variant="primary" className="me-2" />
                    <p>Caricamento movimenti...</p>
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{error}</Alert>
            ) : (
                <Table responsive className="table w-100 text-align-center"> 
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Utente</th>
                      <th>Prodotto</th>
                      <th>Quantità</th>
                      <th>Tipo</th>
                      <th>Note</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movements.length > 0 ? (
                      movements.map((movement) => (
                        <tr key={movement.id_movement || Math.random()}>
                          <td>{formatDate(movement.date || movement.date_time)}</td>
                          <td>{movement.userId?.username || 'N/A'}</td>
                          <td>{movement.productId?.productCode || 'N/A'}</td>
                          <td>{movement.quantity}</td>
                          <td className={getMovementTextColor(movement.movementType)}>
                            {movement.movementType}
                          </td>
                          <td>{movement.notes || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">Nessun movimento recente trovato.</td>
                        </tr>
                    )}
                  </tbody>
                </Table>
            )}

            <a href="/movements" className="d-flex text-align-center my-1 mx-auto" style={{ color: "var(--color-primary)" }}>Mostra Tutto</a>
        </div>
      </Col>

      <Col xs={12} md={12} lg={3} xl={3} xxl={3}>
        {/* ... Aggiornamenti recenti (parte destra) ... */}
      </Col>
    </Row>
  );
}