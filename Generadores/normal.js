const btnSimular = document.getElementById("btnNormalSim");
const btnNormalDelete = document.getElementById("btnNormalDel");

let gridRandVarOptions = {};
let gridChiOptions = {};
let randUnif = [];

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
}

const distribucionNormal = (media, desviacion, n) => {

    //genero 2 random
    let rnd1 = truncateDecimals(Math.random(), 4);
    let rnd2 = truncateDecimals(Math.random(), 4);

    //Box muller
    let z1 = (Math.sqrt(-2 * Math.log(rnd1))) * (Math.sin(2 * Math.PI * rnd2));
    let z2 = (Math.sqrt(-2 * Math.log(rnd1))) * (Math.cos(2 * Math.PI * rnd2));
    let z = 0

    if (n % 2 == 0) {
        z = z1;
    }
    else{
        z = z2;
    }

    let var_aleatoria = (media + (desviacion * z)).toFixed(4)
    return var_aleatoria;
}

const generacionVariablesAleatoriasNormales = (media, desviacion, n) => {
    let variablesAleatorias = [];

    let randObj = {};
    for (let i = 0; i < n; i++) {
        randObj = {
            n: i + 1,
            Aleatorio: distribucionNormal(media, desviacion, n)
        }

        variablesAleatorias.push(randObj);
    }
    return variablesAleatorias;
}


const simularNormal= () => {
    let variablesAleatorias = [];

    borrarTablaNormal();

    const eGridDiv = document.querySelector('#gridVariable');
    let media = parseFloat(document.getElementById("normal-media").value);
    let desviacion = parseFloat(document.getElementById("normal-desviacion").value);
    let n = parseInt(document.getElementById("normal-n").value);

    if (typeof media === "undefined" || typeof desviacion === "undefined" || typeof n === "undefined") return alert("Por favor, ingrese todos los datos.");
    if (isNaN(media) || isNaN(desviacion) || isNaN(n)) return alert("Por favor, ingrese números.");
    
    //media > a desv???

    if (n < 1) return alert("El valor de 'n' debe ser mayor que 0");

    try {
        variablesAleatorias = generacionVariablesAleatoriasNormales(media, desviacion, n);
        randUnif = [...variablesAleatorias];
    }
    catch (error) {
        alert('Oops! Ha ocurrido un error');
        console.log(error)
    }

    let columnDefs = [
        { field: "n" },
        { field: "Aleatorio" },
    ];

    gridRandVarOptions = {
        columnDefs,
        rowData: variablesAleatorias
    };

    new agGrid.Grid(eGridDiv, gridRandVarOptions);
    //btnExportToExcelRandVar.removeAttribute("hidden");
}

const borrarTablaNormal = () => {
    //btnExportToExcelRandVar.setAttribute("hidden", "hidden");
    const eGridDiv = document.querySelector('#gridVariable');

    let child = eGridDiv.lastElementChild;
    while (child) {
        eGridDiv.removeChild(child);
        child = eGridDiv.lastElementChild;
    }
}

btnNormalDelete.addEventListener("click", borrarTablaNormal);
btnSimular.addEventListener("click", simularNormal);