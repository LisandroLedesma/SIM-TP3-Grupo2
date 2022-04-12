import { getRandomNumberNormal } from "./Generadores/normal.js";    

const btnNormalGraf = document.getElementById('btnNormalGraf');

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
}

const getNumbers = (type) => {

    let arrNumb = [];
    if (type === "uniforme"){
        arrNumb = getRandomNumberUniforme();
    } 
    else{
        if (type === "exponencial"){
            arrNumb = [...rndExp];
        }  
        else{
            arrNumb = getRandomNumberNormal();
        }
    }

    let aux = [];
    arrNumb.forEach(valor => {
        aux.push(valor.Aleatorio);
    });

    return aux;
    
}

const getParametros = () => {
    
    let media = parseFloat(document.getElementById("normal-media").value);
    let desviacion = parseFloat(document.getElementById("normal-desviacion").value);
    
    console.log(media)
    console.log(typeof(media))

    return [media, desviacion]
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

    let gridOptions = {
        columnDefs,
        rowData
    };

    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();

    //btnExportToExcelFrec.removeAttribute("hidden");
}

const test = (type) => {
    let select = "";
    let media = 0
    let desviacion = 0
    // const spanL = document.getElementById('resL');
    // const spanLD = document.getElementById('dataL');

    const numeros = getNumbers(type);

    if (type === "uniforme"){
        select = document.getElementById("intUnif");
    }
    else{
        if (type === "exponencial") {
            select = document.getElementById("intExp");
        }
        else{
            select = document.getElementById("intNormal");
            [media, desviacion] = getParametros();
        }
    }
    
    console.log(media)

    const intervalos = select.value;
    numeros.sort();

    const max = numeros[numeros.length - 1];
    const min = numeros[0];
    const paso = Number(((max - min) / intervalos) + 0.0001);

    // let [suma, filas] = sumatoria(numeros, min, max, intervalos, paso);
    let filas = sumatoria(numeros, min, max, intervalos, paso, media, desviacion);

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

const sumatoria = (nros, minimo, maximo, int, paso, media, desviacion) => {
    console.log(media)
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
        let prob = ((Math.exp(-0.5 * ((fila.marca_clase - media) / desviacion ) ** 2)) / (desviacion * Math.sqrt(2 * Math.PI))) * (fila.lim_sup - fila.lim_inf);
        fila.fe = (prob * nros.length).toFixed(4)
        console.log(fila.fe)
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

btnNormalGraf.addEventListener('click', () => {test("normal");});