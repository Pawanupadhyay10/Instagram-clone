import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom' // we are importing this as it is fast and it replace <a href ="">
import M from 'materialize-css'
const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")
    //function of post data
    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/reset-passward", {//we are using signin because in server we have written the same
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-2" })
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
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
                <input type="text" placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <button className="btn waves-effect waves-light #1565c0 blue darken-3 darken-1" onClick={() => PostData()}>
                    reset password
                </button>
            </div>
        </div>
    )
}

export default Reset