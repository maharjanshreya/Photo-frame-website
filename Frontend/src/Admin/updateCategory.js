import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
const UpdateCategory = ({ categoryName,categoryId, onClose, refreshCategoryList }) => {
    console.log("update category: ", categoryId);
    console.log("categroy nemae: ", categoryName);
    const [updates, setUpdates] = useState({
        name: categoryName,
    });
    let name,value;
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
            const response = await fetch(`https://photo-frame-website.onrender.com/category/${encodeURIComponent(categoryId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
                credentials:'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const updatedCategory = await response.json();
            toast.success('Category Updated Successfully.');
            console.log('Category updated:', updatedCategory);
            // Call refreshCategoryList to fetch the updated category list
         refreshCategoryList();
            onClose();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
        <div>
            <form onSubmit={handleFormSubmit} >
                <input type="text" id="name" name="name" value={updates.name} defaultValue={categoryName}  onChange={handleInputChange} className='categoryChange' placeholder='Enter your new category name'/><br/>
                <hr/>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>
                    Close
                </Button>
                <Button type='submit' className='meterButtons' style={{ backgroundColor: '#0d6efd', width: 'auto' }}>
                    Save changes
                </Button> <Toaster position="top-center" reverseOrder={true} />
                </div></form>
        </div>
        </>
    );
};

export default UpdateCategory;
