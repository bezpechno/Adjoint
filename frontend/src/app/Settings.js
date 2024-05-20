import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarMenu from '../components/SidebarMenu';
import SettingsTable from '../components/SettingsTable';
import { useUserAuthentication } from '../hooks/useUserAuthentication';

function Settings() {
  const { username, token } = useUserAuthentication();

  return (
    <Container fluid className="h-100 text-white">
      <Row className="h-100">
        <Col xs={12} md={3} lg={2} className="d-md-block">
          <SidebarMenu username={username} />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-4 mt-4" style={{ paddingTop: '20px' }}> 
          <SettingsTable token={token} />
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
