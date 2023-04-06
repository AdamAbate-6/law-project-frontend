import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface ChatData {
  msg: string;
  source: string;
}

const ChatMessage = ({ msg, source }: ChatData) => {
  const baseMsgFormat = "shadow p-2 mb-3 rounded";

  if (source == "ai") {
    return (
      <Container>
        <Row>
          <Col xs={10} className={baseMsgFormat + " bg-light"}>
            <p className="text-wrap">{msg}</p>
          </Col>
          <Col xs={2}></Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <Row>
          <Col xs={2}></Col>
          <Col xs={10} className={baseMsgFormat + " bg-secondary text-dark text-wrap"}>
            <p className="text-wrap mw-100">{msg}</p>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default ChatMessage;
