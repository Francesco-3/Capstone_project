import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import "../../App.css"
import GearSet from "../../components/Gear"
import PasswordField from "../../components/PasswordField"
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function SigninPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setUserRole] = useState("ENGINEER")
  const [date, setDate] = useState(new Date())
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    try {
      const res = await fetch("/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role, date }),
      })

      if (res.status === 201) {
        setMsg({
          variant: "success",
          text: "Registrazione avvenuta. Effettua il login.",
        })
        setTimeout(() => navigate("/login"), 1000)
        return
      }

      const raw = await res.text().catch(() => "")
      let data = null
      try {
        data = raw ? JSON.parse(raw) : null
      } catch { /* */ }

      let text = "Registrazione fallita" //backend non attivo
      if (Array.isArray(data)) text = data.join(", ")
      else if (data?.message) text = data.message
      else if (data?.errors) text = JSON.stringify(data.errors)
      else if (raw) text = raw
      setMsg({ variant: "danger", text })
    } catch {
      setMsg({ variant: "danger", text: "Errore di rete" })
    }
  }

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
                  <input
                    type="text" id="username"
                    name="username" value={username} required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username" className="label">Username</label>
                </span>

                <span className="input-span">
                  <input
                    type="email" id="email"
                    name="email" value={email} required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email" className="label">Email</label>
                </span>

                <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />

                <span className="input-span">
                  <input
                    type="text" id="roles"
                    name="roles" value={role} required
                    onChange={(e) => setUserRole([e.target.value])}
                  />
                  <label htmlFor="roles" className="label">Ruolo</label>
                </span>

                <span className="input-span">
                  <input
                    type="date" id="date" name="date" required
                    value={date instanceof Date ? date.toISOString().split("T")[0] : date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <label htmlFor="date" className="label">Data</label>
                </span>

                <input className="submit btn" type="submit" value="Registrati" />

                <div className="text-center">
                  <small style={{ color: "var(--label-color)" }}>
                    Hai già un account?{" "}
                    <span className="pointer fw-bold" role="button" onClick={() => navigate("/login")} style={{ color: "var(--steel-skin)" }}>Accedi</span>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <GearSet positionClass="right" />
    </Container>
  )
}