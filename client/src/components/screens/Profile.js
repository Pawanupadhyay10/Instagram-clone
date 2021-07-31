import React,{useEffect,useState,useContext} from 'react'
import{UserContext} from '../../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {Fragment} from 'react';
import moment from 'moment'
// import '../../App.css';
import GoToTop from './ScrollToTop';
const Profile = () => {
    const[mypics,setPics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [view,setView] = useState(false);
    const [data,setData] = useState([])
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
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer"+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //  console.log(result)
         setPics(result.mypost)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "Insta-clone")
            data.append("cloud_name", "amrita1")
            fetch("	https://api.cloudinary.com/v1_1/amrita1/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                    // dispatch({type:"UPDATEPIC",payload:data.url})
                    fetch('/updatepic',{
                        method:"put",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization": "Bearer" + localStorage.getItem("jwt")
                        },
                        body:JSON.stringify({
                            pic:data.url
                        })
                    }).then(res => res.json())
                    .then(result=>{
                        console.log(result)
                        localStorage.setItem("user", JSON.stringify({ ...state, pic:result.pic }))
                        dispatch({ type: "UPDATEPIC", payload: result.pic })
                        window.location.reload()
                    })
                    .then(result=>{
                        M.toast({html: "Profile Pic updated successfully",classes:"#c62828 green darken-3"})
                    })
                    
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },[image])
    const updatePhoto=(file)=>{
        setImage(file)
    }
       /*const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Insta-clone")
        data.append("cloud name", "amrita1")
        fetch("	https://api.cloudinary.com/v1_1/amrita1/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }*/
    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 </div>
               <div className="margin-set">
                   <h4 className="size"><strong>{state?state.name:"loading"}</strong></h4>
                   <h5 className="size">{state?state.email:"loading"}</h5>
                   <div className="11 mur" style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6 className="size1"><strong className="dis">{mypics.length}</strong>posts</h6>
                       <h6 className="size1"><strong className="dis1">{state?state.followers.length:"0"}</strong> followers</h6>
                       <h6 className="size1"><strong className="dis2">{state?state.following.length:"0"}</strong> following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>{
                    var file = e.target.files[0];
                    var t = file.type.split('/').pop().toLowerCase();
                    if (t != "jpeg" && t != "jpg" && t != "png") {
                        M.toast({html: "Image Format is invalid",classes:"#c62828 red darken-3"})
                        return;
                    }
                    updatePhoto(e.target.files[0])}} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="jpg/jpeg/png" />
            </div>
            </div>
            </div>      
            <div className="adjust">
              <span onClick={()=> setView(false)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn red text-white">Posts</span>
              <span onClick={()=> setView(true)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn green text-white">Gallery</span>
            </div>    
           {
                  view 
                  ?<div className="gallery">
               {
                    mypics&&mypics.length>0 ?
                   mypics.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
                   :
                   <h3 style={{ fontFamily:"Grand Hotel, cursive" }}>No Posts published yet</h3>
                  }</div>
                  :<Fragment>
                {
                    mypics&&mypics.length>0 ?  mypics.map(item=>{
                        return(
                          <div className="card home-card" key={item._id}>
                  <div style={{ position:"relative" }}>
            <img className="setting" src={item.postedBy.pic} />
                  <h5 style={{padding:"-2px"}}>
         <Link onClick={scrollToTop} className="link-setting" to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"}>{item.postedBy.username}</Link> 
                              {item.postedBy._id == state._id 
                              && <i className="material-icons img11" 
                              onClick={()=>{
                                  deletePost(item._id);
                              } }
                              >delete</i>
  
                              }</h5></div>
                              <div className="card-image mar">
                                  <img style={{maxHeight:"500px"}} src={item.photo}/>
                              </div>
                              <div className="card-content">
                              <i className="material-icons" style={{color:"red"}}>favorite</i>
                              {item.likes.includes(state._id)
                              ? 
                               <i className="material-icons"
                                      onClick={()=>{unlikePost(item._id)}}
                                >thumb_down</i>
                              : 
                              <i className="material-icons"
                              onClick={()=>{likePost(item._id)}}
                              >thumb_up</i>
                              <h6><strong>{item.likes.length} likes &nbsp;{item.comments.length} comments</strong></h6>
    
      <h6><strong><Link onClick={scrollToTop} to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.username}</Link> </strong>
      &nbsp;{item.body}</h6>
      {item.comments.length==0?<h6><strong>No comments yet..</strong></h6>:item.comments.length===1?<h6><strong>View 1 comment</strong></h6>:
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
                                            onClick={() => deleteComment(item._id, record._id)}
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
       
       <GoToTop />
       </>
   )
}
                }
                  
       </div>
   )
}

export default Profile