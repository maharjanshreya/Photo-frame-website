import Navbar from './adminNavbar';
function Dashboard(){
    return(
        <div style={{ display: 'flex' }}>
            {/* Navbar on the left */}
        <div >
          <Navbar />
        </div>
        <div style={{ flex: 1 }}>
          {/* Content on the right */}
          <div style={{ marginLeft: '250px', padding: '20px' }}>
            
          </div>
        </div>
        
        
      </div>
    );
}
export default Dashboard;