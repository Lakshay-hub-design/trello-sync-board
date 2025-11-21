import CardItem from "./CardItem";

export default function CardList({ list, listColors, lightenColor, fetchLists }) {
  return (
    <div className="cards">
      {list.cards.length === 0 && (
        <div
          className="empty"
          style={{
            "--empty--color": listColors[list.id]
              ? lightenColor(listColors[list.id], 90)
              : "#444",
          }}
        >
          No cards — add one!
        </div>
      )}

      {list.cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          listId={list.id}
          fetchLists={fetchLists}
        />
      ))}
    </div>
  );
}
