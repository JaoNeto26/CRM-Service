import { Link } from "react-router-dom";
import "./style.css";
function Home() {
    return (
        <div>
            <div className="home-body">
                <div className="side-menu">
                    <p>Menu Item 1</p>
                    <p>Menu Item 2</p>
                    <p>Menu Item 3</p>
                    <p>Menu Item 4</p>
                    <p>Menu Item 5</p>
                    <Link to="/calendar">Go to Calendar</Link>
                </div>
                <div className="main-content">
                    <h1>Home</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;
