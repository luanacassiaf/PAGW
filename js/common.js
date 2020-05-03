function criarVetor(n, value = false) {
    return Array(n).fill(value);
}

function criarMatrix(n, m, value = false) {
    return Array(n).fill(value).map(() => Array(m).fill(value));
}

function exibirOuOcultarMenuLateral() {
    let elm = $("#sidebar");
    elm.hasClass("reveal") && elm.removeClass("reveal") || elm.addClass("reveal");
}

function salvarElementoComoImagem(elm, name) {
    window.scrollTo(0,0);  
    html2canvas($(elm)[0]).then(canvas => {
        const data = canvas.toDataURL("png");
        console.log(data);
        const a = document.createElement('a');
        a.download = `${name}.png`;
        a.href = data.replace("png", "octet-stream");
        a.click();
    });
}

var imported = document.createElement('script');
imported.src = 'js/jspdf.min.js';
document.head.appendChild(imported); 

function salvarElementoComoPDF(elm, name){
    var doc = new jsPDF('r', 'pt', 'a4');
    html2canvas($(elm)[0]).then(canvas => {
        var width = canvas.width;
        var height = canvas.height;
        if(width > 584){
            alert("As dimensões da imagem no PDF serão ajustadas para se adequar ao tamanho A4.")
           //Limite horizontal do A4: coluna com 25 vértices (584px)
            var dim = 584/width;
            var prop = (100*(width*dim)/width)/100;
        }else{
            var dim = 1;
            var prop = 1;
        }
        const data = canvas.toDataURL("png");
        console.log(data);
        //X, Y, LARGURA, ALTURA
        doc.addImage(data, 'png', 5, 5, width*dim, height*prop);
        doc.save(`${name}.pdf`);
    });

}

$(document).ready(function () {
    //Ativar/Desativar itens de um determinado grupo.
    $("i[actionbar-group]").click(function () {
        let group = $(this).attr("actionbar-group");
        if (!group) return;
        $(`i[actionbar-group=${group}]`).each(function (i) {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });
});