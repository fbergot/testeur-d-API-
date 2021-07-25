import '../App.css';


export function DisplayData(props) {
    let listItems;
    if (Array.isArray(props.data.data)) {
         listItems = props.data.data.map((item , key) => {
            return <p key={key}>{JSON.stringify(item)}</p>
        })         
    return <div className='data_display'>
        {listItems}
    </div>
    } else {
        return <div className="data_display">
            { JSON.stringify(props.data) }
        </div>;
     }
}

export function Wait(props) {
    return <p>{ props.message }</p>
}


export function Error(props) {
    return <p>{ props.message }</p>
}