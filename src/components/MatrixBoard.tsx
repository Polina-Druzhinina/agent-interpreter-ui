import "../styles/matrixBoard.css";
import "../styles/robots.css";
interface MatrixBoardProps {
	width: number;
	height: number;
	orientation: string;
	matrix: string[][];
	onCellClick?: (h: number, w: number) => void;
}
function MatrixBoard({ width, height, orientation, matrix, onCellClick }: MatrixBoardProps) {
	
	const toolValues: Record<string, number> = {
		emptiness: 0,
		wall: -1,
		rose: 1,
		mint: 2,
		cornflower: 3,
	};

	const matrixCells: JSX.Element[] = [];
	for (let h: number = 0; h < height; h++) {
		const rows: JSX.Element[] = [];
		for (let w: number = 0; w < width; w++) {
			const cellClass: string = matrix?.[h]?.[w] ?? "emptiness";
			const cellValue: number = toolValues[cellClass];
			if (h === 0 && w === 0) {
				rows.push(
					<button
						onClick={onCellClick?.bind(null, h, w)}
						key={`${w}-${h}`}
						className={`cell cellRobot ${cellClass}`}
					>
						{cellValue}
						<span className={`direction-line ${orientation}`}></span>
					</button>,
				);
			} else {
				rows.push(
					<button
						onClick={onCellClick?.bind(null, h, w)}
						key={`${w}-${h}`}
						className={`cell ${cellClass}`}
					>
						{cellValue}
					</button>,
				);
			}
		}
		matrixCells.push(
			<div key={h} className="matrix-row">
				{rows}
			</div>,
		);
	}
	return <div className="matrix-grid">{matrixCells}</div>;
}

export default MatrixBoard;
