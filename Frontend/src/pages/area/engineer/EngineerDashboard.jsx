import { Card, Col, Row, Table, Image } from "react-bootstrap";
import "../../../components/css/Dashboard.css"
import userAvatar from "../../../assets/image/user.png";


export default function EngineerDashboard() {
  return (
    <Row className="mx-0 h-100">
      <Col xs={12} md={12} lg={9} xl={9} xxl={9}>
        <h2 className="mb-2">Movimenti</h2>

        <div className="insights d-grid">
          {/* CARD SALES */}
          <Card className="sales mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
            <Card.Body>
              <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--color-primary)", color: "var(--label-color)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="18" width="20" height="2" rx="1" fill="white" />
                  <rect x="4" y="10" width="4" height="8" rx="1" fill="white" />
                  <rect x="10" y="6" width="4" height="12" rx="1" fill="white" />
                  <rect x="16" y="14" width="4" height="4" rx="1" fill="white" />
                  <circle cx="18" cy="12" r="1.5" fill="white" />
                </svg>
              </span>

              <div className="middle d-flex align-items-center justify-content-space-between">
                <div className="left">
                  <h3>Totale Mese Scorso</h3>

                  <h1>$25,024</h1>
                </div>

                <div className="progress rounded-5 w-100 h-100">
                  <svg>
                    <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={92}></circle>
                  </svg>

                  <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                    <p>81%</p>
                  </div>
                </div>
              </div>

              <small className="text-muted d-block">Last 24 Hours</small>
            </Card.Body>
          </Card>

          {/* CARD EXPENSES */}
          <Card className="expenses mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
            <Card.Body>
              <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--danger)", color: "var(--label-color)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="20" width="18" height="1" fill="white" />
                  <rect x="5" y="14" width="3" height="6" rx="0.5" fill="white" />
                  <rect x="10" y="8" width="3" height="12" rx="0.5" fill="white" />
                  <rect x="15" y="11" width="3" height="9" rx="0.5" fill="white" />
                </svg>
              </span>

              <div className="middle d-flex align-items-center justify-content-space-between">
                <div className="left">
                  <h3>Totale Mese Corrente</h3>

                  <h1>$14,160</h1>
                </div>

                <div className="progress rounded-5">
                  <svg>
                    <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={92}></circle>
                  </svg>

                  <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                    <p>62%</p>
                  </div>
                </div>
              </div>

              <small className="text-muted d-block">Last 24 Hours</small>
            </Card.Body>
          </Card>

          {/* CARD INCOME */}
          <Card className="income mt-1" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
            <Card.Body>
              <span className="d-flex align-items-center justify-content-center rounded-5 mb-1" style={{ backgroundColor: "var(--success)", color: "var(--label-color)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="2" y1="20" x2="22" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="3 18, 8 15, 13 17, 18 14, 21 16" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="3 15, 8 11, 13 13, 18 10, 21 12" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="3 12, 8 7, 13 9, 18 6, 21 8" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <div className="middle d-flex align-items-center justify-content-space-between">
                <div className="left">
                  <h3>Totale Risparmiato</h3>

                  <h1>$10,864</h1>
                </div>

                <div className="progress rounded-5">
                  <svg>
                    <circle cx="38" cy="38" r="36" fill="none" strokeWidth={14} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={92}></circle>
                  </svg>

                  <div className="position-absolute top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
                    <p>44%</p>
                  </div>
                </div>
              </div>

              <small className="text-muted d-block">Last 24 Hours</small>
            </Card.Body>
          </Card>
        </div>

        {/* TABLE MOVEMENT */}
        <div className="movements mt-4">
          <h2 className="my-4">Movimenti</h2>
          <Table responsive className="table w-100 text-align-center"> 
            {/* Nota: 'responsive' permette alla tabella di scorrere su schermi piccoli */}
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
              {/* Riga 1: Transazione completata (Success) */}
              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>

              {/* Riga 2: Transazione in attesa (Warning) */}
              <tr>
                <td>2025-11-19</td>
                <td>Luigi Verdi</td>
                <td>Accessorio Z</td>
                <td>+5</td>
                <td className="text-warning">ORDINE</td>
                <td>In preparazione</td>
              </tr>
                
              {/* Riga 3: Transazione rifiutata/Annullata (Danger) */}
              <tr>
                <td>2025-11-18</td>
                <td>Anna Bianchi</td>
                <td>Laptop Y</td>
                <td>-1</td>
                <td className="text-danger">RESO</td>
                <td>Danneggiato</td>
              </tr>

              {/* Riga 4: Transazione neutrale */}
              <tr>
                <td>2025-11-18</td>
                <td>Marco Gialli</td>
                <td>Cuffie Wireless</td>
                <td>+2</td>
                <td className="text-info">SCAMBIO</td>
                <td>Reso taglia</td>
              </tr>

              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>

              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>

              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>

              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>

              <tr>
                <td>2025-11-19</td>
                <td>Mario Rossi</td>
                <td>Smartphone X</td>
                <td>+1</td>
                <td className="text-success">VENDITA</td>
                <td>Ordine #98345</td>
              </tr>
            </tbody>
          </Table>

          <a href="#" className="d-flex text-align-center my-1 mx-auto" style={{ color: "var(--color-primary)" }}>Mostra Tutto</a>
        </div>
      </Col>

      <Col xs={12} md={12} lg={3} xl={3} xxl={3}>
        <h2 className="mb-3">Aggiornamenti</h2>

        <Card className="recent-updates mb-5" style={{ backgroundColor: "var(--card-bg)", color: "var(--label-color)", border: "var(--border)" }}>
          <Card.Body>
            <div className="updates">
              <div className="update d-flex align-items-start gap-1 mb-2">
                <div className="profile-photo">
                  <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
                </div>

                <div className="message flex-glow-1">
                  <p>
                    <b style={{ color: "white"}}>Mike Tyson </b>
                    recived his order of High Lion
                    tech GPS drone.
                  </p>

                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>

              <div className="update d-flex align-items-start gap-1 mb-2">
                <div className="profile-photo">
                  <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
                </div>

                <div className="message flex-glow-1">
                  <p>
                    <b style={{ color: "white"}}>Mike Tyson </b>
                    recived his order of High Lion
                    tech GPS drone.
                  </p>

                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>

              <div className="update d-flex align-items-start gap-1 mb-2">
                <div className="profile-photo">
                  <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
                </div>

                <div className="message flex-glow-1">
                  <p>
                    <b style={{ color: "white"}}>Mike Tyson </b>
                    recived his order of High Lion
                    tech GPS drone.
                  </p>

                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>

              <div className="update d-flex align-items-start gap-1 mb-2">
                <div className="profile-photo">
                  <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
                </div>

                <div className="message flex-glow-1">
                  <p>
                    <b style={{ color: "white"}}>Mike Tyson </b>
                    recived his order of High Lion
                    tech GPS drone.
                  </p>

                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>

              <div className="update d-flex align-items-start gap-1 mb-2">
                <div className="profile-photo h-auto">
                  <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
                </div>

                <div className="message flex-glow-1">
                  <p>
                    <b style={{ color: "white"}}>Mike Tyson </b>
                    recived his order of High Lion
                    tech GPS drone.
                  </p>

                  <small className="text-muted">2 Minutes Ago</small>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}