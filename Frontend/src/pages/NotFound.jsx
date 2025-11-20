import { Container, Row, Col } from "react-bootstrap";

import "../components/css/NotFoundPage.css";

const Complete404Page = () => {
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="error-card">
          <div className="error-text-container">
            <h1 className="error-title">Pagina non trovata</h1>
            <p className="error-message">
              Non abbiamo trovato la pagina che stai cercando. Prova a tornare
              alla pagina precedente o visita il nostro{" "}
              <a href="#" className="help-link">
                Centro assistenza
              </a>{" "}
              per saperne di più.
            </p>
            <a href="/engineer" className="home-button-link">
              <button
                className="home-button"
              >
                Torna indietro
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complete404Page;
