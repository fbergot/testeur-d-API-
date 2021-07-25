export default function Item (props) {
    const checkIndex = () => {
        props.deleteItem(props.index);
    }
    return (
      <div className="itemContainer">
        <span className="item">{props.value[0]}</span>
        <span className="item">{props.value[1]}</span>
        <span onClick={checkIndex} className="itemDelete">X</span>
      </div>
    );
}