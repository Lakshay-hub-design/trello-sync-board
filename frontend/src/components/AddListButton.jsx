export default function AddListButton({
  addingList,
  setAddingList,
  newListName,
  setNewListName,
  handleAddList,
}) {
  return (
    <div className="add-list-box">
      {!addingList ? (
        <button className="add-list-btn" onClick={() => setAddingList(true)}>
          <i className="ri-add-large-line"></i> Add another list
        </button>
      ) : (
        <div className="add-list-form">
          
          <input
            placeholder="Enter list title..."
            value={newListName}
            autoFocus
            onChange={(e) => setNewListName(e.target.value)}
          />

          <div className="add-list-actions">
            
            <button onClick={handleAddList}>
              Add List
            </button>

            <button
              onClick={() => {
                setAddingList(false);
                setNewListName("");
              }}
            >
              <i className="ri-close-line"></i>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
