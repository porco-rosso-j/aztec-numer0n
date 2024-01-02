import { AccountWalletWithPrivateKey } from "@aztec/aztec.js"
import { Grid } from "@mantine/core"
import { useState } from "react"
import Card from "./Card"

export default function Player ({numLen, wallet}: {numLen: number, wallet: AccountWalletWithPrivateKey}) {
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