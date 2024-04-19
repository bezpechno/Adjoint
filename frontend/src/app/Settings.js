import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';

export function Settings() {
    const { username, token } = useUserAuthentication();


    return (
        <div className="sidebar-container">
            <SidebarMenu username={username} />
        </div>
      );
}

export default Settings;