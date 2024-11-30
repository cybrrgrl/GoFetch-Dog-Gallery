import React, { useRef, useEffect, useState } from "react";
import "./styles.css";
import logo from "./images/logo.jpg"; // Import the logo 

const App = () => {
  const breedSelectRef = useRef(null); // breed list
  const numImagesRef = useRef(null); // num input
  const galleryRef = useRef(null); // gallery
  const [fullImage, setFullImage] = useState(null); // State to track the full image URL
  const [selectedBreed, setSelectedBreed] = useState(""); // State to track the selected breed

  // Fetch breed options on load
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        populateBreedOptions(data.message);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    const populateBreedOptions = (breeds) => {
      const breedNames = Object.keys(breeds);
      breedNames.forEach((breed) => {
        const option = document.createElement("option");
        option.value = breed;
        option.textContent = breed;
        breedSelectRef.current.appendChild(option);
      });
    };

    fetchBreeds();
  }, []);

  // Handle form submission to fetch images
  const handleFetchImages = async (e) => {
    e.preventDefault();
    const breed = breedSelectRef.current.value;
    const numImages = numImagesRef.current.value;

    if (!breed) {
      alert("Please select a breed.");
      return;
    }

    if (numImages < 1 || numImages > 100) {
      alert("Please enter a number between 1 and 100.");
      return;
    }

    setSelectedBreed(breed); // Update the selected breed

    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random/${numImages}`
      );
      const data = await response.json();
      displayImages(data.message);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Display images in the gallery
  const displayImages = (images) => {
    galleryRef.current.innerHTML = ""; // Clear existing images
    images.forEach((image) => {
      const container = document.createElement("div");
      container.classList.add("image-container");

      const img = document.createElement("img");
      img.src = image;
      img.alt = "Dog";
      img.classList.add("gallery-image");

      const button = document.createElement("button");
      button.textContent = "View Full Image";
      button.classList.add("view-button");
      button.onclick = () => setFullImage(image);

      container.appendChild(img);
      container.appendChild(button);
      galleryRef.current.appendChild(container);
    });
  };

  return (
    <div className="app">
      <img src={logo} alt="App Logo" width={130} height={130} className="app-logo" /> {/* Displays the logo */}
      <h1>GoFetch! Dog Gallery</h1>
      <h2>Please select a breed, as well as your specified amount of images.</h2>
      <form onSubmit={handleFetchImages}>
        <label htmlFor="breed-select">Select Breed:</label>
        <select id="breed-select" ref={breedSelectRef}>
          <option value="">-- Select a breed --</option>
        </select>
        <label htmlFor="num-images">Number of Images (1-100):</label>
        <input
          type="number"
          id="num-images"
          ref={numImagesRef}
          min="1"
          max="100"
          defaultValue="1"
        />
        <button type="submit">Go Fetch!</button>
      </form>

      {selectedBreed && (
        <h3 className="selected-breed">
          Showing results for: <strong>{selectedBreed}</strong>
        </h3>
      )}

      <div id="gallery" className="gallery" ref={galleryRef}></div>

      {fullImage && (
        <div className="modal" onClick={() => setFullImage(null)}>
          <img src={fullImage} alt="Full View" className="full-image" />
        </div>
      )}
    </div>
  );
};

export default App;
