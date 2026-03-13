import { Link } from "react-router-dom";
import "./Home.css";
import gym from "../assets/gym1.jpg";
import { useState } from "react";
import axios from "axios";

const Home = () => {

const [form,setForm] = useState({
name:"",
email:"",
message:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit = async(e)=>{
e.preventDefault();


try{

  await axios.post(
    "https://mern-backend-1-wd9z.onrender.com/api/contact",
    form
    );

  alert("Message Sent Successfully ✅");

  setForm({
    name:"",
    email:"",
    message:""
  });

}catch(err){
  console.log(err);
  alert("Error sending message");
}


};

return ( <div className="home">

```
  {/* HERO SECTION */}
  <section
    id="home"
    className="hero"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.85)), url(${gym})`
    }}
  >

    <div className="hero-content">
      <h1>
        Transform Your Body <br />
        <span>Build Your Strength</span>
      </h1>

      <p>
        Join the most trusted gym in your city.
        Modern machines, certified trainers, and a powerful
        environment to achieve your fitness goals.
      </p>

      <div className="hero-buttons">
        <Link to="/signup" className="btn primary">
          Join Now
        </Link>

        <Link to="/login" className="btn secondary">
          Member Login
        </Link>
      </div>
    </div>

  </section>


  {/* FEATURES */}
  <section id="features" className="features">

    <div className="feature-card">
      💪
      <h3>Advanced Gym Equipment</h3>
      <p>
        Train with the latest imported machines and professional
        strength equipment designed to help you build muscle,
        improve endurance and achieve faster fitness results.
      </p>
    </div>

    <div className="feature-card">
      🏋️
      <h3>Certified Personal Trainers</h3>
      <p>
        Our experienced and certified trainers provide proper
        guidance, workout plans and motivation to help you
        transform your body safely and effectively.
      </p>
    </div>

    <div className="feature-card">
      ⏰
      <h3>Flexible Workout Schedule</h3>
      <p>
        We offer flexible gym timings with separate batches
        for morning and evening so you can work out anytime
        according to your daily routine.
      </p>
    </div>

  </section>


  {/* GYM GALLERY */}
  <section id="gallery" className="gallery">

    <h2>Our Gym Gallery</h2>

    <div className="gallery-grid">

      <img src="https://images.unsplash.com/photo-1558611848-73f7eb4001a1" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1599058917212-d750089bc07e" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1517960413843-0aee8e2b3285" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e" alt="gym"/>
      <img src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a" alt="gym"/>

    </div>

  </section>


  {/* TRAINERS */}
  <section id="trainers" className="trainers">

    <h2>Our Trainers</h2>

    <div className="trainer-grid">

      <div className="trainer-card">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="trainer"/>
        <h3>JAYDEEP THAKUR</h3>
        <p>Strength & Muscle Coach</p>
      </div>

      <div className="trainer-card">
        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="trainer"/>
        <h3>SUMIT MUKATI</h3>
        <p>Fat Loss Specialist</p>
      </div>

      <div className="trainer-card">
        <img src="https://randomuser.me/api/portraits/men/60.jpg" alt="trainer"/>
        <h3>KUNAL THAKUR</h3>
        <p>Fitness Trainer</p>
      </div>

    </div>

  </section>


  {/* CONTACT */}
  <section id="contact" className="contact">

    <h2>Contact Us</h2>

    <div className="contact-container">

      <div className="contact-info">
        <p><strong>📍 Address:</strong> Mushkhedi, Indore</p>
        <p><strong>📞 Phone:</strong> +91 9179038806</p>
        <p><strong>📧 Email:</strong> sendhavharshwardhan@gmail.com</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>

        <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        />

        <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
        />

        <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        />

        <button type="submit">Send Message</button>

      </form>

    </div>

  </section>


  {/* WHATSAPP BUTTON */}
  <a
    href="https://wa.me/919179038806"
    className="whatsapp-btn"
    target="_blank"
    rel="noopener noreferrer"
  >
    💬
  </a>

</div>


);
};

export default Home;
