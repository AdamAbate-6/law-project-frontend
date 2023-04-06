import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import Link from "next/link";

const menuLinks = [
  {
    title: "Solutions",
    path: "/solutions",
  },
  {
    title: "Company",
    path: "/company",
  },
];

interface MenuLink {
  title: string;
  path: string;
}

const MenuItem = ({ title, path }: MenuLink) => {
  return (
    
    // The below doesn't work with next.js 13 as per https://nextjs.org/docs/advanced-features/codemods#new-link, so can't figure out how to get pre-rendering.
    // <Link href={path} passHref>
    //     <Nav.Link >{title}</Nav.Link>
    // </Link>

    // ... And this looks like shit because it doesn't have default bootstrap formatting.
    // <Link href={path}>{title}</Link>

    // So I guess we are stuck without pre-rendering! TODO Unless we can use vanilla bootstrap to style Link...
    <Nav.Link href={path}>{title}</Nav.Link>
  );
};
// const MenuItem = ({ title, path }) => {
//   return (
//     <Link href={path} passHref>
//       <Nav.Link>{title}</Nav.Link>
//     </Link>
//   );
// };

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Owl AI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuLinks.map((item, index) => (
              <MenuItem {...item} key={index} />
            ))}
            {/* <Link href="/">
                <Nav.Link>Home</Nav.Link>
            </Link> */}
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
