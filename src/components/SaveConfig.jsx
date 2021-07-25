export default function SaveConfig(props) {

  const Save = function (e) {
    props.onSave();
    }
  const onChangeInput = function (e) {        
        props.changeValue(e.target.value , e.target.name)
    }
    return (
      	<div className="save_config">
			<form>
				<label htmlFor="saveConfig">Nom de la configuration</label>
				<div>
					<input
						onChange={onChangeInput}
						value={props.value}
						type="text"
						id="saveConfig"
						name="saveConfig"
						className='input_save_config'
						placeholder='nom configuration'
					/>
				</div>
				<button type="button" onClick={Save}>
					Enregistrer
				</button>
          	</form>
      	</div>
	);
}