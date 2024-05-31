import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
const UpdateUsers = ({ userId,firstname,lastname,email,contact, onClose, refreshUserList }) => {
    console.log(firstname);
    console.log(userId);
    const [updates, setUpdates] = useState({
        firstname: firstname || '',
        lastname: lastname || '',
        email: email || '',
        contact: contact || '',
    });
    let name, value;
    const handleInputChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUpdates({
            ...updates,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/user-update/${encodeURIComponent(userId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const updatedUser = await response.json();
            console.log('User updated:', updatedUser);
            // Call refreshCategoryList to fetch the updated category list
            refreshUserList();
            onClose();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
            <div>
                <form onSubmit={handleFormSubmit} >
                    <input type="text" id="name" name="firstname" value={updates.firstname || firstname }  onChange={handleInputChange} className='categoryChange' placeholder='Enter new firstname' /><br />
                    <input type="text" id="name" name="lastname" value={updates.lastname || lastname }  onChange={handleInputChange} className='categoryChange' placeholder='Enter  new lastname' /><br />
                    <input type="text" id="name" name="email" value={updates.email || email}  onChange={handleInputChange} className='categoryChange' placeholder='Enter  new email' /><br />
                    <input type="text" id="name" name="contact" value={updates.contact || contact }  onChange={handleInputChange} className='categoryChange' placeholder='Enter  new contact num' /><br />

                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>
                            Close
                        </Button>
                        <Button type='submit' className='meterButtons' style={{ backgroundColor: '#0d6efd', width: 'auto' }}>
                            Save changes
                        </Button>
                    </div></form>
            </div>
        </>
    );
};

export default UpdateUsers;
