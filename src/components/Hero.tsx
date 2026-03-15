
import lthImage from '../assets/lth.png';
function Hero() {
    return (
      <main className="hero">
        <div className = "image-wrapper">
            <img src = {lthImage} alt = "L.T. Hung" className="profile-img"/>
        </div>
        <div className="hero-content">
        <h1 className="title">
          Hi,<br />
          I'm L.T. Hung
        </h1>
        <p className="subtitle">WELCOME TO MY WEBSITE !</p>
        <button className="cv-button">View my CV</button>
      </div>
      </main>  
    );
}

export default Hero;