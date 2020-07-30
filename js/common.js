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
    console.log($(elm)[0]);
    html2canvas($(elm)[0],).then(canvas => {
        var width = canvas.width;
        var height = canvas.height;

        if(width > 1150) {
            if(name == 'matriz') {
                alert("Atenção: Imagens de grafos com mais de 45 vértices podem apresentar comportamento inesperado!");
            }else if(name == 'lista') {
                alert("Atenção: Imagens de grafos que possuem um vértice com mais de 28 conexões podem apresentar comportamento inesperado!");
            }
        }

        const data = canvas.toDataURL("png");
        const a = document.createElement('a');
        a.download = `${name}.png`;
        a.href = data.replace("png", "octet-stream");
        a.click();
    });
}

var jsPDF = document.createElement('script');
jsPDF.src = 'js/jspdf.min.js';
document.head.appendChild(jsPDF); 

function salvarElementoComoPDF(elm, name){
    var doc = new jsPDF('r', 'pt', 'a4');
    html2canvas($(elm)[0]).then(canvas => {
        var width = canvas.width;
        var height = canvas.height;
        var dim = 1;
        var prop = 1;

        if(width > 584){
            //Limite horizontal do A4: coluna com 25 vértices (584px)
             var dim = 584/width;
             var prop = (100*(width*dim)/width)/100;

             if(width < 1150) {
                alert("As dimensões da imagem no PDF serão ajustadas para se adequar ao tamanho A4.");
            }
        }
        if(width > 1150) {
            if(name == 'matriz') {
                alert("Atenção: PDF de grafos com mais de 45 vértices podem apresentar comportamento inesperado!");
            }else if(name == 'lista') {
                alert("Atenção: PDF de grafos que possuem um vértice com mais de 28 conexões podem apresentar comportamento inesperado!");
            }
        }

        const data = canvas.toDataURL("png");
        doc.addImage(data, 'png', 5, 5, width*dim, height*prop); //X, Y, LARGURA, ALTURA
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