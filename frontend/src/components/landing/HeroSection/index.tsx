import React from "react";
import logo from "../../../assets/images/scrollbooks_logo.png";
import Button from "../../common/buttons/Button";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section
      id="hero"
      className="text-white py-20 bg-gradient-to-r from-darkBlue to-mediumBlue"
    >
      <div className="container flex flex-col items-center text-center mx-auto px-4">
        <img
          className="w-16 h-16"
          src={logo}
          alt="App Logo"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "" : "translate(50%, 0%)",
            transition: "opacity 0.6s ease-in, transform 0.6s ease-in",
          }}
        />
        <h1 className="mt-6 text-4xl font-bold">Welcome to ScrollBooks</h1>
        <p className="mt-4 text-lg bg-darkBlue">
          Discover, read, and explore a world of e-books at your fingertips.
        </p>
        <div className="mt-6">
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
