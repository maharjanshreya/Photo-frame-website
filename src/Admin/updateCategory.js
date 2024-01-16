import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
const UpdateCategory = ({ categoryId, onClose, refreshCategoryList }) => {
    console.log("update category: ", categoryId);
    const [updates, setUpdates] = useState({
        name: '',
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
            const response = await fetch(`/category/${encodeURIComponent(categoryId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const updatedCategory = await response.json();
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
        <div className='formedit'>
            <form onSubmit={handleFormSubmit} >
                <p className='editLabel'>Change your category name:</p>
                <input type="text" id="name" name="name" value={updates.name} onChange={handleInputChange} className='categoryChange' placeholder='Enter your new category name'/><br/>
                <Button type='submit' className='meterButtons' style={{backgroundColor:'green', width:'100%',borderColor:'green'}}>Submit</Button><br/>
            </form>
        </div>
        </>
    );
};

export default UpdateCategory;
