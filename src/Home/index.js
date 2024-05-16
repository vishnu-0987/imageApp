import { Component } from "react";
import Popup from "reactjs-popup";
import { ThreeDots } from "react-loader-spinner";
import { IoMdClose } from "react-icons/io";
import { FaSearchengin } from "react-icons/fa6";
import "./index.css";

const switcher = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Home extends Component {
  state = {
    searchInput: "",
    images: [],
    isLoading: switcher.initial,
    offset: 1,
    totalPages: 0,
  };

  getSearchResults = async () => {
    this.setState({
      isLoading: switcher.inProgress,
    });
    const { searchInput, offset } = this.state;
    const apiGet = `https://api.unsplash.com/search/photos?query=${searchInput}&page=${offset}&per_page=24&client_id=${process.env.REACT_APP_API_KEY}`;

    const response = await fetch(apiGet);
    const data = await response.json();
    const pages = data.total_pages;
    console.log(pages);
    const { results } = data;
    if (response.ok) {
      console.log(results);
      const fetchedData = results.map((item) => ({
        imgUrl: item.urls.small,
        alt: item.alt_description,
      }));

      this.setState({
        isLoading: switcher.success,
        images: fetchedData,
        totalPages: pages,
      });
    } else {
      this.setState({
        isLoading: switcher.failure,
      });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.getSearchResults();
    }
  };

  changeInput = (e) => {
    this.setState({
      searchInput: e.target.value,
    });
  };

  buttonClick = (e) => {
    this.setState(
      {
        searchInput: e,
      },
      this.getSearchResults
    );
  };

  search = () => {
    this.getSearchResults();
  };

  previous = () => {
    const { offset } = this.state;
    if (offset > 1) {
      this.setState(
        (prev) => ({
          offset: prev.offset - 1,
        }),
        this.getSearchResults
      );
    }
  };

  next = () => {
    const { totalPages, offset } = this.state;
    if (offset < totalPages) {
      this.setState(
        (prev) => ({
          offset: prev.offset + 1,
        }),
        this.getSearchResults
      );
    }
  };

  renderLoader = () => (
    <div className="loader-container">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );

  renderSuccess = () => {
    const { images, offset, totalPages } = this.state;
    const disableNext = offset === totalPages ? "disable2" : "button2";
    const disablePrev = offset === 1 ? "disable1" : "button1";
    console.log(disableNext);
    return (
      <>
        <div className="images-container">
          {images.length === 0 ? (
            <h1>No Images Found </h1>
          ) : (
            <>
              {images.map((item) => (
                <Popup
                  modal
                  trigger={
                    <div className="hover-container">
                      <img src={item.imgUrl} alt={item.alt} className="image" />
                      <p>{item.alt}</p>
                    </div>
                  }
                >
                  {(close) => (
                    <>
                      <div className="popup-container">
                        <IoMdClose onClick={() => close()} className="close" />
                        <img
                          src={item.imgUrl}
                          className="image-popup"
                          alt={item.alt}
                        />
                        <h1 className="pop-des">{item.alt}</h1>
                      </div>
                    </>
                  )}
                </Popup>
              ))}
            </>
          )}
        </div>
        <div className="buttons">
          <button type="button" className={disablePrev} onClick={this.previous}>
            Previous
          </button>
          <button type="button" className={disableNext} onClick={this.next}>
            Next
          </button>
        </div>
      </>
    );
  };

  renderFailure = () => <p>Sorry!! No Results Found</p>;

  renderImages = () => {
    const { isLoading } = this.state;
    switch (isLoading) {
      case "IN_PROGRESS":
        return this.renderLoader();
      case "SUCCESS":
        return this.renderSuccess();
      case "FAILURE":
        return this.renderFailure();

      default:
        return null;
    }
  };

  render() {
    const { searchInput } = this.state;
    return (
      <div className="bg-container">
        <h1>Image Search</h1>
        <div className="input-container">
          <input
            type="search"
            placeholder="Type something to search..."
            onChange={this.changeInput}
            onKeyDown={this.handleKeyDown}
            value={searchInput}
          />
          <FaSearchengin className="search" onClick={this.search} />
        </div>
        <div className="button-group">
          <button type="button" onClick={() => this.buttonClick("Nature")}>
            Nature
          </button>
          <button type="button" onClick={() => this.buttonClick("Birds")}>
            Birds
          </button>
          <button type="button" onClick={() => this.buttonClick("Cats")}>
            Cats
          </button>
          <button type="button" onClick={() => this.buttonClick("Shoes")}>
            Shoes
          </button>
        </div>
        {this.renderImages()}
      </div>
    );
  }
}

export default Home;
