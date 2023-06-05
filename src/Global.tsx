import {IGlobalState, IGlobalStateStore, IPlayerControlOptions, IReducerOptions} from "./Interface";
import React, {createContext, useContext, useReducer} from "react";

const GlobalReducer = (state: IGlobalState, Options: IReducerOptions) => {
    const newState = {...state};

    if (Options.dataType === "init") {
        return {...newState};
    }

    switch (Options.dataType) {
        case "player":
            newState.PLAYER_CONTROLS = Options.payload as IPlayerControlOptions;
            break; 
        default:
            throw new Error("Global context update error");
    }

    return newState;
};

const PLAYER_CONTROLS:IPlayerControlOptions = {
    state:false
};


const INITIAL_STATE: IGlobalState = {PLAYER_CONTROLS};

const useGlobalStateContext = () => useContext(GlobalStateContext);

const GlobalStateContext = createContext<IGlobalStateStore>({
    GlobalState: INITIAL_STATE,
    dispatch: (Options) => {
        GlobalReducer(INITIAL_STATE, Options);
    },
});


const GlobalStateProvider: React.FC<{ children: JSX.Element }> = ({children}) => {
    const [GlobalState, dispatch] = useReducer(GlobalReducer, INITIAL_STATE);
    return <GlobalStateContext.Provider value={{GlobalState, dispatch}}>{children}</GlobalStateContext.Provider>;
};

export {GlobalStateProvider, useGlobalStateContext};