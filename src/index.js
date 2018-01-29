import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Alternative to Square Component
function Square(props) {
  let style;
  if(props.color){
    if(props.bold!=null){
      style={
        fontWeight:"bold",
        backgroundColor:"#333",
      }
      return (
        <button className="square" onClick={props.onClick} style={style}>
          {props.value}
        </button>
      );
    }
    else{
      style={
        fontWeight:"normal",
        backgroundColor:"#333",
      }
      return (
        <button className="square" onClick={props.onClick} style={style}>
          {props.value}
        </button>
      );
    }
  }
  else{
    if(props.bold!=null){
      style={
        fontWeight:"bold",
        backgroundColor:"white",
      }
      return (
        <button className="square" onClick={props.onClick} style={style}>
          {props.value}
        </button>
      );
    }
    else{
      style={
        fontWeight:"normal",
        backgroundColor:"white",
      }
      return (
        <button className="square" onClick={props.onClick} style={style}>
          {props.value}
        </button>
      );
    }
  }
  
}

class Board extends React.Component {
  renderSquare(i) {
    if(i===this.props.win[0] || i===this.props.win[1] || i===this.props.win[2])
    {
      if(i===this.props.bold)
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} bold={this.props.bold} color="1"/>;
      else
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} color="1"/>;
    }
    else
    {
      if(i===this.props.bold)
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} bold={this.props.bold}/>;
      else
      return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>;
    }
    
  }

  render() {
    let board=Array.apply(null,{length:100});
    console.log(board.length);

    //THIS DOESNT WORK
    // for(let i=0;i<9;i+=3)
    // {
    //   board.push(<div className='board-row'>);
    //   for(let j=0;j<3;j++)
    //   {
    //     board.push(this.renderSquare(i+j));
    //   }
    //   board.push(</div>);
    // }
    return (
      <div>
        {[0,3,6].map((val,i)=>{
          return <div className='board-row'>
            {[0,1,2].map((txt,j)=>{
              // console.log(val+j);
              return this.renderSquare(val+j);
            })}
          </div>
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares : Array(9).fill(null),
      }],
      curBlock:-1,
      colRow:[],
      winnerLine:[],
      stepNumber:0,
      xIsNext:true,
    };
  }
  
  handleClick(i){
    const history=this.state.history.slice(0,this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    const colRow=this.state.colRow.slice(0,this.state.stepNumber+1);
    if(calculateWinner(squares)){
      const lines=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];
      for(let k=0;k<lines.length;k++){
        const [a,b,c]=lines[k];
        if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c])
        {
          this.setState({
            winnerLine:[a,b,c],
          });
        }
      }
    }
    else{
      this.setState({
        winnerLine:[],
      });
    }
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i]=(this.state.xIsNext)?'X':'O';
    colRow.push({col:Math.floor((i%3)+1),row:Math.floor(i/3+1)});
    console.log(colRow);
    this.setState({
      history:history.concat([
        {squares:squares,}
      ]),
      colRow:colRow,
      curBlock:i,
      stepNumber:history.length,
      xIsNext:!this.state.xIsNext,
    });
  }

  jumpTo(step){
    let position=this.state.colRow[step-1];
    position=(position.row-1)*3+position.col-1;
    // console.log(position);
    const history=this.state.history.slice(0,this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if(calculateWinner(squares)){
      const lines=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];
      for(let k=0;k<lines.length;k++){
        const [a,b,c]=lines[k];
        if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c])
        {
          this.setState({
            winnerLine:[a,b,c],
          });
        }
      }
    }
    else{
      this.setState({
        winnerLine:[],
      });
    }
    this.setState({
      stepNumber:step,
      curBlock:position,
      xIsNext:(step%2)===0,
    });
  }
  render() {
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const squares=current.squares.slice();
    const winner=calculateWinner(squares);
    const moves=history.map((step,move)=>{
      // console.log(step.squares);
      // console.log(move);
      const desc= move ? 'Go to move #'+move:'Go to start';
      let colRow;
      if(move>0){
        colRow=this.state.colRow[move-1];
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} >{desc}</button>
            <p>col:{colRow.col} & row:{colRow.row}</p>
          </li>
        )
      }
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} >{desc}</button>
        </li>
      )
    });
    let status;
    if(winner){
      status='winner is : '+winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i)=>this.handleClick(i)} bold={this.state.curBlock} win={this.state.winnerLine}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i=0;i<lines.length;i++){
    const [a,b,c]=lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c])
    return squares[a];
  }
  return null;
}