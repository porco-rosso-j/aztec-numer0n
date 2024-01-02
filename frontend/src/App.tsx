import "@mantine/core/styles.css";
import { MantineProvider, Box,Button, PinInput, Card as MantineCard, Grid, AspectRatio, Center, Container, AppShell, SimpleGrid, TextInput } from "@mantine/core";
import { theme } from "./theme";
import { useEffect, useState } from "react";
import { NumberFormatValues } from 'react-number-format';
import { createDebugLogger, createPXEClient, waitForSandbox, PXE, AztecAddress, Contract, AccountWalletWithPrivateKey, getSandboxAccountsWallets } from "@aztec/aztec.js";
import { format } from 'util';
import { Numer0nContract } from "./artifacts/Numer0n";
import { RegisryContract } from "./artifacts/Regisry";

export default function App() {
  return (
    <MantineProvider theme={theme}>    
      <AppShell withBorder>
        <AppShell.Main >
          <Game>
          </Game>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

function Game() {
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

function PlayerBoard({numLen, wallet}) {
  return (
    <>
      <Player numLen={numLen} wallet={wallet}/>
    </>
  )
}

function EnemyBoard({numLen}) {
  return (
    <>
      <Enemy numLen={numLen}/>
    </>
  )
}

function Player ({numLen, wallet}: {numLen: number, wallet: AccountWalletWithPrivateKey}) {
  const [nums,setNums] = useState<number[]>(Array(numLen).fill(null))
  const [isInit,setIsInit] = useState(false)
  // console.log(nums)

  function handleSetNum(i: number) {
    return (num: number|string) => {
      if (nums.includes(Number(num))) return

      const nextNums = nums.slice()
      nextNums[i] = Number(num)
      setNums(nextNums)
    }
  }

  return (
    <>
      <Grid style={{outline: "1px solid blue"}}>
        {nums.map((_, i)=>{
            return (<Card key={i} num={nums[i]}/>)
        })}
      </Grid>
      {/* {!(isInit) && <Button variant="filled" color="violet">Start</Button>} */}
    </>
  )
}

function Enemy({numLen}: {numLen: number}) {
  const [nums,setNums] = useState<number[]>(Array(numLen).fill(null))
  // const numLen = 3
  return (
    <>
      <Grid style={{outline: "1px solid red"}}>
        {nums.map((n, i)=>{
          return (<Card key={i} num={n}/>)
          })}
      </Grid>
    </>
  )
}

function CallHistory() {
}

function Card({
  num,
  // onSetNum,
  // isInit
}) {

  // function isValidNum(newNum: NumberFormatValues) {
  //   return  Number(newNum.value) >= 0 && Number(newNum.value) <= 9
  // }

  return (
    <Grid.Col 
      // style={{outline: "1px solid red"}} 
      span={4}
      >
      {/* <AspectRatio ratio={1080 / 720} maw={300} mx="auto"> */}
        <MantineCard shadow="sm" padding="lg" radius="lg" withBorder>
          {(num == null)? "?": num}
        </MantineCard>
      {/* </AspectRatio> */}
    </Grid.Col>

    // <NumberInput
    //   min={0}
    //   max={9}
    //   // disabled={isInit}
    //   value={num}
    //   onChange={onSetNum}
    //   isAllowed={isValidNum}
    // />
  )
}

function Call({
  numLen,
  pxe
}) {

  const [input,setInput] = useState<string>()
  // const [input,setInput] = useState<string>()
  // console.log(input)

  // function isValidNum(newNum: NumberFormatValues) {
  //   return  Number(newNum.value) >= 0 && Number(newNum.value) <= 9
  // }
  function handleInput(input: string) {
    const nums = input.split("").map(Number);
    // dup check
    if (nums.length !== new Set(nums).size) return

    
  }

  function handleCall() {
    console.log("scsdcmklvn")
  }

  return (
    <>
      <PinInput 
        type={/^[0-9]*$/}
        inputType="number"
        inputMode="numeric"
        autoFocus={true}
        value={input}
        onChange={setInput}
        length={numLen}
        radius="md"
        size="xl"
        style={{outline: "1px solid purple"}}
        onComplete={handleInput}
        // disabled={isInit}
        // onChange={onSetNum}
      />
      <Button
        variant="filled"
        onClick={handleCall}
      >
        Call
      </Button>
    </>
    // <NumberInput
    //   min={0}
    //   max={9}
    //   // disabled={isInit}
    //   value={num}
    //   onChange={onSetNum}
    //   isAllowed={isValidNum}
    // />
  )
}