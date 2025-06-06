import { UseAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = UseAuth();

  const logIn = (e) => {
    e.preventDefault();

    setIsLoggedIn(true);
    setUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com'
    });
  }

  const logOut = (e) => {
    e.preventDefault();

    setIsLoggedIn(false);
    setUser(null);
  }

  return (
    <>
      <span>User is currently {isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
      {isLoggedIn && (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
      {!isLoggedIn && (
        <h2>Please log in to access your dashboard.</h2>
      )}
      <br />
      {isLoggedIn ? <button className='cursor-pointer' onClick={(e) => logOut(e)}>logout</button> : <button onClick={(e) => logIn(e)}>login</button>}
    </>
  )
}

export default Dashboard
