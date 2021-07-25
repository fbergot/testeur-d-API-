export default function SelectConfig(props) {

    const change = function (e) {
        props.changeSelected(e.target.value);
    }
    const remove = function (e) {
        e.target.name === "removeOne" ? props.onRemove() : props.onRemove(true);
    }
    return <div>
                <form className='selectConfigForm'>
                    <label htmlFor='configSelect'>Configurations enregistrées</label>
                    <select id='configSelect' value={props.value} onChange={change}>
                        <option value='init' key='init'>choisir une config</option>
                        {props.configs.map((config, index) => {
                            return <option key={index} value={config.name}>{config.name}</option>
                        })}
                    </select>
                    <button type='button' name='removeOne' onClick={remove}>Supprimer cette config</button>
                    <button type='button' name='removeAll' onClick={remove}>Supprimer toutes les configs</button>
                </form>
            </div>
}