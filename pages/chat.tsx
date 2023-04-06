import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from 'react'
import ChatMessage from "@/components/chatMessage";

const Chat = () => {

  const firstChatMsg = {
    msg: 'Welcome! How can I help you?',
    source: 'ai'
  }

  const [chatLog, setChatLog] = useState([firstChatMsg]);
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    // TODO Mock automated reply.
    if (input.length > 0) {
        setChatLog(chatLog.concat([{msg: input, source: 'user'}]));
        // Reset the input box.
        setInput('');
    }
  }

  return (
    <Container className="my-3 h-100 flex-nowrap">
        {/* TODO Fix fact that we expand chat box vertically instead of scrolling */}
      <Row className="h-100">
        <Col xs={2}>Side-bar 1</Col>
        <Col className="shadow p-3 mb-5 bg-white rounded">
          {/* Can't get lower div of stack to stick at bottom of page: */}
          {/* <Row xs={11}>Main content</Row>
            <Row>Text input</Row> */}
          {/* <Stack className="h-100" gap={5}>
                <div>Main content</div>
                <div className="bg-light border rounded p-1">Text input</div>
            </Stack> */}

          {/* Weird overlap between rows happening: */}
          {/* <Container fluid className="h-100 d-flex align-items-end">
                <Row>
                    <Col>Text</Col>
                </Row>
                <Row>
                    <Col className="bg-light border rounded p-1">Input</Col>
                </Row>
            </Container> */}

          {/* Try vanilla bootstrap: */}
          <div className="d-flex flex-column justify-content-between h-100 mw-75">

            {/* Chat */}
            <div className="p-2 h-100" style={{minWidth: "100%", width: 0}}>
                {chatLog.map((item, index) => (<ChatMessage {...item} key={index} />))}
            </div>

            {/* Inputs */}
            <Stack direction="horizontal" gap={3}>
              <Form.Control
                className="me-auto"
                placeholder="Ask a question..."
                value={input}
                onChange={event => setInput(event.target.value)}
              />
              <Button variant="secondary" onClick={handleSubmit}>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-send"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                </svg> */}
                Submit
                {/* <i className="bi bi-send">Submit</i> */}
              </Button>
            </Stack>
          </div>
        </Col>
        <Col xs={2}>Side-bar 2</Col>
      </Row>
    </Container>
  );
};

export default Chat;
