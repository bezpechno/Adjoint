import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems } from './menuItemsSlice';

function MenuItems() {
    const dispatch = useDispatch();
    // Correctly accessing the 'items' and 'status' from the Redux state
    const items = useSelector((state) => state.menuItems.items); // Make sure 'menuItems' matches the name of the slice in the store
    const status = useSelector((state) => state.menuItems.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMenuItems());
        }
    }, [status, dispatch]);

    // Checking status to handle loading or error state
    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error fetching menu items.</div>;

    return (
        <div>
            {items?.map((item) => (
                <div key={item.id}>{item.name}</div> // Ensure 'id' and 'name' are valid properties of your items
            ))}
        </div>
    );
}

export default MenuItems;
