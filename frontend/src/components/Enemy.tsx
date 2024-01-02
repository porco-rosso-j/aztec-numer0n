import { Grid } from "@mantine/core"
import { useState } from "react"
import Card from "./Card"

export default function Enemy({numLen}: {numLen: number}) {
    const [nums, setNums] = useState<number[]>(Array(numLen).fill(null))
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