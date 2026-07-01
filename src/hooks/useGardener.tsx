import { useState, useEffect } from "react";
export interface GardenerProps {
    width: number;
    setWidth: (w: number) => void;
    height: number;
    setHeight: (h: number) => void;
    orientation: string;
    setOrientation: (o: string) => void;
    matrix: string[][];
    setMatrix: (v: string[][]) => void;
}
function useGardener():GardenerProps {
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(8);
    const [orientation, setOrientation] = useState('south');
    const [matrix, setMatrix] = useState<string[][]>(() =>
        Array.from({ length: 8 }, () => Array(10).fill('emptiness'))
    );

    useEffect(() => {
        setMatrix(prev => Array.from({ length: height }, (_, h) =>
            Array.from({ length: width }, (_, w) => prev[h]?.[w] ?? "emptiness")
        ));
    }, [width, height]);
	return { width, setWidth, height, setHeight, orientation, setOrientation, matrix, setMatrix };
}

export default useGardener;
