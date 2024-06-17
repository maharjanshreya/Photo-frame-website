import Navbar from '../Navbar/navbar';
import { useUser } from '../context/user';
import {React,useState,useEffect} from 'react';
import { toast } from 'react-hot-toast';
import { TbMessageReport } from "react-icons/tb";
import { Toaster } from 'react-hot-toast';
function Report(){
  const userId = localStorage.getItem('userId');
  
  console.log("report user id",userId);
    useEffect(() => {
      console.log('useEffect in Report component');
      console.log('userId:', userId);
      // Update userId in the state when it changes
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: userId || '',
      }));
    }, [userId]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        userId:  userId|| '', 
      });
      let name,value;
      
    
      const handleChange = (e) => {
        console.log('Handling change:', e.target.name, e.target.value);
        name =e.target.name;
        value = e.target.value;
        setFormData({
          ...formData,[name]:value
        });
        console.log(formData);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const{title,description,userId} =formData;
          const response = await fetch('https://photo-frame-website.onrender.com/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({title,description,userId}),
          });
    
          if (response.ok) {
            toast.success('Report submitted successfully');
            console.log('Report submitted successfully');
            setFormData({
              title: '',
              description: '',
              userId: userId || '',
            });
            // Handle success (e.g., show a success message to the user)
          } else {
            toast.error('Failed to submit report');
            console.error('Failed to submit report');
            // Handle error (e.g., show an error message to the user)
          }
        } catch (error) {
            toast.error('Failed to submit report');
            console.error('Error:', error);
          // Handle error (e.g., show an error message to the user)
        }
      };
    return(
        <>
        
        <div className=''>
            <p><TbMessageReport color='#e38502'/> Report a bug or request for new features</p><hr/>
            <div className="row ">
                <form className="col-md-6" >
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" id="title" value={formData.title} onChange={handleChange} placeholder='Enter the title for the report'/>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                        <textarea name="description" className="form-control" placeholder='Describe your problem' id="exampleFormControlTextarea1" rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <input type='submit' onClick={handleSubmit}/>
                    <Toaster position="top-center" reverseOrder={true}/>
                </form>
            </div>
        </div>

        </>
    )
}
export default Report;