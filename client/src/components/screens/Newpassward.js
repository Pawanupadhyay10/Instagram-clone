import React, { useState, useContext } from 'react'
import { Link, useHistory,useParams} from 'react-router-dom' // we are importing this as it is fast and it replace <a href ="">
import { UserContext } from '../../App'
import M from 'materialize-css'
const SignIn= () => {
    const history = useHistory()
    const [passward, setPassward] = useState("")
    const {token}=useParams()
    console.log(token)
    //function of post data
    const PostData = () => {
        fetch("/new-password", {//we are using signin because in server we have written the same
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                passward,
                token
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-2" })
                }
                else {
                    M.toast({ html:data.message, classes: "#43a047 green darken-1" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="Mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="password" placeholder="password"
                    value={passward}
                    onChange={(e) => setPassward(e.target.value)} />

                <button className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1" onClick={() => PostData()}>
                    Update password
                </button>
            </div>
        </div>
    )
}

export default SignIn