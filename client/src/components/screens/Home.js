import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import {Link} from 'react-router-dom'
import M from 'materialize-css'
import Loading from './Loading'
import moment from 'moment'
import ScrollToTop from './ScrollToTop/index';
import GoToTop from './ScrollToTop';
const ReadMore = ({children}) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const resultString = isReadMore ? text.slice(0, 150) : text;
    const toggleReadMore = () =>{
        setIsReadMore(!isReadMore);
    }
    return (
        <p className='has-text-left'>
        {resultString}
        <span onClick={toggleReadMore} className="tag">
        {isReadMore ? '...read more' : '...show less'}
        </span>
        </p>
    )
}
const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)     
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(data)
                setData(result.posts)
            })
    }, [])
    const likesPost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) { return result }
                    else { return item }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikesPost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) { return result }
                    else { return item }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const makeComment = (text,postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                         return result 
                        }
                    else { 
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const deletePost =(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method: "delete",
            headers: {
                "Authorization":"Bearer" + localStorage.getItem("jwt")
            }
            }).then(res => res.json())
            .then(result=>{
            //    console.log(result)
               const newData=data.filter(item=>{
                   return item._id !==result._id
               })
               setData(newData)
                window.location.reload()
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
    
              if (item._id == result._id) {
                         return result;
              } else {
                return item;
              }
            });
            setData(newData);
          }).then(result=>{
            M.toast({html:"Your comment Deleted Successfully",classes:"#43a047 green darken-1"})
        })
      };
    return (
          //{item.postedBy.name}
          <>
        <div className="home">
            {
                data&&data.length?data.map(item => {
                    return (
                        //<h5 style={{ padding: "6px" }},style={{float:"right"}} >
                        <div className="card home-card" key={item._id}>
                           <div style={{ position:"relative" }}>
                           <img className="setting" src={item.postedBy.pic} />
                          <h5 style={{padding:"-2px"}}>
                            <Link className="link-setting" to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id:"/profile/"}>{item.postedBy.name}</Link>
                            {item.postedBy._id==state._id
                            &&<i className="material-icons img11" 
                            onClick={() =>
                                {deletePost(item._id);
                                }}
                                >delete</i>
                            }</h5></div>
                            <div className="card-image mar ">
                                <img style={{maxHeight:"500px"}}src={item.photo} />
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id)
                                    ? 
                                    <i className="material-icons" onClick={() => { unlikesPost(item._id) }}>thumb_down</i>
                                    :
                                    <i className="material-icons" onClick={() => { likesPost(item._id) }}>thumb_up</i>
                                }
                                <h6>{item.likes.length} Likes</h6>
                                <h6>{item.comments.length} comments</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <h6><strong><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> </strong>
                                &nbsp;<ReadMore>{item.body}</ReadMore></h6>
                               {item.comments.length==0?<h6><strong>No comments yet..</strong></h6>:item.comments.length===1?<h6><strong>View 1 comment</strong></h6>:
                               <h6><strong>View all {item.comments.length} comments</strong></h6>} 
                                {
                                    item.comments.map(record=>{
                                        return (
                                            // this line is printing comments on the frontend screen 
                                        <h6 key={record._id}>
                                        <span style={{fontWeight:"500"}}>
                                <Link to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id :"/profile"  }>{record.postedBy.name}</Link>  
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
                                <br></br>
                                <p><strong>Posted on {moment(item.date).format('MMMM Do YYYY')}</strong></p>
                            </div>
                        </div>
                    )
                })
                : 
                <div>
                <Loading/>
                <h1 style={{textAlign:"center"}}>No posts yet..</h1>
                </div>
            }
            
        </div>
        <GoToTop />
        <ScrollToTop />
        </>
    )
}
export default Home