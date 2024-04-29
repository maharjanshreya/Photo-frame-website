export const PostCategory = async (categoryName) => {
    try {
      const res = await fetch("/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: categoryName
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const data = await res.json();
      return { status: res.status, data };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  