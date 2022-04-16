import { getRandomNumberUniforme } from "./Generadores/uniforme.js";
import { getRandomNumberNormal } from "./Generadores/normal.js";
import { getRandomNumberExp } from "./Generadores/exponencial.js";

const btnExportToExcelFrec = document.getElementById('btnExportToExcelFrec');
const btnUniGraf = document.getElementById('btnUniGraf');
const btnExpGraf = document.getElementById('btnExpGraf');
const btnNormalGraf = document.getElementById('btnNormalGraf');

let gridOptions = {};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
}

const getNumbers = (type) => {

    let arrNumb = [];
    if (type === "uniforme") arrNumb = getRandomNumberUniforme();
    else if (type === "exponencial") arrNumb = getRandomNumberExp();
    else arrNumb = getRandomNumberNormal();
    let aux = [];
    arrNumb.forEach(rnd => {
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
        // { field: "Estadístico" },
    ];

    let rowData = [];
    filas.forEach((fila) => {
        let row = {
            "LimInf": fila.lim_inf,
            "LimSup": fila.lim_sup,
            "MC": fila.marca_clase,
            "Fe": fila.fe,
            "Fo": fila.fo,
            // "Estadístico": fila.estadistico,
        }
        rowData.push(row);
    })

    gridOptions = {
        columnDefs,
        rowData
    };

    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();

    btnExportToExcelFrec.removeAttribute("hidden");
}

//****************************************************************************************
const test = (type) => {
    let select = "";
    // const spanL = document.getElementById('resL');
    // const spanLD = document.getElementById('dataL');

    const numeros = getNumbers(type);
    if (type === "uniforme") select = document.getElementById("intUnif");
    else if (type === "exponencial") select = document.getElementById("intExp");
    else select = document.getElementById("intNormal");
    console.log(numeros);
    const intervalos = select.value;
    numeros.sort();
    let orden = numeros.sort(function (a, b) {  return a - b;  });

    console.log(orden);
    const max = orden[orden.length - 1];
    const min = orden[0];
    const paso = Number(((max - min) / intervalos) + 0.0001);
    console.log(max);
    console.log(min);
    console.log(paso);
    // let [suma, filas] = sumatoria(numeros, min, max, intervalos, paso);
    let filas = sumatoria(orden, min, max, intervalos, paso);

    // let [res, sum, tabla] = prueba(intervalos, suma);

    // sum = truncateDecimals(Number(sum), 4);

    // spanLD.innerHTML = `<span>Estadistico: ${sum}. Valor de tabla: ${tabla}</span>`;


    // if (res) {
    //     spanL.innerHTML = `<span style="color: green">No se rechaza la hipotesis</span>`;
    // } else {
    //     spanL.innerHTML = `<span style="color: red">Se rechaza la hipotesis</span>`;
    // }

    generarTabla(filas);
    // generarHistogramaL(filas, paso);
}

const sumatoria = (nros, minimo, maximo, int, paso) => {
    let filas = [];
    // let suma = 0;
    let min = minimo;
    let lim_inf = 0;
    let lim_sup = 0;

    for (let i = 0; i < int; i++) {

        if (i == 0) {
            lim_inf = Number(min);
            lim_sup = truncateDecimals((Number(min) + Number(paso)), 4);
        } else {
            lim_inf = Number(lim_sup);
            lim_sup = truncateDecimals((Number(lim_sup) + Number(paso)), 4);
        }

        let fila = new Object();

        let mc = truncateDecimals((lim_inf + (lim_sup - lim_inf) / 2), 4);
        fila.marca_clase = Number(mc);
        fila.lim_inf = Number(lim_inf);
        fila.lim_sup = Number(lim_sup);
        fila.fo = frecObs(nros, lim_inf, lim_sup);
        fila.fe = nros.length / int;

        // fila.estadistico = ((fila.fe - fila.fo) ** 2) / fila.fe;

        // suma = truncateDecimals((Number(suma) + Number(fila.estadistico)),4);

        filas.push(fila);

    }

    // return [suma, filas];
    return filas;

}

const frecObs = (nros, inf, sup) => {
    let fo = 0;
    let ord = nros;

    ord.forEach((numero) => {
        if (numero >= inf && numero < sup) {
            fo += 1;
        }
    });

    return fo;
}

// const prueba = (int, suma) => {
//     let v = int - 1;
//     let res = false;
//     let valor_tabla = 0;

//     chi.forEach((par) => {
//         if (par[0] === v) {
//             valor_tabla = par[1];
//         }
//     });

//     if (suma <= valor_tabla) {
//         res = true;
//     }

//     return [res, suma, valor_tabla];
// }

const exportToExcelFrec = () => {
    gridOptions.api.exportDataAsExcel();
}

btnExportToExcelFrec.addEventListener('click', exportToExcelFrec);
btnUniGraf.addEventListener('click', () => {test("uniforme");});
btnExpGraf.addEventListener('click', () => {test("exponencial");});
btnNormalGraf.addEventListener('click', () => {test("normal");});