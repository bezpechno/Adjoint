import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';

export function Dashboard() {
  const { username, token } = useUserAuthentication();
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SidebarMenu username={username} />
        </div>
        <div className="col-md-10">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
          </div>

          <canvas className="my-4 w-100" id="myChart" width="900" height="380"></canvas>

          <h2>Section title</h2>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Header</th>
                  <th>Header</th>
                  <th>Header</th>
                  <th>Header</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1,001</td>
                  <td>Lorem</td>
                  <td>ipsum</td>
                  <td>dolor</td>
                  <td>sit</td>
                </tr>
                {/* Add more table rows here */}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;