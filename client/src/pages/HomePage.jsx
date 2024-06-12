import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [trips, setTrips] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const getTrips = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios("http://localhost:4001/trips?keywords=");
      setTrips(results.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setSearchKeyword(category);
  };

  const filteredTrips = trips.filter(
    (trip) =>
      searchKeyword === "" ||
      trip.title.includes(searchKeyword) ||
      trip.description.includes(searchKeyword) ||
      trip.tags.some((tag) => tag.includes(searchKeyword))
  );

  return (
    <div className="homepage-container">
      <h1 className="heading-text">เที่ยวไหนดี</h1>
      <div className="trip-search">
        <p>
          <b>ค้นหาที่เที่ยว</b>
        </p>
        <input
          className="trip-search-bar"
          type="text"
          placeholder="หาที่เที่ยวแล้วไปกัน ..."
          onChange={handleSearch}
          value={searchKeyword}
        ></input>
      </div>
      <div className="trips-list">
        {filteredTrips.map((trip) => {
          return (
            <div className="trip" key={trip.eid}>
              <div className="trip-first-image">
                <img
                  src={trip.photos[0]}
                  alt="first image of trip"
                  className="trip-first-image"
                  width="280"
                  height="200"
                />
              </div>
              <div className="trip-detail">
                <h3 className="trip-title">
                  <a href={trip.url}>{trip.title}</a>
                </h3>
                <div className="trip-description">
                  <p>
                    {trip.description.length > 100
                      ? trip.description.substring(0, 100) + "..."
                      : trip.description}
                  </p>
                  <a href={trip.url}>อ่านต่อ</a>
                </div>
                <div className="trip-categories">
                  <span>
                    <b>หมวด </b>
                  </span>
                  {trip.tags.map((tag, i) => {
                    return (
                      <span
                        className="trip-category-item"
                        key={i}
                        onClick={() => handleCategoryClick(tag)}
                      >
                        {tag}
                        {i === trip.tags.length - 2 ? " และ" : ""}
                      </span>
                    );
                  })}
                </div>
                <div className="trip-other-images">
                  {trip.photos.slice(1, 4).map((otherImgs, i) => (
                    <img
                      key={i}
                      src={otherImgs}
                      alt="other images of trip"
                      className="trip-other-image-item"
                      width="80"
                      height="80"
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading trips.</p>}
    </div>
  );
}
export default HomePage;
