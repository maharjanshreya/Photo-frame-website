const userFunc = async () => {
    try {
      const res = await fetch('https://photo-frame-website.onrender.com/getUser', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }
  
      const datas = await res.json();
      console.log('API Response in user:', datas);
      return datas;
  
    } catch (err) {
      console.log('Error in fetching data', err);
      throw err; // Rethrow the error to handle it outside this function
    }
  };
  
  export default userFunc;
  