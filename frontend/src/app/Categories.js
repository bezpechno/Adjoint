import React from 'react';

import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';
import CategoriesTable from '../components/CategoriesTable'; 

function Categories() {
    const { username, token } = useUserAuthentication();

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <SidebarMenu username={username} />
            </div>
            <div className="col-md-10">
            {token && <CategoriesTable token={token} />}
            </div>
          </div>
        </div>
      );
  }
export default Categories;