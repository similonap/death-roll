import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DeathRollingSimulationComponent() {
  const [wager, setWager] = useState(5)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [currentRoll, setCurrentRoll] = useState(0)
  const [player1Turn, setPlayer1Turn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [player1Probability, setPlayer1Probability] = useState(0)
  const [customWager, setCustomWager] = useState(5)

  const calculateProbability = useCallback((amount: number) => {
    let probability = 1
    let currentRoll = amount

    while (currentRoll > 1) {
      probability *= (currentRoll - 1) / currentRoll
      currentRoll--
    }

    return 1 - probability
  }, [])

  useEffect(() => {
    setPlayer1Probability(calculateProbability(wager))
  }, [wager, calculateProbability])

  const startGame = useCallback(() => {
    setGameLog([`Game started with a wager of ${wager}g`])
    setCurrentRoll(wager)
    setPlayer1Turn(true)
    setGameOver(false)
    setWinner(null)
  }, [wager])

  const roll = useCallback(() => {
    const newRoll = Math.floor(Math.random() * currentRoll) + 1
    const player = player1Turn ? "Player 1" : "Player 2"
    setGameLog((prev) => [...prev, `${player} rolled: ${newRoll}`])
    
    if (newRoll === 1) {
      setGameOver(true)
      setWinner(player1Turn ? "Player 2" : "Player 1")
    } else {
      setCurrentRoll(newRoll)
      setPlayer1Turn((prev) => !prev)
    }
  }, [currentRoll, player1Turn])

  const predefinedWagers = [2, 10, 25, 50, 100]

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Death Rolling Simulation</h1>
      
      <Tabs defaultValue="game">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Death Rolling Game</CardTitle>
              <CardDescription>Set your wager and start rolling!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="number"
                  min="5"
                  value={wager}
                  onChange={(e) => setWager(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-24"
                />
                <Button onClick={startGame}>Start Game</Button>
                <Button onClick={roll} disabled={gameOver}>Roll</Button>
              </div>
              
              <div className="mb-4">
                <p>Current wager: {wager}g</p>
                <p>Current roll: {currentRoll}</p>
                <p>Player 1 win probability: {(player1Probability * 100).toFixed(2)}%</p>
              </div>
              
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                {gameLog.map((log, index) => (
                  <p key={index}>{log}</p>
                ))}
                {gameOver && <p className="font-bold">{winner} wins!</p>}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistical Analysis</CardTitle>
              <CardDescription>Explore the odds for different wagers</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Predefined Wagers</h3>
              <ul className="list-disc pl-5 mb-4">
                {predefinedWagers.map((w) => (
                  <li key={w}>
                    Wager {w}g: Player 1 loss probability {(calculateProbability(w) * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mb-2">Custom Wager Calculator</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  type="number"
                  min="2"
                  value={customWager}
                  onChange={(e) => setCustomWager(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-24"
                />
                <span>Player 1 loss probability: {(calculateProbability(customWager) * 100).toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>How to Play Death Rolling</CardTitle>
              <CardDescription>Learn the rules and strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Two players agree on a wager amount (minimum 5g).</li>
                <li>The first player rolls a number between 1 and the wager amount.</li>
                <li>The second player then rolls between 1 and the number the first player rolled.</li>
                <li>Players continue taking turns, rolling between 1 and the previous roll.</li>
                <li>The game ends when a player rolls a 1, resulting in their loss.</li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Understanding the Odds</h3>
              <p>
                The probability of winning changes with each roll. The player who goes second has a slight advantage,
                as they always have one less number to potentially roll. However, as the numbers get smaller,
                the chances of rolling a 1 increase for both players.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Strategy</h3>
              <p>
                While Death Rolling is largely a game of chance, choosing the initial wager amount can affect your
                overall odds of winning. Higher wagers generally give a slight advantage to the first player,
                as there are more numbers to roll before reaching 1.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}