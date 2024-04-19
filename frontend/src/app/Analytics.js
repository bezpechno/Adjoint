import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';

function Analytics() {
    const { username, token } = useUserAuthentication();


    return (
        <div className="sidebar-container">
            <SidebarMenu username={username} />
        </div>
      );
}

export default Analytics;