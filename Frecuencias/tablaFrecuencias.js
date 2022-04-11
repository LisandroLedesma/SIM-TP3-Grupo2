const btnExportToExcelChi = document.getElementById('btnExportToExcelChi');

let gridOptions = {};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
}

const getNumbersUnif = () => {
    randUnif = window.randUnif;

    let aux = [];
    randUnif.forEach(rnd => {
        aux.push(rnd.Aleatorio);
    });

    return aux;
}

const getNumbersExp = () => {
    randExp = window.randExp;

    let aux = [];
    randExp.forEach(rnd => {
        aux.push(rnd.Aleatorio);
    });

    return aux;
}

const getNumbersNorm = () => {
    randNorm = window.randNorm;

    let aux = [];
    randNorm.forEach(rnd => {
        aux.push(rnd.Aleatorio);
    });

    return aux;
}

const generarTabla = (filas) => {
    const eGridDiv = document.querySelector('#gridFrecuencia');

    let columnDefs = [
        { field: "LimInf" },
        { field: "LimSup" },
        { field: "MC" },
        { field: "Fe" },
        { field: "Fo" },
        { field: "Estadístico" },
    ];

    let rowData = [];
    filas.forEach((fila) => {
        let row = {
            "LimInf": fila.lim_inf,
            "LimSup": fila.lim_sup,
            "MC": fila.marca_clase,
            "Fe": fila.fe,
            "Fo": fila.fo,
            "Estadístico": fila.estadistico,
        }
        rowData.push(row);
    })

    gridOptions = {
        columnDefs,
        rowData
    };


    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();
}

const test = (type) => {
    const select = document.getElementById("intLineal");
    const intervalos = select.value;
    const spanL = document.getElementById('resL');
    const spanLD = document.getElementById('dataL');

    const numeros = "";
    if (type === "uniforme") numeros = getNumbersUnif();
    else if (type === "exponencial") numeros = getNumbersExp();
    else numeros = getNumbersNorm();
    numeros.sort();

    const max = numeros[numeros.length - 1];
    const min = numeros[0];
    const paso = Number(((max - min) / intervalos) + 0.0001);

    let [suma, filas] = sumatoria(numeros, min, max, intervalos, paso);


    let [res, sum, tabla] = prueba(intervalos, suma);

    sum = truncateDecimals(Number(sum), 4);

    spanLD.innerHTML = `<span>Estadistico: ${sum}. Valor de tabla: ${tabla}</span>`;


    if (res) {
        spanL.innerHTML = `<span style="color: green">No se rechaza la hipotesis</span>`;
    } else {
        spanL.innerHTML = `<span style="color: red">Se rechaza la hipotesis</span>`;
    }

    generarTabla(filas);
    generarHistogramaL(filas, paso);
}

const sumatoria = (nros, minimo, maximo, int, paso) => {
    let filas = [];
    let suma = 0;
    let min = minimo;

    for (let i = 0; i < int; i++) {

        if (i == 0) {
            lim_inf = Number(min);
            lim_sup = truncateDecimals((Number(min) + Number(paso)), 4);
        } else {
            lim_inf = Number(lim_sup);
            lim_sup = truncateDecimals((Number(lim_sup) + Number(paso)),4);
        }

        let fila = new Object();

        let mc = truncateDecimals((lim_inf + (lim_sup - lim_inf) / 2), 4);
        fila.marca_clase = Number(mc);
        fila.lim_inf = Number(lim_inf);
        fila.lim_sup = Number(lim_sup);
        fila.fo = frecObs(nros, lim_inf, lim_sup);
        fila.fe = nros.length / int;
        // TODO Esto no va
        fila.estadistico = ((fila.fe - fila.fo) ** 2) / fila.fe;
        // esto tampoco
        suma = truncateDecimals((Number(suma) + Number(fila.estadistico)),4);

        filas.push(fila);

    }

    return [suma, filas];

}

const frecObs = (nros, inf, sup) => {
    fo = 0;
    ord = nros;

    ord.forEach((numero) => {
        if (numero >= inf && numero < sup) {
            fo += 1;
        }
    });

    return fo;
}