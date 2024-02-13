import Navbar from '../Navbar/navbar';
function Report(){
    return(
        <>
        <Navbar/>
        <div className='mt-5'>
            <h1 className='text-center'>Report a bug or request for new features</h1>
            <div className="row justify-content-center">
                <form className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <input type='submit' />
                </form>
            </div>
        </div>

        </>
    )
}
export default Report;