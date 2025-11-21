import "remixicon/fonts/remixicon.css";
import '../styles/boardNavbar.css'

export default function BoardNavbar({ boardName }) {
  return (
    <div className="board-navbar">
      <div className="left-section">
        <h2 className="board-title">{boardName}</h2>
        <button className="nav-icon-btn">
          <i className="ri-arrow-down-s-line"></i>
        </button>
      </div>
      <div className="flex-spacer"></div>
      <button className="share-btn">
        <i className="ri-user-add-line"></i> Share
      </button>
      <div className="profile-icon">L</div>
    </div>
  );
}
