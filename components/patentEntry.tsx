import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useState, useEffect } from "react";

interface PatentEntryParams {
  apiUrl: string;
  projectId: string;
  userId: string;
}

// const ptp: (string)[] = [];

const PatentEntry = ({ apiUrl, projectId, userId }: PatentEntryParams) => {
  const [patentNumber, setPatentNumber] = useState("");
  const [patentOfficeCode, setPatentOfficeCode] = useState("US");
  const [patentsToProcess, setPatentsToProcess] = useState([] as string[]);
  const [showPatentNotFound, setShowPatentNotFound] = useState(false);

  useEffect(() => {
    const pullPatent = async () => {
      if (patentsToProcess.length == 0) {
        return () => {};
      }

      // Get a patent (country code plus number) to process and remove it from the array.
      const patent = patentsToProcess[0];
      setPatentsToProcess(patentsToProcess.filter((item) => item !== patent));

      try {
        //  TODO Implement post method in main.py and its DB ops in database.py
        const response = await axios.post(apiUrl + "patent/" + patent);
        console.log(
          "Either " +
            patent +
            " already exists in backend DB or we successfully pulled it into backend DB."
        );
        // console.log(response.data.title) // To confirm that patent was successfully queried.
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // If error came from server response rather than during request or elsewhere...
          if (error.response) {
            // A 400 means we failed trying to put the patent into the DB.
            if (error.response.status === 400) {
              console.log("Failed to pull " + patent + " into backend DB.");
              // TODO handle error
            } else if (error.response.status === 404) {
              console.log(
                "Patent " + patentOfficeCode + patentNumber + " not found."
              );
              setShowPatentNotFound(true);
            }
            // } else if (error.request) {
            //   if (error.request.status === 0) {
            //     console.log(
            //       "Patent " + patentOfficeCode + patentNumber + " not found."
            //     );
            //     setShowPatentNotFound(true);
            //   }
          }
        }
      }
    };
    pullPatent();
  }, [patentsToProcess]);

  const addPatent = async (
    apiUrl: string,
    projectId: string,
    userId: string,
    patentNumber: string,
    patentOfficeCode: string
  ) => {
    // TODO  handle validation in backend, comparison against other patent numbers inputted. In turn, this needs to alert if validation or something else fails. Also reset patent number to empty.
    try {
      // const response = await axios.put(apiUrl + "project/" + projectId, {
      //   user_id: userId,
      //   patent_number: patentNumber,
      //   patent_office: patentOfficeCode,
      // });
      const response = await axios.put(
        apiUrl + "project/" + projectId,
        {
          patents: {
            // TODO Allow for multiple entered patents. This will change entry in DB to have only one on every call to addPatent.
            [userId]: [{ office: patentOfficeCode, number: patentNumber }],
          },
        },
        {
          params: {
            user_id: userId,
          },
        }
      );
      console.log(
        "If it didn't already exist, added patent " +
          patentOfficeCode +
          patentNumber +
          " to project " +
          projectId +
          " for user " +
          userId
      );
      setPatentsToProcess(
        patentsToProcess.concat([patentOfficeCode + patentNumber])
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If error came from server response rather than during request or elsewhere...
        if (error.response) {
          // A 400 means we ran into some error modifying the project to have this patent.
          if (error.response.status === 400) {
            console.log(
              "Something went wrong while adding patent " +
                patentOfficeCode +
                patentNumber +
                " to project " +
                projectId +
                " for user " +
                userId
            );
            console.log(error);
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
    return () => {};
  };

  return (
    <Container fluid>
      <Alert
        variant="danger"
        onClose={() => setShowPatentNotFound(false)}
        dismissible
        show={showPatentNotFound}
        className="my-2"
      >
        Patent not found! Please enter the correct SPIF.
      </Alert>
      <Row s={1}>
        <Col md={3} style={{ padding: "1px" }}>
          <Form.Select
            aria-label="US"
            onChange={(event) => setPatentOfficeCode(event.target.value)}
          >
            <option value="US">US</option>
            {/* <option value="WO">WO</option>
          <option value="EP">EP</option>
          <option value="CN">CN</option>
          <option value="JP">JP</option>
          <option value="KR">KR</option>
          <option value="AU">AU</option>
          <option value="BR">BR</option>
          <option value="CA">CA</option>
          <option value="DE">DE</option>
          <option value="ES">ES</option>
          <option value="RU">RU</option>
          <option value="AT">AT</option>
          <option value="IT">AT</option> */}
          </Form.Select>
        </Col>
        <Col md={6} style={{ padding: "1px" }}>
          <Form.Control
            className="me-auto"
            placeholder="Patent Number"
            value={patentNumber}
            onChange={(event) => setPatentNumber(event.target.value)}
          />
        </Col>
        <Col md={3} style={{ padding: "1px" }}>
          <Button
            variant="secondary"
            onClick={() =>
              addPatent(
                apiUrl,
                projectId,
                userId,
                patentNumber,
                patentOfficeCode
              )
            }
          >
            Add
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PatentEntry;
