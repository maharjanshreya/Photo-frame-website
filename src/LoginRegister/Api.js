export const CategoryGetApi = async () => {
    try {
        const res = await fetch('/category', {
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
    } catch (error) {
        throw new Error(error.message);
    }
};