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
    html2canvas($(elm)[0]).then(canvas => {
        const data = canvas.toDataURL("png");
        console.log(data);
        const a = document.createElement('a');
        a.download = `${name}.png`;
        a.href = data.replace("png", "octet-stream");
        a.click();
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