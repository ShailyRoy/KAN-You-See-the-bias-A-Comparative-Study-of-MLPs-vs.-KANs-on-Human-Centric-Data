export { chapter_5_2 };


function chapter_5_2() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = '<strong>Caption:</strong> The Transformer architecture from paper "Attention is All You Need".';

    // getting the dimensions of the actual content
    const contentWidth = 436;
    const contentHeight = 636;
    // setting SVG dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");
    content.append("image")
        .attr("href", "photos/transformers.png")
        .attr("width", "100%")
        .attr("height", "100%");
}