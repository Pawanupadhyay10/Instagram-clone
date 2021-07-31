import React,{useEffect,createContext,useReducer,useContext} from 'react';
import "./App.css"
import Navbar from './components/Navbar'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import SignIn from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import SignUp from './components/screens/SignUp'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import Subscribepost from './components/screens/Subscribepost'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassward'
import ScrollToTop from './components/screens/ScrollToTop';
//  '/' is a default router 
export const UserContext=createContext()


const Routing=()=>{
  const history=useHistory()
  const{state,dispatch}=useContext(UserContext)
  useEffect(()=>{
   
     const user=JSON.parse(localStorage.getItem("user"))
     if(user){
       dispatch({type:"USER",payload:user})
       //history.push('/')
      }else{
        if(!history.location.pathname.startsWith('/reset'))
            history.push('/signin')
      }
   
  },[])
  return(
    <Switch>
      
     <Route exact path="/"> 
      <Home />
    </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <Subscribepost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <Newpassword />
      </Route>
            
      
   </Switch>
  )
}

function App() {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
    <div>
    <BrowserRouter>
    
      <Navbar />   
      <main>
      <Routing/>
      </main>
      <ScrollToTop />
    </BrowserRouter>
    </div>
    </UserContext.Provider>
    </>
  );
}


export default App;