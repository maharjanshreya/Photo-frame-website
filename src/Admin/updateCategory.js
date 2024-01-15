import React, { useState } from 'react';

const UpdateCategory = ({ categoryId, onClose }) => {
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
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="name">Change Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={updates.name}
                onChange={handleInputChange}
            />

            <button type="submit">Update Category</button>
        </form>
    );
};

export default UpdateCategory;
