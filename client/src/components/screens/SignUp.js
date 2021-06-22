import React,{useState,useEffect}from 'react'
import { Link ,useHistory} from 'react-router-dom'
import M from 'materialize-css'             

const SignUp = () => {
    const history=useHistory()
    const[name,setName]=useState("")
    const[passward,setPassward]=useState("")
    const[email,setEmail]=useState("")
    const[image,setImage]=useState("")
    const [url, setUrl] = useState(undefined)
      useEffect(()=>{
           if(url){
               uploadFields()
           }
      },[url])
    const uploadpic= ()=>{

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
     
    const uploadFields=()=>{
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                passward,
                email,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-2" })
                }
                else {
                    M.toast({ html: data.msg, classes: "#43a047 green darken-1" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const PostData=()=>{
        if(image){
            uploadpic()
        }
        else{
            uploadFields()
        }
    }

    return (
        <div className="Mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="username" 
                value={name}
                onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="password" 
                value={passward}
                onChange={(e)=>setPassward(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn  #1e88e5 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1"
                onClick={()=>PostData()}>
                    SignUp
                </button>
                <h5><Link to="/signin">Already have an account Login please?</Link></h5>
            </div>
        </div>
    )
}

export default SignUp