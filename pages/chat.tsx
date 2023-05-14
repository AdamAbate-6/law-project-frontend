import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatMessage from "@/components/chatMessage";
import PatentEntry from "@/components/patentEntry";
import ProjectsSelectionSidebar from "@/components/projectsSelectionSidebar";

const Chat = () => {
  const apiUrl = "http://localhost:8000/api/";

  const firstChatMsg = {
    source: "ai",
    msg: "Welcome! How can I help you?",
  };

  interface UserData {
    // Same as User BaseModel in backend's models.py
    mongo_id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    project_ids: string[];
  }

  interface ProjectInfo {
    mongo_id: string;
    name: string;
  }

  const [userData, setUserData] = useState<UserData>({
    mongo_id: "",
    first_name: "",
    last_name: "",
    email_address: "",
    project_ids: [""],
  });

  const [chatLog, setChatLog] = useState([firstChatMsg]);
  const [input, setInput] = useState("");
  const [aiResponseNeeded, setAiResponseNeeded] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState("");
  // TODO Change to allProjectInfo with fields id and name so that we can just display name to UI but compare fields
  // const [allProjectIds, setAllProjectIds] = useState([""]);
  // In progress todo above
  const [allProjectDetails, setAllProjectsDetails] = useState<ProjectInfo[]>([
    {
      mongo_id: "",
      name: "",
    },
  ]);

  const userEmail = "a@b.com";
  const userFirstName = "Adam";
  const userLastName = "Abate";
  // const projectId = "6437ddd6ca1595eac34f0c29";
  // const projectName = "Sample";

  // Make sure the user exists. This will need to change once above TODOs are complete.
  useEffect(() => {
    let ignore = false;
    const getOrCreateUser = async () => {
      try {
        const response = await axios.get(apiUrl + "user/" + userEmail);
        if (!ignore) {
          setUserData(response.data);
          console.log("User is logged in.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // If error came from server response rather than during request or elsewhere...
          if (error.response) {
            // A 404 means the user did not exist. Make one.
            if (error.response.status === 404) {
              if (ignore) {
                console.log(
                  "User does not exist, but this is the second of two nearly contemporaneous renders (e.g. in React dev mode), so trusting the first to create the user; will not do a second POST."
                );
              } else {
                axios
                  .post(apiUrl + "user", {
                    first_name: userFirstName,
                    last_name: userLastName,
                    email_address: userEmail,
                    project_ids: [],
                  })
                  .then((response) => {
                    console.log("Created new user with email " + userEmail);
                    console.log(response);
                    setUserData(response.data);
                  })
                  .catch((error) => {
                    throw error;
                  }); // TODO Improve error handling for failed new user creation.
              }
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    };

    getOrCreateUser();
    return () => {
      ignore = true;
    };
  }, []);

  // If the user changes, get his/her list of projects (or create one if necessary) and set one to be active.
  useEffect(() => {
    // This function is used when the user already has at least one project and we want to retrieve info about
    //  the project(s).
    function getUserProjectDetails(callback: Function) {
      var tmpProjDetails: ProjectInfo[];
      tmpProjDetails = [];

      const defaultProjectId = userData.project_ids[0]; // TODO let this be configurable. Post-MVP.

      for (let i = 0; i < userData.project_ids.length; i++) {
        const projectId = userData.project_ids[i];

        axios
          .get(apiUrl + "project/" + projectId)
          .then((response) => {
            tmpProjDetails = tmpProjDetails.concat(tmpProjDetails, [
              {
                mongo_id: response.data.mongo_id,
                name: response.data.name,
              },
            ]);

            if (projectId == defaultProjectId) {
              console.log(
                "Project " +
                  projectId +
                  " exists and is being made the active project."
              );
              setActiveProjectId(projectId);
              // Get chat history for this project. Modifying chatLog will adjust display to show chat history.
              setChatLog(response.data.chat[userId]);
            }

            if (tmpProjDetails.length === userData.project_ids.length) {
              callback(tmpProjDetails);
            }
          })
          .catch((error) => {
            // If you get a response 404 error from backend, project does not exist.
            if (error.response) {
              if (error.response.status === 404) {
                throw (
                  "Project ID " +
                  projectId +
                  " is in the list of user project_ids, but it does not exist in the database."
                );
              } else {
                throw error;
              }
            } else {
              throw error;
            }
          });
      }
      return tmpProjDetails;
    }

    // First check that userData has been populated.
    const noUserFields =
      !userData.mongo_id ||
      !userData.email_address ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.project_ids;
    const noUserId = userData.mongo_id.length == 0;
    if (noUserFields || noUserId) {
      return () => {};
    }

    const userId = userData.mongo_id;

    // Create a project if the user does not have any.
    if (userData.project_ids?.length === 0) {
      const defaultProjectName = "Default";
      axios
        .post(apiUrl + "project", {
          name: defaultProjectName,
          chat: { [userId]: [firstChatMsg] },
          patents: { [userId]: [] },
          user_ids: [userId],
          document_ids: [],
        })
        .then((response) => {
          console.log("Created new project with name " + defaultProjectName);
          console.log(response);

          const newProjectId = response.data.mongo_id;
          setActiveProjectId(newProjectId);
          // setAllProjectIds([newProjectId]);
          setAllProjectsDetails([
            {
              mongo_id: newProjectId,
              name: defaultProjectName,
            },
          ]);

          // Update user entry with this new project ID.
          axios
            .put(apiUrl + "user/" + userId, { project_ids: [newProjectId] })
            .then((response) =>
              console.log(
                "Database entry of user " +
                  userId +
                  " had new project ID " +
                  newProjectId +
                  " appended to its project_ids field."
              )
            )
            .catch((error) => {
              if (error.response) {
                if (error.response.status === 400) {
                  console.log(
                    "Something went wrong during user update; project " +
                      newProjectId +
                      " not added to user's list of projects."
                  );
                } else {
                  throw error;
                }
              } else {
                throw error;
              }
            });
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              console.log(
                "Something went wrong during project creation; project not created."
              );
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        });
    }
    // If the user has a project, get the first one (assumed to be default) TODO allow default to be configurable.
    else {
      const projectId = userData.project_ids[0];

      getUserProjectDetails((projDetails: ProjectInfo[]) => {
        console.log(projDetails);
        setAllProjectsDetails(projDetails);
      });
    }
  }, [userData]);

  useEffect(() => {
    if (aiResponseNeeded === false) {
      return () => {};
    }

    let ignore = false;

    async function startAiProcessing() {
      // Have to provide user input as query parameter since we have no guarantee that axios.put() of user input from handleSubmit() has finished.
      //  I.e. the "ai" resource of the backend may query the DB for a most recent user message that does not exist.
      //  Implicit in providing user input as a query parameter is the assumption that nothing happened between handleSubmit() and this effect's
      //  execution that would cause chatLog's last element to differ from the user's input from handleSubmit(). There might be a better way to design this.
      const response = await axios.get(apiUrl + "ai", {
        params: {
          project_id: activeProjectId,
          user_id: userData.mongo_id,
          last_user_chat_msg: chatLog[chatLog.length - 1].msg,
        },
      });
      // Note 4/15/2023: Bellow commented code was inspired by https://react.dev/learn/synchronizing-with-effects#fetching-data, but it failed to ever write to the console.
      // Two possible explanations:
      // 1) Cleanup sets ignore to true before both of React's 2 dev renders, so console.log() never executes. That would imply example in docs is wrong...
      // 2) setAiResponseNeeded(false) prevents the second execution from ever getting to startAiProcessing(). Doesn't explain why logging fails for first execution.
      // if (!ignore) {
      //   // Test with dummy response.
      //   console.log('AI says hello!')
      //   // setTodos(json);
      // }

      // For debugging.
      // console.log('AI says hello!')

      // Put the AI's response in the chatLog state variable so React can re-render and display it.
      setChatLog(chatLog.concat([{ msg: response.data.msg, source: "ai" }]));
    }

    startAiProcessing();
    setAiResponseNeeded(false);

    return () => {
      ignore = true;
    };
  }, [aiResponseNeeded]);

  const handleSubmit = () => {
    if (input.length > 0) {
      // For immediate display purposes, set the chat log to have the most recent message.
      setChatLog(chatLog.concat([{ msg: input, source: "user" }]));

      // Put new chat message in DB so API can process it.
      // axios.put(apiUrl + "project/" + activeProjectId, {
      //   user_id: userData.mongo_id,
      //   msg: input,
      // });
      const userId = userData.mongo_id;
      axios
        .put(
          apiUrl + "project/" + activeProjectId,
          {
            chat: { [userId]: chatLog },
          },
          {
            params: {
              user_id: userId,
            },
          }
        )
        .then((response) =>
          console.log(
            "Pushed the following user input to an entry of the database's projects collection: " +
              input
          )
        );

      // Set the flag to ask for a response from the AI.
      setAiResponseNeeded(true);

      // Reset the input box.
      setInput("");
    }
  };

  const handleChatDelete = () => {
    setChatLog([firstChatMsg]);

    const userId = userData.mongo_id;
    axios
      .put(
        apiUrl + "project/" + activeProjectId,
        {
          chat: { [userId]: [firstChatMsg] },
        },
        {
          params: {
            user_id: userId,
          },
        }
      )
      .then((response) => console.log("Deleted chat log for user  " + userId));
  };

  return (
    <Container className="my-3 h-100">
      <Row className="h-100">
        {/* *** Project area *** */}
        <Col xs={2}>
          <ProjectsSelectionSidebar
            allProjectDetails={allProjectDetails}
            activeProjectId={activeProjectId}
          />
          {/* {allProjectIds.map((item, index) => (
                <ChatMessage {...item} key={index} />
              ))} */}
        </Col>

        {/* *** Main chat area *** */}
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

        {/* *** Patent entry area *** */}
        <Col xs={3}>
          <Row
            className="rounded shadow py-2 px-2 mx-1"
            style={{ backgroundColor: "#E6E6E6" }}
          >
            Enter patents you would like the AI to consider in your question.
            <PatentEntry
              apiUrl={apiUrl}
              projectId={activeProjectId}
              userId={userData.mongo_id}
            />
          </Row>

          <Row
            className="rounded shadow py-2 px-2 mx-1 my-4"
            style={{ backgroundColor: "#E6E6E6" }}
          >
            Saved chat snippets:
          </Row>

          <Row className="shadow rounded mx-1 my-4">
            <Button variant="outline-danger" onClick={handleChatDelete}>
              Clear All Chat Messages
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
