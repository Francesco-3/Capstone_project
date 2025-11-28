import { useState } from "react"
import "../../App.css"
import GearSet from "../../components/Gear"
import PasswordField from "../../components/PasswordField"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg(null);

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg({ variant: "danger", text: data?.message || "Login fallito" });
      return;
    }

    const token = data.accessToken || data.token;

    if (!token) {
      setMsg({ variant: "warning", text: "Nessun token ricevuto" });
      return;
    }

    // Salviamo token
    localStorage.setItem("token", token);

    // Decodifica token
    const payload = parseJwt(token);
    localStorage.setItem("userId", payload.id);

    // ⬇️ PRENDIAMO LO USERNAME DAL BACKEND
    const meRes = await fetch("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (meRes.ok) {
      const meData = await meRes.json();
      localStorage.setItem("username", meData.username);
    }

    // Gestione ruolo
    const backendRole = payload.roles || [];
    const role = backendRole.includes("ENGINEER")
      ? "ENGINEER"
      : "MECHANICAL";

    onLoginSuccess(role);
    navigate(role === "ENGINEER" ? "/engineer" : "/mechanical", { replace: true });

  } catch {
    setMsg({ variant: "danger", text: "Errore di rete" });
  }
};


  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">

      <GearSet positionClass="left" />

      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={10} md={8} lg={5} xl={4}>
          <Card className="shadow-lg rounded-4" style={{ backgroundColor: "var(--card-bg)", border: "var(--border)" }}>
            <Card.Body className="p-4">
              <h4 className="mb-3 text-center" style={{ color: "var(--label-color)" }}>Mechanista WMS</h4>

              {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}

              <Form className="form mx-auto d-flex gap-3 flex-column" onSubmit={handleSubmit}>

                <span className="input-span">
                  <input type="email" id="email" name="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                  <label htmlFor="email" className="label">Email</label>
                </span>

                <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />

                <input className="submit btn my-4" type="submit" value="Accedi" />
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>

      <GearSet positionClass="right" />

    </Container>
  );
}
