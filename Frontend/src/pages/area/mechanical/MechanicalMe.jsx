import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Row, Col, Form, Card, Alert, Spinner } from 'react-bootstrap'
import avatar from '../../../assets/image/avatar.png'
import '../../../components/css/Me.css'

export default function MechanicalMe() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // STATO PER I DATI DEL PROFILO E DEL FORM
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [language, setLanguage] = useState("Italiano");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  // STATO PER L'INTERAZIONE
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMe();
  }, []); 

  useEffect(() => {
    if (profileData) {
      setUsername(profileData.username || "");
      setEmail(profileData.email || "");
      setPassword(profileData.password || "");
      setRole(profileData.role || "");
    }
  }, [profileData]);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/users/me`, { 
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore ${response.status}: ${errorText || "Impossibile caricare i dati."}`);
      }

      const data = await response.json();
      setProfileData(data);
      setError(null);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per inviare le modifiche del profilo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData || loading) return;

    setMsg(null);
    setLoading(true);

    const userId = profileData.id_user;

    const payload = {
      username: username,
      email: email,
      password: password,
      role: role,
    };

    const newPassword = payload.password;
    if (newPassword) {
      payload.password = newPassword;
    }

    try {
      const res = await fetch(`/users/update?user=${userId}`, { // URL di modifica
        method: "PUT", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 202) { // 202 Accepted o 200 OK
        setMsg({ 
          variant: "success", 
          text: "Profilo modificato correttamente! Aggiornamento in corso..."
        });
        fetchMe();
      } else {
        const raw = await res.text().catch(() => "");
        let text = `Modifica fallita! Status: ${res.status}`;
        try {
          const data = raw ? JSON.parse(raw) : null;
          if (data?.message) text = data.message; 
          else if (Array.isArray(data)) text = data.join(", "); 
        } catch {""}
        setMsg({ variant: "danger", text });
      }
    } catch {
      setMsg({
        variant: "danger",
        text: "Errore di rete o server non raggiungibile durante la modifica.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  }

  // Funzione per eliminare l'account
  const handleDeleteMe = async () => {
    if (!profileData || loading) return;

    if (!window.confirm("Sei assolutamente sicuro di voler eliminare il tuo account? L'operazione è irreversibile e disconnetterà immediatamente.")) return;

    setLoading(true);
    setMsg(null);

    const userId = profileData.id_user;
    const url = `/users/delete?user=${userId}`; 

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) { // 204 No Content
        setMsg({ variant: "success", text: "Account eliminato correttamente. Reindirizzamento..." });
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1500) // Reindirizza al login
      } else {
        const text = `Eliminazione fallita! Status: ${res.status}`;
        setMsg({ variant: "danger", text });
      }
    } catch {
      setMsg({ variant: "danger", text: "Errore di rete durante l'eliminazione." });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  return (
    <Row className="container py-4 w-75 mx-auto flex-grow-1" style={{ color: 'var(--label-color)' }}>
      
      <Col xs={12}>
        <h1 className="h1 border-bottom pb-2 mb-4">Gestione Profilo</h1>
      </Col>

      {/* MESSAGGI DI STATO */}
      <Col xs={12} className="mb-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}
        {loading && !profileData && (
          <div className="text-center">
            <Spinner animation="border" role="status" variant="secondary" className="me-2" /> 
            Caricamento dati...
          </div>
        )}
      </Col>
      
      {/* FORM DI MODIFICA PROFILO */}
      {profileData && (
        <Form onSubmit={handleSubmit} className="w-100">
          <Row className="align-items-start">
            
            {/* Colonna Avatar */}
            <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <img
                  src={avatar}
                  alt="MY AVATAR"
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <Button variant="outline-secondary" size="sm">
                  Cambia Avatar
                </Button>
              </div>
            </Col>

            {/* Colonna Dati Utente */}
            <Col xs={12} md={8} className="d-flex flex-column justify-content-start gap-3">
              <Card className="bg-dark text-white border-secondary">
                <Card.Header as="h5">Informazioni di Base</Card.Header>
                <Card.Body className='d-flex flex-column gap-3'>
                  
                  {/* Username (SOLO LETTURA) */}
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm="3" className="text-sm-end">Username</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /> 
                    </Col>
                  </Form.Group>

                  {/* Email (MODIFICABILE) */}
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm="3" className="text-sm-end">Email</Form.Label>
                    <Col sm="9">
                      <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Col>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm="3" className="text-sm-end">Password</Form.Label>
                    <Col sm="9">
                      <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Col>
                  </Form.Group>

                  {/* Ruolo */}
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm="3" className="text-sm-end">Ruolo</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
                    </Col>
                  </Form.Group>

                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* SEZIONE PREFERENZE */}
          <Row className="mt-4">
            <Col xs={12}>
              <Card className="bg-dark text-white border-secondary">
                <Card.Header as="h5">Preferenze</Card.Header>
                <Card.Body>
                  
                  {/* Selezione Lingua */}
                  <Form.Group as={Row} className="mb-4 align-items-center">
                    <Form.Label column sm="3">Lingua</Form.Label>
                    <Col sm="9">
                      <Form.Select className="bg-secondary text-light w-auto" value={language} onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option>Italiano</option>
                        <option>English</option>
                        <option>French</option>
                        <option>Español</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>

                  {/* Toggle Notifiche */}
                  <h5 className='mt-4 border-top pt-3'>Controlli</h5>
                  <div className="fx-block mb-2">
                    <label htmlFor="pushToggle">Notifiche Push</label>
                    <div className="toggle">
                      <div>
                        <input className='position-absolute opacity-0 w-25 h-50' type="checkbox" id="pushToggle" checked={isNotificationsEnabled} 
                          onChange={(e) => setIsNotificationsEnabled(e.target.checked)}
                        /> 
                        <div data-unchecked="On" data-checked="Off"></div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Modalità Scura */}
                  <div className="fx-block mb-2">
                    <label htmlFor="darkToggle">Modalità Scura</label>
                    <div className="toggle">
                      <div>
                        <input className='position-absolute opacity-0 w-25 h-50' type="checkbox" id="darkToggle" /> 
                        <div data-unchecked="On" data-checked="Off"></div>
                      </div>
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Sezione Pulsanti di Azione */}
          <Row>
            <Col xs={12} className="mt-4">
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                <Button variant="light" className="text-dark" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "SALVA MODIFICHE"}
                </Button>
                <Button variant="secondary" className="border" onClick={fetchMe} disabled={loading}>ANNULLA</Button>
                <Button variant="danger" className="border" onClick={handleDeleteMe} disabled={loading}>ELIMINA PROFILO</Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}

    </Row>
  )
}