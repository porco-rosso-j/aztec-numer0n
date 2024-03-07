# Rule Book

Numer0n is a strategic number-guessing game in which two players compete to guess the opponent's 3-digit secret numbers first.

## Basics

- The secret number set by each player consists of 3 digits (0-9) with no duplication, e.g. 013, 591, 854, etc...
- Players take turns and can only guess once at each turn.
- The one who correctly guesses the opponent's secret number first wins.
- Eat & Bite: a feedback mechanism given at each guessing that helps players guess numbers
  - Eat: Both the digit and its position are correct.
  - Bite: The digit is included in the opp's secret number, but the position is incorrect.
  - E.g. If one's secret number is 154 and a guess is 524, the result is 1-1 ( 1 eat & 1 bite ).
- The game is a draw if both players correctly guess the opponent's number in the same round.
- The one who creates the game is the first mover.

## Items
- Players can use an item before guessing at each turn.
- The same item can only be used once by each player per game.
- Items 1-3 are for attacking, while items 4-5 are defensive. 

### 1. High & Low:
It tells you if each number in the opponent's secret number is >4.  
e.g. 351 => ↓↑↓, 901 => ↑↓↓.

### 2. Slash: 
It tells the difference between the highest and lowest digit in the secret number.   
e.g. 5 for 835

### 3. Target: 
It tells the digit position in the secret number for a target number you pick.   
e.g. if my secret number is 381 and you pick 8 as the target, the answer is "8 is in 10's place"

### 4. Change: 
It allows you to change one of the digits in your secret number.   
e.g. 512 => 812 

### 5. Shuffle: 
It allows you to shuffle the orders in your secret number.   
e.g. 351 => 513


