const btnSimular = document.getElementById("btnUniSim");
const btnUniDelete = document.getElementById("btnUniDel");
// const btnExportToExcelRandVar = document.getElementById("btnExportToExcelRandVar");

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
}

const distribucionUniforme = (a, b) => {
    return truncateDecimals(Math.random() * (b - a) + a, 4);
}

let gridOptions = {};

const generacionVariablesAleatoriasUniformes = (a, b, n) => {
    let variablesAleatorias = [];

    let randObj = {};
    for (let i = 0; i < n; i++) {
        randObj = {
            n: i + 1,
            Aleatorio: distribucionUniforme(a, b)
        }

        variablesAleatorias.push(randObj);
    }
    return variablesAleatorias;
}

const simularUniforme = () => {
    let variablesAleatorias = [];

    borrarTablaUniforme();

    const eGridDiv = document.querySelector('#gridVariable');
    let a = parseFloat(document.getElementById("unif-a").value);
    let b = parseFloat(document.getElementById("unif-b").value);
    let n = parseInt(document.getElementById("unif-n").value);

    // A puede ser igual que B????
    if (typeof a === "undefined" || typeof b === "undefined" || typeof n === "undefined") return alert("Por favor, ingrese todos los datos.");
    if (isNaN(a) || isNaN(b) || isNaN(n)) return alert("Por favor, ingrese números.");
    if (a > b) return alert("El valor de 'a' debe ser menor que el valor de 'b'");
    if (n < 1) return alert("El valor de 'n' debe ser mayor que 0");

    try {
        variablesAleatorias = generacionVariablesAleatoriasUniformes(a, b, n);
    }
    catch (error) {
        alert('Oops! Ha ocurrido un error');
    }

    let columnDefs = [
        { field: "n" },
        { field: "Aleatorio" },
    ];

    gridOptions = {
        columnDefs,
        rowData: variablesAleatorias
    };

    new agGrid.Grid(eGridDiv, gridOptions);
    // btnExportToExcelRandVar.removeAttribute("hidden");
}

const borrarTablaUniforme = () => {
    btnExportToExcelRandVar.setAttribute("hidden");
    const eGridDiv = document.querySelector('#gridVariable');

    let child = eGridDiv.lastElementChild;
    while (child) {
        eGridDiv.removeChild(child);
        child = eGridDiv.lastElementChild;
    }
}

const exportToExcel = () => {
    gridOptions.api.exportDataAsExcel();
}

// btnExportToExcelRandVar.addEventListener("click", exportToExcel);

// Ver que este click no está bien, sino que es para prueba
btnUniDelete.addEventListener("click", exportToExcel);
// btnUniDelete.addEventListener("click", borrarTablaUniforme);
btnSimular.addEventListener("click", simularUniforme);