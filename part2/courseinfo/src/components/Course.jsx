const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    props.parts.map(partElem => <Part part={partElem.name} exercises={partElem.exercises} key={partElem.id} />)
  )
}

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = ({course}) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return(
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total total={totalExercises}/>
        </div>
    )
}

export default Course