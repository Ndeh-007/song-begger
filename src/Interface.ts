import React from "react";

export interface ISong{
    title: string,
    artist: string,
    image: string,
    id:string,
    spotifyLink?: string,
    previewLink?:string,
    href?: string,
}

export interface IGlobalStateStore {
    GlobalState: IGlobalState;
    dispatch: React.Dispatch<IReducerOptions>;
}

export interface IGlobalState {
    PLAYER_CONTROLS: IPlayerControlOptions,
}

export interface IPlayerControlOptions{
    song?:ISong,
    state: boolean
}

export interface IReducerOptions {
    dataType: "init" | "player";
    payload: IPlayerControlOptions | null;
}