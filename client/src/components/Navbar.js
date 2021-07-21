import React,{useContext,useRef,useEffect, useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App';
import M from 'materialize-css'
var { SocialIcon } = require('react-social-icons');

const Navbar=()=>{
    const searchModal=useRef(null)
    const{state,dispatch}=useContext(UserContext)
    const [search, setSearch ] = useState('')
    const [ userDetails, setuserDetails] = useState([])
    const history=useHistory()
    useEffect(()=>{
       M.Modal.init(searchModal.current)
    },[])
    const renderList=()=>{
    if(state){
        return[
            <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/create">Create Post</Link></li>,
            <li key="4"><Link to="/myfollowingpost">My following Post</Link></li>,
            <li key="5">
            <button className="btn #c62828 red darken-3" onClick={()=>{
                localStorage.clear()
                dispatch({type:"CLEAR"})
                history.push('/signin')  
            }}>
            Logout
            </button>
            </li>
        ]
    }else{
        return[
            <li key="6"><Link to="/signin">Signin</Link></li>,
            <li key="7"><Link to="/signup">Signup</Link></li>
        ]
    }
}
    const fetchUsers=(query)=>{
    setSearch(query)
    fetch('/search-users',{
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query
            })
    }).then(res=>res.json())
    .then(results=>{
        setuserDetails(results.user)
    })
    }
    return(
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/signin"} className="brand-logo left" >Instagram</Link>
                <Link to={state?"/":"/signin"} ><SocialIcon network ="instagram" style={{left:"110px",fgColor:"#8a3ab9"}}/>)</Link>;
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input type="text" placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)} />
                     
                    <ul className="collection">
                        {userDetails.map(item=>{
                            return <Link to={item._id!==state._id ?"/profile/"+item._id:'/profile'} onClick={()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item">{item.email}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
                </div>
            </div>

        </nav>
    )
}

export default Navbar