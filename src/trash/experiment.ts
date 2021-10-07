import * as fs from 'fs';

let dice: number[] = [4, 6, 8, 10, 12]
let maxDice = 10;
let outputFileName = 'experiment.txt'

function orderDice() {
    let diceRolls: {
        die: number,
        num: number,
        average: number
    }[] = [];

    dice.forEach((die) => {
        for (let i=1; i<=maxDice; i++) {
            diceRolls.push({
                die: die,
                num: i,
                average: (die/2 + .5) * i
            })
        }
    });

    diceRolls.sort((a, b) => {
        return a.average - b.average;
    });

    let toWrite = '';
    diceRolls.forEach((diceRoll)=>{
        toWrite += `${diceRoll.num}d${diceRoll.die}:\t\t${diceRoll.average}\n`
    })
    fs.writeFile(outputFileName, toWrite, (err) => {
        if (err) {return console.log('error')};
    });
}

orderDice();