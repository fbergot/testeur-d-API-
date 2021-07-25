import React from 'react';
import Item from './Item';

function ListBodyItems(props) {
console.log('refresh listBody');
    return (
        <div className='list_items'>
            <h3>Corps de la requête</h3>
            {props.items.map((item ,index) => {
                return <Item deleteItem={props.deleteItem} index={index} key={index} value={item}/>
            })}
        </div>
    )
}

const ListBodyItemMemo = React.memo(ListBodyItems);

export default ListBodyItemMemo;