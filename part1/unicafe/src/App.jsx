import { useState } from 'react'

const Button = ({text, onClick}) => ( 
  <button onClick={onClick}>
    {text}
  </button> 
)

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const average = all === 0 ? 0 : ((props.good + (props.bad * -1)) / all)
  const positive = all === 0 ? 0 : (props.good / all * 100)
  if (all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.good} />
        <StatisticsLine text="neutral" value={props.neutral} />
        <StatisticsLine text="bad" value={props.bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={average.toFixed(3)} />
        <StatisticsLine text="positive" value={positive.toFixed(3) + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  
  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={handleGoodClick}/>
      <Button text="neutral" onClick={handleNeutralClick}/>
      <Button text="bad" onClick={handleBadClick}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App