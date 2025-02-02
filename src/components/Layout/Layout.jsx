import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.scss";

const Layout = ({ children, pageTitle, additionalInfo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);

  const minWidth = 1104; // Minimum width for the layout
  const threshold = 500; // Close the sidebar 50px before the minWidth

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const checkScreenWidth = () => {
    if (window.innerWidth < minWidth + threshold) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("sidebarAnimated");

    if (!hasAnimated) {
      setAnimateSidebar(true);
      sessionStorage.setItem("sidebarAnimated", "true");
      setTimeout(() => {
        setIsSidebarOpen(true);
        setTimeout(() => {
          setIsSidebarOpen(false);
          setTimeout(() => {
            setAnimateSidebar(false);
          }, 1000); // Time for sidebar to fully close
        }, 1000); // Time for sidebar to fully open
      }, 1000); // Time to start the animation
    } else {
      checkScreenWidth(); // Check initial screen width
    }

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const renderBackgroundImages = () => {
    const images = [
      {
        src: require("../../assets/images/drawing1.png"),
        className: "image1",
      },
      {
        src: require("../../assets/images/drawing3.png"),
        className: "image2",
      },
    ];

    // Condition to decide whether to render background images
    const shouldRenderImages = pageTitle === "Home";

    if (shouldRenderImages) {
      return images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={`background-${index}`}
          className={`background-image ${image.className}`}
        />
      ));
    }
    return null; // Do not render images if the condition is not met
  };

  return (
    <div
      className={`app ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${
        animateSidebar ? "animate-sidebar" : ""
      }`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-container">
        <div className="content-container">
          <div className="background">{renderBackgroundImages()}</div>
          <div className="main-content">{children}</div>
          <footer className="footer">
            <small>
              ECO still has a lot of kinks. Inspect project details for
              accuracy.
            </small>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
