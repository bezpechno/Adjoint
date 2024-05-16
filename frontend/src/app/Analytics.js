import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';
import AnalyticsCharts from '../components/AnalyticsCharts';

function Analytics() {
  const { username, token } = useUserAuthentication();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 p-4">
          <SidebarMenu username={username} />
        </div>
        <div className="col-md-10 mt-4 p-4">
          {token && <AnalyticsCharts token={token} />}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
