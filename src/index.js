import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props){
    const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
        <button className={className} onClick = {props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                highlight={this.props.winnerLine && this.props.winnerLine.includes(i)}
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    renderBoard = (squares) => {
        const content = [];
        for (let i = 0; i < squares.length; i += 3) {
            const row = [];
            for (let j = i; j < i + 3; j++) {
                row.push(this.renderSquare(j));
            }
            content.push(
                <div key={i} className='board-row'>
                    {row}
                </div>
            );
        }
        return content;
    };
    render() {
        return <div>{this.renderBoard(this.props.squares)}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }
    handleClick(i) {
        const newHistory = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: newHistory.concat([{
                squares: squares,
                step: i
            }]),
            stepNumber: newHistory.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    handleReset = () => {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscending: true,
        });
    };
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    convertToLocation = (step) => {
        const col = (step % 3) + 1;
        const row = Math.trunc(step / 3) + 1;
        return [row, col];
    };
    handleSortToggle=()=> {
        this.setState({
            isAscending: !this.state.isAscending,
        });

    };
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        const moves = history.map((item, index) => {
            const [row, col] = this.convertToLocation(item.step);
            const desc = index ?
                'Go to move #' + index + ' (' + col + ', ' + row + ')':
                'Go to game start';
            return (
                <li key={index}>
                    <button 
                    className={classnames({ 'selected-item': this.state.stepNumber === index })}
                    onClick={() => this.jumpTo(index)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else if (winInfo.isDraw) {
            status = "Draw";
        } 
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        if (!this.state.isAscending) {
            moves.reverse();
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={winInfo.line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={this.handleReset}>Reset</button>
                    <button onClick={this.handleSortToggle}>
                    {this.state.isAscending ? 'Ascending' : 'Descending'}
                </button>
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

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i],
                isDraw: false,
            };
        }
    }
    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            isDraw = false;
            break;
        }
    }
    return {
        winner: null,
        line: null,
        isDraw: isDraw,
    };
}
