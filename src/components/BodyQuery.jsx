import ListBodyItems from './ListBodyItems';

export default function BodyQuery(props) {
    const changeValue = function (e) {
         props.onChangeInput(e.target.value , e.target.name);
    }
    const makeList = function (e) {
        props.changeList();
    }
    return (
      <div className="body_query">
        <h2>Ajouter des données dans le corps de la requête</h2>
		<div className='containerFlex'>
			<div className="bodyQueryContainer">
				<div>
					<label className="queryLabel" htmlFor="field_key">Clé</label>
					<input
					value={props.nameQuery}
					onChange={changeValue}
					type="text"
					name="nameField"
					className="field_key"
					placeholder="Ex: nom"
					id="field_key"
					/>
				</div>
				<div>
					<label className="queryLabel" htmlFor="field_value">Valeur</label>
					<input
					value={props.valueQuery}
					onChange={changeValue}
					type="text"
					name="valueField"
					className="field_value"
					placeholder="Ex: florian"
					id="field_value"
					/>
				</div>
				<button
					onClick={makeList}
					className="but_add_field"
					type="button"
					id="add_fields"
				>
					Ajouter
				</button>
			</div>
					
			<div className='listItemBody'>
				{props.list.length !== 0 && <ListBodyItems deleteItem={props.deleteItem} items={props.list} />}		
			</div>
		</div>
        
      </div>
    );
}