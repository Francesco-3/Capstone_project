import React, { useState, useEffect } from 'react';
import { Table, Col, Badge, Spinner, Alert, Form } from 'react-bootstrap'; // Importa Form

export default function EngineerMovements() {
  const token = localStorage.getItem("token");

  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(''); // 1. Nuovo stato per la data di ricerca

  // Gestore per il cambio dell'input data
  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  // Recupero movimenti dal backend
  // 2. Modifica la funzione per accettare un parametro di data
  const fetchMovements = async (dateParam = '') => { 
    setIsLoading(true);
    setError(null);

    // Costruisci l'URL di base
    let url = `/movements?size=1000`;
    
    // Aggiungi il filtro per data solo se è stata fornita
    // Assumi che il tuo backend accetti un parametro 'date' o 'date_time' per il filtraggio
    if (dateParam) {
      // Nota: Potresti dover adeguare il nome del parametro ('date')
      // in base a come è configurato il tuo backend.
      url += `&date=${dateParam}`; 
    }

    try {
      const response = await fetch(url, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Tenta di leggere l'errore per un feedback migliore
        const errorDetail = await response.text();
        throw new Error(`Errore nel caricamento dei movimenti: ${response.status} ${errorDetail.substring(0, 50)}...`);
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

  // 4. Aggiorna useEffect per ricaricare quando searchDate cambia
  useEffect(() => {
    // Richiama fetchMovements con la data di ricerca corrente
    fetchMovements(searchDate); 
  }, [searchDate]); // Dipendenza da searchDate

  // Badge colorate in base al tipo
  const getBadgeVariant = (type) => {
    switch (type) {
      case 'INBOUND':
        return 'success';
      case 'OUTBOUND':
      default:
        return 'danger';
    }
  };
  
  // Helper per accedere all'ID (UUID) di un'entità relazionale, gestendo i null
  const getEntityId = (entity) => {
    // La logica originale è stata mantenuta, ma non sembra essere usata nel <tbody> attuale
    if (entity && entity.id) return entity.id;
    if (entity && entity.id_product) return entity.id_product;
    if (entity && entity.id_user) return entity.id_user;
    if (entity && entity.id_shelf) return entity.id_shelf;
    
    return null;
  };

  return (
    <Col xxl={12} lg={12} md={12} sm={12} xs={12} className="mt-4">
      <h2 className="mb-4" style={{ color: "var(--label-color)"}}>📋 Storico Movimenti Magazzino</h2>

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

      {!isLoading && (
        <div className='h-100' style={{ minHeight: '600px', overflowY: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* 3. Sostituisci <th>Data</th> con un input di ricerca */}
                <th style={{ minWidth: '150px' }}>
                  <Form.Label htmlFor="searchDateInput" className="mb-1 d-block fw-bold">Data</Form.Label>
                  <Form.Control
                    type="date"
                    id="searchDateInput"
                    value={searchDate}
                    onChange={handleDateChange}
                    aria-label="Cerca per Data"
                  />
                </th>
                <th>Tipo</th>
                <th>Prodotto ID/Codice</th>
                <th>Quantità</th>
                <th>Ubicazione ID</th>
                <th>Note</th>
                <th>Utente ID</th>
              </tr>
            </thead>
            <tbody>
              {movements.length > 0 ? (
                movements.map((movement) => (
                  <tr key={movement.id_movement}>
                    {/* Mantieni la visualizzazione della data formattata */}
                    <td>{movement.date || movement.date_time}</td> 
                    <td>
                      <Badge bg={getBadgeVariant(movement.movementType)}>
                        {movement.movementType}
                      </Badge>
                    </td>
                    
                    {/* FIX: Accede a una proprietà specifica (p. es. productCode o id_product) */}
                    <td>
                      {movement.productId ? movement.productId.productCode || movement.productId.id_product : 'N/A'}
                    </td>
                    
                    <td className="fw-bold">{movement.quantity}</td>
                    
                    {/* FIX: Accede all'ID dell'entità Shelf o Pallet se sono oggetti */}
                    <td>
                      <span className="font-monospace">
                        {movement.shelfId?.shelfCode || movement.palletId?.palletCode || 'N/A'}
                      </span>
                      <br />
                      <small className="text-muted">
                        {movement.shelfId ? '(Scaffale)' : movement.palletId ? '(Pallet)' : '(N/A)'}
                      </small>
                    </td>
                    
                    <td>{movement.notes}</td>
                    
                    {/* FIX: Accede all'ID dell'entità User */}
                    <td className="text-muted small">
                      {movement.userId ? movement.userId.username : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="7" className="text-center p-3 text-muted">
                      Nessun movimento trovato per la data selezionata.
                    </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {!isLoading && !error && movements.length === 0 && searchDate === '' && (
        <div className="text-center p-3 text-muted">
          Nessun movimento trovato.
        </div>
      )}
    </Col>
  );
}