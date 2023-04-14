import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatMessage from "@/components/chatMessage";

const Chat = () => {
  const apiUrl = "http://localhost:8000/api/";

  const firstChatMsg = {
    source: "ai",
    msg: "Welcome! How can I help you?",
  };

  const [chatLog, setChatLog] = useState([firstChatMsg]);
  const [input, setInput] = useState("");
  const [inputToPush, setInputToPush] = useState("");

  // TODO get user info from sign-in.
  const userEmail = "a@b.com";
  const userFirstName = "Adam";
  const userLastName = "Abate";
  // TODO this needs to be a state variable that is set after sign-in allows pull from MongoDB users collection using email address.
  const userId = "643755fc038ef6861eea3429";
  // TODO Make project choosable by name in side-bar after fetching all projects with the appropriate user ID from MongoDB. Then get projectId from the one selected (i.e. as state).
  const projectId = "6437ddd6ca1595eac34f0c29";
  const projectName = "Sample";
  // TODO Figure out how to use user_id in chat record. Need to update after initial pull of user record from MongoDB in below useEffect.

  // Make sure the user and project exist. This will need to change once above TODOs are complete.
  useEffect(() => {

    axios.get(apiUrl + "user/" + userEmail)
        .then((response) => console.log("User is logged in."))
        .catch((error) => {
            // If you get a response 404 error from backend, user does not exist. Create one.
            if (error.response) {
                if (error.response.status === 404) {
                    axios.post(apiUrl + "user", {"first_name": userFirstName, "last_name": userLastName, "email_address": userEmail, "project_ids": [projectId]})
                        .then((response) => {
                            console.log("Created new user with email " + userEmail)
                            console.log(response)
                        })
                }
            }
        })

    axios.get(apiUrl + "project/" + projectId)
        .then((response) => console.log("Project " + projectId + " exists."))
        .catch((error) => {
          // If you get a response 404 error from backend, project does not exist. Create one.
            if (error.response) {
                if (error.response.status === 404) {
                    // TODO Implement post in back-end
                    axios.post(apiUrl + "project", {"name": projectName, "chat": {userId: [firstChatMsg]}, "user_ids": [userId], "document_ids": []})
                        .then((response) => {
                            console.log("Created new project with name " + projectName)
                            console.log(response)
                            // TODO After creating project, update project_ids field of user entry with new project ID.
                        })
                }
            }
        })
    
  }, []);

  const pushInput = () => {
    if (inputToPush.length === 0) {
        return () => {}
    }
    axios.get(apiUrl + "project/" + projectId)
        .then((response) => {
            // Project exists, so put chat message from user in DB. TODO
            axios.put(apiUrl + "project/" + projectId, {"user_id": userId, "msg": inputToPush});
            console.log("Pushed the following user input to an entry of the database's projects collection: " + inputToPush);
        })
        .catch((error) => {
            // TODO Complain in console log about project not existing because it should have already been created by the time user is entering chats.
            console.log(error);
        })
        .finally(() => {
          setInputToPush("");
          // TODO Figure out why inputToPush is not being reset to empty string and why we push twice.
          console.log("Reset inputToPush to be empty: " + inputToPush);
        })
    return () => {}
  };

  useEffect(pushInput(), [inputToPush]);

  const handleSubmit = () => {
    // TODO Mock automated reply.
    if (input.length > 0) {
      // For immediate display purposes, set the chat log to have the most recent message.
      setChatLog(chatLog.concat([{ msg: input, source: "user" }]));

      // TODO implement effect to put/post user input to DB via FastAPI. Then reset inputToPush to ''.
      //  In that effect, after put/post is successful, set a different state variable to indicate
      //  to a different effect that it should start polling until FastAPI finishes its response generation.
      setInputToPush(input.slice());

      // Reset the input box.
      setInput("");
    }
  };

  return (
    <Container className="my-3 h-100">
      <Row className="h-100">
        <Col xs={2}>Side-bar 1</Col>
        <Col
          className="shadow p-3 bg-white rounded"
          style={{ maxHeight: "100%" }}
        >
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
            <div
              className="p-2 h-100 overflow-scroll mb-2"
              style={{ minWidth: "100%", width: 0 }}
            >
              {chatLog.map((item, index) => (
                <ChatMessage {...item} key={index} />
              ))}
            </div>
            {/* Above is chat history. Note that style tag minWidth and width params prevent growing along cross-axis (horizontally) as per https://stackoverflow.com/questions/24632208/force-flex-element-not-to-grow-in-cross-axis-direction/}
            

            {/* Inputs */}
            <Stack direction="horizontal" gap={3}>
              <Form.Control
                className="me-auto"
                placeholder="Ask a question..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
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
