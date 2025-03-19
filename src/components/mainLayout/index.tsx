'use client';

import HamburgerIcon from '@/icons/navigation/hamburger';
import { useState } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';

const MainLayout = () => {
  const [showSideNav, setShowSideNav] = useState(false);

  return (
    <Container fluid>
      <Navbar expand="lg" className="d-lg-none">
        <Button
          variant="transparent"
          onClick={() => setShowSideNav(!showSideNav)}
        >
          <HamburgerIcon color="grey" />
        </Button>
      </Navbar>
    </Container>
  );
};

export default MainLayout;
