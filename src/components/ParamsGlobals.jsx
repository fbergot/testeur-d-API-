import React from 'react';
import QueryInit from '../class/Query';
import BodyQuery from './BodyQuery';
import { DisplayData , Wait , Error} from './DisplayData';
import SaveConfig from './SaveConfig';
import LocalStorage from "../class/LocalStorage";
import Utilitary from "../class/Utilitary";
import SelectConfig from './SelectConfig';
import NoConfig from './NoConfig';

export default class ParamsGlobals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // query params
      url_input: "",
      methode_select_input: "GET",
      // response
      responseData: "",
      display: false,
      // progress
      inProgress: false,
      // errors
      error: [],
      // bodyQuery 
      input_name_bodyQuery: "",
      input_value_bodyQuery: "",
      list_fields: [],
      // save config
      displaySaveConfig: false,
      inputNameConfig: '',
      arrayConfigs: [],
      selectedConfig : null
    };

    this.handleChange_input = this.handleChange_input.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.onChangeList = this.onChangeList.bind(this);
    this.handleDisplaySaveConfig = this.handleDisplaySaveConfig.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.onSaveConfig = this.onSaveConfig.bind(this);
    this.onSelectedConfig = this.onSelectedConfig.bind(this);
    this.removeConfig = this.removeConfig.bind(this);
	  this.onDeleteItemList = this.onDeleteItemList.bind(this);
  }

  componentDidMount() {
    this.getAndLoadConfigs();
  }

  getAndLoadConfigs() {
    // for load the configs of localStorage in state.arrayConfigs
    const arrConfigString = LocalStorage.getConfig();
    const arrConfigObj = [];

    for (let i = 0; i < arrConfigString.length; i++) {
      arrConfigObj.push(JSON.parse(arrConfigString[i]));
    }

    this.setState(function (state) {
      const selectConfig = arrConfigObj.length ? 'init' : "";
      return { arrayConfigs: arrConfigObj, selectedConfig: selectConfig };
    });
  }

  handleChange_input(e) {
    if (e.target.type === "text") {
      this.setState(() => {
        return {
          url_input: e.target.value
        };
      });
    } else {
      this.setState(() => {
        return {
          methode_select_input: e.target.value
        };
      });
    }
  }

  handleChangeInput(value, nameField) {
    if (nameField === "valueField") {
      this.setState({ input_value_bodyQuery: value });
    } else if (nameField === "saveConfig") {
      this.setState({ inputNameConfig: value });     
    } else {
      this.setState({ input_name_bodyQuery: value });
    }
  }

  // toogle affichage de la zone d'enregistrement de la configuration
  handleDisplaySaveConfig(e) {
    this.setState({ inputNameConfig: "" });
    this.state.displaySaveConfig ? this.setState({ displaySaveConfig: false }) :  
      this.setState({ displaySaveConfig: true });              
  }

  // Ajoute des champs pour le coeur de la requête dans le state et fait des vérifs avant
  onChangeList() {

    const errArray = [];

    if (this.state.input_name_bodyQuery === "") {
      errArray.push("Le champs <Clé> ne doit pas être vide");
    }

    if (this.state.input_value_bodyQuery === "") {
      errArray.push("Le champs <Valeur> ne doit pas être vide");
    }

    this.setState((state) => {
      const errArr = this.createError(...errArray);
      return { error: errArr };
    });

    if (errArray.length === 0) {
      const copyList = this.state.list_fields.slice();
      const newField = [];    
      newField.push(this.state.input_name_bodyQuery, this.state.input_value_bodyQuery);
      copyList.push(newField);
      this.setState({ list_fields: copyList , input_name_bodyQuery: "" , input_value_bodyQuery: '' });          
    }    
  }
	
	/**
	 * for deleting items in state.list_fields
	 *
	 * @param {Number} indexItem index of element for deleting
	 * @memberof ParamsGlobals
	 */
	onDeleteItemList(indexItem) {
		const tempArrayListItemCopy = this.state.list_fields.slice();
		tempArrayListItemCopy.splice(indexItem, 1);
		this.setState({ list_fields: tempArrayListItemCopy });
  	}

  createError(...messages) {
    const errArrCopy = [];
    for (let i = 0; i < messages.length; i++) {
      errArrCopy.push(messages[i]);
    }
    return errArrCopy;
  }

  // initialise des requête avec axios
  async runQuery() {
    // réinitialise les erreurs éventuelles :
    this.setState({ error: [] });
    // verify is field empty
    if (this.verifIfEmpty(this.state.url_input) || this.verifIfEmpty(this.state.methode_select_input)) {
      this.setState((state) => {
        const errArr = this.createError("L'url ou la méthode ne peut être vide pour faire une requête HTTP");
        return { error: errArr };
      });
      return;     
    }
    const arrayParamsQuery = Utilitary.makeObjQuery([this.state.url_input, this.state.methode_select_input] , [...this.state.list_fields]);
    console.log(arrayParamsQuery);
    this.setState((state) => {
      return { inProgress: !state.inProgress };
    });
    const response = await QueryInit.getInstance().dispatchAccordingToMethod(arrayParamsQuery[0], arrayParamsQuery[1]);
    console.log(response);
    if (response) {
      const data = await response.data;
      console.log(data);
      this.setState((state) => {
        return { responseData: data, display: true, inProgress: !state.inProgress };
      });
    } else {
      this.setState((state) => {
        const errArr = this.createError("Il y a eu une erreur, aucune donnée reçu");
        return { responseData: "", display: false, inProgress: !state.inProgress, error: errArr };
      });
    }
  }

  verifIfEmpty(keyInState) {
    if(this.state[keyInState] === "") {
      return true;
    }
    return false;
  }

  onSaveConfig() {
    if (this.verifIfEmpty('inputNameConfig')) {
      this.setState((state) => {
        const errArr = this.createError("Il n'y a pas de nom pour la configuration");
        return { error: errArr };
      });
      return;
    }
    if (this.verifIfEmpty('url_input')) {
      this.setState((state) => {
        const errArr = this.createError("L'url est vide");
        return { error: errArr };
      });
      return;
    }
    const LocalSLength = LocalStorage.getLength();
    const makeName = `config${LocalSLength + 1}`;

    // make name/objConfig-stringify for localStorage
    const arrayConfGlob = Utilitary.makeObjConfig(
      [makeName, this.state.inputNameConfig, this.state.url_input, this.state.methode_select_input, this.state.list_fields]);
    // set item in localStorage
    LocalStorage.setOne(arrayConfGlob[0], arrayConfGlob[1]);
    console.log('ok objet in localstorage !');
    this.setState({ inputNameConfig: '' });
    this.getAndLoadConfigs();
  }

  dispatchParamsConfigInState(nameConf) {
   
    // get good config in state.arrayConfigs
    let objConf;
    this.state.arrayConfigs.forEach((config) => {
      if (nameConf === config.name) {
        objConf = config;
      }
    });
    const arrayFields = [...objConf.listFields];
    this.setState((state) => {
      return { url_input: objConf.url, methode_select_input: objConf.method, list_fields: arrayFields };
    });
  }

  onSelectedConfig(nameConfig) {
    this.setState({
      selectedConfig: nameConfig
    });
    this.dispatchParamsConfigInState(nameConfig);
  }

  removeConfig(switch_bool = false) {
    if (!switch_bool) {
      console.log('one');
      let config;
      const newArray = [...this.state.arrayConfigs];
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].name === this.state.selectedConfig) {
          config = newArray[i];
        }
      }
      LocalStorage.removeOneOrAll(config.localStorageName , false);     
    } else {
      console.log("all");
      LocalStorage.removeOneOrAll('', true);           
    }
    this.getAndLoadConfigs();

  }

  render() {
    let arrayError;
    if (this.state.error.length !== 0) {
      arrayError = this.state.error.map((error, index) => {
        return <Error message={error} key={index} />;
      });
    }
    return (
      <div>
        {/* div url/method */}
        <div className="url_method">
          <div className="content_url_input">
            <label htmlFor="url_input">URL</label>
            <input
              onChange={this.handleChange_input}
              value={this.state.url_input}
              type="text"
              id="url_input"
              placeholder="http..."
              className="input_url"
            />
          </div>

          <div className="method_content">
            <label htmlFor="method_select">Méthode HTTP</label>
            <select
              onChange={this.handleChange_input}
              value={this.state.methode_select_input}
              id="method_select"
              className="input_select_method"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        </div>
        <div className="buttonContainer">
          <button type="button" onClick={this.runQuery}>
            Lancer la requête
          </button>
        </div>
        <div className="selectConfigContainer">
          {this.state.arrayConfigs.length !== 0 ? (
            <SelectConfig
              changeSelected={this.onSelectedConfig}
              configs={this.state.arrayConfigs}
              value={this.state.selectedConfig}
              onRemove={this.removeConfig}
            />
          ) : (
            <NoConfig text="Aucune configuration en mémoire" />
          )}
          <button
            className="saveConfig"
            type="button"
            onClick={this.handleDisplaySaveConfig}
          >
            {!this.state.displaySaveConfig
              ? "Sauvegarder cette config"
              : "Reduire"}
          </button>
        </div>
        <div></div>
        {/* {JSON.stringify(this.state)} */}

        {this.state.inProgress && <Wait message="En attente des données ..." />}
        {this.state.methode_select_input === "POST" ||
        this.state.methode_select_input === "PUT" ? (
          <BodyQuery
            nameQuery={this.state.input_name_bodyQuery}
            valueQuery={this.state.input_value_bodyQuery}
            onChangeInput={this.handleChangeInput}
            list={this.state.list_fields}
            changeList={this.onChangeList}
            deleteItem={this.onDeleteItemList}
          />
        ) : null}
        {this.state.displaySaveConfig && (
          <SaveConfig
            onSave={this.onSaveConfig}
            value={this.state.inputNameConfig}
            changeValue={this.handleChangeInput}
          />
        )}
        {arrayError}
        {this.state.display && <h3 className='headingResult'>Résultat(s) de la requête :</h3>}
        {this.state.display && <DisplayData data={this.state.responseData} />}
      </div>
    );
  }
}