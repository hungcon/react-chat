import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  //const [user, setUser] = useState(null);

  useEffect(() => {
    // axios.post('http://localhost:4000/getUsers')
    // .then(data =>{
    //   console.log(data)
    // })
    // .catch(function(error){
    //   console.log(error)
    // })
   
    // fetch('http://localhost:4000/getUsers', {
    //   method: 'post',
    //    headers: {'Content-Type':'application/json'},
    // })
    // .then(data => {
    //   console.log(data.json())
    // })

    //---- Add user
    // fetch('http://localhost:4000/addUser', {
    //   method: 'post',
    //    headers: {'Content-Type':'application/json'},
    //    body: JSON.stringify({
    //     email: 'test',
    //     password: 'test',
    //   })
    // }
    // )
    // .then(data => {
    //   console.log(data.json())
    // })


    //---editUser
    fetch('http://localhost:4000/addUser', {
      method: 'post',
       headers: {'Content-Type':'application/json'},
       body: JSON.stringify({
        email: 'test',
        password: 'test',
      })
    }
    )
    .then(data => {
      console.log(data.json())
    })

  })
  return (
    <div className="App">
      a
    </div>
  );
}

export default App;
