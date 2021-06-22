import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() =>           //this method will be called when the pic is uploaded on the cloud 
    {
        if (url) {
            fetch("/createpost", {//we are using signin because in server we have written the same 
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                   // console.log(data)
                    if (data.error) {
                        M.toast({html:data.error,classes:"#c62828 red darken-2"})
                    }
                    else {
                        M.toast({ html: "Created Post Successfully ", classes: "#43a047 green darken-1" })
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }

    }, [url])

    const postDetails = () => {
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
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="card input-filled"
            style={{         /*styling the post create page*/
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn  #1e88e5 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1" onClick={() => postDetails()}>Submit Post
                </button>
        </div>

    )
}
export default CreatePost