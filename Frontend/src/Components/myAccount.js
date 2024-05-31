
export const MyAccount = async () => {
    try {
        const res = await fetch('/account', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
  
        const data = await res.json();
        return data;
        //console.log(data);
  
      } catch (err) {
        console.log('Error in fetching data', err);
        
      }
  };

  