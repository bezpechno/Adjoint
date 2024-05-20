import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';
import MenuTable from '../components/MenuTable';

export function Menu() {
  const { username, token } = useUserAuthentication();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 p-4"> 
          <SidebarMenu username={username} />
        </div>
        <div className="col-md-10 mt-4 p-4"> 
          {token && <MenuTable token={token} />}
        </div>
      </div>
    </div>
  );
}

export default Menu;
