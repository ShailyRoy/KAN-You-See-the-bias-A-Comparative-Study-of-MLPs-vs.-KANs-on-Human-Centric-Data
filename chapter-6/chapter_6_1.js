export { chapter_6_1 };


function chapter_6_1() {
    // edit the captioning
    const captionElement = document.getElementById('captioning');
    captionElement.innerHTML = "<strong>Caption:</strong> Our group photo.";

    // getting the dimensions of the actual content
    const contentWidth = 707;
    const contentHeight = 932;
    // setting SVG dimensions to match content
    d3.select("#main-svg")
        .style("width", contentWidth + "px")
        .style("height", contentHeight + "px")
        .style("background-color", "white");

    var content = d3.select("#main-svg g");
    content.append("image")
        .attr("href", "photos/group_photo.png")
        .attr("width", "100%")
        .attr("height", "100%");
}