import Player from "./Player";

export default function PlayerBoard({numLen, wallet}) {
    return (
      <>
        <Player numLen={numLen} wallet={wallet}/>
      </>
    )
  }