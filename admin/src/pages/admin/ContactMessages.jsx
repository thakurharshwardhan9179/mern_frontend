import { useEffect, useState } from "react";
import axios from "axios";

const ContactMessages = () => {

  const [messages,setMessages] = useState([]);

  useEffect(()=>{

    fetchMessages();

  },[]);


  const fetchMessages = async ()=>{

    try{

      const res = await axios.get("http://localhost:5000/api/contact");

      setMessages(res.data);

    }catch(err){

      console.log(err);

    }

  };


  return (

    <div style={{padding:"30px"}}>

      <h2>Contact Messages</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {messages.map((m)=>(
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.message}</td>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

};

export default ContactMessages;
