import "../styles/matrixBoard.css"
function MatrixBoard({ weight, height,  orientation}: { weight: any; height: any, orientation:any}) {

    const matrixCells: JSX.Element[] = [];
    for (let h: number = 0; h < height; h++){
        const rows: JSX.Element[] = [];
        for(let w: number = 0; w < weight; w++){
            if(h == 0 && w == 0)
                rows.push(
                <button key={`${w}-${h}`} className="cell cellRobot">0
                    <span className={`direction-line ${orientation}`}></span>
                </button>
                );
            else
                rows.push(
                <button key={`${w}-${h}`} className="cell">0</button>
            );
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