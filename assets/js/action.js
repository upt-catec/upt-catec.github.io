$(document).ready(function() {
    $(".showMoreButton").click(function(e) {
        e.preventDefault();
        var $content = $(this).closest('.content');
        $content.find(".shortText").hide();
        $content.find(".fullText").show();
        $content.find(".showMoreButton").hide();
        $content.find(".showLessButton").show();
    });

    $(".showLessButton").click(function(e) {
        e.preventDefault();
        var $content = $(this).closest('.content');
        $content.find(".shortText").show();
        $content.find(".fullText").hide();
        $content.find(".showMoreButton").show();
        $content.find(".showLessButton").hide();
    });
});