import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./DragDropRecipes.module.css";

const DragDropRecipes = ({ recipes, setRecipes }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(recipes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRecipes(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="recipes">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={styles.list}>
            {recipes.map((recipe, index) => (
              <Draggable key={recipe._id} draggableId={recipe._id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.item}>
                    {recipe.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropRecipes;
