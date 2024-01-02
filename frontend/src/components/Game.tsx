import { AccountWalletWithPrivateKey, AztecAddress, PXE, createPXEClient, getSandboxAccountsWallets, waitForSandbox } from "@aztec/aztec.js";
import { useEffect, useState } from "react";
import { Numer0nContract } from "../artifacts/Numer0n";
import { Button, Container, SimpleGrid, TextInput } from "@mantine/core";
import PlayerBoard from "./PlayerBoard";
import EnemyBoard from "./EnemyBoard";
import Call from "./Call";

export default function Game() {
    const [pxe, setPXE] = useState<PXE>();
    const [playerWallet, setPlayerWallet] = useState<AccountWalletWithPrivateKey>();
    const [gameID, setGameID] = useState<string>("");
    const registryAddr = AztecAddress.fromString("0x239a5f10f6b315de7d53fafe718ca522c8172443634b36fc089f639c72b3a690")
    
    // Init pxe
    useEffect(() => {
      if (pxe) return
      (async () => {
        // const logger = createDebugLogger('app');
  
        // We create PXE client connected to the sandbox URL
        const pxe = createPXEClient("http://localhost:8080");
        // Wait for sandbox to be ready
        await waitForSandbox(pxe)
        const nodeInfo = await pxe.getNodeInfo();
        console.log('Aztec Sandbox Info ', nodeInfo);
        // logger()
        // format
        setPXE(pxe)
      })()
    }, [pxe]);
  
    // Use Sandbox Account
    (async ()=> {
      if (playerWallet) return
      if (!pxe) return
      const [player]: AccountWalletWithPrivateKey[] = await getSandboxAccountsWallets(pxe);
      setPlayerWallet(player)
    })()
  
    async function handleStart() {
      if (!playerWallet) return
      const gameID = 100n
      const receipt = await Numer0nContract.deploy(playerWallet, gameID, playerWallet.getAddress()).send().wait()
      console.log("contract deployed\naddress: %s\ntxHash:%s", receipt.contractAddress , receipt.txHash)
      // const registryContract = await RegisryContract.at(registryAddr, playerWallet)
      // const addGameReceipt = await registryContract.methods.add_game(receipt.contractAddress).send().wait()
      // console.log("add_game\ntxHash\n%s",JSON.stringify(addGameReceipt))
      // const count = await registryContract.methods.get_current_count().view()
      // alert(`gameID: ${gameID}\ncount: ${count}`)
  
    }
  
    async function handleJoin() {
      // if (!playerWallet) return
      // const registryContract = await RegisryContract.at(registryAddr, playerWallet)
      // registryContract.methods.
      
      // const tx = await Numer0nContract.at(registryAddr, playerWallet)
    }
  
    const numLen = 3
    return (
      <>
        <Container style={{outline: "1px solid pink"}}>
          <TextInput
            onChange={(event) => setGameID(event.currentTarget.value)}
            value={gameID}
            placeholder="GameID"
          />
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleJoin}>Join</Button>
          <SimpleGrid cols={2}>
            <PlayerBoard numLen={numLen} wallet={playerWallet}></PlayerBoard>
            <EnemyBoard numLen={numLen}></EnemyBoard> 
          </SimpleGrid>
          <Call numLen={numLen} pxe={pxe}/>
        </Container>
        {/* <Container>
          <Call numLen={numLen} nums={callingNums}/>
        </Container> */}
      </>
    )
  }