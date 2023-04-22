import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState, useEffect } from "react";

const addPatent = async (
  apiUrl: string,
  projectId: string,
  userId: string,
  patentNumber: string,
  patentOfficeCode: string
) => {
  // TODO  handle validation in backend, comparison against other patent numbers inputted. In turn, this needs to alert if validation or something else fails. Also reset patent number to empty.
  try {
    const response = await axios.put(apiUrl + "project/" + projectId, {
      user_id: userId,
      patent_number: patentNumber,
      patent_office: patentOfficeCode,
    });
    console.log(
      "Added patent " +
        patentOfficeCode +
        patentNumber +
        " to project " +
        projectId +
        " for user " +
        userId
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If error came from server response rather than during request or elsewhere...
      if (error.response) {
        // A 404 means the user did not exist. Make one.
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

interface PatentEntryParams {
  apiUrl: string;
  projectId: string;
  userId: string;
}

const PatentEntry = ({ apiUrl, projectId, userId }: PatentEntryParams) => {
  const [patentNumber, setPatentNumber] = useState("");
  const [patentOfficeCode, setPatentOfficeCode] = useState("US");

  return (
    <Row s={1}>
      <Col md={3} style={{ padding: "1px" }}>
        <Form.Select
          aria-label="US"
          onChange={(event) => setPatentOfficeCode(event.target.value)}
        >
          <option value="US">US</option>
          <option value="WO">WO</option>
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
          <option value="IT">AT</option>
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
            addPatent(apiUrl, projectId, userId, patentNumber, patentOfficeCode)
          }
        >
          Add
        </Button>
      </Col>
    </Row>
  );
};

export default PatentEntry;
