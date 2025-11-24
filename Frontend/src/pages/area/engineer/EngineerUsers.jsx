import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Form, Alert, Button, Pagination } from 'react-bootstrap' 
import '../../../components/css/Products.css' 
import avatar from "../../../assets/image/avatar.png" 
import GearSet from '../../../components/Gear';

export default function EngineerUsers() {
  const token = localStorage.getItem("token");

  // --- STATI FORM ---
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setUserRole] = useState("MECHANICAL")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  // --- STATI LISTA E UI ---
  const [users, setUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [msg, setMsg] = useState(null); 
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 

  // --- PAGINAZIONE ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // utenti per pagina
  const maxPagesToShow = 5;   // Numero massimo di bottoni pagina visibili

  // Calcola gli indici di inizio e fine per la paginazione
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Prodotti visualizzati sulla pagina corrente
  const currentUsers = useMemo(() => {
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, indexOfFirstUser, indexOfLastUser]);

  // Numero totale di pagine
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Funzione per cambiare pagina
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calcolo dei numeri di pagina visibili
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
    fetchUsers();
  }, []);

  // Logica di Ricerca: Filtra gli utenti in tempo reale
  useEffect(() => {
    let filtered;
    if (searchTerm === "") {
      filtered = users;
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = users.filter(
        (p) =>
          p.username.toLowerCase().includes(lowerTerm) ||
          p.role.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); 
    
  }, [searchTerm, users]);

  // GESTIONE RESET DEL FORM: Funzione per uscire dalla modalità modifica
  const handleCancelEdit = () => {
    setEditingUser(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setUserRole("MECHANICAL");
    setDate(new Date().toISOString().split("T")[0]);
    setMsg(null); 
  };

  // GESTIONE MODIFICA: Pre-popola il form con i dati della card selezionata
  const handleEdit = (user) => {
    setEditingUser(user);

    // Pre-popola i campi del form
    setUsername(user.username || "");
    setEmail(user.enail || "");
    setPassword(user.password || "");
    setUserRole(user.role || "MECHANICAL");
    setDate(user.creation_date || new Date().toISOString().split("T")[0]);

    // Scrolla verso il form per avviare la modifica
    const formElement = document.getElementById('product-form-card');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // GESTIONE ELIMINA: Invia la richiesta DELETE all'API
  const handleDelete = async (userId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente? L'operazione è irreversibile.")) return;

    setLoading(true);
    setMsg(null);

    const url = `/users/delete?user=${userId}`; 

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) { 
        setMsg({ variant: "success", text: "Utente eliminato correttamente." });
        fetchUsers(); 
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

  // GET: Recupera la lista degli utenti
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/users?size=1000`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error("Errore nel caricamento degli utenti. Accesso negato o server non disponibile.");

      const data = await response.json();

      // 🔥 ORDINA PER CODICE PRODOTTO
      const list = (data.content || []).sort((a, b) => 
        a.creation_date.localeCompare(b.productCode, undefined, { numeric: true })
      );

      setUsers(list);
      setFilteredUsers(list);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST/PUT: Invia i dati per creare o modificare un utente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    
    // Determina l'ID dell'utente, il metodo (POST/PUT) e l'URL
    const userId = editingUser ? editingUser.id_user : null;
    const method = userId ? "PUT" : "POST";
    
    let url;
    let successStatus;

    if (userId) {
        // Status 202 (Accepted)
        url = `/users/update?user=${userId}`; 
        successStatus = 202;
    } else {
        url = "/users"; 
        successStatus = 201; 
    }

    // Payload basato sui dati del form
    const payload = {
      username: username,
      email: email,
      password: password,
      role: role,
      creation_date: date, 
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
          text: userId ? "Utente modificato correttamente!" : "Utente creato correttamente!" 
        });

        handleCancelEdit(); 
        fetchUsers(); 
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
    <Row className='mx-0 h-100'>
      <Col xs={{ span: 12, order: 1 }} md={{ span: 12, order: 2 }} lg={{ span: 9,  order: 1 }} xl={{ span: 9,  order: 1 }} xxl={{ span: 9, order: 1 }}>

        <Row className="gy-4 mx-4 mt-5">
          {/* LOADING SPINNER LISTA */}
          {loading && <div className="justify-content-center d-flex align-items-center w-100" style={{ height: "90vh" }}><GearSet /></div>}

          {/* Mappa solo i prodotti della pagina corrente */}
          {!loading && currentUsers.map((item) => (
            <Col key={item.id_user || item.creation_date} xs={12} sm={12} md={6} lg={6} xl={4} xxl={6}>
              <Card className="w-100 m-0 p-0 position-relative overflow-hidden" style={{ height: "75%" }}>
                <div className="d-flex h-100">
                  {/* SEZIONE IMMAGINE (SINISTRA) */}
                  <div style={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Card.Img variant="top" src={avatar}
                      style={{ objectFit: "contain", width: "100%" }}
                    />
                  </div>

                  {/* SEZIONE DETTAGLI E PULSANTI (DESTRA) */}
                  <div className="d-flex flex-column justify-content-center align-items-start p-3" style={{ width: "60%" }}>
                    {/* DETTAGLI UTENTE */}
                    <div className="text-start mb-3 w-100">
                      <Card.Title className="fw-bold m-0 text-truncate">{item.username}</Card.Title>
                      <Card.Text className="m-0 text-truncate">{item.email}</Card.Text>
                      <Card.Text className="small">{item.role}</Card.Text>
                    </div>

                    {/* PULSANTI AZIONE */}
                    {/* MODIFICA 2: Bottoni affiancati con spazio distribuito */}
                    <div className="d-flex justify-content-around mt-auto w-100"> 
                      <Button variant="primary" size="sm" onClick={() => handleEdit(item)} disabled={loading}>Modifica</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id_user)} disabled={loading}>Elimina</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
          
          {/* MESSAGGIO SE LISTA FILTRATA VUOTA */}
          {!loading && filteredUsers.length === 0 && ( 
            <div className="justify-content-center d-flex align-items-center w-100" style={{ color: "var(--label-color)", height: "90vh"}}>
              <h2>Nessn utente trovato</h2>
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

                <input className="input w-100 h-100 border-0" placeholder="Cerca per nome..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                <button className='reset border-0 bg-transparent' style={{ color: "#8b8ba7" }} type="button" onClick={() => setSearchTerm("")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mb-1" width="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </Form>
            </Card.Body>
          </Card>

          {/* AGGIUNTO ID PER LO SCROLL */}
          <Card id="product-form-card" className="shadow-lg rounded-4" style={{ backgroundColor: "var(--card-bg)", border: "var(--border)" }}>
            <Card.Body className="p-4">
                
              {/* BOTTONE ANNULLA MODIFICA (Mostrato solo se in editing) */}
              {editingUser && (
                <Button variant="outline-secondary" size="sm" className="mb-3 w-100" onClick={handleCancelEdit}>Annulla Modifica</Button>
              )}
              
              <Form className="form mx-auto d-flex gap-3 flex-column" onSubmit={handleSubmit}>
                
                <span className="input-span">
                  <input type="text" id="username" name='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                  <label htmlFor="username" className="label">Username</label>
                </span>

                <span className="input-span">
                  <input type="email" id="email" name="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                  <label htmlFor="email" className="label">Email</label>
                </span>

                <span className="input-span">
                  <input type="password" id="password" name="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                  <label htmlFor="password" className="label">Password</label>
                </span>

                <span className="input-span">
                  <input type="text" id="roles" name="roles" value={role} required onChange={(e) => setUserRole([e.target.value])} />
                  <label htmlFor="roles" className="label">Ruolo</label>
                </span>

                <span className="input-span">
                  <input type="date" id="date" name="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                  <label htmlFor="date" className="label">Data</label>
                </span>

                {/* PULSANTE SUBMIT DINAMICO: "Salva Modifica" o "Aggiungi" */}
                <input className="submit btn" type="submit" value={loading ? "Salvataggio..." : (editingUser ? "Salva Modifica" : "Aggiungi")} disabled={loading} />
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