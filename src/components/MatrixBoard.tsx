import "../styles/matrixBoard.css"
function MatrixBoard({ weight, height }: { weight: any; height: any }) {
    const matrixCells: JSX.Element[] = [];
    for (let h: number = 0; h < height; h++){
        const rows: JSX.Element[] = [];
        for(let w: number = 0; w < weight; w++){
            rows.push(<button key={`${w}-${h}`} className="cell">0</button>);
        }
        matrixCells.push(<div key={h} className="matrix-row">{rows}</div>);
    }
    return(
        <div className="matrix-grid">
                {matrixCells}
        </div>

    );
}

export default MatrixBoard