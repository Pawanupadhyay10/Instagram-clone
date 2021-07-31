import React, { useEffect, useState, useContext ,useRef} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import M from 'materialize-css'
import Loading from './Loading'
import {Fragment} from 'react';
import moment from 'moment'
import '../../App.css'
import ScrollToTop from './ScrollToTop/index';

const UserProfile= () => {
    const user = useRef(null);
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const {userid}=useParams()
    const [view,setView] = useState(false);
    const [data,setData] = useState([])
    const [showfollow, setShowFollow]=useState(state?!state.following.includes(userid):true)
    const refreshPage = ()=>{
        window.location.reload();
     }
     const scrollToTop = () => {
        window.scrollTo({top:0, behavior:"smooth" })
    }

    
     const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                 //   console.log(result)
          const newData = data.map(item=>{
              if(item._id===result._id){
                  return result
              }else{
                  return item
              }
          })
          const newData1 = userProfile.posts.likes.map(item=>{
              if(item._id===result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
          setProfile(newData1)
        })
        .catch(err=>{
            console.log(err)
        })
  }
  const unlikePost = (id)=>{
    fetch('/unlike',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer"+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
      //   console.log(result)
      const newData = data.map(item=>{
          if(item._id===result._id){
              return result
          }else{
              return item
          }
      })
      const newData1 = userProfile.posts.likes.map(item=>{
          if(item._id===result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
      setProfile(newData1)
    }).catch(err=>{
      console.log(err)
  })
}
const makeComment = (text,postId)=>{
    fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer"+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.map(item=>{
          if(item._id===result._id){
              return result
          }else{
              return item
          }
       })
       const newData1 = userProfile.posts.comments.map(item=>{
          if(item._id===result._id){
              return result
          }else{
              return item
          }
       })
      setData(newData)
      setProfile(newData1)
    }).catch(err=>{
        console.log(err)
    })
}
const deleteComment = (postid, commentid) => {

  fetch(`/deletecomment/${postid}/${commentid}`, {
    method: "delete",
    headers: {
      Authorization: "Bearer" + localStorage.getItem("jwt"),
    },
  })
    .then((res) => res.json())
    .then((result) => {
           const newData = data.map((item) => {

        if (item._id === result._id) {
                   return result;
        } else {
          return item;
        }
      });
      const newData1 = userProfile.posts.comments.map((item) => {

          if (item._id === result._id) {
                     return result;
          } else {
            return item;
          }
        });
      setData(newData);
      setProfile(newData1)
    }).then(result=>{
      M.toast({html:"Your comment Deleted Successfully",classes:"#43a047 green darken-1"})
  })
};
useEffect(()=>{
    fetch(`/user/${userid}`,{
        headers:{
            "Authorization":"Bearer"+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        //console.log(result)
        setProfile(result)
    })
 },[])

 const followUser=()=>{
    fetch('/follow', {
        method:"put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            followId:userid
        })
    }).then(res => res.json())
        .then(data => {
            //console.log(data)
            dispatch({ type: "UPDATE", payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState) =>{
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                   followers:[...prevState.user.followers,data._id]
               }
           }
            })
            setShowFollow(false)
        })
}
const unfollowUser=()=>{
    fetch('/unfollow', {
        method:"put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            unfollowId:userid
        })
    }).then(res => res.json())
        .then(data => {
            //console.log(data)
            dispatch({ type: "UPDATE", payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState) =>{
                const newFollower=prevState.user.followers.filter(item=>item!==data._id)
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:newFollower
                      }
               }
            })
            setShowFollow(true)
        })
}

    return (
          <>
        { userProfile ? 
                <div style={{ maxWidth: '550px', margin: "0px auto" }}>
                    <div style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div style={{
                                display:"flex",//{{ width: "160px", height: "160px", borderRadius: "80%" }}
                                justifyContent:"space-around",
                            }}>
                              
                                {/* <div>
                                    
                                    <img style={{ width: "160px", height: "160px", borderRadius: "80%" }}
                                    src={userProfile.user.pic} 
                                    alt="User"
                                    /> 
                                </div> */}
                        <div className="margin-set">
                            <h4 className="size">{userProfile.user.name}</h4>
                            <h5 className="size">{userProfile.user.email}</h5>
                            <div className="11 mur" style={{ display: 'flex', justifyContent: 'space-between', width: "108%" }}>
                                <h6 className="size1">{userProfile.posts.length}</h6>
                                <h6 className="size1">{userProfile.user.followers.length}</h6>
                                <h6 className="size1">{userProfile.user.following.length}</h6>
                            </div>
                            {showfollow?
                            <button style={{
                                margin:"10px"
                            }} className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1" onClick={() => followUser()}>
                                Follow
                            </button>
                            :
                                <button style={{
                                    margin: "10px"
                                }} className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1" onClick={() => unfollowUser()}>
                               Following
                            </button>
                             }
                        </div>
                    </div>
                    </div>
                    <div className="adjust">
               <span onClick={()=> setView(false)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn red text-white">Posts</span>
               <span onClick={()=> setView(true)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn green text-white">Gallery</span>
             </div>
     {
         view ?
         <div className="gallery">
         {  
             userProfile&&userProfile.posts.length>0?
            userProfile.posts.map(item=>{
                return(
                 <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                )
            }) :
            <h3 style={{ fontFamily:"Grand Hotel, cursive" }}>No Posts published yet</h3>
        }
         </div> :
         <Fragment>
                  {
                    userProfile&&userProfile.posts.length>0 ?  userProfile.posts.map(item=>{
                      return(
                        <div className="card home-card" key={item._id} ref={user}>
                <div style={{ position:"relative" }}>
          <img className="setting" src={item.postedBy.pic} alt="UserPic" />
                <h5 style={{padding:"-2px"}}>
       <Link onClick={scrollToTop} className="link-setting" to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"}>{item.postedBy.username}</Link> 
</h5></div>
                            <div className="card-image mar">
                                <img style={{maxHeight:"500px"}} src={item.photo} alt="User" />
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                            ? 
                             <i className="material-icons"
                                    onClick={()=>{
                                        unlikePost(item._id)
                                        refreshPage();
                                    }}
                              >thumb_down</i>
                            : 
                            <i className="material-icons"
                            onClick={()=>{
                                likePost(item._id)
                                refreshPage();
                            }}
                            >thumb_up</i>
                            }
                           
                            <h6><strong>{item.likes.length} likes &nbsp;{item.comments.length} comments</strong></h6>
    
      <h6><strong><Link onClick={scrollToTop} to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.username}</Link> </strong>
      &nbsp;{item.body}</h6>
      {item.comments.length===0?<h6><strong>No comments yet..</strong></h6>:item.comments.length===1?<h6><strong>View 1 comment</strong></h6>:
        <h6><strong>View all {item.comments.length} comments</strong></h6>}              
                                 {
                                    item.comments.map(record=>{
                                        return(
                                      
                                        <h6 key={record._id}>
                                        <span style={{ fontWeight: "500" }}>
<Link onClick={scrollToTop} to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id :"/profile"  }>{record.postedBy.username}</Link>  
                                        </span>{" "}
                                        {record.text}
                                        { (item.postedBy._id===state._id  || record.postedBy._id===state._id)
            
                                            && (
                                                         <i
                                                           className="material-icons"
                                                           style={{
                                                             float: "right",
                                                           }}
                                                           onClick={() => {
                                                               deleteComment(item._id, record._id)
                                                               refreshPage();  
                                                            }}
                                                         >
                                                           delete
                                                         </i>
                                                       )}
                                  </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value=""
                                    refreshPage();
                                }}>
                                  <input type="text" placeholder="add a comment" />  
                                </form>
                                <p><strong>Posted on {moment(item.date).format('MMMM Do YYYY')}</strong></p>
                            </div>
                        </div>
                      ) 
                    }) : <h3 className="adu">No Posts published yet</h3>
                  }
                    </Fragment>
     }    
               </div>
        : <Loading /> }
        <ScrollToTop />
    </>
    )
}

export default UserProfile